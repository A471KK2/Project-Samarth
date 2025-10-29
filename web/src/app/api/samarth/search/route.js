import {
  getAgriculturalData,
  getClimateData,
  calculateAgriculturalStatistics,
  calculateClimateStatistics,
} from "../../utils/samarth";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      type, // 'agricultural' or 'climate'
      state,
      district,
      crop_name,
      year,
      startYear,
      endYear,
      includeStats = false,
    } = body;

    if (!type || !["agricultural", "climate"].includes(type)) {
      return Response.json(
        { error: 'Invalid type. Must be "agricultural" or "climate"' },
        { status: 400 },
      );
    }

    const filters = { state, district, year, startYear, endYear };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );

    // Add crop_name only for agricultural queries
    if (type === "agricultural" && crop_name) {
      filters.crop_name = crop_name;
    }

    let results = [];
    let stats = null;

    if (type === "agricultural") {
      results = await getAgriculturalData(filters);
      if (includeStats) {
        stats = await calculateAgriculturalStatistics(filters);
      }
    } else {
      results = await getClimateData(filters);
      if (includeStats) {
        stats = await calculateClimateStatistics(filters);
      }
    }

    return Response.json({
      success: true,
      type,
      filters,
      count: results.length,
      data: results,
      stats: stats || null,
    });
  } catch (error) {
    console.error("Error in search endpoint:", error);
    return Response.json(
      { error: error.message || "Failed to search data" },
      { status: 500 },
    );
  }
}
