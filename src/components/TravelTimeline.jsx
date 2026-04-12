import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { getBreadcrumbs, getAvailableBreadcrumbDates } from '../utils/firebase';
import { Calendar, Navigation } from 'lucide-react';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapResizer({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

const TravelTimeline = () => {
  const [date, setDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      const dates = await getAvailableBreadcrumbDates('SENTINEL_01');
      setAvailableDates(dates);
      if (dates.length > 0) {
        setDate(dates[0]);
      }
    };
    fetchDates();
  }, []);

  useEffect(() => {
    const fetchPath = async () => {
      setLoading(true);
      const data = await getBreadcrumbs('SENTINEL_01', date);
      if (data) {
        // Data is an object with time keys
        const sortedHistory = Object.values(data).sort((a, b) => a.t.localeCompare(b.t));
        const coords = sortedHistory.map(item => [parseFloat(item.lat), parseFloat(item.lng)]);
        setPath(coords);
      } else {
        setPath([]);
      }
      setLoading(false);
    };
    fetchPath();
  }, [date]);

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <h2 className="card-title"><Navigation size={20} /> Daily Travel Timeline</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--text-secondary)" />
          <select 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            disabled={availableDates.length === 0}
          >
            {availableDates.length === 0 ? (
              <option value="">No data available</option>
            ) : (
              availableDates.map(d => (
                <option key={d} value={d}>{d}</option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="map-container" style={{ height: '600px' }}>
        {loading ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            Loading history...
          </div>
        ) : path.length > 0 ? (
          <MapContainer center={path[0]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={path} pathOptions={{ color: 'var(--primary-color)', weight: 4 }} />
            <Marker position={path[0]} icon={defaultIcon}>
                <Popup>Start Point</Popup>
            </Marker>
            <Marker position={path[path.length - 1]} icon={defaultIcon}>
                <Popup>Last Known Position</Popup>
            </Marker>
            <MapResizer bounds={path} />
          </MapContainer>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            No path data found for this date.
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Showing {path.length} data points for {date}. Path is reconstructed from historical breadcrumbs.
      </div>
    </div>
  );
};

export default TravelTimeline;
