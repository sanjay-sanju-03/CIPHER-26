# 🔐 CIPHER'26 — Official Techno-Cultural Fest Website

> **National Level Techno-Cultural Fest**  
> Organized by the **Association of Information Technology**  
> **LBS College of Engineering, Kasaragod, Kerala**  
> 📅 **March 23, 2026**

---

## 📌 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Pages](#pages)
- [Admin Panel](#admin-panel)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Deployment Notes](#deployment-notes)
- [Contact](#contact)

---

## 🎯 About

CIPHER'26 is the annual flagship Techno-Cultural Fest of the IT Association at LBS College of Engineering, Kasaragod. This is the official website for the fest — built as a full-stack MERN application — providing event listings, schedule, sponsor info, registrations, and a secure admin dashboard.

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| **React 18** (Vite) | UI framework |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **react-icons** | Icon library (Feather Icons) |
| **Vanilla CSS** | Styling (no Tailwind) |
| **Google Fonts** | Orbitron, Rajdhani, Inter |

### Backend
| Tool | Purpose |
|------|---------|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database |
| **JWT** | Admin authentication |
| **dotenv** | Environment config |
| **bcrypt** | Password hashing |

### Hosting
| Service | Usage |
|---------|-------|
| **MongoDB Atlas** | Cloud database |
| **Render / Railway** | Backend hosting (recommended) |
| **Vercel / Netlify** | Frontend hosting (recommended) |

---

## 🗂 Project Structure

```
CIPHER 26/
├── client/                        # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx / Navbar.css
│   │   │   └── Footer.jsx / Footer.css
│   │   ├── pages/
│   │   │   ├── Home.jsx / Home.css         # Landing page
│   │   │   ├── Events.jsx / Events.css     # Event listings
│   │   │   ├── Schedule.jsx / Schedule.css # Event schedule / Coming Soon
│   │   │   ├── Sponsors.jsx / Sponsors.css # Sponsors page
│   │   │   ├── Register.jsx                # Registration page
│   │   │   ├── AdminLogin.jsx              # Admin login
│   │   │   └── AdminDashboard.jsx          # Admin panel
│   │   ├── utils/
│   │   │   └── api.js                      # Axios instance
│   │   ├── index.css                       # Global styles + design tokens
│   │   ├── App.jsx                         # Routes
│   │   └── main.jsx
│   ├── .env                               # VITE_API_URL
│   └── package.json
│
├── server/                        # Express Backend
│   ├── middleware/
│   │   └── auth.js                        # JWT auth middleware
│   ├── models/
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   ├── Schedule.js
│   │   └── Sponsor.js
│   ├── routes/
│   │   ├── auth.js                        # Admin login/register
│   │   ├── events.js                      # CRUD for events
│   │   ├── registrations.js               # View registrations
│   │   ├── schedule.js                    # CRUD for schedule
│   │   └── sponsors.js                    # CRUD for sponsors
│   ├── server.js                          # Entry point
│   ├── .env                              # MONGO_URI, JWT_SECRET, PORT
│   └── package.json
│
└── package.json                   # Root (optional monorepo scripts)
```

---

## ✨ Features

### Public Website
- 🏠 **Home Page** — Hero section, stats, event highlights, About CIPHER, CTA
- 📋 **Events Page** — Full horizontal event cards with poster, description, date, time, venue, team size, prize, registration status
- 📅 **Schedule Page** — Timeline view (Coming Soon card with countdown when empty)
- 🏆 **Sponsors Page** — Sponsor tiers display
- 📞 **Footer** — Contact details, phone numbers, Google Maps embed, social links

### Event Cards (Public)
- 🖼️ Full-height poster on the left (click to open lightbox)
- 📝 Full description (no truncation)
- 🏷️ Badges: Category, Pre-Event/On-Day, Online/Offline
- 📅 Date, ⏰ Time, 📍 Venue, 👥 Team Size, 🏆 Prize
- 💰 Entry Fee or Free Entry
- 🔗 Register Now button (Google Form link)
- 🔒 Auto "Registration Closed" if deadline has passed

### Admin Panel (`/admin`)
- 🔐 JWT-protected login
- 📊 Overview dashboard with stats
- 📋 **Event Management** — Add, Edit, Delete events with:
  - Title, Category, Date (March 23), Time, Venue, Team Size
  - Prize Pool, Registration Fee, Max Participants
  - Mode (Online/Offline), Event Type (Pre-Event/On-Day)
  - Registration Link (Google Form URL)
  - 🔒 Registration Deadline (auto-closes registration after set date/time)
  - 🖼️ Poster/Image upload (base64, stored in MongoDB)
  - Active/Inactive toggle
- 📅 **Schedule Management** — Add, Edit, Delete timeline items
- 🏆 **Sponsors Management** — Add, Edit, Delete sponsors
- 📝 **Registrations** — View all registrations

---

## 📄 Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/events` | Events | Public |
| `/schedule` | Schedule | Public |
| `/sponsors` | Sponsors | Public |
| `/register` | Register | Public |
| `/admin` | Admin Login | Public |
| `/admin/dashboard` | Admin Dashboard | 🔐 Protected |

---

## 🛡 Admin Panel

### Login
Navigate to `/admin`. Default credentials are set via the `/api/auth/register` endpoint (run once to create admin).

```bash
POST /api/auth/register
{ "username": "admin", "password": "yourpassword" }
```

Then login at `/admin` with those credentials. A JWT token is stored in `localStorage`.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create admin account |
| POST | `/api/auth/login` | Login → returns JWT |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | ❌ | Get all active events |
| POST | `/api/events` | ✅ | Create event |
| PUT | `/api/events/:id` | ✅ | Update event |
| DELETE | `/api/events/:id` | ✅ | Delete event |

### Schedule
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schedule` | ❌ | Get all schedule items |
| POST | `/api/schedule` | ✅ | Create item |
| PUT | `/api/schedule/:id` | ✅ | Update item |
| DELETE | `/api/schedule/:id` | ✅ | Delete item |

### Sponsors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sponsors` | ❌ | Get all sponsors |
| POST | `/api/sponsors` | ✅ | Add sponsor |
| PUT | `/api/sponsors/:id` | ✅ | Update sponsor |
| DELETE | `/api/sponsors/:id` | ✅ | Delete sponsor |

### Registrations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/registrations` | ✅ | View all registrations |
| POST | `/api/registrations` | ❌ | Submit registration |

---

## 🗄 Database Models

### Event
```js
{
  title: String,               // required
  description: String,         // required
  category: String,            // Technical | Workshop | Non-Technical | Gaming | Online
  date: String,                // e.g. "March 23"
  time: String,                // e.g. "10:00 AM"
  venue: String,               // required
  teamSize: String,            // e.g. "Individual" / "2-4 members"
  prize: String,               // e.g. "₹5000"
  registrationFee: Number,     // default 0
  maxParticipants: Number,     // default 100
  image: String,               // base64 data URI
  registrationLink: String,    // Google Form URL
  registrationDeadline: String,// ISO datetime "2026-03-23T17:00"
  isActive: Boolean,           // default true
  mode: String,                // "offline" | "online"
  isPreEvent: Boolean,         // false = On-Day event
}
```

### Schedule
```js
{
  title: String,
  description: String,
  date: String,       // "March 23"
  time: String,
  venue: String,
  type: String,       // event | ceremony | workshop | break
  order: Number,      // sort order
}
```

### Sponsor
```js
{
  name: String,
  logo: String,       // base64 or URL
  tier: String,       // Title | Gold | Silver | Bronze
  website: String,
}
```

### Registration
```js
{
  name: String,
  email: String,
  phone: String,
  college: String,
  event: ObjectId,    // ref: Event
  teamMembers: [String],
  createdAt: Date,
}
```

---

## 🔑 Environment Variables

### `server/.env`
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cipher26
PORT=5000
JWT_SECRET=your_super_secret_key
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files to Git.** Both are listed in `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cipher26.git
cd cipher26
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=choose_a_strong_secret
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Running Locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Create Admin Account (first time only)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

---

## 🌍 Deployment Notes

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

### Backend (Render / Railway)
1. Set all environment variables in the dashboard
2. Start command: `node server.js`
3. Make sure CORS is configured to allow your frontend domain

### Image Storage
Images are stored as **base64 data URIs** directly in MongoDB. This works well for a small event website but for larger scale, consider migrating to Cloudinary or AWS S3.

---

## 📞 Contact

**CIPHER'26 — LBS College of Engineering, Kasaragod**

| Role | Name | Phone |
|------|------|-------|
| Student Coordinator | Muhammed Uvais K | +91 6282691543 |
| HOD | Dr. Anver S.R | +91 9447341312 |
| Staff Coordinator | Prof. Krishnaprasad P.K | +91 9495447684 |

📍 LBS College of Engineering, Kasaragod, Kerala — 671542  
📷 Instagram: [@cipher.lbscek](https://www.instagram.com/cipher.lbscek/)  
💼 LinkedIn: [cipherlbscek](https://www.linkedin.com/company/cipherlbscek/)

---

<div align="center">

Made with ❤️ by the IT Association, LBS College of Engineering  
© 2026 CIPHER'26 — All rights reserved

</div>
