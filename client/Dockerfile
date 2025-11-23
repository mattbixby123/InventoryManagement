# Next.js Frontend Dockerfile
# Next.js Frontend Dockerfile - PRODUCTION MODE
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use ci for production)
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Next.js app (this happens once during image build)
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
