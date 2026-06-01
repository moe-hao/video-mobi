FROM node:24-alpine AS builder
# ENV CI=true
# ENV PNPM_CONFIRM_MODULES_PURGE=false
ENV PNPM_INJECT_WORKSPACE_PACKAGES=true

# 用国内镜像
# RUN npm config set registry https://registry.npmmirror.com/ && \
#     npm install -g pnpm
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @app/mobi build
RUN pnpm --filter @app/mobi deploy --prod /deploy

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /deploy .
EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/index.js"]
