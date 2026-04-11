export const mockData = {
  Breadcrumbs: {
    SENTINEL_01: {
      "10-04-2026": {
        "15-16-53": { lat: "17.890249", lng: "79.599945", t: "15:16:53" },
        "15-18-21": { lat: "17.890300", lng: "79.600000", t: "15:18:21" },
        "15-19-22": { lat: "17.890350", lng: "79.600100", t: "15:19:22" },
        "15-20-23": { lat: "17.890400", lng: "79.600200", t: "15:20:23" },
        "15-21-30": { lat: "17.890450", lng: "79.600300", t: "15:21:30" },
        "15-22-41": { lat: "17.890500", lng: "79.600400", t: "15:22:41" },
        "15-23-47": { lat: "17.890550", lng: "79.600500", t: "15:23:47" },
        "15-24-53": { lat: "17.890600", lng: "79.600600", t: "15:24:53" },
        "15-49-25": { lat: "17.890650", lng: "79.600700", t: "15:49:25" },
        "16-24-28": { lat: "17.890700", lng: "79.600800", t: "16:24:28" }
      }
    }
  },
  Incidents: {
    "10-04-2026": {
      "SENTINEL_01_15-50-23": { accel: "1.03", battery: "85", lat: "17.890249", lng: "79.599945", mic: "0", rssi: "-108", status: "NORMAL", t: "15:50:23" },
      "SENTINEL_01_15-51-52": { accel: "1.07", battery: "85", lat: "17.890250", lng: "79.599950", mic: "0", rssi: "-107", status: "NORMAL", t: "15:51:52" },
      "SENTINEL_01_16-06-58": { accel: "1.15", battery: "85", lat: "17.890300", lng: "79.600000", mic: "0", rssi: "-106", status: "SCREAM_DETECTED", t: "16:06:58" },
      "SENTINEL_01_16-09-20": { accel: "0.94", battery: "85", lat: "17.890400", lng: "79.600200", mic: "0", rssi: "-109", status: "BUTTON_ALERT", t: "16:09:20" }
    }
  },
  LiveStatus: {
    SENTINEL_01: {
      accel: "1.03",
      battery: "85",
      lat: "17.890249",
      lng: "79.599945",
      mic: "0",
      rssi: "-108",
      status: "NORMAL",
      t: "16:24:28"
    }
  },
  Analytics: {
    BatteryHistory: [
      { time: '08:00', level: 100 },
      { time: '10:00', level: 95 },
      { time: '12:00', level: 90 },
      { time: '14:00', level: 88 },
      { time: '16:00', level: 85 }
    ],
    AlertFrequency: [
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 1 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 2 },
      { day: 'Fri', count: 0 },
      { day: 'Sat', count: 0 },
      { day: 'Sun', count: 0 }
    ]
  }
};
