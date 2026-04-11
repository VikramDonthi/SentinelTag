import React from 'react';
import { useSafety } from '../context/SafetyContext';
import MapWidget from './MapWidget';
import { Shield, Navigation, Bookmark, Save, MapPin } from 'lucide-react';

const GeofencePage = () => {
  const { 
    deviceData, 
    safeZone, 
    setSafeZone, 
    geofenceBreached,
    geofencePresets,
    updatePreset,
    geofenceEnabled,
    setGeofenceEnabled
  } = useSafety();

  const handleSaveToSlot = (id) => {
    updatePreset(id, { 
      lat: safeZone.lat, 
      lng: safeZone.lng, 
      radius: safeZone.radius 
    });
  };

  const handleApplySlot = (preset) => {
    setSafeZone({
      lat: preset.lat,
      lng: preset.lng,
      radius: preset.radius
    });
  };

  return (
    <div className="main-content" style={{ gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '2rem' }}>
      {/* Left Column: Interactive Map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Shield size={24} className="text-primary" /> Geofence Setting</h2>
            <span className={`status-badge ${!geofenceEnabled ? 'status-offline' : geofenceBreached ? 'status-danger' : 'status-normal'}`}>
              {!geofenceEnabled ? 'GEOFENCE DISABLED' : (geofenceBreached ? 'ZONE BREACHED' : 'INSIDE SAFE ZONE')}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Click anywhere on the map to define the center of your safe zone.
          </p>
          <div className="map-container" style={{ height: '600px' }}>
            <MapWidget 
              deviceData={deviceData} 
              safeZone={safeZone} 
              setSafeZone={geofenceEnabled ? setSafeZone : null}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Controls & Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title"><Navigation size={20} /> Configuration</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: geofenceEnabled ? 'var(--status-normal)' : 'var(--text-secondary)' }}>
                {geofenceEnabled ? 'Active' : 'Off'}
              </span>
              <button
                onClick={() => setGeofenceEnabled(!geofenceEnabled)}
                aria-label="Toggle geofencing"
                title={geofenceEnabled ? 'Disable geofencing' : 'Enable geofencing'}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '26px',
                  borderRadius: '999px',
                  border: 'none',
                  background: geofenceEnabled ? 'var(--status-normal)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  left: geofenceEnabled ? '25px' : '3px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem', opacity: geofenceEnabled ? 1 : 0.5, pointerEvents: geofenceEnabled ? 'auto' : 'none' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Safe Zone Radius
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="range" 
                  min="50" 
                  max="5000" 
                  step="50"
                  value={safeZone.radius}
                  onChange={(e) => setSafeZone({ ...safeZone, radius: parseInt(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontWeight: '700', minWidth: '60px' }}>{safeZone.radius}m</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={safeZone.lat}
                  onChange={(e) => setSafeZone({ ...safeZone, lat: parseFloat(e.target.value) || safeZone.lat })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={safeZone.lng}
                  onChange={(e) => setSafeZone({ ...safeZone, lng: parseFloat(e.target.value) || safeZone.lng })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Bookmark size={20} /> Saved Locations</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {geofencePresets.map((preset) => (
              <div key={preset.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'hsla(0, 0%, 100%, 0.4)' }}>
                <input 
                  type="text" 
                  value={preset.name}
                  onChange={(e) => updatePreset(preset.id, { name: e.target.value })}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: '700', fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleApplySlot(preset)}
                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    <MapPin size={16} /> Apply
                  </button>
                  <button 
                    className="btn" 
                    onClick={() => handleSaveToSlot(preset.id)}
                    style={{ padding: '0.5rem', fontSize: '0.875rem', border: '1px solid var(--border-color)' }}
                  >
                    <Save size={16} /> Save Current
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeofencePage;
