import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NewsBatchForm } from '@/components/admin/news-batch-form'
import { verifyAdminSession } from '@/lib/session'

/** 后台批量新增动态页：可叠加多个表单，统一提交。 */
export default async function NewNewsPage() {
  const cookieStore = await cookies()
  if (!verifyAdminSession(cookieStore.get('admin_session')?.value)) redirect('/admin')
  return (
    <main className="mx-auto max-w-3xl">
      <NewsBatchForm />
    </main>
  )
}
