import { AIConfig } from '../types/game';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { devLog } from './validation';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "");

export async function validateWithAI(
  userAnswer: string, 
  expectedAnswer: string,
  config: AIConfig
): Promise<boolean> {
  try {
    devLog("Validating with AI:", { userAnswer, expectedAnswer, config });
    
    if (config.provider === 'gemini') {
      // Special case for creative survival scenarios
      if (userAnswer.length > 100 && expectedAnswer === 'survival') {
        return evaluateSurvivalStrategy(userAnswer, config);
      }
      
      return validateWithGemini(userAnswer, expectedAnswer, config);
    }
    
    throw new Error(`Provider '${config.provider}' not implemented`);
  } catch (error) {
    console.error("AI validation error:", error);
    // If AI validation fails, fall back to exact match
    return userAnswer.trim().toLowerCase() === expectedAnswer.trim().toLowerCase();
  }
}

async function validateWithGemini(
  userAnswer: string,
  expectedAnswer: string,
  config: AIConfig
): Promise<boolean> {
  try {
    // Get the specified model
    const model = genAI.getGenerativeModel({ 
      model: config.model || "gemini-1.0-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You're going to help me validate answers to riddles and puzzles." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll help you validate answers to riddles and puzzles! What would you like me to check?" }],
        },
      ],
      generationConfig: {
        temperature: config.temperature || 0.2,
        maxOutputTokens: 100,
      },
    });

    // Craft a specific prompt that asks for a yes/no judgment
    const prompt = `Given the riddle answer "${expectedAnswer}", is "${userAnswer}" a correct answer? Please respond with only "yes" or "no".`;
    
    // Send the message to Gemini
    const result = await chat.sendMessage(prompt);
    const response = result.response.text().toLowerCase();
    
    devLog("Gemini response:", response);
    
    // Look for positive confirmation in the response
    return response.includes("yes");
  } catch (error) {
    console.error("Gemini validation error:", error);
    throw error;
  }
}

// New function to evaluate survival strategies
async function evaluateSurvivalStrategy(
  strategy: string,
  config: AIConfig
): Promise<boolean> {
  try {
    // Get the specified model
    const model = genAI.getGenerativeModel({ 
      model: config.model || "gemini-1.0-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You're going to evaluate a survival strategy in a horror scenario." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll evaluate the survival strategy in a horror scenario. What scenario should I consider?" }],
        },
        {
          role: "user",
          parts: [{ text: "A person is trapped in a maintenance alcove on a spaceship. A hostile alien creature is breaking through the door. The person needs to use items in the room to survive." }],
        },
        {
          role: "model",
          parts: [{ text: "I understand the scenario. Please share the strategy, and I'll evaluate whether it would be effective for survival." }],
        },
      ],
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: 200,
      },
    });

    // Send the survival strategy to be evaluated
    const prompt = `Here's the survival strategy: "${strategy}". Is this strategy creative and likely to help the person survive? Respond with "YES" if the strategy has a good chance of success, or "NO" if it seems ineffective or unrealistic.`;
    
    const result = await chat.sendMessage(prompt);
    const response = result.response.text().toLowerCase();
    
    devLog("Survival strategy evaluation:", response);
    
    // Check if the response indicates a successful strategy
    return response.includes("yes");
  } catch (error) {
    console.error("Strategy evaluation error:", error);
    throw error;
  }
}

export async function generateHint(puzzle: string, previousHints: string[], config: AIConfig) {
  if (config.provider === 'gemini') {
    const model = genAI.getGenerativeModel({ model: config.model || 'gemini-pro' });
    
    const prompt = `For this puzzle: "${puzzle}"
    Previous hints: ${previousHints.join(', ')}
    Generate a new hint that doesn't give away the answer but helps guide the player.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
  
  return 'No hint available';
}
