'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/** 单条待新增动态的草稿状态。 */
type NewsDraft = { date: string; desc: string }

/** 批量保存 API 的响应体；errors 的键对应过滤后的动态下标。 */
type BatchApiResponse = { error?: string; errors?: Record<string, string> }

const emptyDraft = (): NewsDraft => ({ date: '', desc: '' })

/** 日期与内容均为空时视为未填写的空表单。 */
const isDraftEmpty = (draft: NewsDraft) => !draft.date.trim() && !draft.desc.trim()

const inputClassName =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none'

/** 后台批量新增团队动态：一张页面可叠加多个表单，统一提交为单个 Git 提交。 */
export function NewsBatchForm() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<NewsDraft[]>([emptyDraft()])
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function updateDraft(index: number, patch: Partial<NewsDraft>) {
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
      setMessage('请至少填写一条动态')
      return
    }
    setStatus('submitting')
    setMessage('')
    setErrors({})
    const response = await fetch('/api/news/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news: entries.map(({ draft }) => draft) }),
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
    router.push('/admin/news')
    router.refresh()
  }

  return (
    <form onSubmit={submitAll}>
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/news">
        返回动态管理
      </Link>
      <div className="mb-6 mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">新增动态</h1>
        <button
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={status === 'submitting'}
          type="submit"
        >
          {status === 'submitting'
            ? '保存中...'
            : drafts.length > 1
              ? `新增动态（${drafts.length} 条）`
              : '新增动态'}
        </button>
      </div>

      {drafts.map((draft, index) => (
        <section
          className="mb-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm"
          key={index}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">动态 {index + 1}</h2>
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
          <div className="space-y-3">
            <label className="block text-sm text-gray-700">
              日期
              <input
                className={inputClassName}
                onChange={event => updateDraft(index, { date: event.target.value })}
                required
                type="month"
                value={draft.date}
              />
            </label>
            <label className="block text-sm text-gray-700">
              动态内容
              <textarea
                className={`${inputClassName} min-h-28`}
                maxLength={500}
                onChange={event => updateDraft(index, { desc: event.target.value })}
                required
                value={draft.desc}
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
        点击右上角按钮统一提交，全部动态会以一个 Git 提交写回仓库；表单顺序即首页展示顺序（新动态在前）。
      </p>
    </form>
  )
}
