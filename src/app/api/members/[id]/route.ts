import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ContentConflictError, commitRepoJson, MEMBER_INDEX_PATH, readRepoJson } from "@/lib/github-content";
import { isValidMemberId, removeMemberFromIndex, replaceMemberInIndex, validateMemberInput, type MemberRecord } from "@/lib/members";
import { verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";
/** 成员更新接口接收的路径参数。 */
type MemberRouteContext = { params: Promise<{ id: string }> };
/** 更新现有往届成员的受保护 API。 */
export async function PUT(request: Request, { params }: MemberRouteContext) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await params;
  if (!isValidMemberId(id)) return NextResponse.json({ error: "无效成员地址" }, { status: 400 });
  try {
    const input = validateMemberInput(await request.json());
    const { value, sha } = await readRepoJson<MemberRecord>(MEMBER_INDEX_PATH);
    const next = replaceMemberInIndex(value, { id, ...input });
    const result = await commitRepoJson(MEMBER_INDEX_PATH, next, sha, `Update member: ${id}`);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "成员不存在") return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof Error && /届别|姓名|去向|类型|QQ|请求格式/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Member update failed", error);
    return NextResponse.json({ error: "保存失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}

/** 删除现有往届成员的受保护 API。 */
export async function DELETE(_request: Request, { params }: MemberRouteContext) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await params;
  if (!isValidMemberId(id)) return NextResponse.json({ error: "无效成员地址" }, { status: 400 });
  try {
    const { value, sha } = await readRepoJson<MemberRecord>(MEMBER_INDEX_PATH);
    const next = removeMemberFromIndex(value, id);
    const result = await commitRepoJson(MEMBER_INDEX_PATH, next, sha, `Delete member: ${id}`);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message === "成员不存在") return NextResponse.json({ error: error.message }, { status: 404 });
    console.error("Member deletion failed", error);
    return NextResponse.json({ error: "删除失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}
