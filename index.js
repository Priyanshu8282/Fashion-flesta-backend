const app = require('./app');
const { connectDB, envConfig } = require('./config');

// Connect to MongoDB
connectDB();




// Start server
const PORT = envConfig.port;
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Fashion Flesta Backend Server`);
  
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = server;
