# SentinelTag — Comprehensive Project Documentation

## 1. Abstract
**SentinelTag** is a comprehensive, context-aware personal safety platform designed to bridge the gap between IoT hardware, real-time tracking, and proactive risk management. Targeted at high-risk workers, outdoor enthusiasts, and individuals needing immediate assistance in emergency situations, the system utilizes LoRa-connected external nodes to beam telemetry data (longitude and latitude, acceleration, ambient sound,device status,signal strength and Battery percentage) to a cloud database continuously. The software suite—operating flawlessly on both Web and natively on Android via Capacitor—ingests this data in real-time. By implementing advanced Geofencing logic, automated Native Push Notifications, interactive Mapping, and an integrated Google Gemini AI Safety Agent, SentinelTag redefines personal safety through predictive alerts and immediate emergency response tooling.

---

## 2. Overall App Functionality
SentinelTag functions as the "Command Center" for a user's safety ecosystem.
- **Monitoring**: It continuously listens to an IoT device worn by the user, providing live updates on whereabouts, heart rate, and hardware status.
- **Security Perimeter**: It allows administrators or users to draw invisible digital fences (Geofences) on a map. If the hardware crosses this boundary, the app immediately flags a breach.
- **Alerting**: In the event of a drop (Fall Detection), loud noise (Scream Detection), or manual panic trigger (Button Alert), the platform intercepts the signal and blasts high-priority native alarms to connected smartphones.

---

## 3. High-Level Features & Functionalities

1. **Live Dashboard Map**: Integrates `react-leaflet` to drop real-time pins corresponding to the user's GPS coordinates over OpenStreetMap data. 
2. **Dynamic Telemetry Panel**: A graphical user interface rendering live longitude and latitude, acceleration, ambient sound,device status,signal strength and Battery percentage of the hardware tag.
3. **Advanced Geofencing Engine**: 
    - Custom map click-to-center radius definitions.
    - Cloud-synchronized safe zones (updates securely via Firebase to all connected apps).
    - Presets saving mechanisms (save "Home", "Office", "School" routes).
    - Offline-Guard logic: Prevents phantom breach alerts if the device loses connection.
4. **Emergency Controls**: One-click manual triggers to sound an alarm 
5. **Historical Incident Timeline**: Records every drop, sprint, scream, or boundary breach accurately with timestamps, storing exactly what the telemetry looked like at the moment of failure.
6. **Travel Breadcrumbs & Route History**: Records path coordinate history to map out the exact route a user took on any given date.
7. **Live Weather Integation**: Connects with OpenWeatherMap APIs based on the device's exact location to evaluate environmental hazards (extreme heat/storms).

---

## 4. Detailed Application Modules (Page-by-Page Breakdown)

### A. Dashboard (Command Center)
The primary landing page for live safety monitoring.
- **Live Map Widget**: A dynamic map locking onto the hardware's exact GPS coordinates.
- **Telemetry Panel**: Live parameter readouts (Latitude, Longitude, Acceleration, Ambient Sound, Device Status, Signal Strength, and Battery Life).
- **Dynamic Weather & Nearby Services Widget**: Automatically retrieves localized weather variables based on the wearer's location. Also provides 1-click quick-links to **Nearby Emergency Services** (Hospitals, Police, Fire Stations), offering immediate routing algorithms in a crisis.
- **Emergency Action Controls**: High-visibility manual override buttons to trigger an active alarm or dispatch alerts to safety contacts.

### B. Geofencing Page
A dedicated interface for managing securing geographical perimeters.
- **Interactive Radius Builder**: Users can click the map to drop a pin and visually drag to define a safe radius.
- **Preset Management**: A visual list to save and load frequently used safe zones (e.g., "Home," "Office," "Trek Route").
- **Cloud Synchronization Engine**: Changes made here immediately synchronize across all paired platforms via Firebase `ActiveSafeZone`.

### C. Timeline (Travel Breadcrumbs)
Designed for retrospective analysis and search-and-rescue assistance.
- **Historical Pathing**: Users can select previous dates from a calendar to view a connected polyline on the map, reconstructing the exact travel route.
- **Timestamped Coordinates**: Rebuilds the user's path minute-by-minute alongside chronological markers.

### D. Alert History (Incidents)
A permanent, tamper-proof chronological log of all historical safety events.
- **Incident Snapshots**: Logs every critical event (Fall, Scream, Geofence Breach, Panic Button) with a time-stamped snapshot of the precise telemetry (battery, location) at the exact moment of failure.
- **Immediate Response Actions**: Each incident block includes a "**Get Directions**" feature, which utilizes map deep-linking to instantly open Google Maps/Apple Maps and calculate the fastest rescue route from the watcher's phone to the site of the incident.

