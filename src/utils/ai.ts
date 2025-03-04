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

    // More lenient evaluation criteria for the final level
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You're going to evaluate survival strategies in a horror scenario. Be encouraging and lenient - if the plan shows any creativity or logical thinking, consider it valid." }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll evaluate survival strategies with a focus on encouraging creativity and rewarding any reasonable attempt at problem-solving." }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    // More lenient prompt that focuses on finding positives
    const prompt = `Here's a survival strategy: "${strategy}". Looking for ANY creative or logical elements, could this strategy help the person survive? Even if not perfect, does it show problem-solving? Respond with "YES" if there's ANY merit to the plan, or "NO" only if completely unrealistic.`;
    
    const result = await chat.sendMessage(prompt);
    const response = result.response.text().toLowerCase();
    
    devLog("Survival strategy evaluation:", response);
    
    // More lenient check - only fail if explicitly "no"
    return !response.includes("no");
  } catch (error) {
    console.error("Strategy evaluation error:", error);
    // Be lenient on errors - let the player continue
    return true;
  }
}

// New function to generate feedback for failed strategies
export async function generateStrategyFeedback(
  strategy: string,
  config: AIConfig
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: config.model || "gemini-1.0-pro"
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You're providing constructive feedback on survival strategies. Be encouraging while pointing out potential improvements." }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });

    const prompt = `Review this survival strategy: "${strategy}". What could be improved? Provide brief, constructive feedback in a supportive tone. Focus on one or two specific suggestions.`;
    
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Feedback generation error:", error);
    return "Consider revising your strategy to make better use of the available items.";
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
