// src/infrastructure/web/routes/category.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const tenantMiddleware = require('../middlewares/tenant');
const { categoryService } = require('../config/use-cases');

// Apply middlewares
router.use(authMiddleware, tenantMiddleware);

// Create category
router.post('/', async (req, res, next) => {
  try {
    const { name, description, parentId } = req.body;
    
    const category = await categoryService.createCategory({
      name,
      description,
      parentId
    }, req.tenant.id);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// Get tenant's categories
router.get('/', async (req, res, next) => {
  try {
    const options = {
      parentId: req.query.parentId
    };
    
    const categories = await categoryService.getCategoriesByTenant(req.tenant.id, options);
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Get category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
    // Check if category belongs to tenant
    if (category.tenantId !== req.tenant.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// Update category
router.put('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
    // Check if category belongs to tenant
    if (category.tenantId !== req.tenant.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
});

// Delete category
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
    // Check if category belongs to tenant
    if (category.tenantId !== req.tenant.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await categoryService.deleteCategory(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;