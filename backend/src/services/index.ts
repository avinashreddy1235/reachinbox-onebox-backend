export * from './AIService';
export * from './ElasticsearchService';
export * from './ImapService';
export * from './WebhookService';
export * from './ServiceManager';

import { ServiceManager } from './ServiceManager';

export async function initializeServices(): Promise<ServiceManager> {
  const serviceManager = new ServiceManager();
  await serviceManager.start();
  return serviceManager;
}