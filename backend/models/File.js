import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  uploadedBy: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' }
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  size: {
    type: DataTypes.BIGINT,
    comment: 'File size in bytes'
  },
  mimeType: {
    type: DataTypes.STRING(100)
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cloudinaryId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('course', 'resource', 'article', 'template', 'media'),
    defaultValue: 'resource'
  },
  section: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

export default File;
