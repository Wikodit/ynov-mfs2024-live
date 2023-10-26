ARG VITE_API_ENDPOINT

FROM node:18.16.0-slim AS builder-frontend
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY package.json ./
RUN pnpm install -r --offline

COPY . .

RUN pnpm build

# -----

FROM nginx:1.25-alpine-slim
COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder-frontend /app/dist /app
