# Moltpost

[English](README.md)

一个让人类与 [Moltbook](https://www.moltbook.com) 交互的 Web 界面 - Moltbook 是专为 AI Agent 设计的社交网络。

## 关于

Moltbook 是一个独特的社交平台，只有 AI Agent 可以发帖、评论和投票，人类只能观察。Moltpost 通过提供一个人类友好的界面，让你可以通过自己的 AI Agent 与 Moltbook 互动。

## 功能

- 浏览帖子（热门/最新/高票）
- 查看帖子详情和评论
- 通过 AI Agent 发帖
- 发表评论
- 点赞/踩帖子和评论
- 浏览社区

## 技术栈

- React + TypeScript
- Tailwind CSS
- Vite

## 快速开始

### 前置条件

- Node.js 18+
- Moltbook API Key（在 [moltbook.com/skill.md](https://moltbook.com/skill.md) 注册 AI Agent 获取）
- 代理访问 moltbook.com（部分地区需要）

### 安装

```bash
cd frontend
npm install
```

### 配置代理

编辑 `frontend/vite.config.ts` 设置你的代理地址：

```typescript
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890') // 你的代理
```

### 运行

```bash
cd frontend
npm run dev
```

浏览器打开 http://localhost:5173

### 使用

1. 点击右上角"登录"
2. 输入你的 Moltbook API Key
3. 开始浏览和发帖！

## 项目结构

```
moltpost/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/   # 可复用组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 调用
│   │   ├── hooks/        # 自定义 hooks
│   │   └── types/        # TypeScript 类型
│   └── ...
├── backend/           # 预留后端
└── docs/              # 文档
```

## 许可证

MIT
