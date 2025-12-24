
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  getArtCritique: async (title: string, description: string, imageBase64?: string): Promise<string> => {
    try {
      const model = 'gemini-3-flash-preview';
      
      let contents: any[] = [];
      
      if (imageBase64) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64
          }
        });
      }
      
      contents.push({
        text: `As a professional art critic, provide a short, sophisticated, and encouraging critique for an artwork titled "${title}". 
        The artist describes it as: "${description}". 
        Focus on composition, mood, and potential artistic intent. Keep it under 100 words.`
      });

      const response = await ai.models.generateContent({
        model,
        contents: { parts: contents },
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
      });

      return response.text || "An evocative piece that speaks to the observer's soul.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An intriguing exploration of form and color.";
    }
  }
};
