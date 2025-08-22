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

## Performance Monitoring & Optimization

### Monitoring Setup

The application includes built-in performance monitoring tools to help optimize your deployment:

```bash
# Set up performance monitoring (run once)
./scripts/setup_monitoring.sh

# After containers are running, check logs are being generated
ls -la logs/

# Run initial performance test
./scripts/test_performance.sh

# Analyze baseline performance
./scripts/analyze_logs.sh
```

### Nginx Performance Logging

The setup includes detailed performance logging with metrics for:

- **Request timing** (`$request_time`) - Total request processing time
- **Upstream connect time** (`$upstream_connect_time`) - Backend connection time  
- **Upstream header time** (`$upstream_header_time`) - Time to first backend response
- **Upstream response time** (`$upstream_response_time`) - Total backend processing time

Logs are stored in: `logs/detailed_access.log`

### Performance Testing

```bash
# Run comprehensive performance tests
./scripts/test_performance.sh

# Test specific endpoints with detailed timing
curl -w "@scripts/curl-format.txt" -s -o /dev/null http://localhost/api/dashboard
curl -w "@scripts/curl-format.txt" -s -o /dev/null http://localhost/api/inventory
```

### Key Performance Metrics to Monitor

- **Page Load Times** (should be < 2s for dashboard)
- **API Response Times** (should be < 500ms)  
- **Database Query Performance** (check Postgres logs)
- **Static Asset Delivery** (nginx vs Next.js comparison)

### Optimization Tips

- **Enable Caching**: Review and optimize nginx caching headers
- **Database Indexing**: Use Prisma's built-in indexing tools
- **CDN Integration**: Consider Cloudflare for static assets
- **Image Optimization**: Compress product images before upload
- **Connection Pooling**: Optimize database connection limits

### Monitoring Commands

```bash
# View real-time nginx logs
docker compose logs -f nginx

# Check performance logs
tail -f logs/detailed_access.log

# Monitor container resource usage
docker stats

# Test API response times
curl -o /dev/null -s -w "Total: %{time_total}s\n" http://localhost/api/dashboard
```

### Load Testing

For production deployments, consider:

```bash
# Install and run basic load testing
npm install -g artillery
artillery quick --count 20 -n 10 http://localhost/dashboard
```

## VPS-Specific Deployment

For production VPS deployments, use the VPS-specific configuration:

```bash
# Use VPS-specific compose file
docker compose -f docker-compose.vps.yml up --build -d

# Set up monitoring for VPS
./scripts/setup_monitoring.sh

# Check VPS-specific nginx config
vim nginx/nginx.vps.conf
```

The performance monitoring setup provides baseline metrics to track improvements as you optimize your application for production use.

> **Note**: Performance monitoring may generate significant log files. Consider implementing log rotation for production deployments.

### Current Performance Benchmarks (Baseline)

#### API Response Times
- **Average**: 0.01s 
- **Range**: 0.003s - 0.027s
- **Test Method**: Direct API endpoint testing

#### Full Page Load Times (Real User Experience)
- **Initial Load (Cold)**: 29.89s - First visit, includes Next.js compilation
- **Subsequent Loads (Warm)**: 0.003s - 0.026s - Cached performance
- **API-only Requests**: 0.26s - Backend processing time

#### Key Insights:
- **Backend API** is naturally efficient (< 0.03s response)
- **Frontend cold start** requires ~30s for initial compilation
- **Warm performance** is excellent (sub-millisecond response times)
- **Production environment** provides significant performance benefits
- **This establishes a strong baseline** for optimization experiments

### Log Management for Performance Testing

**Current Log Size:** `$(du -sh logs/)`

**Log Rotation Recommended:**
- Rotate logs before each test series
- Keep only relevant test periods
- Monitor disk usage during extended testing

**Cleanup Command:**
```bash
# Run log cleanup (keeps last 1000 lines)
./scripts/cleanup_logs.sh
```
