import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Falta token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = (await import('../models/User.js')).default;
      const user = await User.findByPk(req.userId);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'No tienes permiso para esta acción' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
