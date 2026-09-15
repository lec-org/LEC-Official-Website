import { NextResponse } from "next/server";
/** 清除当前浏览器中的管理员会话。 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", { httpOnly: true, maxAge: 0, path: "/", sameSite: "strict" });
  return response;
}
