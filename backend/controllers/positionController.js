import Position from '../models/Position.js';
import { validationResult } from 'express-validator';

export const createPosition = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { symbol, type, entryPrice, stopLoss, takeProfit, notes } = req.body;

    const position = await Position.create({
      userId: req.userId,
      symbol,
      type,
      entryPrice,
      stopLoss,
      takeProfit,
      notes,
      status: 'open'
    });

    res.status(201).json({
      message: 'Posición creada exitosamente',
      position
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPositions = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    const where = { userId: req.userId };
    if (status !== 'all') where.status = status;

    const positions = await Position.findAll({
      where,
      order: [['openedAt', 'DESC']]
    });

    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosition = async (req, res) => {
  try {
    const position = await Position.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada' });
    }

    res.json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePosition = async (req, res) => {
  try {
    const position = await Position.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada' });
    }

    const { symbol, type, entryPrice, stopLoss, takeProfit, notes } = req.body;

    if (symbol) position.symbol = symbol;
    if (type) position.type = type;
    if (entryPrice) position.entryPrice = entryPrice;
    if (stopLoss) position.stopLoss = stopLoss;
    if (takeProfit) position.takeProfit = takeProfit;
    if (notes) position.notes = notes;

    await position.save();

    res.json({
      message: 'Posición actualizada',
      position
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closePosition = async (req, res) => {
  try {
    const { exitPrice } = req.body;

    const position = await Position.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada' });
    }

    if (position.status === 'closed') {
      return res.status(400).json({ message: 'La posición ya está cerrada' });
    }

    position.exitPrice = exitPrice;
    position.closedAt = new Date();
    position.status = 'closed';

    // Calculate P&L
    if (position.type === 'long') {
      position.profitLoss = (exitPrice - position.entryPrice) * 100; // Simplified
      position.pips = Math.round((exitPrice - position.entryPrice) * 10000);
    } else {
      position.profitLoss = (position.entryPrice - exitPrice) * 100;
      position.pips = Math.round((position.entryPrice - exitPrice) * 10000);
    }

    position.profitLossPercent = ((position.profitLoss / (position.entryPrice * 100)) * 100).toFixed(2);

    await position.save();

    res.json({
      message: 'Posición cerrada exitosamente',
      position
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada' });
    }

    await position.destroy();

    res.json({ message: 'Posición eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const positions = await Position.findAll({
      where: { userId: req.userId, status: 'closed' }
    });

    const totalTrades = positions.length;
    const winningTrades = positions.filter(p => p.profitLoss > 0).length;
    const totalPnL = positions.reduce((sum, p) => sum + (p.profitLoss || 0), 0);
    const avgWin = positions.length > 0
      ? positions.filter(p => p.profitLoss > 0).reduce((sum, p) => sum + p.profitLoss, 0) / winningTrades
      : 0;

    res.json({
      totalTrades,
      winningTrades,
      winRate: ((winningTrades / totalTrades) * 100).toFixed(2) + '%',
      totalPnL: totalPnL.toFixed(2),
      averageWin: avgWin.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
