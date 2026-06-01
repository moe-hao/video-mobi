FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . .
RUN pnpm config set inject-workspace-packages true
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/mobi build
RUN pnpm --filter @app/mobi deploy --prod /deploy

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /deploy .
EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/index.js"]
