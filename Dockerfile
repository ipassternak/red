FROM node:20-alpine as build
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
COPY lib/ lib/
RUN npm run build
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=build /tmp/node_modules/ ./node_modules/
COPY --from=build /tmp/dist/ ./dist/
COPY --from=build /tmp/package.json ./package.json
USER node
CMD ["node", "dist/server.js"]