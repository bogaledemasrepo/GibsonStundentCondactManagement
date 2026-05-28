FROM docker.io/oven/bun:1.3.3 
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD [ "bun","run","index.ts" ]