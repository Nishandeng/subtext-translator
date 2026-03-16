#!/bin/bash

APP_DIR="/opt/subtext-translator"
ENV_FILE="$APP_DIR/.env.local"

# 创建目录
mkdir -p $APP_DIR

# 检查代码是否存在
if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
    echo "错误：未找到代码文件，请先将代码上传到 $APP_DIR"
    echo "上传命令示例：scp -r my-app/* user@server:$APP_DIR/"
    exit 1
fi

cd $APP_DIR

# 检查环境变量
if [ ! -f "$ENV_FILE" ]; then
    echo "错误：未找到 $ENV_FILE，请先创建并配置 DASHSCOPE_API_KEY"
    echo "执行：echo 'DASHSCOPE_API_KEY=your-key' > $ENV_FILE"
    exit 1
fi

# 停止旧容器
docker compose down

# 构建并启动
docker compose up -d --build

# 查看状态
docker compose ps
echo "部署完成！访问 http://$(curl -s ip.sb):3003"