# Stage 1: Build the application
FROM node:20-alpine AS builder

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

# Build the Next.js app
RUN yarn build

# Stage 2: Create the production image
FROM node:20-alpine AS production

# Set environment variables
# Uncomment and set these as needed
# ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN yarn install --production

# Copy build output and necessary files from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["yarn", "start"]
