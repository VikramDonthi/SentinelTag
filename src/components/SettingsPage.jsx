import React from 'react';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><Settings size={22} /> Settings</h2>
        </div>

        {/* Appearance Section */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Appearance
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                backgroundColor: isDarkMode ? 'hsla(222,47%,20%,1)' : 'hsla(50,100%,90%,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDarkMode ? <Moon size={20} color="hsl(220,80%,80%)" /> : <Sun size={20} color="hsl(38,92%,50%)" />}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                  {isDarkMode ? 'Night Mode' : 'Day Mode'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isDarkMode ? 'Dark theme is active' : 'Light theme is active'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '999px',
                border: 'none',
                background: isDarkMode ? 'hsl(199,89%,48%)' : 'var(--border-color)',
                cursor: 'pointer',
                transition: 'background 0.3s',
                padding: 0,
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: '4px',
                left: isDarkMode ? '28px' : '4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
