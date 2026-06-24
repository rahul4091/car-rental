# DriveEase — Car Rental Web App

A full-stack car rental platform where users can browse cars, make bookings, and pay online. Admins can manage the fleet, locations, and all bookings.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Zustand, Axios, Stripe.js |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), httpOnly cookies |
| Payments | Stripe (PaymentIntents + webhooks) |
| Storage | Cloudinary (car images, avatars, documents) |
| Email | Nodemailer (SMTP) |

## Project Structure

```
car/
├── api/          # Express backend
│   └── src/
│       ├── server.js
│       ├── config/       # DB, Cloudinary
│       ├── model/        # Mongoose schemas
│       ├── controllers/  # Route handlers
│       ├── routes/       # Express routers
│       ├── middleware/   # Auth, error handler, upload
│       └── utils/        # JWT, email, OTP, logger
└── web/          # React + Vite frontend
    └── src/
        ├── api/          # Axios functions (one file per domain)
        ├── store/        # Zustand auth store
        ├── components/   # Layout, Navbar, Footer, UI components
        └── pages/        # Route-level page components
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally on port `27017` (or a MongoDB Atlas URI)
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### 1. Configure environment variables

Create `api/.env` (never commit this file):

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URL=mongodb://localhost:27017/car_rental

# JWT
JWT_SECRET=<random string, min 32 chars>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<different random string, min 32 chars>
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (used in CORS and email links)
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail example — use an App Password, not your account password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@driveease.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> Cloudinary and Stripe are optional for basic local development — file uploads and payments will fail gracefully without them.

### 2. Start the backend

```bash
cd api
npm install
npm run dev     # nodemon watches src/ and auto-restarts
```

Backend runs at **http://localhost:5000**

### 3. Start the frontend

```bash
cd web
npm install
npm run dev     # Vite dev server with HMR
```

Frontend runs at **http://localhost:5173**. All `/api/*` requests are proxied to the backend by Vite.

### Production build (frontend)

```bash
cd web
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Features

### User
- Browse and search cars with filters (type, brand, transmission, fuel type, price range)
- View car details, image gallery, specs, and reviews
- Check availability by date range
- Book a car with pickup/drop location selection and coupon codes
- Pay securely via Stripe
- Dashboard with booking history and cancellation (refund policy applies)
- Profile management, avatar upload, driving license upload

### Admin
- Dashboard stats (bookings, revenue, fleet overview)
- Manage cars (create, update, upload images, soft-delete)
- Manage locations
- Manage all bookings and users
- Issue refunds

## API Overview

Base path: `/api/v1`

| Resource | Base Route |
|---|---|
| Auth | `/auth` |
| Cars | `/cars` |
| Bookings | `/bookings` |
| Payments | `/payments` |
| Reviews | `/reviews` |
| Locations | `/locations` |
| Users | `/users` |
| Admin | `/admin` |

See [PROJECT.md](./PROJECT.md) for the full endpoint reference, data models, and data flow diagrams.

## Authentication Flow

1. Login/Register returns an access token (JSON body) and sets an httpOnly refresh token cookie.
2. The Axios client attaches `Authorization: Bearer <token>` to every request.
3. On a `401`, the client silently POSTs to `/auth/refresh-token` (cookie sent automatically), retries the original request with the new token.
4. Zustand persists the access token and user to `localStorage` to survive page refreshes.

## Booking & Payment Flow

```
Browse → Car Detail → Check Availability
  → Booking page (dates, locations, coupon)
    → POST /bookings → booking created with price breakdown (base + 18% GST + security deposit)
      → Payment page
        → POST /payments/create-intent → Stripe clientSecret
          → Stripe.js processes payment
            → POST /payments/confirm → booking confirmed
```
