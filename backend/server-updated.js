import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// === MIDDLEWARE ===
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Webhook debe estar ANTES de express.json()
app.use(webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// === LOGGING ===
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// === API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured'
  });
});

// === 404 HANDLER ===
app.use(notFound);

// === ERROR HANDLER ===
app.use(errorHandler);

// === DATABASE CONNECTION ===
sequelize.authenticate()
  .then(() => {
    logger.info('✅ Base de datos conectada exitosamente');

    // Sync models
    return sequelize.sync({ alter: NODE_ENV === 'development' });
  })
  .then(() => {
    logger.info('✅ Modelos sincronizados');
  })
  .catch(err => {
    logger.error('❌ Error de base de datos:', err);
    process.exit(1);
  });

// === START SERVER ===
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📍 Environment: ${NODE_ENV}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
  logger.info(`💾 Base de datos: ${process.env.DB_NAME}`);
  logger.info(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ No configurado'}`);
});

// === GRACEFUL SHUTDOWN ===
process.on('SIGINT', () => {
  logger.info('⏹️  Cerrando servidor...');
  sequelize.close().then(() => {
    logger.info('✅ Conexión de base de datos cerrada');
    process.exit(0);
  });
});

export default app;
