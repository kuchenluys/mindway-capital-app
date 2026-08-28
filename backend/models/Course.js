import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('trading', 'personal', 'biohacking', 'mindfulness'),
    allowNull: false
  },
  instructor: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes'
  },
  modules: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0
  },
  enrollments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of modules with lessons'
  }
});

export default Course;
