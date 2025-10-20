@echo off
echo Starting ReachInbox development environment...

REM Start Docker containers
docker-compose up -d

REM Wait for services to be ready
timeout /t 10

REM Open browser windows
start http://localhost:3000/api/health
start http://localhost:3001
start http://localhost:9200

echo Development environment is ready!
echo Frontend: http://localhost:3001
echo Backend API: http://localhost:3000
echo Elasticsearch: http://localhost:9200