const express = require('express');
const cors = require('cors');
const AppError = require('./utils/AppError');

const app = express();
app.use(cors({
  origin: 'https://judix-xi.vercel.app', // Allow only your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true, // Allow cookies/headers
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));

// ✅ FIXED FOR EXPRESS 5: Handle undefined routes using a named parameter
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});


// // GLOBAL ERROR HANDLING MIDDLEWARE
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Something went wrong'
  });
});

module.exports = app;