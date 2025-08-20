FROM node:24-alpine AS base

WORKDIR /app

RUN apk update && apk add --no-cache libc6-compat openssl

RUN npm install -g pnpm turbo
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS pruner

COPY . .

RUN npx turbo prune --scope=@hamilton/nextjs --docker

FROM base AS builder

WORKDIR /app

COPY .env .env

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm-store,target=~/.pnpm-store pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=@hamilton/nextjs
RUN pnpm prune --prod --no-optional

RUN rm -rf ./**/*/src
RUN rm -rf apps/web/.next/standalone/node_modules

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/nextjs/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/nextjs/server.js"]