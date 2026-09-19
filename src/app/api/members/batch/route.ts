import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  ContentConflictError,
  commitRepoJson,
  MEMBER_INDEX_PATH,
  readRepoJson,
} from '@/lib/github-content'
import {
  addMemberToIndex,
  createMemberId,
  validateMemberInput,
  type MemberInput,
  type MemberRecord,
} from '@/lib/members'
import { verifyAdminSession } from '@/lib/session'

export const runtime = 'nodejs'

/** 批量新增成员：全部校验通过后以单个提交写回仓库。 */
export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (!verifyAdminSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as { members?: unknown }
    if (!Array.isArray(body?.members)) return NextResponse.json({ error: '请求格式无效' }, { status: 400 })
    if (body.members.length === 0) return NextResponse.json({ error: '至少填写一位成员' }, { status: 400 })
    if (body.members.length > 50) return NextResponse.json({ error: '单次最多新增 50 位成员' }, { status: 400 })

    const inputs: MemberInput[] = []
    const errors: Record<number, string> = {}
    body.members.forEach((raw, index) => {
      try {
        inputs.push(validateMemberInput(raw))
      } catch (error) {
        errors[index] = error instanceof Error ? error.message : '格式无效'
      }
    })
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: '部分成员未通过校验，请按提示修改', errors }, { status: 400 })
    }

    const { value, sha } = await readRepoJson<MemberRecord>(MEMBER_INDEX_PATH)
    let next = value
    for (const input of inputs) {
      next = addMemberToIndex(next, { id: createMemberId(), ...input })
    }
    const result = await commitRepoJson(MEMBER_INDEX_PATH, next, sha, `Add members: ${inputs.length} 人`)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Batch member creation failed', error)
    return NextResponse.json({ error: '保存失败，请检查 GitHub 配置后重试' }, { status: 500 })
  }
}
