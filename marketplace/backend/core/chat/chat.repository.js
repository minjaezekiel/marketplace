// ../chat/chat.repository.js
class ChatRepository {
  async create(messageData) {
    throw new Error('Method not implemented');
  }

  async findByTenant(tenantId, options = {}) {
    throw new Error('Method not implemented');
  }

  async findConversation(userId1, userId2, tenantId) {
    throw new Error('Method not implemented');
  }

  async markAsRead(messageId) {
    throw new Error('Method not implemented');
  }
}

module.exports = ChatRepository;