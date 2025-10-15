# Netlify 部署指南 - 光伏电站智能监控中心

## 项目状态
✅ 项目已准备好部署！
- 构建测试通过 ✓
- 所有依赖已安装 ✓
- 环境变量文件已创建 ✓

## 部署步骤

### 方法一：通过 GitHub 部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **在 Netlify 上创建新站点**
   - 访问 https://app.netlify.com
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "Deploy with GitHub"
   - 授权 Netlify 访问您的 GitHub 账户
   - 选择您的仓库

3. **配置构建设置**
   - Build command: `npm run build` 或 `pnpm run build`
   - Publish directory: `.next`
   - 点击 "Show advanced" 并添加环境变量（见下方）

4. **配置环境变量**
   在 "Environment variables" 部分添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL = 您的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 您的Supabase匿名密钥
   SUPABASE_SERVICE_ROLE_KEY = 您的Supabase服务角色密钥
   ```

5. **开始部署**
   点击 "Deploy site" 按钮

### 方法二：拖拽部署（快速测试）

1. **本地构建**
   ```bash
   npm run build
   # 或
   pnpm run build
   ```

2. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **部署到 Netlify**
   ```bash
   netlify deploy --prod
   ```
   按照提示：
   - 选择 "Create & configure a new site"
   - 选择团队
   - 输入站点名称（可选）
   - 部署目录输入: `.next`

### 方法三：使用 Netlify Drop（最简单）

1. 访问 https://app.netlify.com/drop
2. 将整个项目文件夹拖拽到网页上
3. Netlify 会自动检测 Next.js 项目并开始构建

## 部署后配置

### 1. 设置环境变量
- 进入 Netlify 控制台
- 选择您的站点
- 进入 "Site settings" → "Environment variables"
- 添加所有必要的环境变量

### 2. 配置自定义域名（可选）
- 进入 "Domain settings"
- 点击 "Add custom domain"
- 按照指示配置 DNS

### 3. 启用自动部署
- 进入 "Build & deploy" → "Continuous deployment"
- 确保 "Auto publishing" 已启用
- 每次推送到主分支都会自动触发部署

## 项目特定配置

本项目已包含以下 Netlify 优化配置：

1. **netlify.toml** - 已配置：
   - Next.js 插件
   - 构建命令和发布目录
   - 安全头部设置
   - API 缓存配置

2. **Next.js 配置** - 已优化：
   - 静态页面生成
   - 图片优化
   - 代码分割

## 验证部署

部署完成后，检查以下功能：

1. **访问站点**
   - 打开 Netlify 提供的 URL
   - 例如：https://your-site-name.netlify.app

2. **功能测试**
   - [ ] 页面加载正常
   - [ ] 数据卡片显示正确
   - [ ] 图表渲染正常
   - [ ] 动画效果流畅
   - [ ] 响应式布局正常

3. **数据连接**
   - [ ] Supabase 连接成功
   - [ ] 实时数据更新正常
   - [ ] API 调用正常

## 故障排除

### 构建失败
- 检查构建日志中的错误信息
- 确保所有环境变量已正确设置
- 确保 Node.js 版本为 18+

### 页面显示 404
- 检查发布目录是否正确设置为 `.next`
- 确保已安装 @netlify/plugin-nextjs 插件

### 数据不显示
- 检查浏览器控制台错误
- 验证 Supabase 环境变量
- 确保数据库表已初始化

## 支持资源

- Netlify 文档：https://docs.netlify.com
- Next.js on Netlify：https://docs.netlify.com/frameworks/next-js/
- 项目 README：查看项目根目录的 README.md

## 注意事项

1. **环境变量安全**：不要在代码中硬编码敏感信息
2. **构建缓存**：Netlify 会缓存依赖，如需清理可在控制台操作
3. **部署预览**：PR 会自动生成预览链接
4. **监控**：建议启用 Netlify Analytics 监控站点性能

---

🎉 祝贺！您的光伏电站监控大屏即将上线！