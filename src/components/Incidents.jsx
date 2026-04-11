import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import { getIncidents, getAvailableIncidentDates } from '../utils/firebase';
import { AlertCircle, Calendar, ShieldAlert, Map as MapIcon } from 'lucide-react';

const Incidents = () => {
  const getTodayStr = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  };

  const today = getTodayStr();
  const [date, setDate] = useState(today);
  const [availableDates, setAvailableDates] = useState([]);
  const [incidents, setIncidents] = useState(null);
  const { setHighlightedIncident } = useSafety();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDates = async () => {
      const dates = await getAvailableIncidentDates();
      setAvailableDates(dates);
      if (dates.length > 0 && !dates.includes(today)) {
        setDate(dates[0]); // If today has no incidents, default to the latest available
      }
    };
    fetchDates();
  }, [today]);

  useEffect(() => {
    const fetchIncidents = async () => {
      const data = await getIncidents(date);
      setIncidents(data);
    };
    fetchIncidents();
  }, [date]);

  const handleViewOnMap = (incident) => {
    setHighlightedIncident(incident);
    navigate('/');
  };

  const incidentList = incidents 
    ? Object.entries(incidents).sort((a, b) => {
        // Sort by time descending (latest on top). a[1].t looks like "14:23:05"
        return b[1].t.localeCompare(a[1].t);
      }) 
    : [];

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title"><ShieldAlert size={24} /> Alert History</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--text-secondary)" />
            <select 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
              disabled={availableDates.length === 0}
            >
              {availableDates.length === 0 ? (
                <option value={today}>No incidents yet</option>
              ) : (
                availableDates.map(d => (
                  <option key={d} value={d}>
                    {d === today ? `Today (${d})` : d}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {incidentList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No incidents recorded for this date.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {incidentList.map(([key, data]) => (
              <div key={key} style={{ 
                padding: '1.5rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-color)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle color="var(--status-danger)" size={20} />
                    <strong>{data.status.replace(/_/g, ' ')}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Time: {data.t} • Location: {data.lat}, {data.lng}
                  </div>
                  
                  {/* Detailed Telemetry Row */}
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      <Calendar size={14} className="text-primary" /> 
                      <span style={{ color: 'var(--text-secondary)' }}>Impact:</span> {data.accel}G
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      <AlertCircle size={14} className="text-primary" /> 
                      <span style={{ color: 'var(--text-secondary)' }}>Battery:</span> {data.battery}%
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      <ShieldAlert size={14} className="text-primary" /> 
                      <span style={{ color: 'var(--text-secondary)' }}>Signal:</span> {data.rssi}dBm
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      <AlertCircle size={14} className="text-primary" /> 
                      <span style={{ color: 'var(--text-secondary)' }}>Sound:</span> {data.mic}dB
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleViewOnMap(data)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <MapIcon size={18} /> View on Map
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;
