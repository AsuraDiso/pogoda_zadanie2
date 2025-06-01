# Stage 1: Build dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Stage 2: Final image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV PORT=5000

# OCI label for author
LABEL org.opencontainers.image.author="Maksym Melnychenko <maksym.melnychenko@example.com>"

# Expose port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:5000/ || exit 1

# Start the app
CMD ["node", "app.js"] 