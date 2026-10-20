# LEC 2026 招新页

本仓库原为 React + TypeScript + Vite 单页应用（旧版见 git 历史），现已整体迁移到 Next.js（App Router），页面内容、视觉与交互保持一致。

技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + GSAP + Lenis

现已完成静态“团队动态”与“往届成员”，并提供 `/admin` 后台维护这两部分内容（模仿 Ziro-Zone 的“内容即仓库文件”思路：无数据库，内容存于 `public/members/index.json` 与 `public/news/index.json`，后台保存时通过 GitHub Contents API 以 Git 提交写回，部署平台自动重新构建）。

## /admission 录取查询

直接访问 `/admission`，输入 12 位数字学号和姓名查询录取结果。两项必须同时精确匹配，提交时会去除首尾空格。仅“录取成功”“未通过面试”展示整页结果；没有匹配记录时，在表单下提示“未查询到信息，请确认填写无误”。首页不新增查询入口。

手机和桌面均采用不可滚动的整屏布局，手机软键盘弹出时跟随可视区域调整高度。两种结果页的背景和蓝色风格与查询页一致，通过“重新查询”返回并保留已填写的信息；未查询到信息、输入校验和网络异常均在表单页显示文字提示，修改输入时清除提示。

有效查询提交后播放约 2.3 秒的整屏转场：纯蓝色色块自上而下覆盖，靠左排列的 21 行白色 HTML 源码逐行渐显上移，再自上而下露出查询结果。请求与动画同步执行；响应较慢时停留在源码画面等待，失败或无匹配记录时回到表单提示。动画期间禁用交互，系统开启“减少动态效果”时缩短转场。

录取成功页面的转场结束后，通过 `canvas-confetti` 从左右下角同时向中央发射两簇礼花，每次成功查询仅播放一次，不阻挡页面点击；未通过面试、未查到信息时不播放。手机端减少粒子数量，重新查询或离开页面时清理动画，系统开启“减少动态效果”时停用礼花。

名单存放在 `public/admission/index.json`，查询逻辑在 `src/lib/admission.ts` 中读取该 JSON，由 `POST /api/admission` 返回匹配结果，不需要数据库、后台配置或新增环境变量。完整名单也可通过 `/admission/index.json` 直接公开访问。

**当前 36 条记录均为虚构示例，不是真实录取名单。** 学号为 `202600000001`—`202600000036`，姓名依次为“示例学生01”—“示例学生36”；前 12 条为录取成功，后 24 条为未通过面试：

| 示例学号 | 示例姓名 | 状态字段 | 页面结果 |
| --- | --- | --- | --- |
| `202600000001` | 示例学生01 | `accepted` | 录取成功 |
| `202600000013` | 示例学生13 | `interview_failed` | 未通过面试 |

发布真实结果时，修改 `public/admission/index.json` 中的 `studentId`、`name` 和 `status`；学号保留为 12 位数字字符串，并确保每位学生只对应一条记录。修改后重新构建、部署即可生效。

## /admin 后台

访问 `/admin`，用环境变量 `ADMIN_PASSWORD` 配置的口令登录，可对“往届成员”和“团队动态”做增删改。每次保存 = 一个指向 `GITHUB_BRANCH` 的 Git 提交。

所需环境变量（见 `.env.example`）：

| 变量 | 说明 |
| --- | --- |
| `ADMIN_PASSWORD` | 后台登录口令 |
| `ADMIN_SESSION_SECRET` | 会话签名密钥，至少 32 个字符 |
| `GITHUB_TOKEN` | fine-grained PAT，仅授权本仓库的 Contents 读写 |
| `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` | 写回目标仓库与分支 |

PAT 创建：GitHub → Settings → Developer settings → Fine-grained tokens → 仅选择 `LEC-Official-Website` 仓库、权限给 `Contents: Read and write`（组织仓库还需允许组织级 PAT 访问）。本地填入 `.env.local`，线上填入 Vercel 项目环境变量。

## 与 Vite 版的主要差异（仅入口层）

- 单页入口改为 `src/app/page.tsx`，SEO meta / og / Bing、百度站点验证移至 `src/app/layout.tsx` 的 `metadata`
- 字体（Google Fonts + MiSans CDN）`<link>` 保留在 `layout.tsx` 中
- 全部交互组件标注 `'use client'`；`GridMotion` 因强依赖 `window`，改为挂载后渲染
- 二维码路径由 `import.meta.env.BASE_URL` 改为 `/qr.png`
- 往届成员与团队动态由硬编码 `data.ts` 改为构建时读取 `public/**/index.json`

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生产构建（/ 为完全静态预渲染）
pnpm test     # vitest 单元测试
pnpm start
```

部署在 vercel：https://lec-page-2026.ziroo.cn/
