# IMovies — Movie Ticket Booking Made Simple 🎬

A modern, full-stack **MERN** cinema ticket booking web platform built for high reliability, atomic seat conflict prevention, and an immersive user experience.

---

## 🌟 Key Features

- **Cinematic Dark Design**: Charcoal background, violet/purple gradient accents, interactive cards, micro-animations, and full responsiveness across mobile and desktop.
- **Dynamic Catalogue & Search**: Live multi-parameter filtering (by movie title, director, cast, status, genre, and language) with real-time sort options.
- **Interactive Cinema Seat Map**:
  - Curved screen visualizer ("Screen This Way").
  - Tiered seating structure: **VIP Recliner**, **Premium**, and **Standard** rows.
  - Real-time seat state changes (Available, Selected, Sold Out).
  - Maximum seat selection limits (up to 8 seats per order).
- **Atomic Concurrency & Conflict Prevention**:
  - Utilizes atomic MongoDB `findOneAndUpdate` with `{ bookedSeats: { $nin: requestedSeats } }` to guarantee that two simultaneous customers can never double-book the same seat.
- **Simulated Educational Mock Payment**:
  - Integrated mock gateway with UPI, Credit/Debit Card, and Net Banking options.
  - Transparently marked as educational test mode.
- **Cinematic E-Ticket & Confirmation**:
  - Unique human-readable booking reference (`IMV-XXXX-XXXX`).
  - Printable cinema boarding pass with barcodes and seat identifiers.
- **User Booking Management**:
  - View upcoming and past booking history.
  - Instant ticket cancellation with automatic atomic seat release back into inventory.
- **Role-Based Admin Management Console**:
  - Revenue, ticket sales, movies, and theatre analytics dashboard.
  - Movie CRUD operations.
  - Showtime scheduling with customizable pricing tiers.
  - Platform-wide bookings ledger.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **React 19** + **Vite** (Blazing fast bundling & HMR)
- **React Router DOM 7** (Client-side SPA routing & route guards)
- **Bootstrap 5** + Custom CSS Design System
- **Axios** (Configured with request/response interceptors & Bearer token attachment)
- **React Toastify** (Dark theme notifications)
- **Lucide React** (Modern SVG cinema icons)

### Backend (`/server`)
- **Node.js** (v18+) & **Express.js** (REST API)
- **MongoDB Atlas** + **Mongoose** (ODM with schema validations & indices)
- **JWT (JSON Web Tokens)** + **bcryptjs** (Secure authentication & authorization)
- **Helmet** (HTTP security headers)
- **CORS** (Configured for localhost and production URLs)
- **express-rate-limit** (DDoS and brute-force mitigation on auth and API routes)

---

## 📁 Project Directory Structure

```text
Project IMovies/
├── client/                     # Frontend React + Vite SPA
│   ├── public/                 # Favicon and static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer.jsx      # Cinema footer with quick links & badges
│   │   │   ├── LoadingSpinner.jsx # Glowing purple loading indicator
│   │   │   ├── MovieCard.jsx   # Movie card with hover zoom & poster fallback
│   │   │   ├── Navbar.jsx      # Responsive navigation with auth profile
│   │   │   └── ProtectedRoute.jsx # Route guards for user and admin
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth provider (user, token, role)
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Admin metrics & CRUD operations
│   │   │   ├── BookingConfirmation.jsx # E-Ticket pass & print view
│   │   │   ├── Checkout.jsx    # Order summary & mock payment gateway
│   │   │   ├── Home.jsx        # Hero banner, now showing, upcoming movies
│   │   │   ├── Login.jsx       # Sign in with 1-click demo autofill
│   │   │   ├── MovieDetails.jsx # Synopsis, trailer modal, date & showtimes
│   │   │   ├── Movies.jsx      # Full movie catalogue with filter bars
│   │   │   ├── MyBookings.jsx  # User booking history & seat cancellation
│   │   │   ├── Register.jsx    # Account registration
│   │   │   └── SeatSelection.jsx # Interactive cinema seat layout
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios client with JWT interceptor
│   │   ├── App.css
│   │   ├── App.jsx             # Route definitions & Toastify container
│   │   ├── index.css           # Custom dark cinema design system
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   ├── adminController.js   # Analytics & platform statistics
│   │   │   ├── authController.js    # Register, login, getMe
│   │   │   ├── bookingController.js # Atomic bookings, cancellation, ledger
│   │   │   ├── movieController.js   # Movie search, filter, and CRUD
│   │   │   ├── showController.js    # Showtimes grouped by theatre
│   │   │   └── theatreController.js # Theatres & screening halls
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verifyToken & requireAdmin
│   │   │   ├── errorHandler.js # Centralized 404 & Mongoose error handling
│   │   │   └── rateLimiter.js  # Express rate limiting
│   │   ├── models/
│   │   │   ├── Booking.js
│   │   │   ├── Movie.js
│   │   │   ├── Show.js
│   │   │   ├── Theatre.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── movieRoutes.js
│   │   │   ├── showRoutes.js
│   │   │   └── theatreRoutes.js
│   │   ├── seed.js             # Realistic demo movies, theatres, and shows
│   │   ├── server.js           # Express app bootstrap & health checks
│   │   └── verify-app.js       # Automated tests & concurrency verification
│   ├── .env.example
│   └── package.json
│
├── .gitignore                  # Prevents node_modules and .env from being committed
├── package.json                # Root orchestrator scripts
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9+)
- A **MongoDB Atlas** cluster URI (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/imovies.git
cd "Project IMovies"
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_for_imovies_production_998822
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@imovies.com
ADMIN_PASSWORD=Admin@12345
```

