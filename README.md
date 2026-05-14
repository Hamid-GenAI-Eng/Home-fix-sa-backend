<div align="center">

# Home Fix SA — Backend API

**Express.js · MongoDB · JWT · Google OAuth2 · Vercel**

[![Live API](https://img.shields.io/badge/Live%20API-home--fix--sa--backend.vercel.app-black?style=flat-square&logo=vercel)](https://home-fix-sa-backend.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%2018-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express%205-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## Overview

**Home Fix SA** is a production-deployed authentication backend for a home repair and maintenance services platform operating in Saudi Arabia. Built with Express.js 5 and MongoDB, it supports both traditional email/password auth and Google OAuth2 via Passport.js — with JWT-based session management, bcrypt password hashing, login-event email notifications, and Vercel-optimized serverless deployment.

**Frontend:** [jeddahdepairs.com](https://www.jeddahdepairs.com) — Home repair & maintenance services in Jeddah, KSA.

🔗 **Live API:** [home-fix-sa-backend.vercel.app](https://home-fix-sa-backend.vercel.app)  
📦 **Repo:** [github.com/Hamid-GenAI-Eng/Home-fix-sa-backend](https://github.com/Hamid-GenAI-Eng/Home-fix-sa-backend)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18 |
| **Framework** | Express.js 5.2 |
| **Database** | MongoDB (Mongoose 9) |
| **Authentication** | JWT (jsonwebtoken 9) · Passport.js 0.7 |
| **OAuth2** | passport-google-oauth20 |
| **Password Hashing** | bcryptjs (10 salt rounds) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Security** | Helmet · CORS · dotenv |
| **Deployment** | Vercel Serverless |

---

## Project Structure 
```
Home-fix-sa-backend/
├── src/
│   ├── models/
│   │   └── User.js                 # Mongoose user schema
│   ├── controllers/
│   │   └── authController.js       # Signup, login, Google callback logic
│   ├── routes/
│   │   └── authRoutes.js           # Route definitions
│   ├── config/
│   │   ├── passport.js             # Google OAuth2 Passport strategy
│   │   └── nodemailer.js           # Email transporter config
│   └── server.js                   # Express app entry point
├── vercel.json                      # Vercel deployment config
├── package.json
└── LICENSE
```

---

## API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register with email & password | Public |
| POST | `/api/auth/login` | Email / password login | Public |
| GET | `/api/auth/google` | Initiate Google OAuth2 flow | Public |
| GET | `/api/auth/google/callback` | Google OAuth2 callback handler | Public |
| GET | `/` | Health check | Public |

---

## Auth Flows

### Email / Password
```
POST /api/auth/signup
{
"firstName": "Muhammad",
"lastName": "Ali",
"email": "muhammad@example.com",
"phone": "+966501234567",
"password": "SecurePass123!"
}
→ Hash password (bcrypt, 10 rounds)
→ Save user to MongoDB
→ Send welcome email via Nodemailer
→ Return JWT (30-day expiry)

POST /api/auth/login
→ Validate credentials
→ Increment loginCount + update lastLogin
→ Send login security notification email
→ Return JWT
```

### Google OAuth2
```
GET /api/auth/google
→ Google consent screen (profile + email scopes)
→ User authorizes
GET /api/auth/google/callback
→ Passport verifies Google profile
→ If user exists   → link googleId if missing
→ If user is new   → auto-create from Google profile
→ Increment loginCount + send login email
→ Redirect → https://www.jeddahdepairs.com/login?token=...&user=...
```

---

## User Schema

```javascript
{
  firstName:  String  (required),
  lastName:   String,
  email:      String  (required · unique · lowercase),
  phone:      String,
  password:   String  (hashed · optional for Google users),
  googleId:   String  (links Google account),
  loginCount: Number  (default: 0),
  lastLogin:  Date,
  timestamps: createdAt · updatedAt
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Cloud project (OAuth2 credentials)
- Gmail account (Nodemailer)

### Installation

```bash
git clone https://github.com/Hamid-GenAI-Eng/Home-fix-sa-backend.git
cd Home-fix-sa-backend
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

PORT=5000
NODE_ENV=development
```

### Run Locally

```bash
npm run dev
```

Server starts at `http://localhost:5000`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |

---

## Security

| Feature | Implementation |
|---|---|
| Password Hashing | bcryptjs (10 salt rounds) |
| JWT Auth | 30-day expiry · HS256 |
| Google OAuth2 | Passport.js strategy |
| HTTP Security Headers | Helmet.js |
| CORS | Cross-origin enabled |
| Login Alerts | Email notification on every login |
| DB Connection | Serverless-optimized pooling |

---

## Deployment

Deployed on **Vercel** as a serverless Node.js function. All routes are handled by `src/server.js`. MongoDB connections are pooled and reused across requests to handle cold starts gracefully.

```bash
# Auto-deploys on push to main
git push origin main

# Or deploy manually
vercel --prod
```

---

## Built By

**[Code Envision Technologies](https://codeenvisiontechnologies.com)**

Developed by **Hamid Saifullah** — Tech Lead at [Code Envision Technologies](https://codeenvisiontechnologies.com)

[![GitHub](https://img.shields.io/badge/GitHub-Hamid--GenAI--Eng-181717?style=flat-square&logo=github)](https://github.com/Hamid-GenAI-Eng)
[![Portfolio](https://img.shields.io/badge/Portfolio-hamid--saifullah-black?style=flat-square&logo=vercel)](https://hamid-saifullah-portfolio-nexus.vercel.app)
[![Code Envision Technologies](https://img.shields.io/badge/Company-Code%20Envision%20Technologies-0A66C2?style=flat-square)](https://codeenvisiontechnologies.com)
