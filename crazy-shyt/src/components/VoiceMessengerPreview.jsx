"use client";

import { getGeminiResponse } from "@/api/gemini/route";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Volume2, Square, X } from "lucide-react";

const initialMessages = [
  {
    id: "msg1",
    sender: "agent",
    audioUri: "",
    duration: 15,
    isPlaying: false,
    translation:
      "I have a new property that might interest you. It's a 3-bedroom house in a quiet neighborhood.",
  },
  {
    id: "msg2",
    sender: "client",
    audioUri: "",
    duration: 10,
    isPlaying: false,
    translation: "I would like to schedule a viewing for this weekend. Are you available?",
  },
  {
    id: "msg3",
    sender: "agent",
    audioUri: "",
    duration: 20,
    isPlaying: false,
    translation: "Great! I can show you the property on Saturday morning. Would 10 AM work for you?",
  },
];

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

const VoiceMessengerPreview = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [browserSupport, setBrowserSupport] = useState(true);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const recognitionRef = useRef(null);

  const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const newMessage = {
        id: generateUniqueId(),
        sender: "client",
        audioUri: "",
        duration: 0,
        isPlaying: false,
        translation: transcript,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await translateText(newMessage.id, transcript, selectedLanguage);
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
  }, [selectedLanguage]);

  const translateText = async (messageId, text, targetLanguage) => {
    if (!text.trim()) return;

    setLoadingTranslation(true);
    const prompt = `Translate the following text into ${targetLanguage}. Ensure that the translation retains the original meaning, fluency, and cultural appropriateness. Do not return anything except the translated phrase—no explanations, notes, or additional text.

Text: "${text}"`;

    try {
      const response = await getGeminiResponse('AIzaSyDgtKgA6PXtTCHfUhcbtS8ic4L7ERlI_tA', prompt);
      const translatedText = response.replace(/\s*\(.*?\)\s*/g, "").trim();

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, translation: translatedText } : msg
        )
      );
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoadingTranslation(false);
    }
  };

  const togglePlayback = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, isPlaying: !msg.isPlaying } : { ...msg, isPlaying: false }))
    );
  };

  const toggleMessageExpand = (id) => {
    setExpandedMessages((prev) => (prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]));
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;

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
      <div className="text-center py-4 border-b border-gray-300">
        <h1 className="text-xl font-bold text-gray-800">Real Estate Voice Messenger</h1>
      </div>

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

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.sender === "agent" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-lg flex items-center space-x-2 bg-gray-300`}>
              <span className="text-sm">{message.translation}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-4 space-x-4 items-center">
        {isRecording ? (
          <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600">
            <Square className="text-white w-8 h-8" />
          </button>
        ) : (
          <button onClick={startRecording} className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600">
            <Mic className="text-white w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceMessengerPreview;
