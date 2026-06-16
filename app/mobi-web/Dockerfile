FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build:mobi-web

FROM nginx:1.25-alpine AS runner
WORKDIR /app
COPY --from=builder /app/mobi-web/dist ./dist
COPY --from=builder /app/mobi-web/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
