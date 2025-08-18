## Getting Started

### Docker Development Setup (Recommended)

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
   docker compose up --build
   
   # Or run in background
   docker compose up -d --build
   ```

4. **Access the application**
   - **Main Application**: http://localhost (port 80) - **Use this for full functionality**
   - Direct Frontend: http://localhost:3000 (development only)
   - Database: localhost:5432 (for direct access with admin tools)

   > **Important**: Always use `http://localhost` (port 80) to access the application in Docker. This routes through nginx and ensures static images, assets, and API calls work correctly. Accessing `localhost:3000` directly bypasses the nginx proxy and may result in 404 errors for images and other static assets.

5. **View logs** (if running in background)
   ```bash
   docker compose logs -f
   
   # Or view specific service logs
   docker compose logs -f frontend
   docker compose logs -f backend
   docker compose logs -f postgres
   docker compose logs -f nginx
   ```

6. **Stop the application**
   ```bash
   docker compose down
   ```

### Local Development Setup (Alternative)

For development without Docker containers:

1. **Set up the database**
   ```bash
   # Install and start PostgreSQL locally
   # Create database: inventory_management
   ```

2. **Set up environment files**
   ```bash
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env.local
   ```

3. **Install dependencies and start services**
   ```bash
   # Backend
   cd server
   npm install
   npx prisma db push
   npm run seed
   npm run dev

   # Frontend (in new terminal)
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Port Configuration, Nginx Proxy & Load Balancing

The Docker setup includes a sophisticated nginx reverse proxy that provides:

### Architecture Benefits
- **Load Balancing**: Automatically distributes API requests across multiple backend instances
- **Single Entry Point**: All traffic flows through port 80 for consistency
- **Static Asset Optimization**: nginx serves images and CSS more efficiently than Next.js
- **Production Simulation**: Mirrors real-world deployment architecture

### Port Configuration
- **Port 80 (nginx)**: Main application access point
  - Routes `/api/*` requests to backend server(s) with load balancing
  - Serves static assets (`/static/*`) directly from nginx
  - Proxies all other requests to frontend (port 3000)
  
- **Port 3000 (frontend)**: Next.js development server (internal)
- **Port 8000 (backend)**: Express API server (internal, can be scaled)
- **Port 5432 (database)**: PostgreSQL database (exposed for admin tools)

### Testing Load Balancing
```bash
# Scale backend to multiple instances
docker compose up --scale backend=3

# Test API calls - nginx will distribute requests across instances
curl http://localhost/api/users
curl http://localhost/api/products
curl http://localhost/api/dashboard

# Watch logs to see load distribution
docker compose logs -f backend
```

### Request Flow
```
Browser Request → nginx (port 80) → Routes to:
├── /api/* → backend:8000 (load balanced across instances)
├── /static/* → Static files served directly by nginx
└── /* → frontend:3000 (Next.js pages)
```

### Why Use Port 80?
- **Static Assets**: Images, CSS, and other assets are served efficiently by nginx
- **API Routing**: Seamless API calls without CORS issues
- **Production Simulation**: Mimics real deployment architecture
- **Performance**: nginx handles static files better than Next.js in development mode
- **Scalability**: Supports horizontal scaling of backend instances

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

## Docker Commands Reference

### Essential Commands:
```bash
# Start development environment
docker compose up --build

# Start in background
docker compose up -d --build

# Stop all services
docker compose down

# Stop with complete cleanup (removes volumes, forces fresh seed)
docker compose down --remove-orphans -v

# Restart specific service
docker compose restart backend
docker compose restart nginx

# View logs
docker compose logs -f

# Rebuild specific service
docker compose build frontend
docker compose up frontend
```

### Scaling Commands:
```bash
# Scale backend instances for load testing
docker compose up --scale backend=3

# Scale down and clean up
docker compose down --remove-orphans

# Fresh start with clean database
docker compose down --remove-orphans -v
docker compose up --build
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
docker compose exec nginx nginx -t

# Check if all services are healthy
docker compose ps

# Test API connectivity within Docker network
docker compose exec nginx curl http://backend:8000/api/users
```

> **Note**: Load balancing may take 1-2 page refreshes to fully distribute requests as nginx establishes connections to all backend instances.