import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  // User registration
  socket.on('register_user', (userData) => {
    users.set(socket.id, userData);
    console.log(`User registered: ${userData.username}`);
  });

  // Send message
  socket.on('send_message', (message) => {
    // Broadcast message to all clients
    io.emit('receive_message', message);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    users.delete(socket.id);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
