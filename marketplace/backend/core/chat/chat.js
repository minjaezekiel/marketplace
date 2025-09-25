// src/domain/entities/chat.js
class ChatMessage {
  constructor({
    id,
    senderId,
    receiverId,
    tenantId,
    message,
    isRead = false,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.tenantId = tenantId;
    this.message = message;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsRead() {
    this.isRead = true;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      receiverId:this.receiverId}
  }}