# OpenSpec

本项目使用 OpenSpec 记录可 review 的功能更新、重构和 bugfix。

## 记录规则

- 中等规模更新：创建 `openspec/changes/<change-name>/`，至少包含 `proposal.md`、`design.md` 和 `tasks.md`。
- 大更新：在同一目录增加 `prd.md`，先明确目标、范围、用户流程和验收标准，再进入实现。
- 小改动：在对应变更的 `tasks.md` 或提交说明中记录即可；如果无法清楚判断规模，按中等规模记录。
- 完成前运行 `npm run build` 和 `npm run lint`，把结果写回 `tasks.md`。

## 当前变更

- `changes/refactor-home-content-data/`：首页页面目录、内容数据和 Alumni 数据的可维护性重构。
