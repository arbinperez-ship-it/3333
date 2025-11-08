
import { GoogleGenAI } from "@google/genai";
import { PartCategory } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A simple check, though the prompt states to assume it's always available.
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateDescription(partName: string, category: PartCategory): Promise<string> {
  try {
    const prompt = `Generate a compelling, concise, and professional product description for a motorcycle part for the brand "Terreins". The description should be around 2-3 sentences. Do not use markdown.

Part Name: ${partName}
Category: ${category}

Description:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error: Could not generate description. Please try again.";
  }
}

export async function suggestReorderQuantity(partName: string, category: PartCategory, currentStock: number): Promise<string> {
  try {
    const prompt = `As an expert inventory manager for a motorcycle parts company named "Terreins", suggest a reorder quantity for the following item.
The goal is to maintain a healthy stock level for the next quarter. Base your suggestion on the part category and assume moderate but steady sales velocity.
Consider that items in categories like 'Brakes' or 'Wheels' might be sold less frequently but in higher value transactions than 'Accessories' or 'Lighting'.

Part Name: ${partName}
Category: ${category}
Current Stock: ${currentStock}

Suggested Reorder Quantity (provide only a single number):`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    // Extract just the number from the response
    const match = response.text.trim().match(/\d+/);
    return match ? match[0] : "10"; // Default to 10 if no number found
  } catch (error) {
    console.error("Error suggesting reorder quantity:", error);
    return "Error";
  }
}
