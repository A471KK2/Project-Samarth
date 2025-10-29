import sql from "./sql";

// Agricultural data queries
export async function getAgriculturalData(filters = {}) {
  const { state, district, crop_name, year, startYear, endYear } = filters;

  let query =
    "SELECT a.*, s.name as source_name, s.ministry FROM agricultural_data a LEFT JOIN data_sources s ON a.source_id = s.id WHERE 1=1";
  const params = [];
  let paramCount = 1;

  if (state) {
    query += ` AND a.state = $${paramCount}`;
    params.push(state);
    paramCount++;
  }

  if (district) {
    query += ` AND a.district = $${paramCount}`;
    params.push(district);
    paramCount++;
  }

  if (crop_name) {
    query += ` AND LOWER(a.crop_name) = LOWER($${paramCount})`;
    params.push(crop_name);
    paramCount++;
  }

  if (year) {
    query += ` AND a.year = $${paramCount}`;
    params.push(year);
    paramCount++;
  }

  if (startYear && endYear) {
    query += ` AND a.year BETWEEN $${paramCount} AND $${paramCount + 1}`;
    params.push(startYear, endYear);
    paramCount += 2;
  }

  query += " ORDER BY a.year DESC, a.state, a.crop_name";

  return sql(query, params);
}

// Climate data queries
export async function getClimateData(filters = {}) {
  const { state, district, year, startYear, endYear, month } = filters;

  let query =
    "SELECT c.*, s.name as source_name, s.ministry FROM climate_data c LEFT JOIN data_sources s ON c.source_id = s.id WHERE 1=1";
  const params = [];
  let paramCount = 1;

  if (state) {
    query += ` AND c.state = $${paramCount}`;
    params.push(state);
    paramCount++;
  }

  if (district) {
    query += ` AND c.district = $${paramCount}`;
    params.push(district);
    paramCount++;
  }

  if (year) {
    query += ` AND c.year = $${paramCount}`;
    params.push(year);
    paramCount++;
  }

  if (month) {
    query += ` AND c.month = $${paramCount}`;
    params.push(month);
    paramCount++;
  }

  if (startYear && endYear) {
    query += ` AND c.year BETWEEN $${paramCount} AND $${paramCount + 1}`;
    params.push(startYear, endYear);
    paramCount += 2;
  }

  query += " ORDER BY c.year DESC, c.month DESC, c.state";

  return sql(query, params);
}

// Get available crops
export async function getAvailableCrops() {
  return sql`SELECT DISTINCT crop_name FROM crop_reference ORDER BY crop_name`;
}

// Get available states
export async function getAvailableStates() {
  return sql`SELECT DISTINCT state FROM geographic_data ORDER BY state`;
}

// Get districts for a state
export async function getDistrictsByState(state) {
  return sql`SELECT DISTINCT district FROM geographic_data WHERE state = ${state} ORDER BY district`;
}

// Get data sources
export async function getDataSources() {
  return sql`SELECT * FROM data_sources ORDER BY ministry, name`;
}

// Calculate statistics
export async function calculateAgriculturalStatistics(filters = {}) {
  const data = await getAgriculturalData(filters);

  if (!data || data.length === 0) return null;

  const totalProduction = data.reduce(
    (sum, row) => sum + (parseFloat(row.production_tonnes) || 0),
    0,
  );
  const avgYield =
    data.reduce(
      (sum, row) => sum + (parseFloat(row.yield_per_hectare) || 0),
      0,
    ) / data.length;
  const totalArea = data.reduce(
    (sum, row) => sum + (parseFloat(row.area_hectares) || 0),
    0,
  );

  return {
    totalProduction,
    avgYield,
    totalArea,
    dataPoints: data.length,
    years: [...new Set(data.map((d) => d.year))].sort().reverse(),
  };
}

// Calculate climate statistics
export async function calculateClimateStatistics(filters = {}) {
  const data = await getClimateData(filters);

  if (!data || data.length === 0) return null;

  const avgRainfall =
    data.reduce((sum, row) => sum + (parseFloat(row.rainfall_mm) || 0), 0) /
    data.length;
  const avgTemp =
    data.reduce(
      (sum, row) => sum + (parseFloat(row.temperature_celsius) || 0),
      0,
    ) / data.length;
  const maxRainfall = Math.max(
    ...data.map((row) => parseFloat(row.rainfall_mm) || 0),
  );
  const minRainfall = Math.min(
    ...data.map((row) => parseFloat(row.rainfall_mm) || 0),
  );

  return {
    avgRainfall,
    avgTemp,
    maxRainfall,
    minRainfall,
    dataPoints: data.length,
    years: [...new Set(data.map((d) => d.year))].sort().reverse(),
  };
}

export default {
  getAgriculturalData,
  getClimateData,
  getAvailableCrops,
  getAvailableStates,
  getDistrictsByState,
  getDataSources,
  calculateAgriculturalStatistics,
  calculateClimateStatistics,
};
