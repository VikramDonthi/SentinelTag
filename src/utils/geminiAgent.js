import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_SYSTEM_PROMPT } from "../config";

/**
 * GeminiAgent
 * A reusable class for interacting with Google Gemini AI.
 */
class GeminiAgent {
  constructor(apiKey = GEMINI_API_KEY, systemInstruction = GEMINI_SYSTEM_PROMPT) {
    if (!apiKey) {
      console.warn("GeminiAgent: API Key is missing. Agent will not function.");
      this.genAI = null;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction,
      });
    }
    this.chatSession = null;
  }

  /**
   * Initializes a new chat session with history.
   * @param {Array} history - Optional previous chat history.
   */
  startChat(history = []) {
    if (!this.model) return null;
    this.chatSession = this.model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });
    return this.chatSession;
  }

  /**
   * Sends a message to the agent and returns the response.
   * @param {string} message - User message.
   * @returns {Promise<string>} - Agent response.
   */
  async sendMessage(message) {
    if (!this.model) throw new Error("Agent not initialized. Check API Key.");
    
    // Start session if not existing
    if (!this.chatSession) {
      this.startChat();
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("GeminiAgent Error:", error);
      throw error;
    }
  }

  /**
   * Specifically for safety analysis. 
   * Wraps the data in a prompt for the safety assistant.
   * @param {Object} safetyData - Data from Firebase (hr, speed, etc.)
   */
  async analyzeSafety(safetyData) {
    const prompt = `Analyze this live safety data: ${JSON.stringify(safetyData, null, 2)}. 
    Is the user safe? What actions should they take?`;
    return this.sendMessage(prompt);
  }
}

// Export a singleton instance by default
export const defaultAgent = new GeminiAgent();

// Export the class for custom instances
export default GeminiAgent;
