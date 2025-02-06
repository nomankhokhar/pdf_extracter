# Stage 1: Install dependencies and build Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire application
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the optimized Next.js app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app ./

# Expose the default Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
