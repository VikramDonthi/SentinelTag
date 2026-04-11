import React from 'react';
import { Battery, Wifi, Activity, Navigation, Phone, BellRing, Shield } from 'lucide-react';

const TelemetryPanel = ({ data, isOffline, geofenceBreached }) => {
  if (!data) return <div className="card">Loading Health Data...</div>;

  const rssiValue = parseInt(data.rssi);
  let signalQuality = "Good";
  if (rssiValue < -100) signalQuality = "Weak";
  if (rssiValue > -80) signalQuality = "Excellent";

  const deviceAlert = data.status !== 'NORMAL' ? data.status.replace(/_/g, ' ') : null;
  const hasAlerts = isOffline || geofenceBreached || deviceAlert;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><Activity size={20} /> Live Status</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* System Status - spans full width if there are multiple alerts */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1', borderLeft: `4px solid ${hasAlerts ? 'var(--status-danger)' : 'var(--status-normal)'}` }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>System Status</div>
          {isOffline ? (
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--status-danger)', fontWeight: 'bold', fontSize: '0.9rem' }}>OFFLINE</span>
          ) : !hasAlerts ? (
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(16,185,129,0.15)', color: 'var(--status-normal)', fontWeight: 'bold', fontSize: '0.9rem' }}>SYSTEM NORMAL</span>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {geofenceBreached && (
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--status-danger)', fontWeight: 'bold', fontSize: '0.875rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                  📍 ZONE BREACH
                </span>
              )}
              {deviceAlert && (
                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--status-danger)', fontWeight: 'bold', fontSize: '0.875rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ {deviceAlert}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
            Last Update
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {data.t}
          </div>
        </div>

        {/* Battery */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <Battery size={16} /> Battery
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {data.battery}%
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', marginTop: '0.5rem', borderRadius: '2px' }}>
            <div style={{ width: `${data.battery}%`, height: '100%', backgroundColor: parseInt(data.battery) > 20 ? 'var(--status-normal)' : 'var(--status-danger)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Signal */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <Wifi size={16} /> LoRa Signal (RSSI)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {data.rssi} dBm
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Quality: {signalQuality}
          </div>
        </div>

        {/* Accelerometer */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <Activity size={16} /> G-Force Peak
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {data.accel} g
          </div>
        </div>

        {/* Mic Level */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <BellRing size={16} /> Ambient Sound
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {data.mic} dB
          </div>
        </div>

        {/* Security / System Integrity Badge (fills the empty right-bottom space) */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', opacity: 0.7 }}>
          <Shield size={28} color="var(--status-normal)" style={{ marginBottom: '0.4rem', opacity: 0.8 }} />
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>Sentinel Secured</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Real-time Encrypted Telemetry</div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;
