import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
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
  stripeInvoiceId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subscriptionId: {
    type: DataTypes.UUID,
    references: { model: 'Subscriptions', key: 'id' }
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
    type: DataTypes.ENUM('draft', 'open', 'paid', 'void', 'uncollectible'),
    defaultValue: 'open'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  invoiceUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  attemptCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastAttemptDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

export default Invoice;
