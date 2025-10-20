import { Request, Response } from 'express';
import { ServiceManager } from '../services/ServiceManager';

export class HealthController {
  private serviceManager: ServiceManager;

  constructor(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
  }

  async check(req: Request, res: Response) {
    try {
      // Check Elasticsearch connection
      const elasticService = this.serviceManager.getElasticsearchService();
      await elasticService.ping();

      // Check IMAP connections
      const imapStatuses = new Map<string, boolean>();
      
      // Get individual services for each account
      const accounts = ['default'];
      accounts.forEach(accountId => {
        const service = this.serviceManager.getImapService(accountId);
        if (service) {
          imapStatuses.set(accountId, service.getConnectionStatus());
        }
      });

      res.json({
        status: 'healthy',
        elasticsearch: 'connected',
        imap: Object.fromEntries(imapStatuses),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      });
    }
  }
}