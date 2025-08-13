# Express Backend Dockerfile
FROM node:22-alpine

# Install dependencies including openssl and postgresql-client for health checks
RUN apk add --no-cache openssl postgresql-client

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Add wait-for-postgres script
COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Build the application (if needed)
RUN npm run build

# Expose port
EXPOSE 8000

# Start server with database readiness check and seeding
CMD ["sh", "-c", "/wait-for-postgres.sh db && npm run seed && npm run dev"]