### E. Safety Analytics
A high-level graphical tool for tracking long-term behavior patterns and hardware health.
- **Battery Drain vs Distance Traveled**: Visual Recharts graphs that plot how quickly the battery degrades under heavy usage.
- **Alert Frequency Dashboard**: Aggregate categorizing chart showing which type of alerts (Geofence breaches vs Hardware detections) happen most frequently.
- **Diagnostic Metrics**: Visualizes acceleration ranges and connection strengths to identify potential hardware degradation early.

### F. Settings & Configuration
The administrative control panel for customizing the ecosystem.
- **Device Pairing Management**: Connect and monitor unique IoT hardware ID assignments.
- **Safety Contacts Configuration**: Define SOS phone numbers and emergency emails.
- **Notification Preferences**: Toggles for turning off non-critical audible warning chimes while maintaining critical emergency sirens.

### G. About Layer
Provides system transparency, showing exact software versioning, copyright information, OSS attributions, and local storage diagnostic details.

---

## 5. Hardware & Device Details / How it Works
**The Hardware (SentinelTag Node)**:
The physical device is equipped with:
- GPS Module (for location).
- MPU6050 Accelerometer/Gyroscope (for fall detection and speed).
- Sound Sensor (for scream/abnormal noise detection).
- LoRa Transmitter and reveiver  (Long Range Radio) / ESP32 WiFi.

**The Data Flow**:
1. Sensors on the device constantly poll data locally.
2. The onboard microprocessor packages this data into a JSON payload.
3. The LoRa transmitter sends the data to a Gateway, which forwards it to the internet, OR the ESP32 uploads it directly via WiFi to the **Firebase Realtime Database**.
4. The SentinelTag Web/Android app maintains a permanent WebSocket connection to Firebase (`SentinelTag/LiveStatus/DEVICE_ID`). 
5. Data traverses from sensor to smartphone screen in under ~300ms.

---

## 6. Performance & Logic Efficiency (App Speed)
SentinelTag is heavily optimized for zero-latency emergency environments:
1. **Deduplication Guard**: During high-frequency telemetry floods, the React `useRef` guards prevent the DOM from re-rendering the same notification repeatedly, saving memory and CPU.
2. **Local vs Cloud Evaluation**: Geofence breach math (Haversine formula approximations) is calculated securely on the edge (the user's device/browser) based on the livestream, rather than forcing the server to do the math. This results in 0-ping breach detections.
3. **Smart Re-rendering**: Leveraging React's `useMemo` and `useCallback`, heavy analytical charts (Recharts) do not re-render when the live tracker moves. 
4. **Vite Bundler**: Code is minified via Rollup, shipping incredibly small initial JS blobs to the client, guaranteeing ~1-second load times even on spotty 3G cellular networks.

---

## 7. Platform Architecture: WebApp vs Mobile App
SentinelTag employs a **Single Codebase, Multi-Platform** strategy.
- **Web App / PWA**: Hosted on **Vercel** (or Firebase Hosting). Accessible from any browser. It registers Service Workers to cache assets, allowing the dashboard shell to load offline.
- **Mobile Native (Android)**: Wrapped using **Capacitor**. The exact same React Javascript is executed inside an Android WebKit View.
    - **Native Bridge**: Capacitor converts Javascript commands into Java/Kotlin code. For example, when the React app calls `LocalNotifications.schedule()`, Capacitor executes native Android Notification Channels, bypassing web browser limits. This grants true background ringing, vibration, and persistent push notifications on Android.

---

## 8. Complete Technology Stack
- **Frontend Framework**: React 19 / Vite.
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid) heavily utilizing Glassmorphism and responsive `@media` queries.
- **Routing**: `react-router-dom` (v7) for seamless page transitions.
- **Database / Backend**: Google Firebase (Realtime Database).
- **Mapping**: Leaflet.js wrapped in `react-leaflet`.
- **Charts / UI**: Recharts (for Analytics), `lucide-react` (for SVG iconography).
- **Mobile Runtime Bridge**: Capacitor JS (v8) + Android Studio Gradle toolchain.
- **Hosting**: Vercel CLI.

---

## 9. Third-Party APIs Used
1. **Google Firebase SDK**: Data streaming, cloud persistence, event triggers.
2. **OpenWeatherMap API**: Live humidity, temperature, and condition retrieval based on the hardware's dynamic latitude/longitude.
3. **OpenStreetMap (OSM)**: Open-source map tile generation for all mapping interfaces.

---

