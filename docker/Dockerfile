# Build stage
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/core/package.json ./packages/core/
COPY packages/react/package.json ./packages/react/
COPY packages/vue/package.json ./packages/vue/ 2>/dev/null || true
COPY packages/svelte/package.json ./packages/svelte/ 2>/dev/null || true
COPY packages/cli/package.json ./packages/cli/ 2>/dev/null || true
COPY apps/site/package.json ./apps/site/ 2>/dev/null || true

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build all packages
RUN pnpm build

# Development stage
FROM node:20-alpine AS development

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Copy all files (will be overridden by volume mount for source, but keeps node_modules)
COPY . .

# Install dependencies
RUN pnpm install

EXPOSE 3000 4321 5173 5174

CMD ["pnpm", "dev"]

# Production stage (for site app preview)
FROM node:20-alpine AS production

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace/runtime files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/site ./apps/site

EXPOSE 4321

CMD ["pnpm", "--dir", "./apps/site", "exec", "astro", "preview", "--host", "0.0.0.0", "--port", "4321"]
