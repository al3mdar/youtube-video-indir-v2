/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { AITagResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let client: GoogleGenAI | null = null;

if (apiKey) {
  client = new GoogleGenAI(apiKey);
}

export const generateAIAnalysis = async (videoTitle: string): Promise<AITagResponse> => {
  if (!client) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  try {
    const prompt = `
      Sen profesyonel bir video içerik yöneticisisin. Aşağıdaki video başlığı için Türkçe bir özet, 
      popüler SEO etiketleri ve güvenli, optimize edilmiş bir dosya adı oluştur.
      
      Video Başlığı: "${videoTitle}"
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Videonun kısa, ilgi çekici bir özeti (max 150 karakter)" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 adet popüler etiket" },
            suggestedFilename: { type: Type.STRING, description: "İndirme için önerilen dosya adı (boşluksuz, tire ile ayrılmış)" }
          },
          required: ["summary", "tags", "suggestedFilename"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AITagResponse;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      summary: "AI analizi şu anda kullanılamıyor, ancak videonuz indirilmeye hazır.",
      tags: ["video", "indir", "mp4"],
      suggestedFilename: "video_download"
    };
  }
};
