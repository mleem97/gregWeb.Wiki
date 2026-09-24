# syntax=docker/dockerfile:1
# gregWeb.Wiki — gregCore docs (Astro Starlight, static) + nginx.
# Build context is this repo root (needs wiki-source/).

FROM node:24-alpine AS build
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build

FROM nginx:1.29-alpine AS serve

LABEL org.opencontainers.image.source="https://github.com/mleem97/gregWeb.Wiki"
LABEL org.opencontainers.image.description="gregCore Wiki — guidebook and reference for the Data Center mod framework"
LABEL org.opencontainers.image.licenses="Apache-2.0"

COPY --from=build /site/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
