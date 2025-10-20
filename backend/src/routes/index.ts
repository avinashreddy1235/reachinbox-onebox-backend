import { Express, Router } from 'express';
import { createEmailRoutes } from './emailRoutes';
import { HealthController } from '../controllers/HealthController';
import { ServiceManager } from '../services';

// Create health routes
function healthRoutes(serviceManager: ServiceManager): Router {
  const router = Router();
  const controller = new HealthController(serviceManager);

  router.get('/', (req, res) => controller.check(req, res));

  return router;
}

export function setupRoutes(app: Express, serviceManager: ServiceManager): void {
  app.use('/api/emails', createEmailRoutes(serviceManager));
  app.use('/api/health', healthRoutes(serviceManager));
}