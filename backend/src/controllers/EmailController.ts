import { Request, Response } from 'express';
import { ServiceManager } from '../services/ServiceManager';

export class EmailController {
  private serviceManager: ServiceManager;

  constructor(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
  }

  async searchEmails(req: Request, res: Response) {
    try {
      const { query, accountId, folder, category } = req.query;
      const elasticService = this.serviceManager.getElasticsearchService();
      
      const results = await elasticService.searchEmails(
        query as string,
        {
          accountId: accountId as string,
          folder: folder as string,
          category: category as string
        }
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search emails' });
    }
  }

  async getRecentEmails(req: Request, res: Response) {
    try {
      const { accountId } = req.params;
      const imapService = this.serviceManager.getImapService(accountId);
      
      if (!imapService) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const emails = await imapService.fetchRecentEmails(30);
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent emails' });
    }
  }

  async categorizeEmail(req: Request, res: Response) {
    try {
      const { emailId } = req.params;
      const { subject, body } = req.body;
      
      const aiService = this.serviceManager.getAIService();
      const category = aiService.categorizeEmail(subject, body);
      
      res.json({ category });
    } catch (error) {
      res.status(500).json({ error: 'Failed to categorize email' });
    }
  }

  async suggestReply(req: Request, res: Response) {
    try {
      const { subject, body } = req.body;
      const aiService = this.serviceManager.getAIService();
      
      const suggestedReply = await aiService.suggestReply(`${subject}\n\n${body}`);
      res.json({ reply: suggestedReply });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate reply suggestion' });
    }
  }
}