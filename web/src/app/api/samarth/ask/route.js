import {
  getAgriculturalData,
  getClimateData,
  getAvailableCrops,
  getAvailableStates,
  calculateAgriculturalStatistics,
  calculateClimateStatistics,
} from "../../utils/samarth";

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question || question.trim().length === 0) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    // Step 1: Use GPT to understand the question and extract parameters
    const parseResponse = await fetch(
      "/integrations/chat-gpt/conversationgpt4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a data extraction AI for agricultural and climate data analysis. 
            Extract the following from user questions in JSON format:
            - states: array of Indian states mentioned
            - crops: array of crops mentioned
            - years: array of specific years or year ranges
            - includeClimate: boolean - whether climate data is needed
            - includeAgriculture: boolean - whether agricultural data is needed
            - queryType: 'comparison' | 'trend' | 'statistics' | 'correlation' | 'general'
            
            Available states: Uttar Pradesh, Punjab, Haryana, Maharashtra, Karnataka, Andhra Pradesh, West Bengal, Rajasthan, Tamil Nadu, Gujarat
            Available crops: Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut, Soybean, Pulses, Mustard, Tomato, Onion, Potato, Tea, Coffee, Coconut`,
            },
            {
              role: "user",
              content: `Extract parameters from this question: "${question}"
            
            Respond ONLY with valid JSON.`,
            },
          ],
          json_schema: {
            name: "query_parameters",
            schema: {
              type: "object",
              properties: {
                states: {
                  type: "array",
                  items: { type: "string" },
                },
                crops: {
                  type: "array",
                  items: { type: "string" },
                },
                years: {
                  type: "array",
                  items: { type: "integer" },
                },
                startYear: { type: ["integer", "null"] },
                endYear: { type: ["integer", "null"] },
                includeClimate: { type: "boolean" },
                includeAgriculture: { type: "boolean" },
                queryType: { type: "string" },
              },
              required: [
                "states",
                "crops",
                "years",
                "startYear",
                "endYear",
                "includeClimate",
                "includeAgriculture",
                "queryType",
              ],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    if (!parseResponse.ok) {
      throw new Error("Failed to parse question");
    }

    const parseData = await parseResponse.json();
    const params = JSON.parse(parseData.choices[0].message.content);

    // Step 2: Fetch relevant data based on parsed parameters
    let agriculturalResults = [];
    let climateResults = [];
    let agriculturalStats = null;
    let climateStats = null;

    if (params.includeAgriculture) {
      // Fetch agricultural data for each state and crop combination
      for (const state of params.states || []) {
        for (const crop of params.crops || []) {
          const filters = { state, crop_name: crop };
          if (params.startYear && params.endYear) {
            filters.startYear = params.startYear;
            filters.endYear = params.endYear;
          } else if (params.years && params.years.length > 0) {
            // Fetch for specific years
            for (const year of params.years) {
              const yearData = await getAgriculturalData({ ...filters, year });
              agriculturalResults.push(...yearData);
            }
            continue;
          }
          const data = await getAgriculturalData(filters);
          agriculturalResults.push(...data);

          // Calculate stats for this combination
          const stats = await calculateAgriculturalStatistics(filters);
          if (stats) {
            agriculturalStats = {
              ...(agriculturalStats || {}),
              [`${state}_${crop}`]: stats,
            };
          }
        }
      }
    }

    if (params.includeClimate) {
      // Fetch climate data for each state
      for (const state of params.states || []) {
        const filters = { state };
        if (params.startYear && params.endYear) {
          filters.startYear = params.startYear;
          filters.endYear = params.endYear;
        } else if (params.years && params.years.length > 0) {
          for (const year of params.years) {
            const yearData = await getClimateData({ ...filters, year });
            climateResults.push(...yearData);
          }
          continue;
        }
        const data = await getClimateData(filters);
        climateResults.push(...data);

        // Calculate climate stats
        const stats = await calculateClimateStatistics(filters);
        if (stats) {
          climateStats = {
            ...(climateStats || {}),
            [state]: stats,
          };
        }
      }
    }

    // Step 3: Use GPT to synthesize the answer with citations
    const synthesizeResponse = await fetch(
      "/integrations/chat-gpt/conversationgpt4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an expert analyst synthesizing agricultural and climate data.
            Your task is to answer questions with accurate, data-backed insights.
            
            IMPORTANT: For EVERY data point or claim in your answer, you MUST cite the source.
            Use this format for citations: [Source: Ministry/Department - Dataset Name]
            
            Always provide:
            1. A clear, direct answer to the question
            2. Key statistics and comparisons
            3. Trends and patterns (if applicable)
            4. Data source citations for each claim
            5. Any limitations or caveats in the data`,
            },
            {
              role: "user",
              content: `Answer this question: "${question}"
            
            Agricultural Data:
            ${agriculturalResults.length > 0 ? JSON.stringify(agriculturalResults.slice(0, 20), null, 2) : "No agricultural data available"}
            
            Agricultural Statistics:
            ${agriculturalStats ? JSON.stringify(agriculturalStats, null, 2) : "No statistics"}
            
            Climate Data:
            ${climateResults.length > 0 ? JSON.stringify(climateResults.slice(0, 20), null, 2) : "No climate data available"}
            
            Climate Statistics:
            ${climateStats ? JSON.stringify(climateStats, null, 2) : "No statistics"}
            
            Data Collection Parameters Used:
            - States: ${params.states?.join(", ") || "None"}
            - Crops: ${params.crops?.join(", ") || "None"}
            - Years: ${params.startYear && params.endYear ? `${params.startYear}-${params.endYear}` : params.years?.join(", ") || "Latest available"}
            
            Provide a comprehensive answer with citations.`,
            },
          ],
        }),
      },
    );

    if (!synthesizeResponse.ok) {
      throw new Error("Failed to synthesize answer");
    }

    const synthesizeData = await synthesizeResponse.json();
    const answer = synthesizeData.choices[0].message.content;

    // Extract citations from the data
    const citations = [];
    const sources = new Set();

    agriculturalResults.forEach((row) => {
      if (row.source_name) sources.add(row.source_name);
    });

    climateResults.forEach((row) => {
      if (row.source_name) sources.add(row.source_name);
    });

    sources.forEach((source) => {
      citations.push(source);
    });

    return Response.json({
      success: true,
      question,
      answer,
      citations: Array.from(citations),
      dataUsed: {
        agriculturalDataPoints: agriculturalResults.length,
        climateDataPoints: climateResults.length,
        statesQueried: params.states?.length || 0,
        cropsQueried: params.crops?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in ask endpoint:", error);
    return Response.json(
      { error: error.message || "Failed to process question" },
      { status: 500 },
    );
  }
}
