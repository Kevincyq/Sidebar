# AI Model Arena

一个响应式的 Web 前端应用（PWA），允许用户输入一个问题并同时从两个不同的 AI 模型（GPT-5.2 和 Gemini 3 Pro）接收流式回答进行对比。

## 技术栈

- **框架**: Next.js 14+ (App Router) with TypeScript
- **样式**: Tailwind CSS + Shadcn UI
- **图标**: Lucide React
- **Markdown**: react-markdown + react-syntax-highlighter
- **状态管理**: React Hooks (useState, useEffect, useRef)
- **网络**: 原生 fetch API（支持 SSE）

## 功能特性

### 布局
- **上下堆叠布局**: 适合在浏览器侧边栏中运行（GPT在上，Gemini在下，各占50%高度）
- **安全区域**: 处理移动设备的"刘海"和底部主屏幕栏

### 核心功能
- 单个输入框（固定在底部）
- 同时启动两个模型的流式响应（并发请求）
- 真实的流式传输（通过 Turing 平台 API）
- 支持"停止生成"功能
- 系统级 API Keys 配置（通过环境变量，安全可靠）
- Markdown 渲染：支持代码高亮，代码块自动横向滚动
- 自动滚动：文本生成时自动滚动到底部
- 视觉区分：每个模型使用不同的颜色主题（绿色代表 GPT，蓝色代表 Gemini）

### PWA 支持
- 可安装到移动设备和桌面
- 支持离线使用（基础功能）

## 项目结构

```
.
├── app/
│   ├── layout.tsx          # 全局布局（viewport、安全区域）
│   ├── page.tsx            # 主聊天界面逻辑和布局
│   └── globals.css         # 全局样式
├── components/
│   ├── chat-message.tsx   # Markdown 内容渲染组件
│   └── ui/                 # Shadcn UI 组件
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── dialog.tsx
├── hooks/
│   └── use-stream.ts       # 流式处理自定义 Hook
├── lib/
│   └── utils.ts            # 工具函数
└── public/
    └── manifest.json       # PWA 配置文件
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

**WSL 环境访问说明**：
- 开发服务器已配置为监听所有网络接口（`0.0.0.0`）
- 从 Windows 浏览器访问：`http://<WSL_IP>:3000`
- 获取 WSL IP 地址：在 WSL 中运行 `hostname -I`
- 当前 WSL IP：`172.19.181.182`（可能会变化）
- 也可以尝试使用 `localhost:3000`（如果 Windows 端口转发已配置）

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

详细的部署步骤请参考 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

快速步骤：
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目（使用 GitHub 登录）
3. 配置环境变量：`TURING_API_KEY` 和 `TURING_API_BASE`
4. 点击部署，完成！

**重要**：记得在 Vercel 项目设置中配置环境变量，否则 API 调用会失败。

## 配置 API Keys

使用 Turing 平台的封装接口，API Keys 通过环境变量配置，确保安全性：

1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的 Turing API 配置：
   ```env
   TURING_API_KEY=your-turing-api-key-here
   TURING_API_BASE=https://live-turing.cn.llm.tcljd.com/api/v1
   ```

3. 重启开发服务器使配置生效

**注意**：
- `.env.local` 文件已被 `.gitignore` 忽略，不会提交到代码仓库
- Turing 平台统一管理 GPT 和 Gemini 等模型的调用，使用统一的 API Key
- 模型名称格式：`turing/gpt-4o-mini`、`turing/gemini-pro` 等

## 使用说明

1. **提问**:
   - 在底部输入框输入您的问题
   - 按 Enter 或点击发送按钮
   - 两个模型将同时开始生成回答（上下堆叠显示）

2. **停止生成**:
   - 在生成过程中，点击停止按钮可以中断流式传输

## API 调用说明

项目使用 Turing 平台的封装接口来调用 GPT 和 Gemini 模型：

- **API 路由**: `app/api/chat/route.ts` - 处理流式 API 调用
- **前端 Hook**: `hooks/use-stream.ts` - 处理流式响应解析
- **模型配置**: 
  - GPT 模型：`turing/gpt-4o-mini`（可在 `app/api/chat/route.ts` 中修改）
  - Gemini 模型：`turing/gemini-pro`（可在 `app/api/chat/route.ts` 中修改）

如需修改模型，编辑 `app/api/chat/route.ts` 中的 `turingModel` 变量。

## 注意事项

- API Keys 通过环境变量配置，存储在服务器端，不会暴露给客户端
- 使用 Turing 平台的统一接口，支持 GPT 和 Gemini 等多种模型
- 确保 `.env.local` 文件已添加到 `.gitignore`，不要提交到代码仓库
- 流式响应通过 Server-Sent Events (SSE) 实现，支持实时显示生成内容

## PWA 图标

项目已包含 PWA 图标文件（icon-192.png, icon-512.png）。如果需要重新生成图标：

```bash
npm run generate-icons
```

或者使用浏览器工具：
1. 打开 `public/generate-icons.html` 文件
2. 点击按钮下载对应尺寸的图标

## 许可证

MIT

