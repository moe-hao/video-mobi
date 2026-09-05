FROM node:24-alpine AS builder
WORKDIR /video-mobi

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:mobi

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /video-mobi/app/mobi/dist ./dist
EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.js"]
