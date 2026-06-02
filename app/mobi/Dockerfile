FROM node:24-alpine AS builder
WORKDIR /app
ENV CI=true
ENV PNPM_CONFIRM_MODULES_PURGE=false

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . .
RUN rm pnpm-lock.yaml && pnpm install
RUN pnpm build:mobi
RUN pnpm deploy --prod --filter mobi /deploy --config.node-linker=hoisted

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /deploy/dist /deploy/node_modules .

EXPOSE 3000
CMD ["node", "--enable-source-maps", "index.js"]
