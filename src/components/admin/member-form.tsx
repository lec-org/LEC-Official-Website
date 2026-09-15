'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

/** 编辑表单显示和提交成员所需的初始数据。 */
export type MemberFormInitialValues = {
  id: string
  grade: string
  name: string
  dest: string
  type: string
  qq?: string
}

/** 新建与编辑成员共用表单的输入参数。 */
type MemberFormProps = { mode: 'create' | 'edit'; initialValues?: MemberFormInitialValues }

/** 成员保存 API 的最小响应体。 */
type MemberApiResponse = { error?: string }

const inputClassName =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none'

/** 管理员用于新增或编辑往届成员的表单。 */
export function MemberForm({ mode, initialValues }: MemberFormProps) {
  const router = useRouter()
  const [grade, setGrade] = useState(initialValues?.grade ?? '')
  const [name, setName] = useState(initialValues?.name ?? '')
  const [dest, setDest] = useState(initialValues?.dest ?? '')
  const [type, setType] = useState(initialValues?.type ?? '')
  const [qq, setQq] = useState(initialValues?.qq ?? '')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const response = await fetch(
      mode === 'create' ? '/api/members' : `/api/members/${initialValues?.id}`,
      {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, name, dest, type, qq }),
      },
    )
    const body = (await response.json().catch(() => null)) as MemberApiResponse | null
    if (!response.ok) {
      setStatus('error')
      setMessage(body?.error || '保存失败')
      return
    }
    router.push('/admin/members')
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm text-gray-700">
        级别
        <input
          className={inputClassName}
          onChange={event => setGrade(event.target.value)}
          placeholder="如：2026"
          required
          value={grade}
        />
      </label>
      <label className="block text-sm text-gray-700">
        姓名
        <input
          className={inputClassName}
          onChange={event => setName(event.target.value)}
          placeholder="如：20"
          required
          value={name}
        />
      </label>
      <label className="block text-sm text-gray-700">
        专业 / 去向
        <input
          className={inputClassName}
          onChange={event => setDest(event.target.value)}
          placeholder="如：软件工程 / 字节跳动"
          required
          value={dest}
        />
      </label>
      <label className="block text-sm text-gray-700">
        标签
        <select
          className={inputClassName}
          onChange={event => setType(event.target.value)}
          value={type}
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
          onChange={event => setQq(event.target.value)}
          placeholder="5-12 位数字"
          value={qq}
        />
      </label>
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
      )}
      <div className="pt-2">
        <button
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={status === 'submitting'}
          type="submit"
        >
          {status === 'submitting' ? '保存中...' : mode === 'create' ? '新增成员' : '保存修改'}
        </button>
      </div>
    </form>
  )
}
