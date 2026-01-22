# Vercel 部署指南

本指南将帮助你将项目从 GitHub 部署到 Vercel 平台。

## 前置条件

- ✅ 项目已推送到 GitHub
- ✅ 拥有 Vercel 账号（如果没有，可以免费注册）
- ✅ GitHub 仓库是公开的，或者你有 Vercel 的 GitHub 集成权限

## 步骤 1: 创建 Vercel 账号

1. 访问 [Vercel 官网](https://vercel.com)
2. 点击右上角的 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"**（推荐，方便后续集成）
4. 授权 Vercel 访问你的 GitHub 账号

## 步骤 2: 导入 GitHub 项目

1. 登录 Vercel 后，进入 **Dashboard**
2. 点击 **"Add New..."** 按钮
3. 选择 **"Project"**
4. 在项目列表中找到你的 `Sidebar` 项目（或你的仓库名称）
5. 点击 **"Import"** 按钮

## 步骤 3: 配置项目设置

### 3.1 项目配置

Vercel 会自动检测 Next.js 项目，通常会自动配置：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `.next`（自动检测）
- **Install Command**: `npm install`（自动检测）

### 3.2 环境变量配置（重要！）

这是最关键的一步，需要配置 Turing API 的密钥：

1. 在项目配置页面，找到 **"Environment Variables"** 部分
2. 点击 **"Add"** 添加环境变量
3. 添加以下两个环境变量：

   **变量 1:**
   - **Name**: `TURING_API_KEY`
   - **Value**: 你的 Turing API Key
   - **Environment**: 选择所有环境（Production, Preview, Development）

   **变量 2:**
   - **Name**: `TURING_API_BASE`
   - **Value**: `https://live-turing.cn.llm.tcljd.com/api/v1`
   - **Environment**: 选择所有环境（Production, Preview, Development）

4. 点击 **"Save"** 保存环境变量

### 3.3 项目名称（可选）

- **Project Name**: 可以修改为你喜欢的名称，或保持默认
- **Team**: 选择你的个人账号或团队

## 步骤 4: 部署项目

1. 确认所有配置无误后，点击 **"Deploy"** 按钮
2. Vercel 将开始构建和部署你的项目
3. 等待部署完成（通常需要 1-3 分钟）

## 步骤 5: 查看部署结果

部署完成后，你会看到：

- ✅ **部署成功**：显示绿色的成功提示
- 🌐 **部署 URL**：类似 `https://your-project-name.vercel.app`
- 📊 **部署日志**：可以查看构建过程的详细信息

## 步骤 6: 验证部署

1. 点击部署 URL 访问你的应用
2. 测试功能是否正常：
   - 输入一个问题
   - 检查 GPT 和 Gemini 是否都能正常响应
   - 检查流式输出是否正常

## 自动部署（已配置）

Vercel 会自动配置以下功能：

- ✅ **自动部署**：每次推送到 GitHub 的 `main` 分支，Vercel 会自动重新部署
- ✅ **预览部署**：每次创建 Pull Request，Vercel 会创建预览部署
- ✅ **域名管理**：自动提供 `*.vercel.app` 域名

## 自定义域名（可选）

如果你想使用自己的域名：

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 **"Settings"** → **"Domains"**
3. 输入你的域名（如 `example.com`）
4. 按照提示配置 DNS 记录
5. 等待 DNS 生效（通常几分钟到几小时）

## 环境变量管理

### 更新环境变量

1. 进入项目 Dashboard
2. 点击 **"Settings"** → **"Environment Variables"**
3. 可以添加、编辑或删除环境变量
4. 修改后需要重新部署才能生效

### 环境变量作用域

- **Production**: 生产环境（主分支部署）
- **Preview**: 预览环境（PR 和分支部署）
- **Development**: 本地开发环境（使用 Vercel CLI）

## 常见问题

### Q1: 部署失败怎么办？

**检查清单：**
- ✅ 确认环境变量已正确配置
- ✅ 检查构建日志中的错误信息
- ✅ 确认 `package.json` 中的构建脚本正确
- ✅ 确认所有依赖都已正确安装

### Q2: API 调用失败？

**可能原因：**
- 环境变量未正确配置
- API Key 无效或过期
- 网络连接问题

**解决方法：**
- 检查 Vercel 环境变量配置
- 查看浏览器控制台和 Vercel 函数日志
- 确认 API Key 有正确的权限

### Q3: 如何查看部署日志？

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 **"Deployments"** 标签
3. 点击具体的部署记录
4. 查看 **"Build Logs"** 和 **"Function Logs"**

### Q4: 如何回滚到之前的版本？

1. 在 **"Deployments"** 页面
2. 找到想要回滚的部署版本
3. 点击右侧的 **"..."** 菜单
4. 选择 **"Promote to Production"**

## 后续操作

### 监控和分析

- **Analytics**: 在项目设置中启用 Analytics 查看访问统计
- **Logs**: 查看实时日志了解应用运行状态
- **Speed Insights**: 启用 Speed Insights 查看性能指标

### 持续集成

每次推送到 GitHub 的 `main` 分支，Vercel 会自动：
1. 检测代码变更
2. 运行构建命令
3. 部署新版本
4. 更新生产环境

## 安全提示

- ⚠️ **不要**在代码中硬编码 API Keys
- ✅ **始终**使用环境变量存储敏感信息
- ✅ 定期轮换 API Keys
- ✅ 使用 Vercel 的环境变量功能管理密钥

## 总结

部署完成后，你的应用将：
- 🌐 拥有一个公开的 URL（`https://your-project.vercel.app`）
- 🔄 自动部署（每次推送到 GitHub）
- 📊 提供性能监控和分析
- 🔒 安全地管理环境变量

祝你部署顺利！🎉

