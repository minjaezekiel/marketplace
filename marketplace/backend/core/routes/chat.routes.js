// backend/core/routes/chat.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const tenantMiddleware = require('../middlewares/tenant');
const { chatService } = require('../config/use-cases');

// Apply middlewares
router.use(authMiddleware, tenantMiddleware);

// Send message
router.post('/messages', async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    
    const chatMessage = await chatService.sendMessage(
      req.user.id, 
      receiverId, 
      req.tenant.id, 
      message
    );
    
    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: chatMessage
    });
  } catch (error) {
    next(error);
  }
});

// Get messages
router.get('/messages', async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };
    
    const result = await chatService.getMessages(req.tenant.id, options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Get conversation
router.get('/conversations/:userId', async (req, res, next) => {
  try {
    const messages = await chatService.getConversation(
      req.user.id, 
      req.params.userId, 
      req.tenant.id
    );
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

// Mark message as read
router.patch('/messages/:messageId/read', async (req, res, next) => {
  try {
    const success = await chatService.markAsRead(req.params.messageId);
    
    res.status(200).json({
      success,
      message: success ? 'Message marked as read' : 'Failed to mark message as read'
    });
  } catch (error) {
    next(error);
  }
});

// Get unread count
router.get('/unread-count', async (req, res, next) => {
  try {
    const count = await chatService.getUnreadCount(req.user.id, req.tenant.id);
    
    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;