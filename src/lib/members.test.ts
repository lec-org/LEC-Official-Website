import { describe, expect, it } from "vitest";
import { addMemberToIndex, createMemberId, isValidMemberId, removeMemberFromIndex, replaceMemberInIndex, validateMemberInput, type MemberRecord } from "./members";

const baseMember = { grade: "2025", name: "张三", dest: "软件工程", type: "深造", qq: "123456789" };

describe("validateMemberInput", () => {
  it("接受合法成员并规范化字段", () => {
    const value = validateMemberInput({ ...baseMember, name: " 张三 ", type: "" });
    expect(value).toEqual({ grade: "2025", name: "张三", dest: "软件工程", type: "", qq: "123456789" });
  });

  it("拒绝非对象请求", () => {
    expect(() => validateMemberInput("nope")).toThrow("请求格式无效");
  });

  it("拒绝非 4 位年级", () => {
    expect(() => validateMemberInput({ ...baseMember, grade: "25" })).toThrow("届别必须是 4 位年级数字");
  });

  it("拒绝空姓名与超长姓名", () => {
    expect(() => validateMemberInput({ ...baseMember, name: " " })).toThrow("姓名不能为空");
    expect(() => validateMemberInput({ ...baseMember, name: "一".repeat(31) })).toThrow("姓名不能为空且不能超过 30 个字符");
  });

  it("拒绝空去向", () => {
    expect(() => validateMemberInput({ ...baseMember, dest: "" })).toThrow("去向不能为空");
  });

  it("拒绝未知类型", () => {
    expect(() => validateMemberInput({ ...baseMember, type: "出国" })).toThrow("类型只能是 深造、就业 或留空");
  });

  it("拒绝非法 QQ 号", () => {
    expect(() => validateMemberInput({ ...baseMember, qq: "abc" })).toThrow("QQ 号只能是 5-12 位数字");
  });
});

describe("member index operations", () => {
  const record: MemberRecord = { id: "m-001", ...baseMember };

  it("追加新成员并检测重复 id", () => {
    const next = addMemberToIndex([], record);
    expect(next).toHaveLength(1);
    expect(() => addMemberToIndex(next, record)).toThrow("成员 id 已存在");
  });

  it("替换现有成员并拒绝缺失 id", () => {
    const next = replaceMemberInIndex([record], { ...record, name: "李四" });
    expect(next[0].name).toBe("李四");
    expect(() => replaceMemberInIndex([], { ...record, name: "李四" })).toThrow("成员不存在");
  });

  it("删除现有成员并拒绝缺失 id", () => {
    expect(removeMemberFromIndex([record], "m-001")).toHaveLength(0);
    expect(() => removeMemberFromIndex([], "m-001")).toThrow("成员不存在");
  });

  it("校验 id 格式并生成新 id", () => {
    expect(isValidMemberId("m-001")).toBe(true);
    expect(isValidMemberId("../evil")).toBe(false);
    const id = createMemberId();
    expect(isValidMemberId(id)).toBe(true);
  });
});
