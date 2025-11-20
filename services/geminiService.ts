
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LogoConfig } from "../types";
import { GEMINI_MODEL_NAME } from "../constants";

const configSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    textMain: { type: Type.STRING },
    textSecondary: { type: Type.STRING },
    textTagline: { type: Type.STRING },
    colorMain: { type: Type.STRING },
    colorMainRest: { type: Type.STRING },
    colorSecondary: { type: Type.STRING },
    colorTagline: { type: Type.STRING },
    bgColor: { type: Type.STRING },
    fontFamily: { type: Type.STRING },
    letterSpacingMain: { type: Type.NUMBER },
    letterSpacingTagline: { type: Type.NUMBER },
    gapSize: { type: Type.NUMBER },
  },
  required: [
    "textMain",
    "textSecondary",
    "textTagline",
    "colorMain",
    "colorMainRest",
    "colorSecondary",
    "colorTagline",
    "bgColor",
    "fontFamily",
    "letterSpacingMain",
    "letterSpacingTagline",
    "gapSize",
  ],
};

export const generateLogoModification = async (
  currentConfig: LogoConfig,
  userPrompt: string
): Promise<LogoConfig> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL_NAME,
    contents: `Current Logo Configuration: ${JSON.stringify(currentConfig)}.
    User Request: "${userPrompt}".
    
    Instructions:
    1. Update the logo configuration JSON based on the user's request.
    2. Keep values that are not mentioned unchanged.
    3. "fontFamily" should be a valid CSS font-family string.
    4. "gapSize" is the spacing between the main name and the secondary symbol (default ~20).
    5. "letterSpacingMain" and "letterSpacingTagline" are in em units (e.g. 0.1, -0.05).
    6. Ensure colors are valid hex codes.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: configSchema,
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as LogoConfig;
  }
  
  throw new Error("Failed to generate logo configuration");
};

export const generateLogoVariations = async (
  currentConfig: LogoConfig,
  userPrompt: string,
  count: number = 4
): Promise<LogoConfig[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL_NAME,
    contents: `Current Logo Configuration: ${JSON.stringify(currentConfig)}.
    User Request: "${userPrompt}".
    
    Instructions:
    1. Generate exactly ${count} DISTINCT variations of the logo configuration based on the request.
    2. If the user asks for "lighter" or "darker", adjust colors accordingly.
    3. Vary the fonts, spacing, and colors slightly between variations to give options.
    4. Keep the text content (Dimo, V, Construction) unless explicitly asked to change.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: configSchema,
          },
        },
      },
    },
  });

  if (response.text) {
    const parsed = JSON.parse(response.text);
    if (parsed.variations && Array.isArray(parsed.variations)) {
        return parsed.variations as LogoConfig[];
    }
    // Fallback if model returns raw array despite schema
    if (Array.isArray(parsed)) {
        return parsed as LogoConfig[];
    }
  }
  
  throw new Error("Failed to generate variations");
};
