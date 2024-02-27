function getApiUrl() {
  const host = process.env.REACT_APP_API_SERVER;
  const subDir = process.env.REACT_APP_API_BASE_URL;
  const url = new URL(subDir, host).toString();
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}
module.exports = {
  API_URL: getApiUrl(),
};
