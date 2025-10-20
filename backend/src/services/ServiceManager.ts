import { ImapService } from './ImapService';
import { ElasticsearchService } from './ElasticsearchService';
import { WebhookService } from './WebhookService';

// Importing AIService via barrel file to avoid circular dependency
import { AIService } from './index';
import { EmailConfig } from '../config/types';

export class ServiceManager {
  private imapServices: Map<string, ImapService> = new Map();
  private elasticsearchService: ElasticsearchService;
  private aiService: AIService;
  private webhookService: WebhookService;

  constructor() {
    // Initialize Elasticsearch service
    const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
    const esIndex = process.env.ELASTICSEARCH_INDEX || 'emails';
    this.elasticsearchService = new ElasticsearchService(esNode, esIndex);

    // Initialize AI service
    this.aiService = new AIService();

    // Initialize Webhook service
    const slackWebhook = process.env.SLACK_WEBHOOK_URL || '';
    const externalWebhook = process.env.EXTERNAL_WEBHOOK_URL || '';
    this.webhookService = new WebhookService(slackWebhook, externalWebhook);

    // Initialize IMAP services for each configured email account
    this.initializeImapServices();
  }

  private initializeImapServices() {
    Object.entries(process.env)
      .filter(([key]) => key.startsWith('EMAIL_') && key.endsWith('_PASSWORD'))
      .forEach(([key, password]) => {
        const accountId = key.replace('_PASSWORD', '');
        const email = process.env[accountId];
        
        if (email && password) {
          const config: EmailConfig = {
            email,
            password,
            host: process.env.EMAIL_HOST || 'imap.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '993'),
            tls: process.env.EMAIL_USE_TLS !== 'false'
          };
          
          this.imapServices.set(accountId, new ImapService(config));
        }
      });

    // Default configurations if needed
    if (this.imapServices.size === 0) {
      const defaultConfig: EmailConfig = {
        email: process.env.DEFAULT_EMAIL || '',
        password: process.env.DEFAULT_PASSWORD || '',
        host: process.env.EMAIL_HOST || 'imap.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '993'),
        tls: process.env.EMAIL_USE_TLS !== 'false'
      };
      
      if (defaultConfig.email && defaultConfig.password) {
        this.imapServices.set('default', new ImapService(defaultConfig));
      }
    }
  }

  public getImapService(accountId: string): ImapService | undefined {
    return this.imapServices.get(accountId);
  }

  public getElasticsearchService(): ElasticsearchService {
    return this.elasticsearchService;
  }

  public getAIService(): AIService {
    return this.aiService;
  }

  public getWebhookService(): WebhookService {
    return this.webhookService;
  }

  public async start() {
    // Connect all IMAP services
    for (const [accountId, service] of this.imapServices) {
      try {
        await service.connect();
        service.enableIdleMode();
        console.log(`Connected to IMAP for account: ${accountId}`);
      } catch (error) {
        console.error(`Failed to connect IMAP for account: ${accountId}`, error);
      }
    }
  }

  public async stop() {
    // Disconnect all IMAP services
    for (const service of this.imapServices.values()) {
      service.disconnect();
    }
  }
}