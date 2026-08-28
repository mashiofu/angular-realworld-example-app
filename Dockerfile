# syntax=docker/dockerfile:1
#
# NOTE: this repo has a git submodule (realworld/, shared assets/theme used
# across RealWorld frontends). Whoever runs `docker build` must have already
# run `git submodule update --init --recursive` - CI does this via
# `submodules: recursive` on the checkout step (see .github/workflows).

## ---- Build stage ----
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bunx vitest run
RUN bun run build

## ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache wget

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-conduit/browser /usr/share/nginx/html
COPY docker-entrypoint.d/40-inject-env.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
    CMD wget --no-verbose --tries=1 -O /dev/null http://localhost/healthz || exit 1
