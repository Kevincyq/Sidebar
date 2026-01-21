# GitHub 推送步骤指南

## 前置准备

1. 确保你已安装 Git
2. 确保你已注册 GitHub 账号
3. 确保已配置 Git 用户信息（如果未配置，见下方）

## 步骤 1: 配置 Git 用户信息（如果还未配置）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 步骤 2: 初始化 Git 仓库

```bash
cd /home/kevincyq/Sidebar
git init
```

## 步骤 3: 添加所有文件到暂存区

```bash
git add .
```

## 步骤 4: 创建首次提交

```bash
git commit -m "Initial commit: AI Model Arena project"
```

## 步骤 5: 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `Sidebar` (或你喜欢的名字)
   - Description: `AI Model Arena - Compare AI models side by side`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有文件）
4. 点击 "Create repository"

## 步骤 6: 添加远程仓库并推送

GitHub 创建仓库后会显示命令，通常如下：

```bash
# 添加远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/Sidebar.git

# 或者使用 SSH（如果你配置了 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/Sidebar.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 7: 验证推送

在浏览器中打开你的 GitHub 仓库页面，确认所有文件都已成功上传。

## 后续更新代码

当你修改代码后，使用以下命令更新 GitHub：

```bash
git add .
git commit -m "描述你的更改"
git push
```

## 注意事项

- ✅ `.env.local` 文件已被 `.gitignore` 忽略，不会上传到 GitHub（安全）
- ✅ `node_modules` 目录不会被上传（通过 `.gitignore` 忽略）
- ✅ 所有敏感信息（API keys）都通过环境变量配置，不会泄露

## 常见问题

### 如果推送时要求输入用户名和密码

GitHub 已不再支持密码认证，你需要：

1. **使用 Personal Access Token (推荐)**:
   - 在 GitHub Settings > Developer settings > Personal access tokens 创建 token
   - 推送时用户名输入你的 GitHub 用户名，密码输入 token

2. **或配置 SSH key**:
   - 生成 SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
   - 将公钥添加到 GitHub Settings > SSH and GPG keys
   - 使用 SSH URL: `git@github.com:USERNAME/REPO.git`

