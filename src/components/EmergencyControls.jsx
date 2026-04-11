import React from 'react';
import { Navigation, AlertTriangle, ExternalLink, MapPin } from 'lucide-react';

const EmergencyControls = ({ data, showDirections, onToggleDirections, caretakerPos }) => {
  const openInGoogleMaps = () => {
    if (!data) return;
    if (caretakerPos) {
      window.open(`https://www.google.com/maps/dir/${caretakerPos[0]},${caretakerPos[1]}/${data.lat},${data.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`, '_blank');
    }
  };

  const isEmergency = data && data.status !== 'NORMAL' && !data.status.includes('VERIFYING');

  return (
    <div className="card" style={{ borderColor: isEmergency ? 'var(--status-danger)' : 'var(--border-color)' }}>
      <div className="card-header">
        <h2 className="card-title">
          {isEmergency && <AlertTriangle color="var(--status-danger)" className="animate-pulse" />}
          Response
        </h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Navigate to Device: toggles route on map */}
        <button 
          onClick={onToggleDirections}
          className="btn" 
          style={{ 
            width: '100%', 
            backgroundColor: showDirections ? 'hsl(199,89%,38%)' : 'var(--primary-color)', 
            color: 'white', 
            padding: '0.9rem', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <MapPin size={20} />
          {showDirections ? 'Hide Route' : 'Show Route on Map'}
        </button>

        {/* Open in Google Maps */}
        <button 
          onClick={openInGoogleMaps}
          className="btn" 
          style={{ 
            width: '100%', 
            backgroundColor: 'transparent', 
            color: 'var(--primary-color)', 
            padding: '0.9rem', 
            fontSize: '1rem',
            border: '1px solid var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <ExternalLink size={20} />
          Open in Google Maps
        </button>
      </div>
    </div>
  );
};

export default EmergencyControls;
