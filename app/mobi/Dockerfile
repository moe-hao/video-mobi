FROM node:24.20.0-alpine3.24 AS builder
WORKDIR /video-mobi

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:mobi

FROM node:24.20.0-alpine3.24 AS runner
WORKDIR /app
COPY --from=builder /video-mobi/app/mobi/dist ./dist
EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.js"]