**Frontend (`client/.env`):**
Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

Install root, client, and server dependencies:
```bash
# In the root directory:
npm install --prefix server
npm install --prefix client
```

### 4. Seed the Database
Populate realistic demo movies, multiplexes, showtimes, and admin accounts:
```bash
npm run seed --prefix server
```

### 5. Start the Development Servers

**Run Server:**
```bash
npm run dev --prefix server
# Server starts on http://localhost:5000
# Health check available at: http://localhost:5000/api/health
```

**Run Client:**
```bash
npm run dev --prefix client
# Client starts on http://localhost:5173
```

---

## 👥 Demo Accounts (Pre-configured)

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `Admin@12345` | Access to Admin Dashboard, Movie CRUD, Showtime creation, All bookings ledger |
| **Regular User** | `priya@example.com` | `User@12345` | Movie booking, seat selection, personal ticket history & cancellation |

> **Tip:** The Login page includes one-click **"Admin Demo"** and **"User Demo"** buttons to auto-populate credentials for quick grading/testing.

---

## 🛡️ Concurrency & Atomic Seat Conflict Prevention

When multiple users attempt to reserve the same seat simultaneously:
```javascript
// Server atomic query in bookingController.js:
const updatedShow = await Show.findOneAndUpdate(
  {
    _id: showId,
    bookedSeats: { $nin: requestedSeatNumbers }, // Condition: seat must NOT be booked
  },
  {
    $push: { bookedSeats: { $each: requestedSeatNumbers } }, // Atomically append
  },
  { new: true }
);

if (!updatedShow) {
  // If another transaction claimed the seat a millisecond prior, returns 409 Conflict
  return res.status(409).json({
    success: false,
    message: 'One or more selected seats were just booked by another customer. Please choose different seats.',
  });
}
```
This guarantees 100% database consistency without race conditions.

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 cluster**.
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** > Copy the connection string.
6. Replace `<username>` and `<password>` in your connection URI.

### 2. Backend Deployment on Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com/) and click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<Long secure random string>`
   - `CLIENT_URL`: `<Your Vercel frontend URL, e.g. https://imovies.vercel.app>`
   - `ADMIN_EMAIL`: `admin@imovies.com`
   - `ADMIN_PASSWORD`: `Admin@12345`
6. Click **Create Web Service**.
7. Once deployed, run the seed script via Render's **Shell** tab: `npm run seed`.

### 3. Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `<Your deployed Render backend URL>/api` (e.g. `https://imovies-api.onrender.com/api`)
5. Click **Deploy**.

---

## 🧪 Testing & Verification

Run the automated verification suite:
```bash
npm run test --prefix server
```
This script tests:
- Environment variable configuration
- Database connectivity & health
- User registration and bcrypt password hashing
- JWT signing and verification
- Atomic duplicate seat booking rejection (verifies 409 Conflict behavior)

To verify the frontend production build:
```bash
npm run build --prefix client
```

---

## 📝 GitHub Publication Commands

```bash
git add .
git commit -m "feat: complete IMovies cinema booking full-stack MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/imovies.git
git push -u origin main
```
