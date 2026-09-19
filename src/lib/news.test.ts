import { describe, expect, it } from "vitest";
import { addNewsToIndex, createNewsId, isValidNewsId, removeNewsFromIndex, replaceNewsInIndex, sortNewsByDateDesc, validateNewsInput, type NewsRecord } from "./news";

const baseNews = { date: "2026-09", desc: "恭喜张三获得国赛一等奖！" };

describe("validateNewsInput", () => {
  it("接受合法动态", () => {
    expect(validateNewsInput(baseNews)).toEqual(baseNews);
  });

  it("拒绝非对象请求", () => {
    expect(() => validateNewsInput(null)).toThrow("请求格式无效");
  });

  it("拒绝非 YYYY-MM 日期", () => {
    expect(() => validateNewsInput({ date: "2026-9", desc: "内容" })).toThrow("日期格式必须是 YYYY-MM");
    expect(() => validateNewsInput({ date: "2026-13", desc: "内容" })).toThrow("日期格式必须是 YYYY-MM");
  });

  it("拒绝空内容", () => {
    expect(() => validateNewsInput({ date: "2026-09", desc: "" })).toThrow("动态内容不能为空");
  });
});

describe("news index operations", () => {
  const record: NewsRecord = { id: "n-001", ...baseNews };

  it("新动态插入头部并检测重复 id", () => {
    const next = addNewsToIndex([], record);
    expect(next).toHaveLength(1);
    expect(() => addNewsToIndex(next, record)).toThrow("动态 id 已存在");
  });

  it("替换现有动态并拒绝缺失 id", () => {
    const next = replaceNewsInIndex([record], { ...record, desc: "更新后" });
    expect(next[0].desc).toBe("更新后");
    expect(() => replaceNewsInIndex([], { ...record, desc: "更新后" })).toThrow("动态不存在");
  });

  it("删除现有动态并拒绝缺失 id", () => {
    expect(removeNewsFromIndex([record], "n-001")).toHaveLength(0);
    expect(() => removeNewsFromIndex([], "n-001")).toThrow("动态不存在");
  });

  it("校验 id 格式并生成新 id", () => {
    expect(isValidNewsId("n-001")).toBe(true);
    expect(isValidNewsId("../evil")).toBe(false);
    expect(isValidNewsId(createNewsId())).toBe(true);
  });
});

describe("sortNewsByDateDesc", () => {
  const record = (id: string, date: string): NewsRecord => ({ id, date, desc: id });

  it("跨月条目按日期降序排列", () => {
    const sorted = sortNewsByDateDesc([record("a", "2025-01"), record("b", "2026-09"), record("c", "2025-12")]);
    expect(sorted.map((item) => item.id)).toEqual(["b", "c", "a"]);
  });

  it("同月条目保持原有相对顺序（稳定排序）", () => {
    const sorted = sortNewsByDateDesc([record("a", "2026-08"), record("b", "2026-07"), record("c", "2026-08")]);
    expect(sorted.map((item) => item.id)).toEqual(["a", "c", "b"]);
  });

  it("兼容未补零的 YYYY-M 日期，非法日期排最后", () => {
    const sorted = sortNewsByDateDesc([record("a", "2020-8"), record("b", "2020-10"), record("c", "2020-12"), record("d", "bad")]);
    expect(sorted.map((item) => item.id)).toEqual(["c", "b", "a", "d"]);
  });

  it("不改变传入数组", () => {
    const original = [record("a", "2025-01"), record("b", "2026-09")];
    sortNewsByDateDesc(original);
    expect(original.map((item) => item.id)).toEqual(["a", "b"]);
  });
});
