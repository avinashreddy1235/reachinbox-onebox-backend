import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { ServiceManager } from '../services/ServiceManager';

export function healthRoutes(serviceManager: ServiceManager): Router {
  const router = Router();
  const controller = new HealthController(serviceManager);

  router.get('/', (req, res) => controller.check(req, res));

  return router;
}