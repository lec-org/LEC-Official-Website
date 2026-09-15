import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ContentConflictError, commitRepoJson, NEWS_INDEX_PATH, readRepoJson } from "@/lib/github-content";
import { addNewsToIndex, createNewsId, validateNewsInput, type NewsRecord } from "@/lib/news";
import { verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";
/** 新增团队动态的受保护入口。 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  try {
    const input = validateNewsInput(await request.json());
    const record: NewsRecord = { id: createNewsId(), ...input };
    const { value, sha } = await readRepoJson<NewsRecord>(NEWS_INDEX_PATH);
    const next = addNewsToIndex(value, record);
    const result = await commitRepoJson(NEWS_INDEX_PATH, next, sha, `Add news: ${record.date} ${record.desc.slice(0, 24)}…`);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && /日期|动态内容|请求格式/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("News creation failed", error);
    return NextResponse.json({ error: "保存失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}
