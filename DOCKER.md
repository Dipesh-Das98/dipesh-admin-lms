# Docker Setup for LMS Admin Panel

This guide explains how to run the LMS Admin Panel using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed

## Quick Start

1. **Clone and navigate to the project directory**
   ```bash
   cd /path/to/lms-admin-panel
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your actual values.

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Manual Docker Commands

### Build the Docker image
```bash
docker build -t lms-admin-panel .
```

### Run the container
```bash
docker run -p 3000:3000 --env-file .env lms-admin-panel
```

## Environment Variables

The following environment variables are required:

- `BACKEND_API_URL`: URL of your backend API
- `AUTH_SECRET`: Secret key for authentication
- `NEXTAUTH_URL`: URL where your Next.js app is hosted
- `NEXT_PUBLIC_APP_URL`: Public URL of your application

## Production Deployment

For production deployment, you may want to:

1. Use a reverse proxy (nginx) in front of the application
2. Set up proper SSL certificates
3. Configure environment variables for production
4. Set up proper logging and monitoring

## Docker Compose Services

- **lms-admin-panel**: The main Next.js application
- **lms-network**: Custom bridge network for service communication

## Troubleshooting

### Port conflicts
If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to your preferred port
```

### Environment variable issues
Ensure all required environment variables are set in your `.env` file and match the schema defined in `env.ts`.

### Build failures
If you encounter build failures, try:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```
