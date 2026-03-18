# CIPHER'26 🔐

**National Level Techno-Cultural Fest**  
Organized by the Association of Information Technology  
**LBS College of Engineering, Kasaragod**  
📅 March 23, 2026

---

## About

CIPHER is the annual flagship Techno-Cultural Fest of the IT Association at LBS College of Engineering, Kasaragod. This is the official website for CIPHER'26 — featuring event listings, schedules, certificate verification, and comprehensive event management.

---

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite bundler
- **React Router DOM** v7.13.1 for navigation
- **Axios** for API communication
- **React Icons** (Feather icons)
- **CSS3** with CSS variables, glassmorphism, and keyframe animations

### Backend
- **Node.js** with Express 5.2.1
- **MongoDB 9.2.4** with Mongoose ODM
- **JWT Authentication** with bcryptjs password hashing
- **Google Sheets API v4** for certificate data integration

### Styling & Design
- **Font Stack**: Orbitron (titles), Rajdhani (tech), Inter (body)
- **Color Palette**: 
  - Primary Green: `#00ff88`
  - Secondary Purple: `#7b2fff`
  - Accent Cyan: `#00d4ff`
  - Dark Background: `#060614`
- **Effects**: Glassmorphism, glow animations, gradient shadows, particle effects

---

## 📄 Pages & Features

### Public Pages
- **Home** — Landing page with fest highlights, 1000+ participants, 25+ events showcase, animated countdown timer, and particle effects
- **Events** — Complete event catalog with descriptions, posters, and registration links
- **Schedule** — Day-wise schedule for March 23, 2026
- **Sponsors** — Festival sponsors and partners
- **Register** — Event registration form
- **Certificates** — Certificate listing and verification with Google Sheets backend

### Admin Pages
- **Admin Dashboard** — Event and registration management
- **Admin Login** — Secure authentication with JWT

---

## ✨ UI/UX Enhancements (Latest)

### Navbar
- **Glassmorphism Effect** — Persistent 10px blur backdrop with enhanced 25px blur on scroll
- **Logo Branding** — CIPHER'26 logo with color-coded text (green CIPHER + cyan '26)
- **Green Glow Border** — Subtle shadow and glow effect on scroll activation

### Countdown Timer
- **Pulsing Glow Animation** — 2-second oscillating box-shadow effect (0.3 → 0.5 opacity)
- **Text Glow** — Green text-shadow on countdown numbers for neon effect
- **Responsive Sizing** — Optimized 75px boxes that fit viewport without scrolling

### Buttons
- **Dual-Layer Shadow System** — Gradient shadows with inset highlights
- **Enhanced Hover Effects** — 40px glow radius on primary buttons, 2px border styling on secondary
- **Transform Feedback** — translateY(-3px) on hover for tactile response

### Typography
- **Tagline Hierarchy** — Font-weight 600 with proper letter-spacing
- **Responsive Scaling** — clamp() values for fluid sizing across devices

### Scroll Indicator
- **Animated Arrow** — Chevron animation with vertical movement (-10px to +10px)
- **Fade Effect** — Opacity oscillation from 0.3 to 1.0
- **Green Color** — Matches primary brand color

---

## 🔗 API Integration

### Google Sheets Certificate Verification
- **Sheet**: CT26 with columns: NAME, CERTIFICATE ID, EVENT NAME, EVENT DATE, CERTIFICATE TYPE, VERIFICATION URL, QR CODE
- **Search**: By certificate ID (exact match) or participant name (partial match)
- **Endpoint**: `GET /api/certificates/verify?type=id&value=CT26001`

---

## 📁 Project Structure

```
CIPHER 26/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, Countdown, Footer
│   │   ├── pages/          # Home, Events, Register, etc.
│   │   ├── utils/          # API utilities
│   │   ├── assets/         # Logo and images
│   │   └── index.css       # Global styles
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # Auth middleware
│   └── server.js
└── README.md
```

---

## 🛠 Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Sheets API key

### Installation

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Environment Variables

**`server/.env`**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cipher26
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SHEET_RANGE=CT26!A:Z
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### Running Development Servers

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

Server runs on `http://localhost:5000`  
Client runs on `http://localhost:5173`

---

## 🎨 Design Details

### Particle System
- 80 animated green particles on landing page
- Smooth movement with boundary collision detection
- Variable opacity for depth effect

### Animations
- **fadeInUp** — Staggered entrance for hero elements
- **float** — ±10px vertical movement on logos
- **scrollDown** — Scroll indicator arrow animation (2s infinite)
- **countdownGlow** — Countdown box glow pulse (2s infinite)
- **Hover Effects** — Button transform and shadow enhancements

### Responsive Breakpoints
- Mobile-first design with clamp() for fluid scaling
- Tablet (768px): Adjusted spacing and font sizes
- Desktop (1024px+): Full layout optimization

---

## 📊 Current Status

- ✅ Frontend & Backend running
- ✅ Google Sheets API integration (certificate verification)
- ✅ JWT Authentication operational
- ✅ MongoDB connection stable
- ✅ All UI/UX enhancements implemented
- ✅ Landing page optimized for viewport fit
- ✅ Responsive design across devices

---

## 🔐 Security

- Password hashing with bcryptjs
- JWT-based authentication
- Protected admin routes
- Environment variable configuration

---

## 📝 License

© 2026 CIPHER'26 — LBS College of Engineering, Kasaragod  
All rights reserved. Part of the IT Association Annual Fest.
