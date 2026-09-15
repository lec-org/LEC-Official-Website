import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ContentConflictError, commitRepoJson, MEMBER_INDEX_PATH, readRepoJson } from "@/lib/github-content";
import { addMemberToIndex, createMemberId, validateMemberInput, type MemberRecord } from "@/lib/members";
import { verifyAdminSession } from "@/lib/session";

export const runtime = "nodejs";
/** 新增往届成员的受保护入口。 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  try {
    const input = validateMemberInput(await request.json());
    const record: MemberRecord = { id: createMemberId(), ...input };
    const { value, sha } = await readRepoJson<MemberRecord>(MEMBER_INDEX_PATH);
    const next = addMemberToIndex(value, record);
    const result = await commitRepoJson(MEMBER_INDEX_PATH, next, sha, `Add member: ${record.grade} ${record.name}`);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ContentConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && /届别|姓名|去向|类型|QQ|请求格式/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Member creation failed", error);
    return NextResponse.json({ error: "保存失败，请检查 GitHub 配置后重试" }, { status: 500 });
  }
}
