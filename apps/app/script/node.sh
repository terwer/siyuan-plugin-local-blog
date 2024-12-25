#!/bin/bash

# 使用 Node 构建配置
echo "Using Node build config as SSR build."
cp nuxt.node.config.ts nuxt.config.ts
echo "Nuxt build for node finished."

# 拷贝资源
# rsync -av --progress .output/public/ ./dist/
mkdir -p ../../dist/node
rsync -av .output/ ../../dist/node
echo "Resources are copied."

nuxt build
echo "Node build finished."