## 10. Core Logics Implemented
- **Geofence Distance Logic**: Calculates the spherical distance between the hardware's [Lat, Lng] and the safe zone's center [Lat, Lng]. If `distance > radius`, `isBreached = true`.
- **Offline Fallback Guard**: A heartbeat interval runs every 5000ms. It compares the wall-clock time with the `last_updated_time` of the hardware payload. If the gap exceeds 15 seconds, the app declares an 'Offline State' and safely suspends geofence calculations to avoid false positives.
- **Event Debouncing Reference Logic**: `useRef` locks limit emergency push notifications to 1 per incident block, rather than 50 per second.
- **Cloud State Sync**: `useEffect` hooks listen to `SentinelTag/AppData/ActiveSafeZone`. Any state change locally triggers a simultaneous `set()` to the cloud, synchronizing all cross-platform apps without manual refresh algorithms.

---

## 11. Data for UML & System Diagrams

If you need to draw UML models (e.g., in Draw.io, StarUML, or PlantUML), use the following detailed structural models:

**A. Use Case Diagram**
- **Actors**: User (Hardware Wearer), Watcher/Admin (Dashboard User), External APIs (OpenWeatherMap).
- **Core Use Cases**: 
    - *Hardware*: Send Telemetry, Trigger SOS (Button), Detect Fall/Scream.
    - *Watcher*: Monitor Dashboard, Configure Geofence, View Historical Data, Review Incident Logs.
    - *System*: Retrieve Weather Data, Log Incidents, Dispatch Push Notifications.

**B. Class Diagram (Data & Logic Entities)**
- **IoT Node**: `DeviceId`, `Lat`, `Lng`, `Accel`, `Sound`, `Status`, `Battery`, `RSSI` -> Methods: `pollSensors()`, `transmitLoRa()`.
- **Firebase Realtime DB**: `LiveStatus`, `Breadcrumbs`, `Incidents`, `GeofencePresets`.
- **SafetyContext (React Context)**: `deviceData`, `isOffline`, `safeZone`, `geofenceBreached`, `notifications[]` -> Methods: `addNotification()`, `setSafeZone()`, `checkOffline()`.
- **Mobile/Capacitor Bridge**: `LocalNotifications` -> Methods: `createChannel()`, `schedule()`.

**C. Activity Diagram (Geofence Evaluation Flow)**
1. Standard telemetry received via WebSocket.
2. System checks if `geofenceEnabled == true` AND `isOffline == false`.
3. Geofence algorithm calculates Haversine distance between device `[lat, lng]` and SafeZone `[lat, lng]`.
4. Decision: If `Distance > Radius` -> Proceed to Step 5. Else -> Wait for next pulse.
5. Trigger Red UI Alert (Dashboard).
6. Fire Native Audio Siren & Push Notification.
7. Write event to Firebase `Incidents` node (`recordIncident()`) to prevent duplicate logging.

**D. Sequence Diagram (Emergency Alert Flow)**
1. **Hardware Node**: Detects Fall -> Publishes `status: "FALL_DETECTED"` to Firebase.
2. **Firebase Realtime DB**: Pushes `LiveStatus` update to all active web/mobile clients.
3. **SafetyContext.jsx**: Receives snapshot -> Evaluates `status !== 'NORMAL'`.
4. **SafetyContext.jsx**: Calls `addNotification()` UI function and database `recordIncident()`.
5. **LocalNotifications Plugin**: Requests Android OS native layer to play alarm sound.
6. **Android OS**: Pushes native banner to the user's screen.

**E. State Machine Diagram (Hardware/System States)**
- `NORMAL`: Default, transmitting standard coordinates.
- `VERIFYING`: Anomalous data detected, waiting for sensor confirmation.
- `FALL_DETECTED` / `SCREAM_DETECTED`: Confirmed danger parameter breached.
- `BUTTON_ALERT`: Manual override SOS triggered.
- `GEOFENCE_BREACH`: Determined computationally by coordinates.
- `OFFLINE`: Computed locally when no ping is received within the past 15 seconds.

---

## 12. Advantages of SentinelTag
- **Agnostic & Scalable**: Works seamlessly across desktops, iPhones (via browser), and Android (via Native App) without needing separate codebases.
- **Highly Responsive (Sub-second)**: Uses raw sockets (Firebase Realtime) instead of REST APIs to fetch data, bringing latency close to zero.
- **Cost Effective Architecture**: Runs entirely within free-tier limits of Firebase and Vercel for standard consumer load.

---

## 13. Future Scope
- **Offline Map Mementos**: Automatically cache map tiles directly to the Android phone storage using Capacitor Filesystem so the app maps work without an internet connection.
- **Automated Rescue Routing**: In case of a fall, route the fastest path from the watcher's phone to the hardware Tag using MapBox Directions API.
- **Wearable Integration**: Push SentinelTag critical alerts directly to Apple Watches or WearOS devices via native Bluetooth BLE channels.
- **Predictive Battery AI**: Use historical data machine learning to predict exactly when the device will run out of battery based on current velocity and outdoor temperature constraints.

---
_Generated for Vikram Reddy | SentinelTag Ecosystem 2026_
