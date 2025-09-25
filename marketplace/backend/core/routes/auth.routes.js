// src/infrastructure/web/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { userService } = require('../config/use-cases');

// Register user
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    
    const result = await userService.registerUser({
      firstName,
      lastName,
      email,
      password,
      phone
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await userService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;