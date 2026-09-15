import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
/** 管理员 Cookie 内经签名保护的会话载荷。 */
type AdminSessionPayload = { expiresAt: number };

/** 创建可验证、有效期为 24 小时的管理员会话 Cookie 值。 */
export function createAdminSession(): string {
  const payload: AdminSessionPayload = { expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, getSessionSecret())}`;
}

/** 校验管理员会话 Cookie 的签名和到期时间。 */
export function verifyAdminSession(value: string | undefined): boolean {
  if (!value) return false;
  const [encodedPayload, signature, extraPart] = value.split(".");
  if (!encodedPayload || !signature || extraPart) return false;
  try {
    const expectedSignature = sign(encodedPayload, getSessionSecret());
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return false;
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    return typeof payload.expiresAt === "number" && payload.expiresAt > Date.now();
  } catch { return false; }
}

/** 常量时间比较管理员登录口令。 */
export function verifyAdminPassword(password: string): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) throw new Error("缺少 ADMIN_PASSWORD 环境变量");
  const input = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  return input.length === expected.length && timingSafeEqual(input, expected);
}

/** 返回管理员会话使用的签名密钥。 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET 必须至少包含 32 个字符");
  return secret;
}

/** 为 Cookie 载荷创建 HMAC-SHA256 签名。 */
function sign(value: string, secret: string): string { return createHmac("sha256", secret).update(value).digest("base64url"); }
export { SESSION_MAX_AGE_SECONDS };
