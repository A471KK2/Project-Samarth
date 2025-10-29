import {
  getAvailableStates,
  getAvailableCrops,
  getDistrictsByState,
  getDataSources,
} from "../../utils/samarth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    let response = {
      states: await getAvailableStates(),
      crops: await getAvailableCrops(),
      dataSources: await getDataSources(),
    };

    if (state) {
      response.districts = await getDistrictsByState(state);
    }

    return Response.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error in metadata endpoint:", error);
    return Response.json(
      { error: error.message || "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
