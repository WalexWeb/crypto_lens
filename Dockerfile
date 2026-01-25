FROM oven/bun:latest AS builder

WORKDIR /app

# Копируем package.json, lockfile и .env.local для корректной сборки
COPY package.json bun.lock* .env.local ./
COPY . .

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# Собираем Next.js приложение (использует переменные из .env.local)
RUN bun run build

# --- Production-этап с nginx ---
FROM oven/bun:alpine as runner

WORKDIR /app

# Копируем собранные статические файлы Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./.env.local
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["bun", "run", "start"]