import { randomUUID } from "node:crypto";

/** 团队动态条目（前台展示字段）。 */
export interface HistoryItem {
  date: string
  desc: string
}

/** 带稳定 id 的动态记录，对应 public/news/index.json 中的一项。 */
export type NewsRecord = HistoryItem & { id: string };

/** 后台提交的动态字段（已校验）。 */
export type NewsInput = { date: string; desc: string };

const NEWS_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const NEWS_ID_PATTERN = /^n-[A-Za-z0-9-]{1,64}$/;

/** 校验路径中的动态 id。 */
export function isValidNewsId(id: string): boolean {
  return NEWS_ID_PATTERN.test(id);
}

/** 把 YYYY-MM（兼容未补零的 YYYY-M）转换为可比较的月份数值，非法值排最后。 */
function toMonthValue(date: string): number {
  const value = Number(date.replace('-', ''));
  return Number.isNaN(value) ? 0 : value;
}

/** 将动态按日期降序做稳定排序（同月内保持原有相对顺序），不改变传入数组。 */
export function sortNewsByDateDesc(news: NewsRecord[]): NewsRecord[] {
  return [...news].sort((a, b) => toMonthValue(b.date) - toMonthValue(a.date));
}

/** 生成新的动态 id。 */
export function createNewsId(): string {
  return `n-${randomUUID()}`;
}

/** 将未经信任的后台提交转换为合法动态字段。 */
export function validateNewsInput(value: unknown): NewsInput {
  const fields = assertObject(value);
  const date = getRequiredString(fields, "date", "日期");
  if (!NEWS_DATE_PATTERN.test(date)) throw new Error("日期格式必须是 YYYY-MM，如 2026-09");
  const desc = getRequiredString(fields, "desc", "动态内容", 500);
  return { date, desc };
}

/** 将新动态插入索引头部（前台按最新在前展示），重复 id 会直接拒绝。 */
export function addNewsToIndex(index: NewsRecord[], record: NewsRecord): NewsRecord[] {
  if (index.some((item) => item.id === record.id)) throw new Error("动态 id 已存在");
  return [record, ...index];
}

/** 替换现有动态记录，缺失 id 会直接拒绝。 */
export function replaceNewsInIndex(index: NewsRecord[], record: NewsRecord): NewsRecord[] {
  let found = false;
  const nextIndex = index.map((item) => {
    if (item.id !== record.id) return item;
    found = true;
    return record;
  });
  if (!found) throw new Error("动态不存在");
  return nextIndex;
}

/** 从索引中移除动态，缺失 id 会直接拒绝。 */
export function removeNewsFromIndex(index: NewsRecord[], id: string): NewsRecord[] {
  if (!index.some((item) => item.id === id)) throw new Error("动态不存在");
  return index.filter((item) => item.id !== id);
}

/** 断言请求体为对象字段集合。 */
function assertObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") throw new Error("请求格式无效");
  return value as Record<string, unknown>;
}

/** 读取并限制请求中的必填文本字段。 */
function getRequiredString(fields: Record<string, unknown>, key: string, label: string, maxLength?: number): string {
  const value = fields[key];
  if (typeof value !== "string" || !value.trim() || (maxLength && value.trim().length > maxLength)) {
    throw new Error(`${label}不能为空${maxLength ? `且不能超过 ${maxLength} 个字符` : ""}`);
  }
  return value.trim();
}
