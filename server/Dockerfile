# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN yarn install

# Copy all source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS app
RUN yarn build

# Stage 2: Create the production image
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN yarn install --production

# Copy source files and build output from builder
COPY . .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 8080

# Start the application using npm start
CMD ["yarn", "start:prod"]
