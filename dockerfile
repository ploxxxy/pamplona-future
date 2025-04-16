FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm i -g pnpm prisma && pnpm install
EXPOSE 3000 25565 42230
