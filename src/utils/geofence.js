/**
 * Calculates the great-circle distance between two points on a sphere
 * using the Haversine formula (in meters).
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;
  
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Checks if a point is outside the safe zone.
 * @param {object} currentCoords {lat, lng}
 * @param {object} safeZoneCoords {lat, lng}
 * @param {number} radius Radius in meters
 * @returns {boolean} true if outside the geofence
 */
export const checkGeofenceBreach = (currentCoords, safeZoneCoords, radius) => {
  if (!currentCoords || !safeZoneCoords || !radius) return false;
  
  const distance = calculateDistance(
    parseFloat(currentCoords.lat),
    parseFloat(currentCoords.lng),
    parseFloat(safeZoneCoords.lat),
    parseFloat(safeZoneCoords.lng)
  );
  
  return distance > radius;
};
