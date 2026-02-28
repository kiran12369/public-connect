require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const bodyParser = require('body-parser');
const { validate, isProd } = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

validate();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = corsOrigin
    ? { origin: corsOrigin.split(',').map(o => o.trim()) }
    : {};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 100 : 1000,
    message: { message: 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body & compression
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static('uploads'));

// Request logging
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, { ip: req.ip });
    next();
});

// Health check (no rate limit)
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const ok = dbState === 1;
    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        db: dbState === 1 ? 'connected' : 'disconnected',
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Public Connect API' });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Database
const { seedIfEmpty } = require('./seed');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI_STANDARD || process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            maxPoolSize: 10,
        });
        logger.info('MongoDB connected');
        const seeded = await seedIfEmpty();
        if (seeded) logger.info('Seeded services (DB was empty)');
    } catch (err) {
        logger.error('MongoDB connection failed', { err: err.message });
        process.exit(1);
    }
};

const server = app.listen(PORT, async () => {
    await connectDB();
    logger.info(`Server listening on port ${PORT}`, { env: process.env.NODE_ENV || 'development' });
});

// Graceful shutdown
const shutdown = (signal) => {
    logger.info(`Received ${signal}, shutting down`);
    server.close(() => {
        mongoose.connection.close(false).then(() => {
            logger.info('Closed');
            process.exit(0);
        }).catch((err) => {
            logger.error('Shutdown error', { err: err.message });
            process.exit(1);
        });
    });
    setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
