import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
// ---------------------------------------------------------------------------
// 🔐  AUTH — credentials are managed in src/config.js → AUTH_USERS
// ---------------------------------------------------------------------------
import { AUTH_USERS } from '../config';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // 🔐  CREDENTIALS — add/remove users in src/config.js → AUTH_USERS
  // Future: swap this block for Firebase Authentication (firebase/auth)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // 👤  DISPLAY NAME MAP — maps username → friendly name shown in the header
  // Add a new entry here whenever you add a user to AUTH_USERS in config.js
  // ---------------------------------------------------------------------------
  const DISPLAY_NAMES = {
    vikramreddy1: 'Vikram Reddy', // ← update this to match your name
    admin: 'Administrator',  // ← update or remove as needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (AUTH_USERS[form.username] === form.password) {
        onLogin({
          username: form.username,
          displayName: DISPLAY_NAMES[form.username] || form.username,
        });
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, hsl(222, 47%, 6%) 0%, hsl(222, 47%, 16%) 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        background: 'hsla(0, 0%, 100%, 0.05)',
        backdropFilter: 'blur(24px)',
        border: '1px solid hsla(0, 0%, 100%, 0.1)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(199, 89%, 48%), hsl(199, 89%, 35%))',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px hsla(199, 89%, 48%, 0.4)',
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>SentinelTag</h1>
          <p style={{ color: 'hsla(210, 40%, 98%, 0.5)', fontSize: '0.9rem' }}>Safety Monitoring Platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username */}
          <div>
            <label style={{ display: 'block', color: 'hsla(210, 40%, 98%, 0.7)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Username
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid hsla(0,0%,100%,0.15)',
                background: 'hsla(0,0%,100%,0.07)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: 'hsla(210, 40%, 98%, 0.7)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.85rem 3rem 0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid hsla(0,0%,100%,0.15)',
                  background: 'hsla(0,0%,100%,0.07)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.5)', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'hsla(0,84%,60%,0.15)', border: '1px solid hsla(0,84%,60%,0.3)', borderRadius: '0.75rem', color: 'hsl(0,84%,75%)', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: loading ? 'hsla(199,89%,48%,0.5)' : 'linear-gradient(135deg, hsl(199,89%,48%), hsl(199,89%,38%))',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px hsla(199,89%,48%,0.3)',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'hsla(210,40%,98%,0.3)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Protected by SentinelTag Security
        </p>
      </div>
    </div>
  );
};

export default Login;
