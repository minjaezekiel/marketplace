// src/application/services/chat.service.js
const ChatRepository = require('../chat/chat.repository');
const ChatMessage = require('../../domain/entities/chat');
const TenantRepository = require('../tenant/tenant.repository');

class ChatService {
  constructor(chatRepository, tenantRepository, io) {
    this.chatRepository = chatRepository;
    this.tenantRepository = tenantRepository;
    this.io = io;
  }

  async sendMessage(senderId, receiverId, tenantId, message) {
    // Verify tenant exists
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant || !tenant.isActive) {
      throw new Error('Invalid tenant');
    }
    
    // Create and save message
    const chatMessage = await this.chatRepository.create({
      senderId,
      receiverId,
      tenantId,
      message
    });
    
    // Emit message via socket.io
    this.io.to(`tenant:${tenantId}`).to(`user:${receiverId}`).emit('newMessage', {
      id: chatMessage.id,
      senderId: chatMessage.senderId,
      receiverId: chatMessage.receiverId,
      tenantId: chatMessage.tenantId,
      message: chatMessage.message,
      isRead: chatMessage.isRead,
      createdAt: chatMessage.createdAt
    });
    
    return chatMessage;
  }

  async getMessages(tenantId, options = {}) {
    return await this.chatRepository.findByTenant(tenantId, options);
  }

  async getConversation(userId1, userId2, tenantId) {
    return await this.chatRepository.findConversation(userId1, userId2, tenantId);
  }

  async markAsRead(messageId) {
    return await this.chatRepository.markAsRead(messageId);
  }

  async getUnreadCount(userId, tenantId) {
    // This would require a custom query in the repository
    // For now, we'll return a placeholder implementation
    return 5;
  }

  setupSocketConnection(socket) {
    // Join tenant room
    socket.on('joinTenant', (tenantId) => {
      socket.join(`tenant:${tenantId}`);
    });
    
    // Join user room
    socket.on('joinUser', (userId) => {
      socket.join(`user:${userId}`);
    });
    
    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, receiverId, tenantId, message } = data;
        const chatMessage = await this.sendMessage(senderId, receiverId, tenantId, message);
        
        // Send confirmation to sender
        socket.emit('messageSent', {
          success: true,
          message: chatMessage
        });
      } catch (error) {
        socket.emit('messageSent', {
          success: false,
          error: error.message
        });
      }
    });
    
    // Handle marking messages as read
    socket.on('markAsRead', async (messageId) => {
      try {
        const success = await this.markAsRead(messageId);
        socket.emit('messageRead', {
          success,
          messageId
        });
      } catch (error) {
        socket.emit('messageRead', {
          success: false,
          error: error.message
        });
      }
    });
  }
}

module.exports = ChatService;