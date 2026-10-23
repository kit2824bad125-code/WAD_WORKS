FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY prisma/ ./prisma/

RUN npm install
RUN npm run build --workspace=@fixnear/shared
RUN npx prisma generate
RUN npm run build --workspace=@fixnear/api

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "apps/api/dist/server.js"]
