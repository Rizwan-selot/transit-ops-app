# Transit Ops - Mobile App Web Preview Prototype

This project converts the **Stitch Design System** for **Transit Ops** into a fully interactive mobile web prototype with an embedded web preview device shell.

## 📱 Included Screens

1. **01 - Manager Login** (`login-screen`)
   - Pre-filled credentials (`manager@transitops.io`)
   - Interactive password visibility toggle
   - Functional "Sign In" and "Face ID" simulated login flows
2. **02 - Operations Dashboard** (`dashboard-screen`)
   - Regional fleet telemetry KPIs (Active Fleet, Running, Stopped, Idle, Depot)
   - Performance SLA punctuality horizontal bar & metrics breakdown
   - Interactive management modules & active system alert cards
3. **03 - Fleet Status** (`status-screen`)
   - Live vehicle search bar (search by vehicle ID, driver, line, or depot)
   - Interactive filter chips (`All`, `Running`, `Stopped`, `Idle`, `Offline`) with live counting & filtering
   - Detailed vehicle status cards linking directly to Vehicle Details
4. **04 - Vehicle Detail (#4082)** (`vehicle-detail-screen`)
   - Architectural vector map with live pulse node & next station ETA card
   - Live CAN-BUS telemetry bento metrics (Speed 42 km/h gauge, Ignition state, Energy/Battery 78%)
   - Real-time CAN-BUS hardware node log stream
   - Interactive "Contact Driver" modal & "Emergency Override" command modal

## 🚀 How to Run

1. Open `index.html` in any modern web browser (Edge, Chrome, Firefox, Safari).
2. Use the top web control bar to switch screens or change device frame views (`iPhone 16 Pro`, `Pixel 9`, `Full Screen`).
