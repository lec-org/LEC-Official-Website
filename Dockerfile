# 多阶段构建：在校园生产 CI 执行 lint、单测与 standalone 构建，运行阶段仅保留最小产物。
ARG NODE_IMAGE=node:24.14.1-bookworm-slim
ARG NPM_REGISTRY=https://registry.npmmirror.com

FROM ${NODE_IMAGE} AS build
ARG NPM_REGISTRY
ENV NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_NPM_REGISTRY=${NPM_REGISTRY}
WORKDIR /source

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable \
    && corepack prepare pnpm@10.33.0 --activate \
    && pnpm install --frozen-lockfile --registry=${NPM_REGISTRY}

COPY . .
RUN pnpm lint && pnpm test && pnpm build

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app

COPY --from=build --chown=1000:1000 /source/.next/standalone ./
COPY --from=build --chown=1000:1000 /source/.next/static ./.next/static
COPY --from=build --chown=1000:1000 /source/public ./public

USER 1000:1000
EXPOSE 3000
CMD ["node", "server.js"]
