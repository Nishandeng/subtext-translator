# ============================
# Stage 1: deps — 安装依赖
# ============================
FROM node:20-alpine AS deps
WORKDIR /app

# 拷贝 package 文件
COPY package.json package-lock.json ./

# 使用 npm ci 精确安装（适合生产/CI）
RUN npm ci --prefer-offline

# ============================
# Stage 2: builder — 构建应用
# ============================
FROM node:20-alpine AS builder
WORKDIR /app

# 将 deps 阶段的 node_modules 复制过来
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建期注入环境变量占位（实际 key 在运行时注入）
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================
# Stage 3: runner — 最终镜像
# ============================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户，提升安全性
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# 拷贝构建产物（standalone 模式下更精简，这里用标准 .next）
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
