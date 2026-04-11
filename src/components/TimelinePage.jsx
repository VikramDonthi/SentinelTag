import React from 'react';
import TravelTimeline from './TravelTimeline';
import { Route } from 'lucide-react';

const TimelinePage = () => {
  return (
    <div className="main-content" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><Route size={24} className="text-primary" /> Route History</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Select a date to view the path taken by the SentinelTag device.
        </p>
        <TravelTimeline />
      </div>
    </div>
  );
};

export default TimelinePage;
