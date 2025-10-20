
import { GoogleGenAI, Modality } from "@google/genai";

const base64FromDataUrl = (dataUrl: string): string => dataUrl.split(',')[1];
const mimeTypeFromDataUrl = (dataUrl: string): string => dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));


export async function editImageWithMask(
  originalImage: string,
  maskImage: string,
  prompt: string
): Promise<string> {
  // Assume API_KEY is set in the environment
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const originalImagePart = {
    inlineData: {
      data: base64FromDataUrl(originalImage),
      mimeType: mimeTypeFromDataUrl(originalImage),
    },
  };

  const maskImagePart = {
    inlineData: {
      data: base64FromDataUrl(maskImage),
      mimeType: 'image/png',
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana
      contents: {
        parts: [originalImagePart, maskImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to edit image. The model may not have been able to fulfill the request.");
  }
}
