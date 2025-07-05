# RTC Chat - A peer-to-peer video chat app made with WebRTC

Built with React, with WebRTC for real-time video streaming, and Firebase as the signaling server.

No back-end, all peer-to-peer media sharing!

## ✨ Features

- **Peer-to-Peer video calls**: Direct browser-to-browser communication using WebRTC
- **Call Creation & Joining**: Create calls with unique IDs or join existing calls
- **Drag & Drop Interface**: Reposition your video feed anywhere on the screen
- **Camera Controls**: Toggle camera on/off during calls
- **Real-time Signaling**: Firebase Firestore handles WebRTC signaling
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI
- **Dark/Light Theme**: Toggle between themes with the mode switcher
- **Permission Management**: Graceful handling of camera permissions
- **Connection Status**: Real-time connection state indicators

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: Zustand
- **Real-time Communication**: WebRTC (RTCPeerConnection)
- **Signaling Server**: Firebase Firestore
- **Drag & Drop**: @dnd-kit
- **UI Components**: Custom components with shadcn/ui patterns
- **Build Tool**: Vite with SWC

### WebRTC Flow

1. **Call Creation**: Host creates RTCPeerConnection and generates offer
2. **Signaling**: Offer stored in Firebase Firestore
3. **Call Joining**: Guest retrieves offer and creates answer
4. **ICE Candidates**: Both parties exchange ICE candidates via Firebase
5. **Connection**: Direct peer-to-peer connection established
