# ReachInbox Assignment - Email Aggregator

A feature-rich email aggregator that synchronizes multiple IMAP email accounts in real-time and provides AI-powered email categorization and reply suggestions.

## Features

1. Real-Time Email Synchronization
   - Syncs multiple IMAP accounts simultaneously
   - Fetches last 30 days of emails
   - Uses IDLE mode for real-time updates

2. Searchable Storage (Elasticsearch)
   - Full-text search capabilities
   - Filter by folder & account
   - Advanced indexing

3. AI-Based Email Categorization
   - Categorizes emails into:
     - Interested
     - Meeting Booked
     - Not Interested
     - Spam
     - Out of Office

4. Slack & Webhook Integration
   - Slack notifications for interested leads
   - External webhook triggers

5. Frontend Interface
   - Email display and filtering
   - Search functionality
   - AI categorization display

6. AI-Powered Reply Suggestions
   - Context-aware reply generation
   - Training data integration

## Setup Instructions

1. Prerequisites
   - Node.js (v18 or later)
   - Docker Desktop
   - Git

2. Environment Setup
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd reachinbox-assignment

   # Create .env file in backend directory
   cp backend/.env.example backend/.env
   # Edit .env with your email credentials and API keys
   ```

3. Email Configuration
   - Enable IMAP in your Gmail accounts
   - Generate App Passwords for both email accounts
   - Add credentials to .env file

4. Start Services
   ```bash
   # Start all services using Docker Compose
   docker-compose up -d

   # Check logs
   docker-compose logs -f
   ```

5. Access the Application
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3001
   - Elasticsearch: http://localhost:9200

## API Endpoints

1. Email Search
   ```
   GET /api/emails/search?query=&accountId=&folder=&category=
   ```

2. Recent Emails
   ```
   GET /api/emails/:accountId/recent
   ```

3. Email Categorization
   ```
   POST /api/emails/:emailId/categorize
   ```

4. Reply Suggestions
   ```
   POST /api/emails/suggest-reply
   ```

## Architecture

The application follows a microservices architecture:

1. Backend Service
   - Express.js with TypeScript
   - IMAP integration
   - AI categorization
   - Webhook management

2. Elasticsearch Service
   - Email storage and indexing
   - Full-text search
   - Filtering capabilities

3. Frontend Service
   - React with TypeScript
   - Real-time updates
   - Search interface

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Development

1. Backend Development
   ```bash
   cd backend
   npm run dev
   ```

2. Frontend Development
   ```bash
   cd frontend
   npm run dev
   ```

## Troubleshooting

1. Email Connection Issues
   - Verify IMAP settings
   - Check App Password validity
   - Ensure proper SSL/TLS configuration

2. Elasticsearch Issues
   - Check Elasticsearch logs
   - Verify memory settings
   - Check index health

3. Docker Issues
   - Restart Docker Desktop
   - Check container logs
   - Verify port availability