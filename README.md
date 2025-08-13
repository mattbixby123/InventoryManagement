### Option 1: Docker Development (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/mattbixby123/InventoryManagement.git
   cd InventoryManager
   ```

2. **Set up environment files**
   ```bash
   # Copy example files to create your Docker environment files
   cp client/.env.example client/.env.docker
   cp server/.env.example server/.env.docker
   ```

3. **Start the application with Docker**
   ```bash
   # Build and start all services (database, backend, frontend, nginx)
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

4. **Access the application**
   - **Main Application**: http://localhost (port 80) - **Use this for full functionality**
   - Direct Frontend: http://localhost:3000 (development only)
   - Backend API: http://localhost:8000
   - Database: localhost:5432 (for direct access)

   > **Important**: Always use `http://localhost` (port 80) to access the application in Docker. This routes through nginx and ensures static images, assets, and API calls work correctly. Accessing `localhost:3000` directly bypasses the nginx proxy and may result in 404 errors for images and other static assets.

5. **View logs** (if running in background)
   ```bash
   docker-compose logs -f
   
   # Or view specific service logs
   docker-compose logs -f frontend
   docker-compose logs -f backend
   docker-compose logs -f postgres
   docker-compose logs -f nginx
   ```

6. **Stop the application**
   ```bash
   docker-compose down
   ```

## Docker Commands Reference

### Essential Commands:
```bash
# Start development environment
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart backend
docker-compose restart nginx

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build frontend
docker-compose up frontend

# Clean up (remove containers and volumes)
docker-compose down -v
```

### Troubleshooting:
```bash
# Check running containers
docker ps

# Check all containers (including stopped)
docker ps -a

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Check Docker volumes
docker volume ls

# Test nginx configuration
docker-compose exec nginx nginx -t

# Check if all services are healthy
docker-compose ps
```

## Port Configuration & Nginx Proxy

The Docker setup includes an nginx reverse proxy that handles routing and static file serving:

- **Port 80 (nginx)**: Main application access point
  - Routes `/api/*` requests to backend server (port 8000)
  - Serves static assets (`/static/*`) directly from nginx
  - Proxies all other requests to frontend (port 3000)
  
- **Port 3000 (frontend)**: Next.js development server (internal)
- **Port 8000 (backend)**: Express API server (internal)
- **Port 5432 (database)**: PostgreSQL database (exposed for admin tools)

### Why Use Port 80?
- **Static Assets**: Images, CSS, and other assets are served efficiently by nginx
- **API Routing**: Seamless API calls without CORS issues
- **Production Simulation**: Mimics real deployment architecture
- **Performance**: nginx handles static files better than Next.js in development mode

### Development vs Production URLs
```bash
# Docker Development (recommended)
http://localhost          # Full application through nginx

# Local Development (no containers)
http://localhost:3000     # Frontend only
http://localhost:8000/api # Backend only

# Production (when deployed)
https://yourdomain.com    # Full application through nginx/load balancer
```