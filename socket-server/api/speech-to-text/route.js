import express from 'express';
import multer from 'multer';
import { v2 } from '@google-cloud/speech';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Cloud Speech client
const speechClient = new v2.SpeechClient({
  keyFilename: './google-cloud-key.json' // Path to your Google Cloud service account key
});

app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const language = req.body.language || 'en-US';

    // Convert audio to base64
    const audioBytes = req.file.buffer.toString('base64');

    // Configure the request
    const request = {
      config: {
        encoding: 'WEBM_OPUS', // Matches the webm format in the frontend
        sampleRateHertz: 48000, // Typical sample rate for most modern microphones
        languageCode: language,
        alternativeLanguageCodes: supportedLanguages // Optional: add more languages for better detection
      },
      audio: {
        content: audioBytes
      }
    };

    // Perform speech recognition
    const [response] = await speechClient.recognize(request);
    
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({ 
      text: transcription,
      confidence: response.results[0].alternatives[0].confidence 
    });

  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// List of supported languages (same as frontend)
const supportedLanguages = [
  'en-US', 'es-ES', 'fr-FR', 'de-DE', 
  'zh-CN', 'ar-SA', 'hi-IN', 'ja-JP', 
  'pt-BR', 'ru-RU'
];

export default app;