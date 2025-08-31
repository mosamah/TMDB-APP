# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Final production image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy built files, node_modules, and Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

# Generate Prisma client
RUN npx prisma generate

EXPOSE 8080
CMD ["node", "dist/main.js"]
