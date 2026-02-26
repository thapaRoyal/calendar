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
COPY apps/docs/package.json ./apps/docs/ 2>/dev/null || true

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

# Production stage (for docs site)
FROM node:20-alpine AS production

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/apps/docs/.astro ./apps/docs/.astro
COPY --from=builder /app/apps/docs/dist ./apps/docs/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4321

CMD ["node", "./apps/docs/dist/server/entry.mjs"]
