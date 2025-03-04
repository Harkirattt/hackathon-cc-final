"use client"
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Volume2, Square, X, MessageCircle, Globe, UserCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
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
  { code: "gu-IN", name: "Gujarati (India)" },
];

const VoiceMessengerWithSockets = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [browserSupport, setBrowserSupport] = useState(true);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [currentUsername,setCurrentUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const recognitionRef = useRef(null);

  const [connectionStatus, setConnectionStatus] = useState({
    socket: false,
    recognition: false
  });
  const [error, setError] = useState(null);

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
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus(prev => ({ ...prev, socket: true }));
      toast.success('Connected to Voice Messenger', {
        description: 'Ready to send and receive messages'
      });
    });

    newSocket.on('connect_error', (error) => {
      setError('Connection failed. Please check your network.');
      toast.error('Connection Error', {
        description: 'Unable to connect to the server'
      });
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

    const handleUsernameChange = (e) => {
      const inputUsername = e.target.value;
      setUsername(inputUsername);
      
      // Optional: Clear error if user starts typing
      if (usernameError) {
        setUsernameError("");
      }
    };
  
    const handleUsernameKeyDown = (e) => {
      // Clear error on key press
      if (usernameError) {
        setUsernameError("");
      }
  
      // Submit username on Enter key
      if (e.key === 'Enter') {
        handleUsernameSubmit(e);
      }
    };

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
    <div className="max-w-lg mx-auto h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col shadow-2xl">
      <Toaster richColors position="top-right" />
      {/* {!username && (
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
      )} */}

      {username && (
        <>
          <div className="text-center py-4 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-800">
              Real Estate VM
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

          {/* <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
          </div> */}
        </>
      )}
<motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <UserCircle2 className="text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">
            {username || "Voice Messenger"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className={`w-5 h-5 ${connectionStatus.socket ? 'text-green-500' : 'text-red-500'}`} />
          <RefreshCw className={`w-4 h-4 ${connectionStatus.recognition ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
      </motion.div>

      {/* Language and Username Setup */}
      {!username && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 flex-grow flex flex-col justify-center"
        >
          <input 
            type="text"
            value={currentUsername}
            onKeyDown={(e) => e.key === "Enter" && setUsername(e.target.value)}
            onChange={(e) => setCurrentUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 transition-all duration-300 text-center text-lg"
          />
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm">
        <AnimatePresence>
          {username && messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex flex-col ${message.sender === username ? "items-end" : "items-start"}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-xl shadow-md flex items-center space-x-2 ${
                  message.sender === username 
                    ? "bg-indigo-200 text-indigo-900" 
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <MessageCircle className="w-4 h-4 opacity-70" />
                <span className="text-sm">
                  <strong>{message.sender}: </strong>
                  {translationLoading 
                    ? "Translating..." 
                    : (message.translation || message.originalText)
                  }
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recording Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-white/80 backdrop-blur-md flex justify-center"
      >
        {isRecording ? (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={stopRecording} 
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl transition-all"
          >
            <Square className="text-white w-8 h-8" />
          </motion.button>
        ) : (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={startRecording} 
            className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center shadow-xl transition-all"
          >
            <Mic className="text-white w-8 h-8" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default VoiceMessengerWithSockets;