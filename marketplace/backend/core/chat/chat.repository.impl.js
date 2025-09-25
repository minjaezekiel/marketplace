// src/infrastructure/database/repositories/chat.repository.impl.js
const ChatRepository = require('./chat.repository');
const ChatModel = require('../models/chat.model');
const ChatMessage = require('../../../domain/entities/chat');
const { Op } = require('sequelize');

class ChatRepositoryImpl extends ChatRepository {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.chatModel = ChatModel(sequelize);
  }

  async create(messageData) {
    const message = await this.chatModel.create(messageData);
    return this.toDomain(message);
  }

  async findByTenant(tenantId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.chatModel.findAndCountAll({
      where: { tenantId },
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    return {
      messages: rows.map(message => this.toDomain(message)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  async findConversation(userId1, userId2, tenantId) {
    const messages = await this.chatModel.findAll({
      where: {
        tenantId,
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    return messages.map(message => this.toDomain(message));
  }

  async markAsRead(messageId) {
    const [updated] = await this.chatModel.update(
      { isRead: true },
      { where: { id: messageId } }
    );
    return updated > 0;
  }

  toDomain(chatModel) {
    return new ChatMessage({
      id: chatModel.id,
      senderId: chatModel.senderId,
      receiverId: chatModel.receiverId,
      tenantId: chatModel.tenantId,
      message: chatModel.message,
      isRead: chatModel.isRead,
      createdAt: chatModel.createdAt,
      updatedAt: chatModel.updatedAt
    });
  }
}

module.exports = ChatRepositoryImpl;