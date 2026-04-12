import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  History,
  BarChart3,
  Settings,
  MapPin,
  UserCircle,
  Route as RouteIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Shield size={32} className="text-primary" />
        <span>SentinelTag</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/geofencing" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <MapPin size={22} />
          <span>Geofencing</span>
        </NavLink>

        <NavLink to="/timeline" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <RouteIcon size={22} />
          <span>Timeline</span>
        </NavLink>

        <NavLink to="/incidents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <History size={22} />
          <span>Alert History</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BarChart3 size={22} />
          <span>Analytics</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {/* Settings link */}
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Settings size={22} />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <UserCircle size={22} />
          <span>User Profile</span>
        </NavLink>

        {/* Professional Copyright Tag */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid hsla(0,0%,100%,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <span style={{ fontSize: '0.55rem', fontWeight: '500', color: 'hsla(0,0%,100%,0.8)', letterSpacing: '0.5px' }}>
            Created by
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white', letterSpacing: '0.2px' }}>
            Vikram Reddy
          </span>
          <span style={{ fontSize: '0.55rem', color: 'hsla(0,0%,100%,0.5)', marginTop: '0.2rem' }}>
            &copy; {new Date().getFullYear()} All Rights Reserved
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
