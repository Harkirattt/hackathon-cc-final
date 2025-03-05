const { GoogleGenerativeAI } = require("@google/generative-ai");

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