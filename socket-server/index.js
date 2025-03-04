import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
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

// Gemini API translation function
async function translateText(originalText, sourceLanguage, targetLanguage) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
            Provide ONLY the translated text without any additional explanation or notes.

            Original text: "${originalText}"`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 256
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Translation Error:", error.response ? error.response.data : error.message);
    return originalText; // Fallback to original text if translation fails
  }
}

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

  // Translation request
  socket.on('translate_message', async (translationRequest) => {
    const { originalText, sourceLanguage, targetLanguage } = translationRequest;

    try {
      // Perform translation
      const translatedText = await translateText(
        originalText, 
        sourceLanguage, 
        "en (US)"
      );

      // Send back translated message
      socket.emit('translated_message', {
        originalId: translationRequest.id,
        translatedText: translatedText
      });
    } catch (error) {
      console.error('Translation error:', error);
    }
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