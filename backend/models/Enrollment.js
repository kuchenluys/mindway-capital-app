import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Courses', key: 'id' }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Completion percentage (0-100)'
  },
  currentModule: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused', 'abandoned'),
    defaultValue: 'active'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time spent in minutes'
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1, max: 5 }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Enrollment;
