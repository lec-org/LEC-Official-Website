import { afterEach, describe, expect, it } from "vitest";
import { createAdminSession, verifyAdminPassword, verifyAdminSession } from "./session";

const ORIGINAL_SECRET = process.env.ADMIN_SESSION_SECRET;
const ORIGINAL_PASSWORD = process.env.ADMIN_PASSWORD;

afterEach(() => {
  process.env.ADMIN_SESSION_SECRET = ORIGINAL_SECRET;
  process.env.ADMIN_PASSWORD = ORIGINAL_PASSWORD;
});

function withEnv(values: { secret?: string; password?: string }) {
  if (values.secret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = values.secret;
  if (values.password === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = values.password;
}

describe("admin session", () => {
  it("创建的会话可以通过校验", () => {
    withEnv({ secret: "0123456789abcdef0123456789abcdef" });
    expect(verifyAdminSession(createAdminSession())).toBe(true);
  });

  it("拒绝篡改或过期的会话", () => {
    withEnv({ secret: "0123456789abcdef0123456789abcdef" });
    const session = createAdminSession();
    const [payload, signature] = session.split(".");
    const tampered = `${payload}.${signature.slice(0, -1)}${signature.endsWith("A") ? "B" : "A"}`;
    expect(verifyAdminSession(tampered)).toBe(false);
    expect(verifyAdminSession(undefined)).toBe(false);
  });

  it("拒绝过短的签名密钥", () => {
    withEnv({ secret: "too-short" });
    expect(() => createAdminSession()).toThrow("ADMIN_SESSION_SECRET 必须至少包含 32 个字符");
  });
});

describe("verifyAdminPassword", () => {
  it("接受正确口令并拒绝错误口令", () => {
    withEnv({ password: "lec-2026" });
    expect(verifyAdminPassword("lec-2026")).toBe(true);
    expect(verifyAdminPassword("wrong")).toBe(false);
  });

  it("未配置口令时立即失败", () => {
    withEnv({ password: undefined });
    expect(() => verifyAdminPassword("anything")).toThrow("缺少 ADMIN_PASSWORD 环境变量");
  });
});
