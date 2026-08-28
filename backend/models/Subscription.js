import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Subscription = sequelize.define('Subscription', {
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
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  plan: {
    type: DataTypes.ENUM('free', 'premium', 'elite'),
    defaultValue: 'free'
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'past_due', 'trialing', 'unpaid'),
    defaultValue: 'active'
  },
  pricePerMonth: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  canceledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trialStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trialEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethodId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

export default Subscription;
