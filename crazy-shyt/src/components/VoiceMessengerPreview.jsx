"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Volume2, Square, X } from 'lucide-react';

// Sample predefined messages
const initialMessages = [
  {
    id: 'msg1', // Changed from numeric to string with prefix
    sender: 'agent',
    audioUri: '',
    duration: 15,
    isPlaying: false,
    translation: 'I have a new property that might interest you. It\'s a 3-bedroom house in a quiet neighborhood.'
  },
  {
    id: 'msg2', // Changed from numeric to string with prefix
    sender: 'client',
    audioUri: '',
    duration: 10,
    isPlaying: false,
    translation: 'I would like to schedule a viewing for this weekend. Are you available?'
  },
  {
    id: 'msg3', // Changed from numeric to string with prefix
    sender: 'agent',
    audioUri: '',
    duration: 20,
    isPlaying: false,
    translation: 'Great! I can show you the property on Saturday morning. Would 10 AM work for you?'
  }
];

// List of languages supported by Web Speech API
const supportedLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
  { code: 'hi-IN', name: 'Hindi (India)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ru-RU', name: 'Russian' }
];

const VoiceMessengerPreview = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [transcribedText, setTranscribedText] = useState('');
  const [browserSupport, setBrowserSupport] = useState(true);
  const recognitionRef = useRef(null);

  // Helper function to generate unique IDs
  const generateUniqueId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setBrowserSupport(false);
      return;
    }
  
    recognitionRef.current = new (window).webkitSpeechRecognition();
    const recognition = recognitionRef.current;
  
    recognition.continuous = true;  // Keep recording until manually stopped
    recognition.interimResults = false;
    recognition.lang = selectedLanguage;
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
  
      const newMessage = {
        id: generateUniqueId(),
        sender: 'client',
        audioUri: '',
        duration: 0,
        isPlaying: false,
        translation: transcript
      };
  
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setTranscribedText(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };
  
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [selectedLanguage]);  

  const togglePlayback = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id 
        ? { ...msg, isPlaying: !msg.isPlaying }
        : { ...msg, isPlaying: false }
    ));
  };

  const toggleMessageExpand = (id) => {
    setExpandedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    );
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
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
          Your browser does not support speech recognition. 
          Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <div className="text-center py-4 border-b border-gray-300">
        <h1 className="text-xl font-bold text-gray-800">
          Real Estate Voice Messenger
        </h1>
      </div>

      {/* Language Selection */}
      <div className="p-4 bg-white">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
          Speech Recognition Language
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

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender === 'agent' ? 'items-end' : 'items-start'
            }`}
          >
            <div 
              className={`
                max-w-[80%] 
                p-3 
                rounded-lg 
                flex 
                items-center 
                space-x-2
                ${
                  message.sender === 'agent' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-black'
                }
              `}
            >
              <button
                onClick={() => togglePlayback(message.id)}
                className={`
                  p-2 
                  rounded-full 
                  ${
                    message.sender === 'agent' 
                      ? 'hover:bg-blue-600' 
                      : 'hover:bg-gray-400'
                  }
                `}
              >
                {message.isPlaying ? (
                  <Pause 
                    className={
                      message.sender === 'agent' 
                        ? 'text-white' 
                        : 'text-black'
                    } 
                  />
                ) : (
                  <Play 
                    className={
                      message.sender === 'agent' 
                        ? 'text-white' 
                        : 'text-black'
                    } 
                  />
                )}
              </button>
              <span className="text-sm">
                {message.duration}s Audio
              </span>
            </div>

            {/* Translation Section */}
            <div 
              className={`
                mt-2 
                max-w-[80%] 
                p-2 
                rounded-lg 
                text-sm 
                flex 
                items-center 
                space-x-2
                ${
                  message.sender === 'agent' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-200 text-gray-800'
                }
              `}
            >
              <Volume2 className="w-5 h-5 flex-shrink-0" />
              <div className="flex-grow">
                {expandedMessages.includes(message.id) 
                  ? message.translation 
                  : `${message.translation.slice(0, 50)}...`}
              </div>
              {message.translation.length > 50 && (
                <button 
                  onClick={() => toggleMessageExpand(message.id)}
                  className="text-xs underline ml-2"
                >
                  {expandedMessages.includes(message.id) ? 'Collapse' : 'Expand'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center py-4 space-x-4 items-center">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="
              w-16 
              h-16 
              rounded-full 
              bg-red-500 
              hover:bg-red-600 
              flex 
              items-center 
              justify-center
            "
          >
            <Square className="text-white w-8 h-8" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="
              w-16 
              h-16 
              rounded-full 
              bg-blue-500 
              hover:bg-blue-600 
              flex 
              items-center 
              justify-center
              transition-colors
              duration-200
            "
          >
            <Mic className="text-white w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceMessengerPreview;