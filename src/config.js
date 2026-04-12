// =============================================================================
//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
//
//  SentinelTag — Global Application Configuration
//  -----------------------------------------------
//  All user-editable keys and settings live here.
//  DO NOT commit this file to public repositories
//  with real API keys filled in.
// =============================================================================

// ---------------------------------------------------------------------------
// 🌤️  OPENWEATHERMAP — Real-time Weather
// ---------------------------------------------------------------------------
// 1. Sign up free at https://openweathermap.org/api
// 2. Navigate to "My API Keys" in your profile dashboard
// 3. Copy your API key and paste it below, replacing the empty string ""
// 4. The free "Current Weather Data" plan is sufficient for this app
// ---------------------------------------------------------------------------
export const OPENWEATHER_API_KEY = "be9481c5c2c3f99e0d17835ce306643d"; // ← PASTE YOUR KEY HERE

// The units system: "metric" = Celsius, "imperial" = Fahrenheit
export const WEATHER_UNITS = "metric";

// ---------------------------------------------------------------------------
// 🔴  FIREBASE — Real-time Database
// ---------------------------------------------------------------------------
// Already configured in src/utils/firebase.js — listed here for reference.
// Path: SentinelTag/LiveStatus/<DEVICE_ID>
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 📡  SENTINEL DEVICE — Hardware Configuration
// ---------------------------------------------------------------------------
// The device ID must exactly match the key used in your Firebase database.
// Example Firebase path: SentinelTag/LiveStatus/SENTINEL_01
// ---------------------------------------------------------------------------
export const DEVICE_ID = "SENTINEL_01"; // ← Change to match your device key

// ---------------------------------------------------------------------------
// 🗺️  MAP — Initial Loading Center
// ---------------------------------------------------------------------------
// This coordinate is ONLY used to load the map tiles during initial boot.
// Once device data arrives, the map auto-centers on the device location,
// and the Safe Zone is dynamically created at the device's real coordinates.
// ---------------------------------------------------------------------------
export const DEFAULT_MAP_CENTER = {
  lat: 17.890249, 
  lng: 79.599945, 
};

// ---------------------------------------------------------------------------
// 🤖  GEMINI — AI Safety Agent
// ---------------------------------------------------------------------------
// 1. Get an API key from https://aistudio.google.com/
// 2. Paste your key below
// ---------------------------------------------------------------------------
export const GEMINI_API_KEY = ""; // ← PASTE YOUR GEMINI API KEY HERE

export const GEMINI_SYSTEM_PROMPT = `
You are the SentinelTag Safety Assistant. Your role is to analyze real-time safety data 
(heart rate, altitude, speed, battery) and provide concise, actionable safety advice.
You should be calm, professional, and prioritize user safety above all else.
If you see dangerous trends (extreme heart rate, rapid altitude drop), flag them immediately.
`;

export const AUTH_USERS = {
  // "username": "password"
  vikramreddy1: "sentinel123", // ← Change or remove this entry
  admin: "admin123",    // ← Change or remove this entry
};
//end 