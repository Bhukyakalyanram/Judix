const app = require('./app'); // Move app logic (cors, routes) to app.js
const connectDB = require('./config/db');
const config = require('./config/config');

// Connect to Database
connectDB();

const server = app.listen(config.port, () => {
  console.log(`
    ====================================
    ✅ Server running in ${config.env} mode
    🚀 Listening on port: ${config.port}
    ====================================
  `);
});

// Handle Unhandled Promise Rejections (e.g., DB connection issues)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});