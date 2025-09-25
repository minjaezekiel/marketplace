// backend/core/routes/order.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const tenantMiddleware = require('../middlewares/tenant');
const { orderService } = require('../config/use-cases');

// Apply middlewares
router.use(authMiddleware, tenantMiddleware);

// Create order
router.post('/', async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const order = await orderService.createOrder(
      req.user.id, 
      req.tenant.id, 
      shippingAddress, 
      paymentMethod
    );
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.tenant.id);
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Get tenant's orders
router.get('/', async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      status: req.query.status
    };
    
    const result = await orderService.getOrdersByTenant(req.tenant.id, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await orderService.updateOrderStatus(req.params.id, status, req.tenant.id);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;