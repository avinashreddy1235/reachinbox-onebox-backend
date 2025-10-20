import { AIService } from '../../services';
import { EmailCategory } from '../../config/types';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockImplementation(async ({ messages }) => {
            // Mock responses based on the input
            if (messages[1].content.includes('URGENT')) {
              return {
                choices: [{ message: { content: 'URGENT' } }]
              };
            } else if (messages[1].content.includes('Project')) {
              return {
                choices: [{ message: { content: 'WORK' } }]
              };
            } else if (messages[1].content.includes('Birthday')) {
              return {
                choices: [{ message: { content: 'PERSONAL' } }]
              };
            } else if (messages[1].content.includes('schedule a meeting')) {
              return {
                choices: [{ message: { content: 'I would be happy to schedule a meeting. Please let me know your availability and I will coordinate accordingly.' } }]
              };
            }
            return {
              choices: [{ message: { content: '' } }]
            };
          })
        }
      }
    }))
  };
});

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  describe('categorizeEmail', () => {
    it('should categorize urgent emails correctly', async () => {
      const subject = 'URGENT: System Outage';
      const body = 'Production server is down and needs immediate attention.';
      
      const categories = await aiService.categorizeEmail(subject, body);
      expect(categories[0]).toBe(EmailCategory.URGENT);
    });

    it('should categorize work emails correctly', async () => {
      const subject = 'Project Update Meeting';
      const body = 'Let\'s discuss the project progress in our weekly meeting.';
      
      const categories = await aiService.categorizeEmail(subject, body);
      expect(categories[0]).toBe(EmailCategory.WORK);
    });

    it('should categorize personal emails correctly', async () => {
      const subject = 'Birthday Party Invitation';
      const body = 'You are invited to my birthday party this weekend!';
      
      const categories = await aiService.categorizeEmail(subject, body);
      expect(categories[0]).toBe(EmailCategory.PERSONAL);
    });
  });

  describe('suggestReply', () => {
    it('should generate appropriate reply for work emails', async () => {
      const emailContent = 'Can we schedule a meeting to discuss the project updates?';
      
      const reply = await aiService.suggestReply(emailContent);
      expect(reply).toBeTruthy();
      expect(typeof reply).toBe('string');
    });

    it('should handle empty email content gracefully', async () => {
      const emailContent = '';
      
      const reply = await aiService.suggestReply(emailContent);
      expect(reply).toBe('');
    });
  });
});