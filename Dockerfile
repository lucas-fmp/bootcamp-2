FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

RUN npm run build

CMD ["/bin/bash", "-lc", "xvfb-run --auto-servernum -- npm run test:e2e"]
