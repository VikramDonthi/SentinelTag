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
      </div>
    </aside>
  );
};

export default Sidebar;
