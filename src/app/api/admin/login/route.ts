import { NextResponse } from "next/server";
import { createAdminSession, SESSION_MAX_AGE_SECONDS, verifyAdminPassword } from "@/lib/session";

export const runtime = "nodejs";
/** 管理员登录接口接收的 JSON 请求体。 */
type LoginRequest = { password?: unknown };
/** 验证环境变量口令并设置 HttpOnly 管理员会话。 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;
    if (typeof body.password !== "string" || !verifyAdminPassword(body.password)) return NextResponse.json({ error: "口令错误" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: SESSION_MAX_AGE_SECONDS, path: "/" });
    return response;
  } catch (error) {
    console.error("Administrator login failed", error);
    return NextResponse.json({ error: "登录服务配置错误" }, { status: 500 });
  }
}
