FROM node:24.20.0-alpine3.24 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:task
RUN pnpm --filter @app/task deploy --prod /deploy

FROM node:24.20.0-alpine3.24 AS runner
WORKDIR /app

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

COPY --from=builder /deploy/dist ./dist
COPY --from=builder /deploy/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.js"]
