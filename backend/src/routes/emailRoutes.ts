import { Router } from 'express';
import { EmailController } from '../controllers/EmailController';
import { ServiceManager } from '../services/ServiceManager';

export function createEmailRoutes(serviceManager: ServiceManager): Router {
  const router = Router();
  const controller = new EmailController(serviceManager);

  // Search emails
  router.get('/search', (req, res) => controller.searchEmails(req, res));

  // Get recent emails for an account
  router.get('/:accountId/recent', (req, res) => controller.getRecentEmails(req, res));

  // Categorize an email
  router.post('/:emailId/categorize', (req, res) => controller.categorizeEmail(req, res));

  // Get AI reply suggestion
  router.post('/suggest-reply', (req, res) => controller.suggestReply(req, res));

  return router;
}