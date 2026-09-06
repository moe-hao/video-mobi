FROM node:24.20.0-alpine3.24 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:openapi
RUN pnpm --filter @app/openapi deploy --prod /deploy

FROM node:24.20.0-alpine3.24 AS runner
WORKDIR /app
COPY --from=builder /deploy/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.js"]
