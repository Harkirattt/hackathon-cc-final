"use client"
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Volume2, Square, X } from "lucide-react";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import io from 'socket.io-client';
import axios from 'axios';

export async function getGeminiResponse(apiKey, prompt) {
  if (!apiKey) {
      throw new Error('API key is required');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  try {
      // Make sure prompt is a string
      const promptString = String(prompt);
      const result = await model.generateContent(promptString);
      const response = await result.response;
      return response.text();
  } catch (error) {
      console.error("Error in getGeminiResponse:", error);
      throw error; // Rethrow to handle in the component
  }
}

const supportedLanguages = [
  { code: "en-US", name: "English (US)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "zh-CN", name: "Chinese (Mandarin)" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
  { code: "hi-IN", name: "Hindi (India)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ru-RU", name: "Russian" },
];

const VoiceMessengerWithSockets = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [browserSupport, setBrowserSupport] = useState(true);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const recognitionRef = useRef(null);

  const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Function to translate message using Gemini API
  const translateMessage = async (originalText, targetLanguage) => {
    if (!originalText) return originalText;

    setTranslationLoading(true);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const response = await getGeminiResponse('AIzaSyDgtKgA6PXtTCHfUhcbtS8ic4L7ERlI_tA',
       `Translate the following text into the language corresponding to the code ${targetLanguage}. Ensure that the translation maintains the original meaning, tone, and context. Provide only the translated text without any additional explanation:

Original Text: "${originalText}"`

      );
      console.log(response);

      // Extract the translated text from the response
      const translatedText = response
      setTranslationLoading(false);
      return translatedText;
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslationLoading(false);
      return originalText;
    }
  };

  useEffect(() => {
    // Socket connection setup
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    // Listen for incoming messages and translate them
    newSocket.on('receive_message', async (message) => {
      console.log('Received message:', message);
      
      // Translate the message if the target language is different
      const translatedMessage = message.sourceLanguage !== selectedLanguage 
        ? await translateMessage(message.originalText, selectedLanguage)
        : message.originalText;

      const updatedMessage = {
        ...message,
        translation: translatedMessage
      };

      setMessages(prevMessages => [...prevMessages, updatedMessage]);
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [selectedLanguage]);

  // User registration effect
  useEffect(() => {
    if (socket && username) {
      // Register user when username is set
      socket.emit('register_user', { 
        username, 
        language: selectedLanguage 
      });
    }
  }, [socket, username, selectedLanguage]);

  // Speech recognition setup effect
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setBrowserSupport(false);
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const newMessage = {
        id: generateUniqueId(),
        sender: username,
        audioUri: "",
        duration: 0,
        isPlaying: false,
        translation: transcript,
        originalText: transcript,
        sourceLanguage: selectedLanguage
      };

      // Send message directly via socket
      if (socket) {
        socket.emit('send_message', newMessage);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [socket, username, selectedLanguage]);

  const startRecording = () => {
    if (!recognitionRef.current || !username) {
      alert("Please enter a username first!");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!browserSupport) {
    return (
      <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Browser Not Supported</h2>
        <p className="text-gray-600 mb-4">
          Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col">
      {!username && (
        <div className="p-4 bg-white">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Enter Username
          </label>
          <input 
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Enter your username"
          />
        </div>
      )}

      {username && (
        <>
          <div className="text-center py-4 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-800">
              Real Estate Voice Messenger 
              {isConnected ? " (Connected)" : " (Disconnected)"}
            </h1>
          </div>

          <div className="p-4 bg-white">
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
              Speech Recognition & Translation Language
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isRecording}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col ${message.sender === username ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg flex items-center space-x-2 ${
                    message.sender === username ? "bg-blue-300" : "bg-gray-300"
                  }`}
                >
                  <span className="text-sm">
                    <strong>{message.sender}: </strong>
                    {translationLoading 
                      ? "Translating..." 
                      : (message.translation || message.originalText)
                    }
                  </span>
                </div>
                {message.sourceLanguage !== selectedLanguage && (
                  <span className="text-xs text-gray-500 mt-1">
                    (Translated from {supportedLanguages.find(lang => lang.code === message.sourceLanguage)?.name})
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center py-4 space-x-4 items-center">
            {isRecording ? (
              <button 
                onClick={stopRecording} 
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
              >
                <Square className="text-white w-8 h-8" />
              </button>
            ) : (
              <button 
                onClick={startRecording} 
                className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <Mic className="text-white w-8 h-8 m-auto" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceMessengerWithSockets;