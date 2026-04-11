import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

const WeatherWidget = ({ lat, lng }) => {
  const [weather, setWeather] = useState({ temp: 32, condition: 'Sunny', humidity: 45 });

  useEffect(() => {
    const mockWeather = () => {
      setWeather({
        temp: 28 + Math.floor(Math.random() * 5),
        condition: 'Clear Sky',
        humidity: 62
      });
    };
    mockWeather();
  }, [lat, lng]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Local Weather</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.temp}°C</div>
          <div style={{ fontSize: '0.875rem' }}>{weather.condition}</div>
        </div>
        <Cloud size={40} color="var(--primary-color)" />
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        Humidity: {weather.humidity}% • Chance of Rain: 5%
      </div>
    </div>
  );
};

export default WeatherWidget;
