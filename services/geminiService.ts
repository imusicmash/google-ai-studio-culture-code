import { GoogleGenAI, Type } from "@google/genai";
import type { MaximContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    maxim: { 
      type: Type.STRING, 
      description: "The original maxim provided." 
    },
    meaning: { 
      type: Type.STRING, 
      description: "A detailed explanation of the maxim's meaning in the context of building strong cultures, as described in 'The Culture Code'." 
    },
    stories: {
      type: Type.ARRAY,
      description: "One or two stories from 'The Culture Code' that exemplify the maxim.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING, 
            description: "A short, compelling title for the story (e.g., 'The Navy SEALs' AARs')." 
          },
          narrative: { 
            type: Type.STRING, 
            description: "A summary of the story from the book, explaining how it connects to the maxim." 
          },
          quote: { 
            type: Type.STRING, 
            description: "A powerful, relevant quote from the book related to the story or maxim." 
          }
        },
        required: ["title", "narrative", "quote"]
      }
    }
  },
  required: ["maxim", "meaning", "stories"]
};

export async function fetchMaximExplanation(maxim: string): Promise<MaximContent> {
  const prompt = `
    You are an expert on Daniel Coyle's book "The Culture Code".
    Your task is to analyze the following maxim from the book and provide a detailed explanation.

    Maxim: "${maxim}"

    Based on the content and themes of "The Culture Code", please provide the following in a structured JSON format according to the provided schema.
    1.  **meaning**: A clear and concise explanation of what this maxim means in the context of building a strong and successful group culture.
    2.  **stories**: One or two specific stories or examples from the book that vividly illustrate this maxim in action. For each story, provide:
        *   A short, descriptive **title**.
        *   A **narrative** summarizing the story and explaining its connection to the maxim.
        *   A direct **quote** from the book that is relevant to the story or the maxim's theme.

    Do not include any information outside of the book "The Culture Code". Adhere strictly to the requested JSON schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    let jsonText = response.text.trim();
    
    // The API can sometimes wrap the JSON in markdown code fences or include other text.
    // This robustly extracts the JSON object from the response string.
    const startIndex = jsonText.indexOf('{');
    const endIndex = jsonText.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        console.error("Invalid JSON response format:", jsonText);
        throw new Error("AI returned a response that could not be read. Please try again.");
    }
    
    jsonText = jsonText.substring(startIndex, endIndex + 1);

    const parsedData = JSON.parse(jsonText);

    // Basic validation to ensure the parsed data matches our expected type
    if (parsedData.maxim && parsedData.meaning && Array.isArray(parsedData.stories)) {
      return parsedData as MaximContent;
    } else {
      console.error("Parsed data is missing required fields:", parsedData);
      throw new Error("AI response was missing required data fields.");
    }
  } catch (error) {
    console.error("Error fetching or parsing Gemini response:", error);
    if (error instanceof SyntaxError) {
      throw new Error("The AI returned a malformed data structure. Please try again.");
    }
    // Propagate other errors (like network errors or specific API errors)
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unexpected error occurred while fetching the explanation.");
  }
}