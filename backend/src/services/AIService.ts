import OpenAI from 'openai';
import { EmailCategory } from '../config/types';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async categorizeEmail(subject: string, body: string): Promise<EmailCategory[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a helpful assistant that categorizes emails. Provide up to 3 categories from the following list: URGENT, FOLLOW_UP, PERSONAL, WORK, PROMOTIONAL, SPAM"
        }, {
          role: "user",
          content: `Analyze this email and provide categories. Subject: "${subject}" Body: "${body}"`
        }],
        temperature: 0.3,
        max_tokens: 50
      });

      const categories = response.choices[0].message.content
        ?.split(',')
        .map(cat => cat.trim() as EmailCategory)
        .filter(cat => Object.values(EmailCategory).includes(cat)) || [];

      return categories;
    } catch (error) {
      console.error('Error categorizing email:', error);
      return [];
    }
  }

  async suggestReply(emailContent: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a helpful assistant that generates professional email replies. Be concise and courteous."
        }, {
          role: "user",
          content: `Generate a reply to this email: "${emailContent}"`
        }],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('Error suggesting reply:', error);
      return '';
    }
  }
}