# BixStock - Enterprise Inventory Management System

## Overview
A full-stack inventory management dashboard originally built with AWS cloud architecture and now containerized with Docker for enhanced development workflow. The application demonstrates both cloud-native design principles and modern containerization practices.

## Inspiration & Purpose
My inspiration came from wanting to create a robust enterprise-level application that would demonstrate my AWS cloud skills and full-stack capabilities. After running successfully on AWS infrastructure for over a year, I containerized the application to streamline development processes and enable more flexible deployment options while maintaining the same enterprise-grade functionality.

## Architecture Evolution

### Original AWS Cloud Architecture (Production)
- **AWS EC2**: Application hosting
- **AWS RDS (PostgreSQL)**: Managed database service
- **AWS S3**: Static asset storage
- **AWS API Gateway**: API endpoint management
- **AWS Amplify**: Automated deployment pipeline

### Current Containerized Architecture (Development)
- **Docker**: Containerized development environment
- **PostgreSQL**: Database container with persistent storage
- **Express.js**: RESTful API server
- **Next.js**: React-based frontend
- **Nginx**: Reverse proxy for production deployments

## Tech Stack Decisions
### Frontend
- **Next.js & TypeScript**: Chosen for type safety and enhanced development experience
- **Material UI Data Grid**: Implemented for handling inventory data with sorting and filtering capabilities
- **Redux Toolkit**: Used for state management
- **Tailwind CSS**: Selected for UI development and consistent styling

### Backend & Infrastructure
- **Express.js**: RESTful API server with TypeScript
- **PostgreSQL**: Robust relational database for inventory data
- **Prisma ORM**: Type-safe database queries and schema management
- **Docker**: Containerized development and deployment environment
- **Nginx**: Reverse proxy for production deployments

### Cloud Experience (AWS)
- **Previous AWS Deployment**: Successfully hosted on AWS infrastructure for 1+ year
- **AWS EC2, RDS, S3, API Gateway, Amplify**: Proven experience with full AWS stack
- **Cloud-to-Container Migration**: Containerized for improved development workflow

## Development Tools
- Docker Desktop for container management
- pgAdmin4 for PostgreSQL database administration
- Node.js for server-side operations
- TypeScript for code reliability across the stack

## Current Features
- Static inventory display with sorting and filtering
- Dark/Light mode toggle
- Admin user authentication
- Responsive dashboard layout
- Docker containerized development environment
- PostgreSQL database integration
- Image asset serving

## Getting Started

### Prerequisites
- Docker Desktop installed
- Node.js 22+ (for local development)
- Git

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
   # Build and start all services (database, backend, frontend)
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432 (for direct access)

5. **View logs** (if running in background)
   ```bash
   docker-compose logs -f
   
   # Or view specific service logs
   docker-compose logs -f frontend
   docker-compose logs -f backend
   docker-compose logs -f postgres
   ```

6. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Set up local environment**
   ```bash
   # Copy and configure environment files
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env.local
   ```

3. **Start PostgreSQL locally** (if not using Docker)
   ```bash
   # Make sure PostgreSQL is running on your machine
   # Update DATABASE_URL in server/.env.local to match your local setup
   ```

4. **Run development servers**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from client directory, new terminal)
   npm run dev
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
```

## Project Structure
```
InventoryManager/
├── client/                 # Next.js frontend
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env.docker         # Gitignored
│   └── package.json
├── server/                 # Express backend
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env.docker         # Gitignored
│   ├── assets/            # Product images
│   └── prisma/
├── docker-compose.yml      # Container orchestration
├── nginx.conf             # Production proxy config
└── README.md
```

## Environment Configuration

The application uses environment files for configuration:
- `.env.example` files are committed and show required variables
- `.env.docker` files are gitignored and contain actual values
- Copy example files to create your environment configuration

## Database Management

The PostgreSQL database runs in a Docker container with persistent data storage. The database is automatically set up with:
- Username: `matthewbixby`
- Password: `inventory123` (change in .env.docker)
- Database: `inventory_management`

Prisma handles schema management and migrations automatically on container startup.

## Deployment History & Options

### Production (AWS Cloud) - 2023-2024
The application was successfully deployed and maintained on AWS infrastructure, demonstrating:
- **Scalable Architecture**: AWS EC2 auto-scaling groups
- **Managed Database**: AWS RDS PostgreSQL with automated backups
- **CDN Integration**: AWS S3 + CloudFront for asset delivery
- **CI/CD Pipeline**: AWS Amplify for automated deployments

### Current Development (Docker)
Containerized for enhanced development experience and deployment flexibility:
- **Local Development**: Full-stack environment in Docker containers
- **Production Ready**: Container images deployable to any Docker-compatible platform
- **Cloud Agnostic**: Can deploy to AWS ECS, Google Cloud Run, Azure Container Instances, or any Kubernetes cluster

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Submit a pull request