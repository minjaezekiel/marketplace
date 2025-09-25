// src/config/index.js (update this file)

require('dotenv').config();
const app = require('./core/app');
const { sequelize } = require('./core/config/database');
const http = require('http');
const socketIo = require('socket.io');
const { chatService } = require('./core/chat/chat.service.js');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Set socket.io instance to app to be used in routes
app.set('io', io);

// Initialize chat service with socket.io
const ChatService = require('../../application/services/chat.service');
const chatServiceWithSocket = new ChatService(chatService.chatRepository, chatService.tenantRepository, io);

// Setup socket.io connection
io.on('connection', (socket) => {
  chatServiceWithSocket.setupSocketConnection(socket);
});

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
