// src/infrastructure/web/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const tenantMiddleware = require('../middlewares/tenant');
const { getProfitLossAnalysisUseCase } = require('../config/use-cases');

// Apply middlewares
router.use(authMiddleware, tenantMiddleware);

// Get profit/loss analysis
router.get('/profit-loss', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const analysis = await getProfitLossAnalysisUseCase.execute(
      req.tenant.id,
      startDate,
      endDate
    );
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;