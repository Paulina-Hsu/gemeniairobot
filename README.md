# Gemini 聊天机器人

一个使用 Google Gemini API 和 React 构建的中文界面聊天机器人。

## ✨ 功能

*   与 AI 进行实时对话
*   AI 消息流式传输，逐步显示回复
*   清晰区分用户和 AI 的消息
*   加载状态指示（AI 思考中）
*   错误信息展示
*   支持消息内链接的渲染 (例如 `http://` 或 `https://`)
*   响应式设计，适配不同屏幕尺寸

## 🛠️ 技术栈

*   React 19 (通过 esm.sh)
*   TypeScript (通过 esm.sh 编译的 React 组件)
*   Tailwind CSS (通过 CDN)
*   Font Awesome (通过 CDN for icons)
*   @google/genai (Gemini API SDK, 通过 esm.sh)

## 🔑 API 密钥配置 (重要!)

本应用需要一个 Google Gemini API 密钥才能运行。

**代码中的 API 密钥使用**

应用代码 (主要在 `services/geminiService.ts` 和 `App.tsx` 中初始化服务) 期望通过 `process.env.API_KEY` 获取 API 密钥，这是 `@google/genai` SDK 推荐的方式。

```javascript
// 在 services/geminiService.ts 中
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**挑战**: 在浏览器环境中，`process.env.API_KEY` 通常是 `undefined`，除非通过构建工具在构建时将其注入。

### 对于 Vercel 部署 (推荐方式)

1.  在您的 Vercel 项目设置中，导航到 "Settings" -> "Environment Variables"。
2.  添加一个名为 `API_KEY` 的环境变量，并将其值设置为您的 Google Gemini API 密钥。
3.  **重要**: 要使此环境变量在客户端代码中通过 `process.env.API_KEY` 可用，您**必须**使用一个支持环境变量注入的构建步骤/框架。
    *   **推荐**: 将此项目迁移到像 [Vite](https://vitejs.dev/) 这样的构建工具。Vite 可以配置为在构建时将环境变量替换到您的代码中。
    *   当使用 Vite 时，您可以在 Vercel 中设置 `API_KEY`，然后在 `vite.config.ts` 中配置 `define` 选项 (详见下方本地开发部分)，Vercel 构建时会自动使用这个环境变量。
    *   如果您将此项目直接部署为静态文件 (没有构建步骤，例如 Vercel 的 "Other" 预设且无构建命令)，Vercel 设置的 `API_KEY` 环境变量将**无法**直接被客户端的 `process.env.API_KEY` 读取。这种情况下，您需要修改应用架构，例如通过 Vercel Serverless Function 代理 API 请求（这样密钥仅在受信任的后端环境中使用）。

### 对于本地开发

*   **选项 1: 使用构建工具 (如 Vite) (推荐)**
    *   这能更好地模拟生产环境并正确处理环境变量。
    1.  确保您已安装 Node.js 和 npm/yarn。
    2.  创建一个新的 Vite + React + TypeScript 项目:
        ```bash
        npm create vite@latest my-gemini-chatbot -- --template react-ts
        # 或者 yarn create vite my-gemini-chatbot --template react-ts
        cd my-gemini-chatbot
        ```
    3.  将本项目 (`index.html`, `index.tsx`, `App.tsx`, `components/`, `services/`, `types.ts`, `constants.ts`, `metadata.json`) 的相关代码和文件结构迁移到新的 Vite 项目中。
        *   Vite 的 `index.html` 在项目根目录，`main.tsx` (或 `index.tsx`) 在 `src/` 目录下。
        *   您需要调整 `index.html` 以匹配 Vite 的结构 (例如，script src 指向 `src/index.tsx`) 并移除 CDN 引入的 React/ReactDOM 及 importmap，因为 Vite 会处理这些。Tailwind CSS 也可以通过 PostCSS 在 Vite 中集成。
    4.  安装必要的依赖:
        ```bash
        npm install @google/genai tailwindcss postcss autoprefixer
        # 或者 yarn add @google/genai tailwindcss postcss autoprefixer
        ```
        (React 和 ReactDOM 已经由 Vite 模板提供)。
        并按照 Tailwind CSS 的 Vite 安装指南进行配置。
    5.  在项目根目录创建 `.env` 文件，并添加您的 API 密钥:
        ```
        VITE_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
        ```
    6.  修改或创建 `vite.config.ts` (或 `.js`)，添加 `define` 选项，以便在代码中将 `process.env.API_KEY` 映射到 `import.meta.env.VITE_GEMINI_API_KEY`:
        ```typescript
        // vite.config.ts
        import { defineConfig, loadEnv } from 'vite'
        import react from '@vitejs/plugin-react'

        export default defineConfig(({ mode }) => {
          // 加载特定模式的环境变量
          const env = loadEnv(mode, process.cwd(), '');
          return {
            plugins: [react()],
            define: {
              // 将 process.env.API_KEY 暴露给客户端代码
              // Vercel 会设置 API_KEY, 本地会使用 VITE_GEMINI_API_KEY
              'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY)
            }
          }
        })
        ```
    7.  运行开发服务器: `npm run dev` (或 `yarn dev`)。

*   **选项 2: 临时修改代码 (不推荐用于版本控制)**
    *   您可以临时修改 `services/geminiService.ts`，将 API 密钥硬编码。
        **警告**: 这非常不安全，仅用于快速本地测试，**切勿将包含密钥的此类更改提交到 Git！**
      ```javascript
      // 在 services/geminiService.ts 中进行临时修改:
      // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // 注释掉这行
      const apiKeyForTesting = "YOUR_ACTUAL_API_KEY"; // 替换为你的密钥
      const ai = new GoogleGenAI({ apiKey: apiKeyForTesting }); // 使用这行
      ```

## 🚀 本地运行 (基于当前文件结构)

如果您不立即使用构建工具，并想尝试直接运行 `index.html`:

1.  **确保 API 密钥问题已解决** (参见上面的 "API 密钥配置" 部分，最可能的方式是临时修改代码)。
2.  由于项目直接使用 ES 模块和 CDN，您可以在项目根目录中通过一个简单的 HTTP 服务器来提供 `index.html`。例如:
    *   如果您安装了 Node.js: `npx serve .` (如果未安装 `serve`，请先运行 `npm install -g serve`)
    *   或者使用 VS Code 的 "Live Server" 扩展。
3.  在浏览器中打开服务器提供的本地地址 (例如 `http://localhost:3000` 或 `http://localhost:5500`)。

