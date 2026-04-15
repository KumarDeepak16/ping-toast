FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve test app
WORKDIR /app/tests/test-app
RUN npm ci
EXPOSE 5173
CMD ["npx", "vite", "--host"]
