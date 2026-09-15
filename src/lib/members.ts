import { randomUUID } from "node:crypto";

/** 往届成员条目（前台展示字段）。 */
export interface AlumniMember {
  grade: string
  name: string
  dest: string
  type: string
  qq?: string
}

/** 带稳定 id 的成员记录，对应 public/members/index.json 中的一项。 */
export type MemberRecord = AlumniMember & { id: string };

/** 后台提交的成员字段（已校验）。 */
export type MemberInput = { grade: string; name: string; dest: string; type: string; qq?: string };

const GRADE_PATTERN = /^\d{4}$/;
const QQ_PATTERN = /^\d{5,12}$/;
const MEMBER_ID_PATTERN = /^m-[A-Za-z0-9-]{1,64}$/;
const MEMBER_TYPES = ["", "深造", "就业"];

/** 校验路径中的成员 id。 */
export function isValidMemberId(id: string): boolean {
  return MEMBER_ID_PATTERN.test(id);
}

/** 生成新的成员 id。 */
export function createMemberId(): string {
  return `m-${randomUUID()}`;
}

/** 将未经信任的后台提交转换为合法成员字段。 */
export function validateMemberInput(value: unknown): MemberInput {
  const fields = assertObject(value);
  const grade = getRequiredString(fields, "grade", "届别");
  if (!GRADE_PATTERN.test(grade)) throw new Error("届别必须是 4 位年级数字，如 2025");
  const name = getRequiredString(fields, "name", "姓名", 30);
  const dest = getRequiredString(fields, "dest", "去向", 60);
  const type = getOptionalString(fields.type, "类型", 10) ?? "";
  if (!MEMBER_TYPES.includes(type)) throw new Error("类型只能是 深造、就业 或留空");
  const qq = getOptionalString(fields.qq, "QQ 号", 12);
  if (qq && !QQ_PATTERN.test(qq)) throw new Error("QQ 号只能是 5-12 位数字");
  return { grade, name, dest, type, ...(qq ? { qq } : {}) };
}

/** 将新成员追加到索引尾部，重复 id 会直接拒绝。 */
export function addMemberToIndex(index: MemberRecord[], record: MemberRecord): MemberRecord[] {
  if (index.some((item) => item.id === record.id)) throw new Error("成员 id 已存在");
  return [...index, record];
}

/** 替换现有成员记录，缺失 id 会直接拒绝。 */
export function replaceMemberInIndex(index: MemberRecord[], record: MemberRecord): MemberRecord[] {
  let found = false;
  const nextIndex = index.map((item) => {
    if (item.id !== record.id) return item;
    found = true;
    return record;
  });
  if (!found) throw new Error("成员不存在");
  return nextIndex;
}

/** 从索引中移除成员，缺失 id 会直接拒绝。 */
export function removeMemberFromIndex(index: MemberRecord[], id: string): MemberRecord[] {
  if (!index.some((item) => item.id === id)) throw new Error("成员不存在");
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

/** 读取、清理并限制请求中的可选文本字段。 */
function getOptionalString(value: unknown, label: string, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.trim().length > maxLength) throw new Error(`${label}不能超过 ${maxLength} 个字符`);
  return value.trim() || undefined;
}
