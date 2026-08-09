## Context

当前首页由八个长页面组件组成。组件内混有动画生命周期、布局标记和内容列表，导致内容修改必须进入复杂 JSX。成员列表还被压成单一 `allMembers` 数组，新增年级时需要同时修改筛选和标签逻辑。

## Design

### 页面目录

每个首页 Section 使用 `src/home/SectionN/index.tsx` 作为渲染入口；与该页面直接相关的静态内容放在同目录 `data.ts`。`src/home/index.tsx` 只负责页面编排、导航和跨页面装饰。

### Alumni 数据

`src/components/home/AlumniScroll/data.ts` 定义 `AlumniMember`，按年级导出 `MEMBERS_2025` 等常量，再通过显式 spread 组成 `MEMBERS_ALL`。UI 只依赖 `MEMBERS_ALL` 和 `GRADE_LABELS`，不再内嵌成员资料。

### 维护边界

新增内容优先修改 `data.ts`；新增布局或交互才修改 `index.tsx`。需要跨页面改变编排时修改 `home/index.tsx`，不要把导航配置复制进单个 Section。

## Non-Goals

- 本次不改变视觉设计、文案含义或用户交互流程。
- 本次不引入路由库或新的状态管理方案。
- 本次不把所有通用视觉样式抽成新的设计系统。
