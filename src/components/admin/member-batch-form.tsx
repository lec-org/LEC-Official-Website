'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/** 单个待新增成员的草稿状态。 */
type MemberDraft = { grade: string; name: string; dest: string; type: string; qq: string }

/** 批量保存 API 的响应体；errors 的键对应过滤后的成员下标。 */
type BatchApiResponse = { error?: string; errors?: Record<string, string> }

const emptyDraft = (): MemberDraft => ({ grade: '', name: '', dest: '', type: '', qq: '' })

/** 除标签外全部为空时视为未填写的空表单。 */
const isDraftEmpty = (draft: MemberDraft) =>
  !draft.grade.trim() && !draft.name.trim() && !draft.dest.trim() && !draft.qq.trim()

const inputClassName =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none'

/** 后台批量新增成员：一张页面可叠加多个表单，统一提交为单个 Git 提交。 */
export function MemberBatchForm() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<MemberDraft[]>([emptyDraft()])
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function updateDraft(index: number, patch: Partial<MemberDraft>) {
    setDrafts(prev => prev.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)))
  }

  function addDraft() {
    setDrafts(prev => [...prev, emptyDraft()])
  }

  function removeDraft(index: number) {
    setDrafts(prev => prev.filter((_, i) => i !== index))
  }

  async function submitAll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 空白表单直接跳过；记录过滤后下标到原始下标的映射，便于把服务端错误对回具体表单
    const entries = drafts.map((draft, index) => ({ draft, index })).filter(({ draft }) => !isDraftEmpty(draft))
    if (entries.length === 0) {
      setStatus('error')
      setErrors({})
      setMessage('请至少填写一位成员')
      return
    }
    setStatus('submitting')
    setMessage('')
    setErrors({})
    const response = await fetch('/api/members/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members: entries.map(({ draft }) => draft) }),
    })
    const body = (await response.json().catch(() => null)) as BatchApiResponse | null
    if (!response.ok) {
      setStatus('error')
      if (body?.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(body.errors).map(([key, value]) => [entries[Number(key)]?.index ?? key, value]),
          ),
        )
      }
      setMessage(body?.error || '保存失败')
      return
    }
    router.push('/admin/members')
    router.refresh()
  }

  return (
    <form onSubmit={submitAll}>
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/members">
        返回成员管理
      </Link>
      <div className="mb-6 mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">新增成员</h1>
        <button
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={status === 'submitting'}
          type="submit"
        >
          {status === 'submitting'
            ? '保存中...'
            : drafts.length > 1
              ? `新增成员（${drafts.length} 位）`
              : '新增成员'}
        </button>
      </div>

      {drafts.map((draft, index) => (
        <section
          className="mb-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm"
          key={index}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">成员 {index + 1}</h2>
            {drafts.length > 1 && (
              <button
                className="text-sm text-red-500 transition-colors hover:text-red-700"
                onClick={() => removeDraft(index)}
                type="button"
              >
                移除
              </button>
            )}
          </div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <label className="block text-sm text-gray-700">
              级别
              <input
                className={inputClassName}
                onChange={event => updateDraft(index, { grade: event.target.value })}
                placeholder="如：2026"
                required
                value={draft.grade}
              />
            </label>
            <label className="block text-sm text-gray-700">
              姓名
              <input
                className={inputClassName}
                onChange={event => updateDraft(index, { name: event.target.value })}
                required
                value={draft.name}
              />
            </label>
            <label className="block text-sm text-gray-700">
              专业 / 去向
              <input
                className={inputClassName}
                onChange={event => updateDraft(index, { dest: event.target.value })}
                placeholder="如：软件工程 / 字节跳动"
                required
                value={draft.dest}
              />
            </label>
            <label className="block text-sm text-gray-700">
              标签
              <select
                className={inputClassName}
                onChange={event => updateDraft(index, { type: event.target.value })}
                value={draft.type}
              >
                <option value="">无标签</option>
                <option value="深造">深造</option>
                <option value="就业">就业</option>
              </select>
            </label>
            <label className="block text-sm text-gray-700">
              QQ 号（用于头像获取，选填）
              <input
                className={inputClassName}
                onChange={event => updateDraft(index, { qq: event.target.value })}
                placeholder="5-12 位数字"
                value={draft.qq}
              />
            </label>
          </div>
          {errors[index] && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors[index]}</p>
          )}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
              onClick={addDraft}
              type="button"
            >
              ＋ 继续新增
            </button>
          </div>
        </section>
      ))}

      {status === 'error' && message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
      )}
      <p className="mt-2 text-sm text-gray-400">
        点击右上角按钮统一提交，全部成员会以一个 Git 提交写回仓库。
      </p>
    </form>
  )
}
