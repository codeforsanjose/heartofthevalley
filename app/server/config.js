//config.js
const DEFAULT_BASE_URL = '/v1/heartofvalley';
function getBaseUrl() {
  const value = process.env.API_BASE_URL;
  if (value == null || value === '') return DEFAULT_BASE_URL;
  if (value.startsWith('/')) return value;
  return `/${value}`;
}
module.exports  = {
  baseUrl: getBaseUrl(),
}