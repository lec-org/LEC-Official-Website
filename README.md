# LEC 2026 招新页

本仓库原为 React + TypeScript + Vite 单页应用（旧版见 git 历史），现已整体迁移到 Next.js（App Router），页面内容、视觉与交互保持一致。

技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + GSAP + Lenis

现已完成静态“团队动态”与“往届成员”，并提供 `/admin` 后台维护这两部分内容（无数据库，内容存于 `public/members/index.json` 与 `public/news/index.json`，后台保存时通过 GitHub Contents API 以 Git 提交写回，部署平台自动重新构建）。

# 2026 秋季招新新增 /admission 录取查询页

名单存放在 `public/admission/index.json`，查询逻辑在 `src/lib/admission.ts` 中读取该 JSON，由浏览器直接匹配，不需要数据库、后台配置或新增环境变量。原 `POST /api/admission` 保留兼容，查询页面不再调用。完整名单也可通过 `/admission/index.json` 直接公开访问。

# 招新主页的 /admin 后台

访问 `/admin`，用环境变量 `ADMIN_PASSWORD` 配置的口令登录，可对“往届成员”和“团队动态”做增删改。每次保存 = 一个指向 `GITHUB_BRANCH` 的 Git 提交。

所需环境变量（见 `.env.example`）：

| 变量 | 说明 |
| --- | --- |
| `ADMIN_PASSWORD` | 后台登录口令 |
| `ADMIN_SESSION_SECRET` | 会话签名密钥，至少 32 个字符 |
| `GITHUB_TOKEN` | fine-grained PAT，仅授权本仓库的 Contents 读写 |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | 写回目标仓库与分支 |

PAT 创建：GitHub → Settings → Developer settings → Fine-grained tokens → 仅选择 `LEC-Official-Website` 仓库、权限给 `Contents: Read and write`（组织仓库还需允许组织级 PAT 访问）。本地填入 `.env.local`，线上填入 Vercel 项目环境变量。

> 如果 Github 密钥过期了 please call me

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生产构建（/ 为完全静态预渲染）
pnpm test     # vitest 单元测试
pnpm start
```

部署在 vercel：https://lec-page-2026.ziroo.cn/
