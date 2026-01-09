# Judix Full-Stack Task Management System

A modern, scalable, and secure web application built for the Judix Developer Intern assignment. Features a robust MERN stack architecture with JWT-based authentication, real-time profile management, and a high-performance task dashboard.

## 🚀 Core Features
- **Authentication**: JWT-based login/signup with secure password hashing (bcrypt).
- **Profile Management**: Real-time name updates and secure password change flow.
- **Task Dashboard**: Full CRUD operations for tasks with debounced search and status filtering.
- **Responsive UI**: Polished, mobile-first design using TailwindCSS and Lucide icons.
- **Security**: Protected routes, JWT middleware, and server-side validation.

## 🛠️ Tech Stack
- **Frontend**: React.js, TailwindCSS, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Icons/UI**: Lucide React, React Hot Toast.

## ⚙️ Installation & Setup

### Backend
1. Navigate to `/backend`
2. Run `npm install`
3. Create a `.env` file and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
4. Run `npm start`


### Frontend
1. Navigate to `/frontend`
2. Run `npm install`
2. Run `npm run dev`