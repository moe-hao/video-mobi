FROM node:24.20.0-alpine3.24 AS builder
WORKDIR /video-mobi

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:manage
RUN pnpm deploy --filter @app/manage --prod --legacy /video-mobi/prod

FROM node:24.20.0-alpine3.24 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /video-mobi/prod ./
# COPY --from=builder /video-mobi/app/manage/dist ./dist
# EXPOSE 3000
CMD ["node", "dist/index.js"]
