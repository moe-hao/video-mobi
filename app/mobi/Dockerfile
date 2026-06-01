FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY app/*/package.json ./app/
COPY lib/*/package.json ./lib/
COPY app/mobi/esbuild.config.js ./app/mobi/esbuild.config.js
RUN echo "inject-workspace-packages=true" > .npmrc
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @app/mobi build

FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/app/*/package.json ./app/
COPY --from=builder /app/lib/*/package.json ./lib/

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN echo "inject-workspace-packages=true" > .npmrc
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/app/mobi/dist ./app/mobi/dist
EXPOSE 3000
CMD ["node", "--enable-source-maps", "app/mobi/dist/index.js"]