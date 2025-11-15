
import { GoogleGenAI, Type } from "@google/genai";
import { Riddle, Difficulty } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const riddleSchema = {
  type: Type.OBJECT,
  properties: {
    riddle: {
      type: Type.STRING,
      description: "A 2-4 sentence riddle about a Vedic figure (Deva or Rishi). The riddle must not contain the answer.",
    },
    name: {
      type: Type.STRING,
      description: "The name of the Vedic figure, which is the answer to the riddle.",
    },
  },
  required: ['riddle', 'name'],
};

const getDifficultyPrompt = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case Difficulty.Easy:
            return "Generate a simple and straightforward riddle about a very well-known Rishi (sage) or Deva (deity) from the Vedic scriptures. The answer should be a household name for those familiar with Hinduism.";
        case Difficulty.Hard:
            return "Generate a complex and subtle riddle about a less common but still significant Rishi (sage) or Deva (deity), or a more obscure aspect of a famous one. The riddle should be a real challenge for someone with deep knowledge of Hinduism.";
        case Difficulty.Medium:
        default:
            return "Generate a concise and intriguing riddle about a famous Rishi (sage) or Deva (deity) from the Vedic scriptures. The riddle should be challenging but fair for someone with some knowledge of Hinduism.";
    }
}

export const fetchRiddle = async (difficulty: Difficulty): Promise<Riddle> => {
  try {
    const difficultyPrompt = getDifficultyPrompt(difficulty);
    const fullPrompt = `You are an expert in Vedic lore. ${difficultyPrompt} Do not mention the figure's name in the riddle. Return the response as a single, valid JSON object with the riddle and the name of the figure.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: riddleSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedRiddle: Riddle = JSON.parse(jsonText);
    
    if (!parsedRiddle.riddle || !parsedRiddle.name) {
        throw new Error("Invalid riddle format received from API.");
    }

    return parsedRiddle;
  } catch (error) {
    console.error("Error fetching riddle from Gemini API:", error);
    // Provide a fallback riddle in case of API failure
    return {
        riddle: "I am the king of the gods, wielding a thunderbolt (Vajra) and riding a white elephant named Airavata. Who am I?",
        name: "Indra"
    };
  }
};

export const fetchHint = async (name: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Give me a short, one-sentence hint for the Vedic figure: ${name}. The hint must not contain the name "${name}".`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching hint from Gemini API:", error);
        return "Sorry, a hint could not be generated at this time.";
    }
};