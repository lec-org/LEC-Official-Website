import { afterEach, describe, expect, it, vi } from "vitest";
import * as admission from "../../../lib/admission";
import { POST } from "./route";

/** 构造录取查询接口的 JSON 请求。 */
function createRequest(body: unknown) {
  return new Request("http://localhost/api/admission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => vi.restoreAllMocks());

describe("POST /api/admission", () => {
  it.each([
    ["202600000001", "示例学生01", "accepted"],
    ["202600000013", "示例学生13", "interview_failed"],
    ["202600000025", "示例学生25", "interview_failed"],
  ])("仅返回 %s 的录取状态", async (studentId, name, status) => {
    const response = await POST(createRequest({ studentId, name }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ status });
  });

  it.each([
    { studentId: "202600000037", name: "示例学生37" },
    { studentId: "202600000001", name: "不匹配的姓名" },
  ])("合法但无匹配的查询返回 200 和空结果：%j", async (query) => {
    const response = await POST(createRequest(query));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: null });
  });

  it("在服务端去除学号和姓名首尾空格", async () => {
    const response = await POST(createRequest({ studentId: " 202600000001 ", name: " 示例学生01 " }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "accepted" });
  });

  it.each([
    [null, "请求格式无效"],
    [[], "请求格式无效"],
    ["invalid", "请求格式无效"],
    [{}, "请输入 12 位数字学号"],
    [{ studentId: "123", name: "示例学生01" }, "请输入 12 位数字学号"],
    [{ studentId: 202600000001, name: "示例学生01" }, "请输入 12 位数字学号"],
    [{ studentId: "202600000001", name: " " }, "请输入姓名"],
    [{ studentId: "202600000001" }, "请输入姓名"],
  ])("无效请求返回 400：%j", async (body, error) => {
    const response = await POST(createRequest(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error });
  });

  it("无效 JSON 返回 400", async () => {
    const request = new Request("http://localhost/api/admission", { method: "POST", body: "{" });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "请求格式无效" });
  });

  it("服务异常返回 500，避免误报为无录取信息", async () => {
    vi.spyOn(admission, "findAdmissionStatus").mockImplementationOnce(() => {
      throw new Error("Unexpected lookup failure");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(createRequest({ studentId: "202600000001", name: "示例学生01" }));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "查询失败，请稍后重试" });
  });
});
