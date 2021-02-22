FROM node:14-alpine as base
WORKDIR /app

FROM base AS development
COPY ["package.json", "package-lock.json*", "./"]

# first set aside prod dependencies so we can copy in to the prod image
RUN npm ci --production
RUN cp -R node_modules /tmp/node_modules

RUN npm ci
COPY . .

FROM development as builder
#RUN npm lint
ENV NODE_ENV=development
RUN npm run lint
RUN npm run test
RUN npm run build

# release includes bare minimum required to run the app, copied from builder
FROM base AS release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
EXPOSE 12345
# this is temporary!:
ENV NODE_ENV=development
CMD ["npm","start"]


