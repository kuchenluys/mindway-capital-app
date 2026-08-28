import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Position = sequelize.define('Position', {
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
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('long', 'short'),
    allowNull: false
  },
  entryPrice: {
    type: DataTypes.DECIMAL(10, 5),
    allowNull: false
  },
  stopLoss: {
    type: DataTypes.DECIMAL(10, 5),
    allowNull: false
  },
  takeProfit: {
    type: DataTypes.DECIMAL(10, 5),
    allowNull: false
  },
  exitPrice: {
    type: DataTypes.DECIMAL(10, 5),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'pending'),
    defaultValue: 'open'
  },
  profitLoss: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  profitLossPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  pips: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  openedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Position;
