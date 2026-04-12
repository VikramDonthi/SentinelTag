import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSafety } from '../context/SafetyContext';
import { XCircle, ExternalLink, Crosshair, User } from 'lucide-react';

// --- Icon Definitions ---
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

// Re-centers map imperatively
function MapController({ mapRef, deviceData, hasCentered, setHasCentered }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    if (deviceData?.lat && deviceData?.lng && map && !hasCentered) {
      map.setView([deviceData.lat, deviceData.lng], 16);
      setHasCentered(true);
    }
  }, [map, mapRef, deviceData, hasCentered, setHasCentered]);
  return null;
}

function MapClickListener({ setSafeZone, safeZone }) {
  useMapEvents({
    click(e) {
      if (setSafeZone) setSafeZone({ ...safeZone, lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const MapWidget = ({ deviceData, safeZone, setSafeZone, showCenterMarker = true, showDirections = false, caretakerPos }) => {
  const { highlightedIncident, setHighlightedIncident } = useSafety();
  const mapRef = useRef(null);
  const [hasCentered, setHasCentered] = useState(false);
  const [routeCoords, setRouteCoords] = useState(null);

  // ---------------------------------------------------------------------------
  // 🗺️  ROAD ROUTE FETCHING — OSRM (Open Source Routing Machine)
  // ---------------------------------------------------------------------------
  // Fires whenever the user toggles "Show Route on Map" OR caretaker GPS moves.
  //
  // Current engine: public OSRM demo server (router.project-osrm.org)
  //   ✅ Free, no API key required  ❌ Rate-limited, not for production
  //
  // To switch to a production routing service, replace the fetch URL:
  //   • Mapbox Directions: https://api.mapbox.com/directions/v5/...
  //   • Google Routes API: https://routes.googleapis.com/directions/...
  //   • Self-hosted OSRM:  http://your-server/route/v1/driving/...
  //
  // The response must return GeoJSON geometry with lng,lat coordinate pairs.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (showDirections && caretakerPos && deviceData?.lat && deviceData?.lng) {
      const fetchRoute = async () => {
        try {
          // Coordinates format: longitude,latitude (note: reversed from [lat, lng])
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${caretakerPos[1]},${caretakerPos[0]};${deviceData.lng},${deviceData.lat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            // Convert GeoJSON [lng, lat] → Leaflet [lat, lng]
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoords(coords);
          }
        } catch (e) {
          console.error('Route fetch error:', e);
          setRouteCoords(null);
        }
      };
      fetchRoute();
    } else {
      setRouteCoords(null);
    }
  }, [showDirections, caretakerPos, deviceData?.lat, deviceData?.lng]);

  if (!deviceData || !deviceData.lat || !deviceData.lng) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Waiting for GPS...</div>;
  }

  const devicePos = [parseFloat(deviceData.lat), parseFloat(deviceData.lng)];
  const incidentPos = highlightedIncident ? [parseFloat(highlightedIncident.lat), parseFloat(highlightedIncident.lng)] : null;
  const center = incidentPos || devicePos;
  const deviceIcon = deviceData.status !== 'NORMAL' ? redIcon : defaultIcon;

  const openInGoogleMaps = () => {
    if (caretakerPos) {
      window.open(`https://www.google.com/maps/dir/${caretakerPos[0]},${caretakerPos[1]}/${devicePos[0]},${devicePos[1]}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${devicePos[0]},${devicePos[1]}`, '_blank');
    }
  };

  const centerOnDevice = () => {
    if (mapRef.current) mapRef.current.setView(devicePos, 17);
  };

  const centerOnCaretaker = () => {
    if (mapRef.current && caretakerPos) mapRef.current.setView(caretakerPos, 17);
  };

  // Map corner button style
  const cornerBtn = (active) => ({
    background: active ? 'hsl(199,89%,48%)' : 'white',
    color: active ? 'white' : 'hsl(215,25%,27%)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
  });

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Top-right overlay buttons */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {highlightedIncident && (
          <button
            onClick={() => setHighlightedIncident(null)}
            style={{ ...cornerBtn(false), width: 'auto', padding: '0.4rem 0.75rem', fontWeight: '600', color: 'var(--status-danger)', fontSize: '0.8rem', gap: '0.4rem', display: 'flex', alignItems: 'center' }}
          >
            <XCircle size={15} /> Live View
          </button>
        )}
        {showDirections && caretakerPos && (
          <button
            onClick={openInGoogleMaps}
            style={{ ...cornerBtn(true), width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.4rem', display: 'flex', alignItems: 'center' }}
          >
            <ExternalLink size={15} /> Google Maps
          </button>
        )}
      </div>

      {/* Bottom-left centering buttons */}
      <div style={{ position: 'absolute', bottom: '24px', left: '12px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <button onClick={centerOnDevice} style={cornerBtn(false)} title="Center on device">
          <Crosshair size={18} color="hsl(199,89%,48%)" />
        </button>
        {caretakerPos && (
          <button onClick={centerOnCaretaker} style={cornerBtn(false)} title="Center on my location">
            <User size={18} color="hsl(160,84%,39%)" />
          </button>
        )}
      </div>

      <MapContainer center={center} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController 
          mapRef={mapRef} 
          deviceData={deviceData} 
          hasCentered={hasCentered} 
          setHasCentered={setHasCentered} 
        />
        <MapClickListener setSafeZone={setSafeZone} safeZone={safeZone} />

        {/* SentinelTag Device Marker */}
        {!highlightedIncident && (
          <Marker position={devicePos} icon={deviceIcon}>
            <Popup>
              <strong>📍 SentinelTag</strong><br />
              Status: {deviceData.status}<br />
              Time: {deviceData.t}
            </Popup>
          </Marker>
        )}

        {/* Incident Marker */}
        {highlightedIncident && incidentPos && (
          <Marker position={incidentPos} icon={orangeIcon}>
            <Popup>
              <strong>INCIDENT RECORD</strong><br />
              Status: {highlightedIncident.status}<br />
              Time: {highlightedIncident.t}
            </Popup>
          </Marker>
        )}

        {/* Caretaker Location Marker */}
        {caretakerPos && (
          <Marker position={caretakerPos} icon={purpleIcon}>
            <Popup>
              <strong>🧑‍⚕️ Your Location</strong><br />
              {caretakerPos[0].toFixed(5)}, {caretakerPos[1].toFixed(5)}
            </Popup>
          </Marker>
        )}

        {/* Route: dashed polyline from caretaker → device using OSRM */}
        {showDirections && caretakerPos && !highlightedIncident && routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: 'hsl(199,89%,48%)', weight: 4, dashArray: '10 7', opacity: 0.9 }}
          />
        )}

        {/* Geofence Circle + draggable center */}
        {safeZone && safeZone.lat !== null && safeZone.lng !== null && (
          <>
            <Circle
              center={[safeZone.lat, safeZone.lng]}
              radius={safeZone.radius}
              pathOptions={{ color: 'var(--primary-color)', fillColor: 'var(--primary-color)', fillOpacity: 0.1 }}
            />
            {showCenterMarker && (
              <Marker
                position={[safeZone.lat, safeZone.lng]}
                icon={greenIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    if (setSafeZone) setSafeZone({ ...safeZone, lat: pos.lat, lng: pos.lng });
                  },
                }}
              >
                <Popup>Geofence Center (Draggable)</Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapWidget;
