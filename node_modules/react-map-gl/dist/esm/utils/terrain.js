export function getTerrainElevation(map, _ref) {
  var longitude = _ref.longitude,
      latitude = _ref.latitude;

  if (map && map.queryTerrainElevation) {
    return map.queryTerrainElevation([longitude, latitude]) || 0;
  }

  return 0;
}
//# sourceMappingURL=terrain.js.map