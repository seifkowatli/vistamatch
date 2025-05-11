# Use an official Node runtime – Node 18 is a common choice for Next.js 15
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package definitions
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Next.js default port (3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]