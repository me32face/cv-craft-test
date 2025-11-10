import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Try environment variable first, then fallback to your provided key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyALLq6Zu5KUiPEM8r4TnnhYqpgAa2zofxg';
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Don't initialize model in constructor, do it when needed
      this.model = null;
    } else {
      this.genAI = null;
      this.model = null;
    }
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }

  async listModels() {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized');
    }
    try {
      const models = await this.genAI.listModels();
      console.log('Available models:', models);
      return models;
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  async generateContent(section, keywords) {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized');
    }

    // Try to initialize model if not already done
    if (!this.model) {
      try {
        // Try different models for free tier
        const models = ["gemini-2.5-flash-lite"];
        for (const modelName of models) {
          try {
            this.model = this.genAI.getGenerativeModel({ model: modelName });
            console.log(`Using model: ${modelName}`);
            break;
          } catch (err) {
            console.log(`Model ${modelName} not available`);
          }
        }
      } catch (error) {
        console.error('Model initialization failed:', error);
        throw new Error('Failed to initialize Gemini model');
      }
    }

    const prompts = {
      summary: `Write a professional resume summary/profile for someone with these keywords: ${keywords}. Keep it concise, 2-3 sentences, and professional.`,
      profile: `Write a professional resume summary/profile for someone with these keywords: ${keywords}. Keep it concise, 2-3 sentences, and professional.`,
      skills: `Generate a list of 6-8 professional skills based on these keywords: ${keywords}. Return only the skills, one per line, no bullets or numbers.`,
      'work experience': `Generate 2-3 work experiences based on: ${keywords}. Format EXACTLY as follows for each job (separate jobs with ---): 
      Company Name
      Job Title
      Start Year - End Year
      • First responsibility
      • Second responsibility
      • Third responsibility
      ---
      Next Company Name
      Next Job Title
      Start Year - End Year
      • Responsibility
      • Responsibility`,
      education: `Generate education details based on: ${keywords}. Format as: Degree Name | Institution | Date Range | GPA (if relevant).`,
      languages: `Generate a list of languages with proficiency levels based on: ${keywords}. Format as: Language (Proficiency Level), one per line.`
    };

    const prompt = prompts[section.toLowerCase()] || `Generate professional content for ${section} based on: ${keywords}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content');
    }
  }
}

export const geminiService = new GeminiService();