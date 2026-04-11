import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Droplets, Wind } from 'lucide-react';

const DashboardWeather = ({ lat, lng }) => {
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...', humidity: '--', wind: '--' });

  useEffect(() => {
    // Simulated live weather for the device's location
    const temp = 28 + Math.floor(Math.random() * 5);
    setWeather({
      temp,
      condition: temp > 30 ? 'Sunny' : 'Partly Cloudy',
      humidity: 60 + Math.floor(Math.random() * 20),
      wind: 12 + Math.floor(Math.random() * 15)
    });
  }, [lat, lng]);

  const isSunny = weather.condition === 'Sunny';

  return (
    <div className="card" style={{ overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
      {/* Dynamic Animated Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        background: isSunny ? 'linear-gradient(135deg, hsl(200, 90%, 85%), hsl(210, 80%, 75%))' : 'linear-gradient(135deg, hsl(220, 20%, 80%), hsl(220, 30%, 65%))',
        opacity: document.documentElement.getAttribute('data-theme') === 'dark' ? 0.15 : 0.4
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Tag Weather</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>{weather.temp}°</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>C</span>
            </div>
          </div>
          
          {/* Animated Icons */}
          <div style={{ position: 'relative', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isSunny ? (
              <Sun size={48} color="#f59e0b" style={{ animation: 'spin-slow 15s linear infinite' }} />
            ) : (
              <>
                <Sun size={36} color="#f59e0b" style={{ position: 'absolute', top: 0, right: '4px', animation: 'spin-slow 20s linear infinite' }} />
                <Cloud size={44} color="var(--text-primary)" style={{ position: 'absolute', bottom: 0, left: '-4px', animation: 'float 4s ease-in-out infinite' }} />
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Droplets size={16} color="hsl(199, 89%, 48%)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Humidity</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{weather.humidity}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Wind size={16} color="var(--text-secondary)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Wind</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{weather.wind} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWeather;
