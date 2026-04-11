import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import MapWidget from './MapWidget';
import TelemetryPanel from './TelemetryPanel';
import EmergencyControls from './EmergencyControls';
import { ShieldAlert, PlusSquare, Flame, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { 
    deviceData, 
    isOffline, 
    safeZone, 
    setSafeZone, 
    geofenceBreached 
  } = useSafety();

  const [showDirections, setShowDirections] = useState(false);
  const [caretakerPos, setCaretakerPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => setCaretakerPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const handleNearbySearch = (type) => {
    if (!deviceData) return;
    let query = '';
    switch(type) {
      case 'police': query = 'police+station'; break;
      case 'hospital': query = 'hospital'; break;
      case 'fire': query = 'fire+station'; break;
      default: query = 'emergency+services';
    }
    const url = `https://www.google.com/maps/search/${query}/@${deviceData.lat},${deviceData.lng},15z`;
    window.open(url, '_blank');
  };

  const getStatusColor = () => {
    if (isOffline) return 'status-offline';
    if (!deviceData) return 'status-offline';
    if (deviceData.status.includes('VERIFYING')) return 'status-verifying';
    if (deviceData.status !== 'NORMAL' || geofenceBreached) return 'status-danger';
    return 'status-normal';
  };

  const getStatusLabel = () => {
    if (isOffline) return 'DEVICE DISCONNECTED';
    if (!deviceData) return 'LOADING...';
    
    const alerts = [];
    if (geofenceBreached) alerts.push('ZONE BREACH');
    if (deviceData.status !== 'NORMAL') alerts.push(deviceData.status.replace(/_/g, ' '));
    
    if (alerts.length > 0) return alerts.join(' + ');
    return 'SYSTEM NORMAL';
  };

  return (
    <div className="main-content" style={{ gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
      {/* Left Column: Map and Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Live Tracking</h2>
            <span className={`status-badge ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
          </div>
          <div className="map-container">
            <MapWidget 
              deviceData={deviceData} 
              safeZone={safeZone} 
              showCenterMarker={false}
              showDirections={showDirections}
              caretakerPos={caretakerPos}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><MapPin size={20} /> Nearby Emergency Services</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Quickly find emergency response units near the device's current coordinates.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <button 
              className="btn" 
              onClick={() => handleNearbySearch('police')}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', backgroundColor: 'hsla(220, 80%, 50%, 0.1)', color: 'hsl(220, 80%, 45%)', border: '1px solid hsla(220, 80%, 50%, 0.2)' }}
            >
              <ShieldAlert size={32} />
              <span style={{ fontWeight: '600' }}>Police</span>
            </button>
            <button 
              className="btn" 
              onClick={() => handleNearbySearch('hospital')}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', backgroundColor: 'hsla(0, 80%, 50%, 0.1)', color: 'hsl(0, 80%, 45%)', border: '1px solid hsla(0, 80%, 50%, 0.2)' }}
            >
              <PlusSquare size={32} />
              <span style={{ fontWeight: '600' }}>Healthcare</span>
            </button>
            <button 
              className="btn" 
              onClick={() => handleNearbySearch('fire')}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', backgroundColor: 'hsla(30, 80%, 50%, 0.1)', color: 'hsl(30, 80%, 45%)', border: '1px solid hsla(30, 80%, 50%, 0.2)' }}
            >
              <Flame size={32} />
              <span style={{ fontWeight: '600' }}>Fire</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Column: Telemetry and Help */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <TelemetryPanel 
          data={deviceData} 
          isOffline={isOffline} 
          geofenceBreached={geofenceBreached}
        />
        <EmergencyControls data={deviceData} showDirections={showDirections} onToggleDirections={() => setShowDirections(p => !p)} caretakerPos={caretakerPos} />
      </div>
    </div>
  );
};

export default Dashboard;
