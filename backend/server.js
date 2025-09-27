// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeDB } = require('./services/dbService');
const requestsRouter = require('./routes/requests');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/requests', requestsRouter);

// Start server after DB is initialized
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initializeDB();
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
