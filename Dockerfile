FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY index.html vite.config.mjs ./
COPY src ./src
RUN npm run build
COPY server ./server
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "server/server.js"]
