FROM node:24.20.0-alpine3.24 AS builder
WORKDIR /video-mobi

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:task

FROM node:24.20.0-alpine3.24 AS runner
WORKDIR /app

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

COPY --from=builder /video-mobi/app/task/dist ./dist
EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.js"]
