import React from 'react';
import { User, Mail, LogOut } from 'lucide-react';

const Profile = ({ user, onLogout }) => {
  return (
    <div className="main-content" style={{ gridTemplateColumns: '1fr' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><User size={24} /> User Profile</h2>
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), hsl(199,89%,35%))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={52} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Full Name</label>
              <h3 style={{ fontSize: '1.25rem' }}>{user?.displayName || 'Vikram Adithya'}</h3>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Username</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                <Mail size={16} color="var(--text-secondary)" /> {user?.username || 'vikram'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="card" style={{ marginTop: '2rem', border: '1px solid hsla(0,84%,60%,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Sign Out</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign out from SentinelTag on this device.</p>
          </div>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'hsla(0,84%,60%,0.1)', color: 'var(--status-danger)', border: '1px solid hsla(0,84%,60%,0.3)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
