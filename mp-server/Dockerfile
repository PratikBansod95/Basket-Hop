# Build with the repository root as the Docker context because the authoritative
# server intentionally shares the browser game's deterministic physics modules.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY mp-server/package.json mp-server/package-lock.json* ./mp-server/
RUN npm --prefix mp-server install --omit=dev
COPY mp-server/src ./mp-server/src
COPY shared ./shared
COPY src/game ./src/game
WORKDIR /app/mp-server
EXPOSE 8787
CMD ["npm", "start"]
