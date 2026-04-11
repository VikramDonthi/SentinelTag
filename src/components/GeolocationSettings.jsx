import React from 'react';
import { MapPin, Globe, Bell, Navigation } from 'lucide-react';

const GeolocationSettings = () => {
  return (
    <div className="main-content" style={{ gridTemplateColumns: '1fr' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><MapPin size={24} /> Geolocation & Geofencing</h2>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={20} className="text-primary" /> Tracking Intervals
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Active Mode (Moving)</label>
              <select style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <option>Every 10 seconds</option>
                <option>Every 30 seconds</option>
                <option>Every 1 minute</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Idle Mode (Stationary)</label>
              <select style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Every 1 hour</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} className="text-primary" /> Alert Thresholds
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Geofence Radius (meters)</label>
              <input type="number" defaultValue="100" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" defaultChecked />
              <label>Notify emergency contacts on breach</label>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default GeolocationSettings;
