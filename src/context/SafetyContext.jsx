import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  subscribeToLiveStatus, 
  subscribeToGeofencePresets, 
  saveGeofencePresets,
  subscribeToActiveSafeZone,
  saveActiveSafeZone,
  recordIncident 
} from '../utils/firebase';
import { checkGeofenceBreach } from '../utils/geofence';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// ---------------------------------------------------------------------------
// ⚙️  DEVICE CONFIGURATION
// ---------------------------------------------------------------------------
// Change DEVICE_ID to match the key your hardware publishes to in Firebase.
// Firebase path: SentinelTag/LiveStatus/<DEVICE_ID>
// Also configured centrally in src/config.js → DEVICE_ID
// ---------------------------------------------------------------------------
import { DEVICE_ID, DEFAULT_MAP_CENTER } from '../config';

const SafetyContext = createContext();

export const SafetyProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // ---------------------------------------------------------------------------
  // 📍  DEFAULT SAFE ZONE
  // The map starts centred here and the first geofence circle is placed here.
  // Change these to match your home/school/office base coordinates.
  // Central config: src/config.js → DEFAULT_MAP_CENTER
  // ---------------------------------------------------------------------------
  const [safeZone, setSafeZone] = useState({ 
    lat: null,
    lng: null,
    radius: 100 
  });

  // ---------------------------------------------------------------------------
  // 💾  GEOFENCE CLOUD SYNC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToActiveSafeZone((data) => {
      if (data) {
        setSafeZone(data);
      } else if (deviceData?.lat && deviceData?.lng) {
        // Fallback: Default to device location if Firebase is empty
        const initial = {
          lat: parseFloat(deviceData.lat),
          lng: parseFloat(deviceData.lng),
          radius: 100
        };
        setSafeZone(initial);
        saveActiveSafeZone(initial);
      }
    });
    return () => unsubscribe();
  }, [deviceData?.lat, deviceData?.lng]); // Re-run if first-time init is needed when data arrives

  const [geofenceBreached, setGeofenceBreached] = useState(false);
  const [geofencePresets, setGeofencePresets] = useState([]);
  const [highlightedIncident, setHighlightedIncident] = useState(null);
  const [isBreachLogged, setIsBreachLogged] = useState(false);

  // ---------------------------------------------------------------------------
  // 🔔  GEOFENCE ENABLED TOGGLE
  // Controlled from the Geofencing tab toggle switch.
  // When false: breach detection is completely skipped and no incidents are logged.
  // ---------------------------------------------------------------------------
  const [geofenceEnabled, setGeofenceEnabled] = useState(true);

  // ---------------------------------------------------------------------------
  // 🔔  NOTIFICATIONS SYSTEM
  // ---------------------------------------------------------------------------
  const [notifications, setNotifications] = useState([]);
  const lastNoteRef = React.useRef({ message: '', time: 0 }); // Guard for double-alerts
  
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Professional Alert Sound URLs
  const CRITICAL_SOUND = 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3'; // Emergency Siren
  const WARNING_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

  // Request browser and native notification permissions
  const requestNotificationPermission = useCallback(async () => {
    // 1. Browser Native
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
    }
    
    // 2. Capacitor (Android)
    if (Capacitor.isNativePlatform()) {
      try {
        const status = await LocalNotifications.requestPermissions();
        console.log('Native notification permission:', status.display);

        // CREATE CHANNEL (Required for Android 8.0+)
        await LocalNotifications.createChannel({
          id: 'sentinel-alerts',
          name: 'Sentinel Alerts',
          description: 'Critical safety and emergency alerts',
          importance: 5, // Importance.High
          visibility: 1, // Visibility.Public
          vibration: true,
          sound: 'alert.wav' // Fallback
        });
        console.log('Sentinel notification channel initialized.');
      } catch (err) {
        console.error('Failed to init native notifications:', err);
      }
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const addNotification = useCallback((type, title, message, duration = 6000) => {
    const now = Date.now();
    
    // Deduplication guard: ignore identical messages within 3 seconds
    if (message === lastNoteRef.current.message && (now - lastNoteRef.current.time) < 3000) {
      return;
    }
    lastNoteRef.current = { message, time: now };

    const id = Date.now() + Math.random();
    setNotifications(prev => [{ id, type, title, message }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    const idString = `sentinel-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // ── 🔊 PLAY SOUND ─────────────────────────────────────────────
    try {
      const audio = new Audio(type === 'critical' ? CRITICAL_SOUND : WARNING_SOUND);
      audio.volume = type === 'critical' ? 1.0 : 0.6;
      
      if (type === 'critical') {
        audio.loop = true;
        audio.play().catch(e => console.warn('Audio play failed:', e));
        
        // Stop the looping alarm when the notification duration ends
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, duration);
      } else {
        audio.play().catch(e => console.warn('Audio play failed:', e));
      }
    } catch (e) {
      console.warn('Audio initialization failed');
    }

    // ── 📱 NATIVE ANDROID NOTIFICATION ──────────────────────────
    if (Capacitor.isNativePlatform()) {
      LocalNotifications.schedule({
        notifications: [{
          title: title,
          body: message,
          id: Math.floor(Math.random() * 100000),
          sound: type === 'critical' ? 'alert.wav' : 'vibrate.wav', // Fallback to system if not found
          smallIcon: 'ic_stat_name', // Standard capacitor icon
          channelId: 'sentinel-alerts',
          attachments: []
        }]
      });
    }

    // ── 🌐 WEB BROWSER NOTIFICATION ─────────────────────────────
    if (!Capacitor.isNativePlatform() && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { 
          body: message, 
          tag: idString,
          renotify: true 
        });
      }
    }
  }, []);

  // Track if we already warned about low battery to avoid spam
  const [hasWarnedBattery, setHasWarnedBattery] = useState(false);

  // Low Battery checking
  useEffect(() => {
    if (deviceData?.battery && deviceData.battery <= 20) {
      if (!hasWarnedBattery) {
        addNotification('warning', 'Low Battery Alert', `SentinelTag battery is critically low (${deviceData.battery}%). Please charge immediately.`);
        setHasWarnedBattery(true);
      }
    } else if (deviceData?.battery && deviceData.battery > 25) {
      setHasWarnedBattery(false); // Reset warning if device got charged
    }
  }, [deviceData?.battery, hasWarnedBattery, addNotification]);

  // ---------------------------------------------------------------------------
  // 📡  LIVE DEVICE TELEMETRY SUBSCRIPTION
  // Subscribes to Firebase path: SentinelTag/LiveStatus/<DEVICE_ID>
  // All telemetry fields (lat, lng, status, battery, accel, mic, rssi) come here.
  // This re-runs on mount only. If you have multiple devices, call this once per id.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToLiveStatus(DEVICE_ID, (data) => {
      setDeviceData(data);
    });
    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------------------------
  // 📝  AUTOMATED GEOFENCE BREACH LOGGING
  // Writes exactly ONE incident record per breach event to Firebase.
  // isBreachLogged prevents duplicate entries while the device stays outside.
  // Resets automatically when the device re-enters the safe zone.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (geofenceBreached && deviceData && !isBreachLogged) {
      console.log("Logging automated geofence breach...");
      addNotification('critical', 'Critical Security Alert', 'Device has breached the strict geofence perimeter!', 10000);
      recordIncident(DEVICE_ID, {
        ...deviceData,
        status: 'GEOFENCE_BREACH'
      });
      setIsBreachLogged(true);
    } else if (!geofenceBreached) {
      setIsBreachLogged(false); // Reset when device returns inside safe zone
    }
  }, [geofenceBreached, deviceData, isBreachLogged, addNotification]);

  // ---------------------------------------------------------------------------
  // 🚨  HARDWARE STATUS MONITOR
  // Listens for alerts explicitly pushed by the device (Button, Fall, Scream)
  // ---------------------------------------------------------------------------
  const lastStatusRef = React.useRef('NORMAL');

  useEffect(() => {
    if (!deviceData || !deviceData.status) return;

    const currentStatus = deviceData.status;

    // Trigger when changing to a new abnormal state
    // We use a Ref here because state is too slow to prevent double-fires
    // for high-frequency GPS updates.
    if (currentStatus !== 'NORMAL' && currentStatus !== lastStatusRef.current) {
      if (['BUTTON_ALERT', 'SCREAM_DETECTED', 'FALL_DETECTED'].includes(currentStatus)) {
        addNotification('critical', `Emergency: ${currentStatus.replace(/_/g, ' ')}`, `SentinelTag reported an emergency event.`, 15000);
        recordIncident(DEVICE_ID, { ...deviceData });
      } else if (currentStatus.includes('VERIFYING')) {
        addNotification('warning', 'Device Verifying', 'SentinelTag is currently verifying an irregular status.');
      }
    }
    
    lastStatusRef.current = currentStatus;
  }, [deviceData, addNotification]);

  // ---------------------------------------------------------------------------
  // 💾  GEOFENCE PRESET SYNC (Cloud ↔ Local)
  // Reads presets from Firebase on startup and writes changes back on save.
  // Falls back to hardcoded defaults below if the DB is empty on first run.
  // To add a new preset slot, increment the id and add an entry to defaults[].
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = subscribeToGeofencePresets((data) => {
      if (data && Array.isArray(data)) {
        setGeofencePresets(data);
      } else {
        // Default presets — edit names/coordinates/radii to suit your locations
        const defaults = [
          { id: 1, name: 'Home',   lat: DEFAULT_MAP_CENTER.lat,        lng: DEFAULT_MAP_CENTER.lng,        radius: 100 },
          { id: 2, name: 'Office', lat: DEFAULT_MAP_CENTER.lat + 0.001, lng: DEFAULT_MAP_CENTER.lng + 0.001, radius: 200 },
          { id: 3, name: 'School', lat: DEFAULT_MAP_CENTER.lat - 0.001, lng: DEFAULT_MAP_CENTER.lng - 0.001, radius: 150 }
        ];
        setGeofencePresets(defaults);
        saveGeofencePresets(defaults); 
      }
    });
    return () => unsubscribe();
  }, []);

  const updatePreset = (id, newData) => {
    const updated = geofencePresets.map(p => p.id === id ? { ...p, ...newData } : p);
    setGeofencePresets(updated);
    saveGeofencePresets(updated);
  };

  // ---------------------------------------------------------------------------
  // 💓  HEARTBEAT MONITOR + GEOFENCE EVALUATOR
  // Runs every time deviceData updates (i.e. on every Firebase push).
  //
  // Offline detection: if device timestamp is >15 seconds behind wall-clock time,
  //   the device is considered offline. Adjust "15000" (ms) to change timeout.
  // ---------------------------------------------------------------------------
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    if (!deviceData?.t) return;
    
    const checkOffline = () => {
      const now = new Date();
      const parts = deviceData.t.split(':');
      if (parts.length === 3) {
        let devTime = new Date();
        
        // Parse exact date from hardware if available (DD-MM-YYYY)
        if (deviceData.d) {
          const dParts = deviceData.d.split('-');
          if (dParts.length === 3) {
            devTime.setFullYear(parseInt(dParts[2], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[0], 10));
          }
        }
        
        devTime.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10), 0);
        
        const diffMs = now - devTime;
        setIsOffline(diffMs > 15000); 

        // Update display date directly from hardware
        if (deviceData.d) {
          setDisplayDate(deviceData.d);
        } else {
          const d = devTime.getDate().toString().padStart(2, '0');
          const m = (devTime.getMonth() + 1).toString().padStart(2, '0');
          setDisplayDate(`${d}-${m}-${devTime.getFullYear()}`);
        }
      }
    };
    
    checkOffline();
    const intervalId = setInterval(checkOffline, 5000); // ← heartbeat check interval (ms)

    let isBreached = false;
    // ONLY check geofence if device is ONLINE and enabled
    if (geofenceEnabled && !isOffline && safeZone.lat !== null && safeZone.lng !== null) {
      isBreached = checkGeofenceBreach(
        { lat: parseFloat(deviceData.lat), lng: parseFloat(deviceData.lng) },
        { lat: safeZone.lat, lng: safeZone.lng },
        safeZone.radius
      );
    }
    setGeofenceBreached(isBreached);

    return () => clearInterval(intervalId);
  }, [deviceData, safeZone, geofenceEnabled]);

  const value = {
    deviceData,
    isOffline,
    displayDate,
    safeZone,
    setSafeZone: (newZone) => {
      // Logic for functional updates or direct objects
      const updatedZone = typeof newZone === 'function' ? newZone(safeZone) : newZone;
      setSafeZone(updatedZone);
      saveActiveSafeZone(updatedZone);
    },
    geofenceBreached,
    geofencePresets,
    updatePreset,
    highlightedIncident,
    setHighlightedIncident,
    geofenceEnabled,
    setGeofenceEnabled,
    notificationPermission,
    requestNotificationPermission
  };

  return (
    <SafetyContext.Provider value={value}>
      {/* Toast Notifications UI */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}>
        {notifications.map(n => {
          const isCritical = n.type === 'critical';
          return (
            <div key={n.id} style={{
              background: isCritical 
                ? 'linear-gradient(135deg, hsla(0, 84%, 12%, 0.85), hsla(0, 84%, 20%, 0.95))' 
                : 'linear-gradient(135deg, hsla(35, 92%, 12%, 0.85), hsla(35, 92%, 20%, 0.95))',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${isCritical ? 'hsla(0, 84%, 60%, 0.5)' : 'hsla(45, 100%, 50%, 0.5)'}`,
              color: '#ffffff',
              padding: '1.25rem',
              borderRadius: '12px',
              minWidth: '320px',
              maxWidth: '420px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              borderLeft: `5px solid ${isCritical ? 'hsl(0, 84%, 60%)' : 'hsl(45, 100%, 50%)'}`,
              animation: 'float 0.3s ease-out',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
                <h4 style={{ 
                  margin: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  fontSize: '1rem',
                  color: '#ffffff',
                  fontWeight: '700',
                  letterSpacing: '0.2px'
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: isCritical ? 'hsl(0, 84%, 60%)' : 'hsl(45, 100%, 50%)',
                    boxShadow: `0 0 10px ${isCritical ? 'hsl(0, 84%, 60%)' : 'hsl(45, 100%, 50%)'}`
                  }} />
                  {n.title}
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.875rem', 
                  color: 'rgba(255, 255, 255, 0.95)', 
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>
                  {n.message}
                </p>
            </div>
          );
        })}
      </div>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
