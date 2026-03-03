FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# To override this in docker compose, use the command
# start:dev, which will mount with live reloading.
CMD ["npm", "run", "start:prod"]