**注意**: 此方法下，`process.env.API_KEY` 将是 `undefined` 除非您采取了上述的临时措施。

## 部署到 Vercel

1.  **准备您的代码**:
    *   将您的代码推送到 GitHub/GitLab/Bitbucket 仓库。
    *   **强烈建议**: 按照上述 "API 密钥配置" 和 "本地开发 - 选项 1 (Vite)" 的说明，将项目设置为使用 Vite（或其他构建工具）。这将确保 Vercel 的环境变量能被正确注入。

2.  **在 Vercel 上创建新项目**:
    *   登录 Vercel ([https://vercel.com](https://vercel.com))。
    *   点击 "Add New..." -> "Project"。
    *   选择您的 Git 仓库并导入。

3.  **配置项目**:
    *   **Framework Preset**:
        *   如果您集成了 Vite，选择 "Vite"。Vercel 通常会自动检测并配置。
        *   如果坚持部署当前无构建步骤的静态文件，选择 "Other"。但再次强调 API 密钥注入的挑战。
    *   **Build and Output Settings**:
        *   如果使用 Vite，Vercel 会自动使用正确的构建命令 (如 `npm run build` 或 `vite build`) 和输出目录 (通常是 `dist`)。
        *   如果选择 "Other"，构建命令可以留空，输出目录也通常留空（Vercel 会尝试直接服务根目录的文件）。
    *   **Environment Variables**:
        *   导航到项目设置的 "Environment Variables" 部分。
        *   添加一个名为 `API_KEY` 的环境变量。
        *   将其值设置为您的 Google Gemini API 密钥。
        *   确保该变量可用于“Production”, “Preview”, 和 “Development” 环境（如果适用）。

4.  **部署**:
    *   点击 "Deploy"。
    *   Vercel 将从您的 Git 仓库拉取代码，执行构建过程（如果配置了），然后将您的应用部署到全球 CDN。
    *   部署完成后，您会得到一个可公开访问的 URL。

## 📁 项目结构

```
.
├── index.html          # HTML 入口文件 (使用 CDN 和 importmap)
├── index.tsx           # React 应用主入口 (被 index.html 通过 type="module" 引入)
├── App.tsx             # 主要的 React 应用组件 (包含聊天界面和核心逻辑)
├── components/         # 存放所有 React UI 组件的目录
│   ├── ChatInput.tsx     # 用户输入消息的文本框和发送按钮
│   ├── MessageList.tsx   # 展示聊天消息列表的容器
│   ├── MessageItem.tsx   # 渲染单条聊天消息（用户或 AI）
│   ├── LoadingSpinner.tsx# AI 响应时的加载动画指示器
│   └── ErrorDisplay.tsx  # 显示错误的组件
├── services/           # 包含与外部服务交互的逻辑
│   └── geminiService.ts  # 封装与 Google Gemini API 通信的函数
├── types.ts            # 定义项目中使用的 TypeScript 类型 (如 Message, Sender)
├── constants.ts        # 存放应用常量 (如 Gemini 模型名称, AI 显示名称, 系统指令)
└── metadata.json       # 应用元数据 (如名称, 描述)，可能用于 PWA 或其他集成
```

希望这个 README 对您有所帮助！
