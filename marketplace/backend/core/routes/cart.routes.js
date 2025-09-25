// src/infrastructure/web/routes/cart.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const tenantMiddleware = require('../middlewares/tenant');
const { cartService } = require('../config/use-cases');

// Apply middlewares
router.use(authMiddleware, tenantMiddleware);

// Get user's cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id, req.tenant.id);
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/items', async (req, res, next) => {
  try {
    const { productId, quantity, attributes } = req.body;
    
    const cart = await cartService.addItem(
      req.user.id, 
      req.tenant.id, 
      productId, 
      quantity || 1, 
      attributes || {}
    );
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Update item quantity
router.put('/items/:productId', async (req, res, next) => {
  try {
    const { quantity, attributes } = req.body;
    
    const cart = await cartService.updateItemQuantity(
      req.user.id, 
      req.tenant.id, 
      req.params.productId, 
      quantity, 
      attributes || {}
    );
    
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/items/:productId', async (req, res, next) => {
  try {
    const { attributes } = req.query;
    
    const cart = await cartService.removeItem(
      req.user.id, 
      req.tenant.id, 
      req.params.productId, 
      attributes ? JSON.parse(attributes) : {}
    );
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id, req.tenant.id);
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// Get cart total
router.get('/total', async (req, res, next) => {
  try {
    const total = await cartService.getCartTotal(req.user.id, req.tenant.id);
    
    res.status(200).json({
      success: true,
      data: { total }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;