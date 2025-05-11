# Use an official Node runtime – Node 18 is recommended for Strapi v5
FROM node:18-alpine

# Set working directory
WORKDIR /srv/app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies using npm install
RUN npm install

# Copy the rest of your Strapi application code
COPY . .

# Build the Strapi application
RUN npm run build

# Expose the default Strapi port
EXPOSE 1337

# Start Strapi in production mode
CMD ["npm", "start"]