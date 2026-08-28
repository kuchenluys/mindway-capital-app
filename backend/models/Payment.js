import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define('Payment', {
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
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('succeeded', 'processing', 'requires_action', 'requires_payment_method', 'canceled'),
    defaultValue: 'processing'
  },
  type: {
    type: DataTypes.ENUM('subscription', 'one_time', 'upgrade', 'refund'),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'bank_transfer', 'paypal'),
    allowValue: 'card'
  },
  cardBrand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cardLast4: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attemptCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  nextRetryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

export default Payment;
