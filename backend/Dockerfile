# Stage 1: Build the application
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma Client and build the application
RUN npm run build

# Stage 2: Create the final image
FROM node:18-alpine

WORKDIR /app

# Copy built application from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
# Ensure Prisma schema is included
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
