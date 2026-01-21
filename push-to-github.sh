#!/bin/bash
# GitHub 推送脚本
# 使用方法: bash push-to-github.sh

echo "🚀 开始推送到 GitHub..."

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
fi

# 添加所有文件
echo "📝 添加文件到暂存区..."
git add .

# 检查是否有更改
if git diff --staged --quiet; then
    echo "⚠️  没有需要提交的更改"
    exit 0
fi

# 提交更改
echo "💾 提交更改..."
git commit -m "Initial commit: AI Model Arena project"

echo ""
echo "✅ 本地提交完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 在 GitHub 上创建新仓库（如果还没有）"
echo "2. 运行以下命令添加远程仓库并推送："
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "   或者使用 SSH："
echo "   git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
