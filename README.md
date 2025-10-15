# Next.js on Netlify Platform Starter

[Live Demo](https://nextjs-platform-starter.netlify.app/)

A modern starter based on Next.js 14 (App Router), Tailwind, and [Netlify Core Primitives](https://docs.netlify.com/core/overview/#develop) (Edge Functions, Image CDN, Blob Store).

In this site, Netlify Core Primitives are used both implictly for running Next.js features (e.g. Route Handlers, image optimization via `next/image`, and more) and also explicitly by the user code.

Implicit usage means you're using any Next.js functionality and everything "just works" when deployed - all the plumbing is done for you. Explicit usage is framework-agnostic and typically provides more features than what Next.js exposes.

## Deploying to Netlify

This site requires [Netlify Next Runtime v5](https://docs.netlify.com/frameworks/next-js/overview/) for full functionality. That version is now being gradually rolled out to all Netlify accounts.

After deploying via the button below, please visit the **Site Overview** page for your new site to check whether it is already using the v5 runtime. If not, you'll be prompted to opt-in to to v5.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-platform-starter)

## Developing Locally

1. Clone this repository, then run `npm install` in its root directory.

2. For the starter to have full functionality locally (e.g. edge functions, blob store), please ensure you have an up-to-date version of Netlify CLI. Run:

```
npm install netlify-cli@latest -g
```

3. Link your local repository to the deployed Netlify site. This will ensure you're using the same runtime version for both local development and your deployed site.

```
netlify link
```

4. Then, run the Next.js development server via Netlify CLI:

```
netlify dev
```

If your browser doesn't navigate to the site automatically, visit [localhost:8888](http://localhost:8888).

## 项目信息

### 部署信息
- **生产环境**: https://polarbigdatashowv2.netlify.app
- **Netlify Site ID**: 1baaeac4-2a91-4fc6-b96e-0b85a0ed4443
- **部署状态**: ✅ 已部署并测试通过
- **最后部署**: 2025-10-15

### 技术栈
- **前端框架**: Next.js 15.5.4 (App Router)
- **UI 库**: React 18.3.1, Tailwind CSS 4.1.13
- **动画**: Framer Motion 12.23.24
- **图表**: ECharts 6.0.0, echarts-for-react 3.0.2
- **数据库**: Supabase (@supabase/supabase-js 2.75.0)
- **部署平台**: Netlify
- **包管理器**: pnpm

### 项目功能
- ✅ 光伏能源监控系统
- ✅ 实时数据展示
- ✅ 设备管理（动态路由）
- ✅ 数据分析和可视化
- ✅ 历史数据查询
- ✅ 系统设置和配置
- ✅ 主题切换（深色/蓝色/白色/绿色）
- ✅ API 接口（随机引用、数据初始化）

### 测试状态
- **基础功能测试**: ✅ 100% 通过 (13/13)
- **高级功能测试**: ✅ 93.33% 通过 (14/15)
- **整体评分**: A 级 ⭐⭐⭐⭐⭐
- **测试报告**: 见 [DEPLOYMENT_TEST_REPORT.md](./DEPLOYMENT_TEST_REPORT.md)

### 部署流程

使用 pnpm 和 Netlify CLI 部署：

```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm run build

# 3. 部署到 Netlify
netlify deploy --prod --dir=.next --site=1baaeac4-2a91-4fc6-b96e-0b85a0ed4443
```

### 测试命令

```bash
# 基础功能测试
node scripts/test-deployed-site.js

# 高级功能测试
node scripts/test-advanced-features.js

# 生成测试报告
node scripts/generate-test-report.js
```

### 项目结构

```
polarbigdatashowv2/
├── app/                      # Next.js App Router 页面
│   ├── about/               # 关于页面
│   ├── analytics/           # 数据分析页面
│   ├── api/                 # API 路由
│   ├── devices/             # 设备管理（含动态路由）
│   ├── history/             # 历史数据页面
│   ├── settings/            # 系统设置页面
│   └── providers.jsx        # 全局 Provider（主题等）
├── components/              # React 组件
│   ├── charts/             # 图表组件
│   ├── dashboard/          # 仪表板组件
│   └── ...
├── lib/                     # 工具库
│   ├── supabase.js         # Supabase 客户端
│   ├── themeContext.jsx    # 主题上下文
│   └── dataService.js      # 数据服务
├── scripts/                 # 脚本文件
│   ├── test-deployed-site.js
│   ├── test-advanced-features.js
│   └── generate-test-report.js
├── public/                  # 静态资源
├── styles/                  # 全局样式
└── netlify.toml            # Netlify 配置

```

### 环境变量

项目支持以下环境变量（可选）：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

如未配置，系统将使用模拟客户端以保证基本功能运行。

---

**最后更新**: 2025-10-15