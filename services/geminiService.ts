import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is available. In a real app, this should be handled securely.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a headshot image based on a text prompt and an input image.
 * @param prompt The text prompt describing the desired headshot modifications.
 * @param base64ImageData The base64 encoded string of the user's uploaded image.
 * @param mimeType The MIME type of the user's uploaded image.
 * @returns A Promise that resolves to the base64 encoded image string of the generated headshot.
 */
export const generateHeadshot = async (
  prompt: string,
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Generate a professional headshot based on the provided image. Keep the person's face and features the same, but change the clothing and background according to the following style: ${prompt}`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error("The AI couldn't create a headshot from this photo. Please try a different one.");
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('safety')) {
            throw new Error("Generation failed due to safety filters. Please try a different photo or pose.");
        }
    }
    throw new Error("Image generation failed. This could be a network issue or an API error. Please try again.");
  }
};
