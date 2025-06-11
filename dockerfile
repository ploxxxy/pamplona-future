FROM node:22-alpine
ARG NODE_PORT=3000
WORKDIR /app
COPY . .
RUN npm i -g pnpm prisma && pnpm install
EXPOSE ${NODE_PORT} 25565 42230
