import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  ContentConflictError,
  commitRepoJson,
  NEWS_INDEX_PATH,
  readRepoJson,
} from '@/lib/github-content'
import {
  createNewsId,
  validateNewsInput,
  type NewsInput,
  type NewsRecord,
} from '@/lib/news'
import { verifyAdminSession } from '@/lib/session'

export const runtime = 'nodejs'

/** 批量新增团队动态：全部校验通过后以单个提交写回仓库，整批按表单顺序插入列表头部。 */
export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (!verifyAdminSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as { news?: unknown }
    if (!Array.isArray(body?.news)) return NextResponse.json({ error: '请求格式无效' }, { status: 400 })
    if (body.news.length === 0) return NextResponse.json({ error: '至少填写一条动态' }, { status: 400 })
    if (body.news.length > 50) return NextResponse.json({ error: '单次最多新增 50 条动态' }, { status: 400 })

    const inputs: NewsInput[] = []
    const errors: Record<number, string> = {}
    body.news.forEach((raw, index) => {
      try {
        inputs.push(validateNewsInput(raw))
      } catch (error) {
        errors[index] = error instanceof Error ? error.message : '格式无效'
      }
    })
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: '部分动态未通过校验，请按提示修改', errors }, { status: 400 })
    }

    const { value, sha } = await readRepoJson<NewsRecord>(NEWS_INDEX_PATH)
    const records: NewsRecord[] = inputs.map(input => ({ id: createNewsId(), ...input }))
    const next = [...records, ...value]
    const result = await commitRepoJson(NEWS_INDEX_PATH, next, sha, `Add news: ${inputs.length} 条`)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Batch news creation failed', error)
    return NextResponse.json({ error: '保存失败，请检查 GitHub 配置后重试' }, { status: 500 })
  }
}
