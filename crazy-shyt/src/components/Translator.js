"use client";
import { getGeminiResponse } from "@/api/gemini/route";
import { useState } from "react";

export default function Translator() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const languages = ["Hindi", "French", "Spanish", "German", "Chinese"];

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log(process.env)
    const prompt = `Translate the following text into ${targetLanguage}. Ensure that the translation retains the original meaning, fluency, and cultural appropriateness. Do not return anything except the translated phrase—no explanations, notes, or additional text.  

  Text: "${text}"`;


    try {
        const response = await getGeminiResponse(API_KEY, prompt);
        response.replace(/\s*\(.*?\)\s*/g, "").trim();
        
        console.log(response);
      
    

      
      setTranslatedText(response);
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslatedText("Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">AI Translator</h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <select
          className="w-full p-2 border rounded mb-2"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <button
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          onClick={translateText}
          disabled={loading}
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {translatedText && (
          <div className="mt-4 p-3 bg-gray-200 rounded">{translatedText}</div>
        )}
      </div>
    </div>
  );
}
