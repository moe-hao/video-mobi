FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:manage
RUN pnpm --filter @app/manage deploy --prod /deploy

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /deploy/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/index.js"]
