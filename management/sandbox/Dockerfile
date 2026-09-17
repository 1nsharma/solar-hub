FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install --no-audit --no-fund

COPY src ./src

ENV SOLARHUB_WORKSPACE=/workspace
ENV OLLAMA_BASE_URL=http://host.docker.internal:11434

CMD ["npm", "run", "scan"]
