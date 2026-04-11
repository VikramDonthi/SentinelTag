import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set } from 'firebase/database';
import { mockData } from '../mockData';

// ---------------------------------------------------------------------------
// 🔴  FIREBASE CONFIGURATION
// ---------------------------------------------------------------------------
// 1. Go to https://console.firebase.google.com/ and select your project
// 2. Project Settings → Your Apps → Web App → SDK setup and configuration
// 3. Copy the config object and paste the values below
// 4. Set databaseURL to your Realtime Database URL (visible in Database tab)
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDcctL8VdQJiVt_Yn06yAgjn4jbX-BPowk",       // ← Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN",                             // ← e.g. yourapp.firebaseapp.com
  databaseURL: "https://mainproject-f8b19-default-rtdb.firebaseio.com/", // ← Realtime DB URL
  projectId: "YOUR_PROJECT_ID",                               // ← e.g. mainproject-f8b19
  storageBucket: "YOUR_STORAGE_BUCKET",                       // ← e.g. yourapp.appspot.com
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ---------------------------------------------------------------------------
// 🔧  MOCK DATA TOGGLE
// Set to true → uses local mockData.js (no Firebase needed, great for dev)
// Set to false → reads live from your Firebase Realtime Database
// ---------------------------------------------------------------------------
const USE_MOCK_DATA = false;

let db;

try {
  if (!USE_MOCK_DATA && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  }
} catch (error) {
  console.error("Firebase init error", error);
}

// ---------------------------------------------------------------------------
// 📡  DEVICE SUBSCRIPTION
// ---------------------------------------------------------------------------
// Listens for real-time telemetry from the device.
// Path: SentinelTag/LiveStatus/<DEVICE_ID>
// DEVICE_ID is set in src/config.js → DEVICE_ID
// ---------------------------------------------------------------------------
export const subscribeToLiveStatus = (deviceId, callback) => {
  if (USE_MOCK_DATA || !db) {
    // Return mock data immediately and simulate updates if needed
    callback(mockData.LiveStatus[deviceId]);
    return () => {}; // Cleanup function mock
  }

  const statusRef = ref(db, `SentinelTag/LiveStatus/${deviceId}`);
  return onValue(statusRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Fetch Available Dates for Breadcrumbs
export const getAvailableBreadcrumbDates = async (deviceId) => {
  if (USE_MOCK_DATA || !db) {
    return mockData.Breadcrumbs[deviceId] ? Object.keys(mockData.Breadcrumbs[deviceId]) : [];
  }

  const breadcrumbsRef = ref(db, `SentinelTag/Breadcrumbs/${deviceId}`);
  const snapshot = await get(breadcrumbsRef);
  if (snapshot.val()) {
    return Object.keys(snapshot.val()).sort((a, b) => new Date(b.split('-').reverse().join('-')) - new Date(a.split('-').reverse().join('-')));
  }
  return [];
};

// Fetch Breadcrumbs
export const getBreadcrumbs = async (deviceId, dateStr) => {
  if (USE_MOCK_DATA || !db) {
    return mockData.Breadcrumbs[deviceId]?.[dateStr] || null;
  }

  const breadcrumbsRef = ref(db, `SentinelTag/Breadcrumbs/${deviceId}/${dateStr}`);
  const snapshot = await get(breadcrumbsRef);
  return snapshot.val();
};

// Fetch All Incidents (for Analytics)
export const getAllIncidents = async () => {
    if (USE_MOCK_DATA || !db) {
        return mockData.Incidents;
    }

    const incidentsRef = ref(db, `SentinelTag/Incidents`);
    const snapshot = await get(incidentsRef);
    return snapshot.val();
};

// Fetch Available Dates for Incidents
export const getAvailableIncidentDates = async () => {
  if (USE_MOCK_DATA || !db) {
    return Object.keys(mockData.Incidents || {});
  }

  const incidentsRef = ref(db, `SentinelTag/Incidents`);
  const snapshot = await get(incidentsRef);
  if (snapshot.val()) {
    return Object.keys(snapshot.val()).sort((a, b) => new Date(b.split('-').reverse().join('-')) - new Date(a.split('-').reverse().join('-')));
  }
  return [];
};

// Fetch Incidents by Date
export const getIncidents = async (dateStr) => {
  if (USE_MOCK_DATA || !db) {
    return mockData.Incidents[dateStr] || null;
  }

  const incidentsRef = ref(db, `SentinelTag/Incidents/${dateStr}`);
  const snapshot = await get(incidentsRef);
  return snapshot.val();
};

// Fetch Analytics
export const getAnalytics = async () => {
    if (USE_MOCK_DATA || !db) {
      return mockData.Analytics;
    }
  
    const analyticsRef = ref(db, `SentinelTag/Analytics`);
    const snapshot = await get(analyticsRef);
    return snapshot.val();
  };

// Geofence Presets Sync
export const subscribeToGeofencePresets = (callback) => {
  if (USE_MOCK_DATA || !db) {
    const saved = localStorage.getItem('sentinel_geofence_presets');
    callback(saved ? JSON.parse(saved) : null);
    return () => {};
  }

  const presetsRef = ref(db, `SentinelTag/AppData/GeofencePresets`);
  return onValue(presetsRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const saveGeofencePresets = async (presets) => {
  if (USE_MOCK_DATA || !db) {
    localStorage.setItem('sentinel_geofence_presets', JSON.stringify(presets));
    return;
  }

  const presetsRef = ref(db, `SentinelTag/AppData/GeofencePresets`);
  await set(presetsRef, presets);
};

// ---------------------------------------------------------------------------
// 📝  INCIDENT LOGGING
// ---------------------------------------------------------------------------
// Writes a single incident record to Firebase under:
//   SentinelTag/Incidents/<DD-MM-YYYY>/<DEVICEID_HH-mm-ss>
// Called automatically by SafetyContext on every alert or geofence breach.
// ---------------------------------------------------------------------------
export const recordIncident = async (deviceId, data) => {
  if (USE_MOCK_DATA || !db) {
    console.log("Mock Incident Recorded:", data);
    return;
  }

  // Get current date in DD-MM-YYYY format
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  
  // Format the time for the key: HH-mm-ss
  const timeKey = data.t.replace(/:/g, '-');
  const incidentId = `${deviceId}_${timeKey}`;

  const incidentRef = ref(db, `SentinelTag/Incidents/${dateStr}/${incidentId}`);
  await set(incidentRef, data);
};
