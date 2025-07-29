# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code (exclude .env via .dockerignore)
COPY . .

# Build TypeScript code
RUN npm run build

# Expose backend port
EXPOSE 3001

# Run compiled app
CMD ["node", "dist/index.js"]
