require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

connectDB();
const app = express();

// --- security middleware, order matters ---
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,   // never use '*' once cookies/auth are involved
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));   // caps body size, blocks payload-bomb attacks
app.use(cookieParser());
app.use(mongoSanitize());                    // strips $ and . from req.body/query/params
app.use(hpp());

// general rate limit — everything
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// stricter limit for auth — brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, try again later.',
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
// app.use('/api/menu', require('./routes/menu.routes'));
// app.use('/api/bookings', require('./routes/booking.routes'));

// central error handler — never leak stack traces in production
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));