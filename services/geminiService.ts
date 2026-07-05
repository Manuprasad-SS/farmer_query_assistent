
import { GoogleGenAI } from "@google/genai";
import type { Language, ChatMessage } from '../types';
import { SYSTEM_INSTRUCTION_TEMPLATE } from '../constants';

// Fix: Per Gemini API guidelines, initialize with API_KEY from environment variables directly.
// The key is assumed to be pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL = "gemini-2.5-flash";

export const callGeminiApi = async (
  history: ChatMessage[],
  query: string,
  language: Language,
  imageBase64: string | null,
  // Fix: Added imageMimeType parameter for robust MIME type handling.
  imageMimeType: string | null
): Promise<string> => {
  const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE.replace('{lang}', language);

  const historicContents = history.map(msg => ({
    role: msg.from === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const userParts = [];

  // Fix: Use the passed imageMimeType instead of sniffing the base64 string.
  if (imageBase64 && imageMimeType) {
    userParts.push({
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType
      }
    });
  }

  userParts.push({ text: query });

  const contents = [...historicContents, { role: 'user', parts: userParts }];

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error in callGeminiApi:", error);
    // Rethrow to be handled by the caller
    throw error;
  }
};
