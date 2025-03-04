import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { text, targetLanguage } = await req.json();
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const prompt = `Translate the following text into ${targetLanguage}: ${text}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GOOGLE_API_KEY}`,
      {
        prompt: prompt,
        temperature: 0.7,
      }
    );

    const translatedText = response.data.candidates?.[0]?.output || "Translation failed.";
    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("Translation Error:", error);
    return NextResponse.json({ error: "Translation failed." }, { status: 500 });
  }
}
