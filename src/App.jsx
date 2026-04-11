import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SafetyProvider } from './context/SafetyContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Incidents from './components/Incidents';
import Profile from './components/Profile';
import GeofencePage from './components/GeofencePage';
import SafetyAnalytics from './components/SafetyAnalytics';
import TimelinePage from './components/TimelinePage';
import SettingsPage from './components/SettingsPage';
import Login from './components/Login';
import TopHeader from './components/TopHeader';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <ThemeProvider>
        <Login onLogin={(userData) => setUser(userData)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafetyProvider>
        <Router>
          <div className="app-container">
            <Sidebar onLogout={() => setUser(null)} />
            
            <div className="main-layout">
                <TopHeader user={user} />

              <main style={{ flex: 1, overflowY: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/incidents" element={<Incidents />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                  <Route path="/analytics" element={<SafetyAnalytics />} />
                  <Route path="/geofencing" element={<GeofencePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<Profile user={user} onLogout={() => setUser(null)} />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </SafetyProvider>
    </ThemeProvider>
  );
}

export default App;
