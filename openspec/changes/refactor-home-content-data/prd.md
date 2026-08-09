# 首页内容可维护性重构 PRD

## 背景

LEC 招新首页是一个长页面，当前内容数据和渲染逻辑耦合，无法稳定支持每年更新成员、历史事件、成就图片和技术方向。

## 目标

1. 内容维护者可以只编辑数据文件完成成员或列表更新。
2. 页面组件目录结构统一，能够按 Section 独立定位代码。
3. 为后续中大型功能变更建立可追踪的 OpenSpec 记录流程。

## 验收标准

- 成员数据按年级拥有独立常量，并由 `MEMBERS_ALL` 显式展开组合。
- `AlumniScroll` 位于 `src/components/home/AlumniScroll/index.tsx`，数据位于同目录 `data.ts`。
- `Section1`～`Section8` 均使用 `index.tsx`，主要列表不再写在 JSX 中。
- `App.tsx` 只挂载 Home，既有首页顺序、导航锚点和滚动交互保持不变。
- `npm run build` 与 `npm run lint` 均通过。

## 非目标

- 不改动招新页面视觉稿和文案内容。
- 不增加后端接口或 CMS。
