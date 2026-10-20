import { describe, expect, it } from "vitest";
import { AdmissionValidationError, findAdmissionStatus, validateAdmissionQuery } from "./admission";

describe("validateAdmissionQuery", () => {
  it("去除首尾空格并保留学号字符串", () => {
    expect(validateAdmissionQuery({ studentId: " 202600000001 ", name: " 示例学生01 " }))
      .toEqual({ studentId: "202600000001", name: "示例学生01" });
    expect(validateAdmissionQuery({ studentId: "000000000001", name: "张三" }).studentId)
      .toBe("000000000001");
  });

  it.each([null, undefined, [], "invalid", 12, true])("拒绝非对象请求：%j", (input) => {
    expect(() => validateAdmissionQuery(input)).toThrow(AdmissionValidationError);
    expect(() => validateAdmissionQuery(input)).toThrow("请求格式无效");
  });

  it.each([undefined, null, 202600000001, "", "20260000001", "2026000000001", "20260000000a", "２０２６０００００００１", "2026 00000001"])(
    "拒绝非法学号：%j",
    (studentId) => {
      expect(() => validateAdmissionQuery({ studentId, name: "示例学生01" }))
        .toThrow("请输入 12 位数字学号");
    },
  );

  it.each([undefined, null, 123, "", " \t\n "])("拒绝无效姓名：%j", (name) => {
    expect(() => validateAdmissionQuery({ studentId: "202600000001", name }))
      .toThrow("请输入姓名");
  });
});

describe("findAdmissionStatus", () => {
  it.each([
    ["202600000001", "示例学生01", "accepted"],
    ["202600000012", "示例学生12", "accepted"],
    ["202600000013", "示例学生13", "interview_failed"],
    ["202600000024", "示例学生24", "interview_failed"],
    ["202600000025", "示例学生25", "interview_failed"],
    ["202600000036", "示例学生36", "interview_failed"],
  ])("返回 %s 对应的录取状态", (studentId, name, status) => {
    expect(findAdmissionStatus({ studentId, name })).toBe(status);
  });

  it.each([
    { studentId: "202600000037", name: "示例学生37" },
    { studentId: "202600000001", name: "示例学生13" },
    { studentId: "202600000013", name: "示例学生01" },
    { studentId: "202600000001", name: "示例学生" },
    { studentId: "202600000001", name: "示例 学生01" },
  ])("学号和姓名没有同时精确匹配时返回空结果：%j", (query) => {
    expect(findAdmissionStatus(query)).toBeNull();
  });

  it("规范化含首尾空格的请求后可正常匹配", () => {
    const query = validateAdmissionQuery({ studentId: " 202600000001\n", name: "\t示例学生01 " });
    expect(findAdmissionStatus(query)).toBe("accepted");
  });
});
