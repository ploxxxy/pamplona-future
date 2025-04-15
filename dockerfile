FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm i -g pnpm prisma && pnpm install
COPY . .

FROM build
WORKDIR /app
COPY --from=build /app/src ./src
EXPOSE 3000 25565 42230
