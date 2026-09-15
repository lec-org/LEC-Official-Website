import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ContentConflictError, commitRepoJson, NEWS_INDEX_PATH, readRepoJson } from "@/lib/github-content";
import { isValidNewsId, removeNewsFromIndex, replaceNewsInIndex, validateNewsInput, type NewsRecord } from "@/lib/news";
import { verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";
/** 动态更新接口接收的路径参数。 */
type NewsRouteContext = { params: Promise<{ id: string }> };
/** 更新现有团队动态的受保护 API。 */
export async function PUT(request: Request, { params }: NewsRouteContext) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await params;
  if (!isValidNewsId(id)) return NextResponse.json({ error: "无效动态地址" }, { status: 400 });
  try {
    const input = validateNewsInput(await request.json());
    const { value, sha } = await readRepoJson<NewsRecord>(NEWS_INDEX_PATH);
    const next = replaceNewsInIndex(value, { id, ...input });
    const result = await commitRepoJson(NEWS_INDEX_PATH, next, sha, `Update news: ${id}`);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "动态不存在") return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof Error && /日期|动态内容|请求格式/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("News update failed", error);
    return NextResponse.json({ error: "保存失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}

/** 删除现有团队动态的受保护 API。 */
export async function DELETE(_request: Request, { params }: NewsRouteContext) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await params;
  if (!isValidNewsId(id)) return NextResponse.json({ error: "无效动态地址" }, { status: 400 });
  try {
    const { value, sha } = await readRepoJson<NewsRecord>(NEWS_INDEX_PATH);
    const next = removeNewsFromIndex(value, id);
    const result = await commitRepoJson(NEWS_INDEX_PATH, next, sha, `Delete news: ${id}`);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "动态不存在") return NextResponse.json({ error: error.message }, { status: 404 });
    console.error("News deletion failed", error);
    return NextResponse.json({ error: "删除失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}
