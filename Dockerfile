FROM node:18.10-buster-slim as builder

ARG PORT=3000

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

RUN npm ci

# Copy source
COPY ./ ./

RUN npm run build
RUN cp package.json build/
RUN cp package-lock.json build/

FROM node:18.10-buster-slim as runner

COPY --from=builder --chown=node:node /app/build /app

WORKDIR /app

USER node

RUN npm ci --production

EXPOSE $PORT
CMD ["npm", "run" ,"start:prod"]
