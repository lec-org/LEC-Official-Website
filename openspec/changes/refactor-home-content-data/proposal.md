## Why

首页页面组件同时承担布局、交互和大量内容数据，成员、历史、技术方向、图片列表等内容分散在 JSX 中，维护时容易误改结构，也难以继续增加年级或内容项。

## What Changes

- 将 `home/1.tsx`～`8.tsx` 统一为 `home/Section1`～`Section8/index.tsx`。
- 将 `AlumniScroll` 归档到 `components/home/AlumniScroll/index.tsx`。
- 将成员数据按年级拆成 `MEMBERS_2025`～`MEMBERS_2019`，并通过 `MEMBERS_ALL` 组合。
- 将首页各 Section 的静态列表和长文本数据移出渲染组件，集中到同级 `data.ts`。
- 在 `App.tsx` 保持单一 Home 入口，页面编排由 `home/index.tsx` 管理。

## Capabilities

### New Capabilities

- `home-content-data`: 首页内容以数据模块组织，支持按页面和主题独立维护。
- `project-change-records`: 使用 OpenSpec 记录中大型更新，并要求大更新附带 PRD。

### Modified Capabilities

- None.

## Impact

- 影响 `src/home`、`src/components/home` 和 `src/App.tsx` 的目录及导入路径。
- 运行时展示和交互保持不变，变更主要是组织方式和维护边界。
