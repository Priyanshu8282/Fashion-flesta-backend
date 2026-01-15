const express = require('express');
const cors = require('cors');
const config = require('./config/env.config');



// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Fashion Flesta API - Girls Wear E-commerce',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});




// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

module.exports = app;
