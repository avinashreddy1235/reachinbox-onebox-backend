#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function executeCommand(command, cwd) {
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to execute command: ${command}${colors.reset}`);
    return false;
  }
}

function checkPrerequisites() {
  console.log(`${colors.bright}Checking prerequisites...${colors.reset}`);
  
  try {
    // Check Docker
    execSync('docker --version');
    console.log(`${colors.green}✓ Docker is installed${colors.reset}`);
    
    // Check Node.js
    execSync('node --version');
    console.log(`${colors.green}✓ Node.js is installed${colors.reset}`);
    
    // Check npm
    execSync('npm --version');
    console.log(`${colors.green}✓ npm is installed${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Prerequisites check failed. Please install missing dependencies.${colors.reset}`);
    return false;
  }
}

function setupEnvironment() {
  console.log(`${colors.bright}Setting up development environment...${colors.reset}`);

  // Create necessary directories
  const dirs = ['backend/src', 'frontend/src', 'config'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Copy environment files if they don't exist
  if (!fs.existsSync('backend/.env')) {
    fs.copyFileSync('backend/.env.example', 'backend/.env');
    console.log(`${colors.yellow}Please update backend/.env with your credentials${colors.reset}`);
  }

  // Install dependencies
  console.log(`${colors.bright}Installing dependencies...${colors.reset}`);
  executeCommand('npm install', 'backend');
  executeCommand('npm install', 'frontend');

  // Build Docker containers
  console.log(`${colors.bright}Building Docker containers...${colors.reset}`);
  executeCommand('docker-compose build');

  console.log(`${colors.bright}Starting services...${colors.reset}`);
  executeCommand('docker-compose up -d');

  console.log(`
${colors.green}Setup complete! You can now:${colors.reset}

1. Update backend/.env with your email credentials
2. Start the backend: cd backend && npm run dev
3. Start the frontend: cd frontend && npm start
4. Access the application at:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Elasticsearch: http://localhost:9200
  `);
}

// Run the setup
if (checkPrerequisites()) {
  setupEnvironment();
} else {
  process.exit(1);
}