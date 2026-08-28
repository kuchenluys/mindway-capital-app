import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
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

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
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

// === START HTTP SERVER WITH SOCKET.IO ===
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store connected users
const connectedUsers = new Map();

// === WEBSOCKET EVENTS ===
io.on('connection', (socket) => {
  logger.info(`✅ Cliente conectado: ${socket.id}`);

  socket.on('user:join', (userData) => {
    connectedUsers.set(socket.id, {
      userId: userData.userId,
      email: userData.email,
      socketId: socket.id
    });
    io.emit('users:online', Array.from(connectedUsers.values()));
    logger.info(`👤 Usuario ${userData.email} se unió`);
  });

  socket.on('position:update', (positionData) => {
    io.emit('position:updated', {
      ...positionData,
      timestamp: new Date().toISOString()
    });
    logger.info(`📊 Posición actualizada: ${positionData.symbol}`);
  });

  socket.on('notification:send', (notification) => {
    io.emit('notification:receive', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('course:progress', (courseData) => {
    io.emit('course:updated', courseData);
    logger.info(`📚 Progreso de curso: ${courseData.courseId}`);
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    if (user) {
      io.emit('users:online', Array.from(connectedUsers.values()));
      logger.info(`👋 Usuario ${user.email} desconectado`);
    }
  });
});

server.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📍 Environment: ${NODE_ENV}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
  logger.info(`💾 Base de datos: ${process.env.DB_NAME}`);
  logger.info(`🔌 WebSockets: Activos`);
});

// === GRACEFUL SHUTDOWN ===
process.on('SIGINT', () => {
  logger.info('⏹️  Cerrando servidor...');
  io.close();
  server.close(() => {
    logger.info('✅ Servidor HTTP cerrado');
    sequelize.close().then(() => {
      logger.info('✅ Conexión de base de datos cerrada');
      process.exit(0);
    });
  });
});

export default app;
