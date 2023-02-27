FROM node:18.8-alpine as base

################################################################################

# Build admin panel and server
FROM base as builder

WORKDIR /home/node/app
COPY package*.json yarn.lock ./
RUN yarn install

COPY tsconfig.json tsconfig.json
COPY assets assets
COPY src src
RUN yarn build

################################################################################

# Install production
FROM builder as builder-prod

ENV NODE_ENV=production
RUN rm -rf ./node_modules
RUN yarn install --production

################################################################################

# Runtime for packaging
FROM base as runtime

ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js
ENV NODE_ENV=production
WORKDIR /home/node/app

COPY --from=builder-prod /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]
