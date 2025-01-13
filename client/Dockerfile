# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, .env, and next.config.mjs
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .env.local ./
COPY next.config.mjs ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, .env, and next.config.mjs
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .env.local ./
COPY next.config.mjs ./

# Install only production dependencies
RUN pnpm install --prod

# Copy build files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
