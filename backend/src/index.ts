import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes/index';
import { initializeServices } from './services/index';
import { ServiceManager } from './services/ServiceManager';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
initializeServices().then((serviceManager: ServiceManager) => {
  // Setup routes
  setupRoutes(app, serviceManager);

  console.log('Services initialized and routes set up');
}).catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});