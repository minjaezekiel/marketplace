// src/infrastructure/web/routes/tenant.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { tenantService } = require('../config/use-cases');

// Apply auth middleware
router.use(authMiddleware);

// Create tenant
router.post('/', async (req, res, next) => {
  try {
    const { name, description, logo } = req.body;
    
    const tenant = await tenantService.createTenant({
      name,
      description,
      logo
    }, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant
    });
  } catch (error) {
    next(error);
  }
});

// Get user's tenants
router.get('/', async (req, res, next) => {
  try {
    const tenants = await tenantService.getTenantsByOwner(req.user.id);
    
    res.status(200).json({
      success: true,
      data: tenants
    });
  } catch (error) {
    next(error);
  }
});

// Get tenant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    
    // Check if user owns this tenant
    if (tenant.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
});

// Update tenant
router.put('/:id', async (req, res, next) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    
    // Check if user owns this tenant
    if (tenant.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const updatedTenant = await tenantService.updateTenant(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: updatedTenant
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;