import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Droplets, Wind } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

// ---------------------------------------------------------------------------
// 🌤️  WEATHER CONFIG — See src/config.js to add your OpenWeatherMap API key
// ---------------------------------------------------------------------------
import { OPENWEATHER_API_KEY, WEATHER_UNITS } from '../config';

// ---------------------------------------------------------------------------
// fetchWeather: Calls OpenWeatherMap's "Current Weather" endpoint.
// ---------------------------------------------------------------------------
async function fetchWeather(lat, lng) {
  if (!OPENWEATHER_API_KEY) {
    const temp = 28 + Math.floor(Math.random() * 6);
    return {
      temp,
      condition: temp > 30 ? 'Sunny' : 'Partly Cloudy',
      humidity: 60 + Math.floor(Math.random() * 25),
      wind: 10 + Math.floor(Math.random() * 18),
      location: 'Local Tag'
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${WEATHER_UNITS}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `API error: ${res.status}`);
  }
  const data = await res.json();
  return {
    temp: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 3.6),
    location: data.name || 'Local Tag'
  };
}

const TopHeader = ({ user }) => {
  const { deviceData } = useSafety();

  const [weather, setWeather] = useState({
    temp: 31,
    condition: 'Sunny',
    humidity: 68,
    wind: 14,
    location: 'Loading...'
  });
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    const lat = parseFloat(deviceData?.lat) || 17.890249;
    const lng = parseFloat(deviceData?.lng) || 79.599945;
    
    setWeatherError(null);
    fetchWeather(lat, lng)
      .then(setWeather)
      .catch(err => {
        console.warn('Weather fetch failed:', err);
        setWeatherError(err.message);
      });
  }, [deviceData?.lat, deviceData?.lng]);

  const isSunny = ['Sunny', 'Clear'].includes(weather.condition);

  return (
    <header className="top-header">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Welcome back,</span>
        <strong style={{ fontSize: '1.25rem' }}>{user.displayName}</strong>
        <span style={{ fontSize: '0.78rem', color: 'hsl(199, 89%, 50%)', fontWeight: '600', marginTop: '0.1rem' }}>
          Device: {deviceData?.id || 'SENTINEL_01'}
        </span>
      </div>

      {/* ── Right: Animated Weather Card ───────────────────────────── */}
      <div>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.6rem 1.1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          lineHeight: 1.4,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none',
            background: isSunny
              ? 'linear-gradient(135deg, hsl(45, 100%, 92%), hsl(200, 80%, 88%))'
              : 'linear-gradient(135deg, hsl(220, 20%, 88%), hsl(210, 30%, 80%))',
            opacity: 0.5
          }} />

          <div style={{ position: 'relative', zIndex: 1, width: '44px', height: '44px', flexShrink: 0 }}>
            {isSunny ? (
              <Sun size={44} color="#f59e0b" style={{ animation: 'spin-slow 12s linear infinite' }} />
            ) : (
              <>
                <Sun size={28} color="#f59e0b" style={{ position: 'absolute', top: 0, right: 0, animation: 'spin-slow 18s linear infinite' }} />
                <Cloud size={36} color="hsl(215, 20%, 50%)" style={{ position: 'absolute', bottom: 0, left: 0, animation: 'float 3.5s ease-in-out infinite' }} />
              </>
            )}
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '120px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>
              {weather.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', color: '#0f172a' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: 1 }}>{weather.temp}°</span>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
                {WEATHER_UNITS === 'metric' ? 'C' : 'F'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '1px' }}>
              {weather.description || weather.condition}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '0.75rem', borderLeft: '1px solid hsla(215, 15%, 50%, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Droplets size={13} color="hsl(199,89%,48%)" />
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#0f172a' }}>{weather.humidity}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Wind size={13} color="#475569" />
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#0f172a' }}>{weather.wind} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
