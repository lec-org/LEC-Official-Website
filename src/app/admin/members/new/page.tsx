import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MemberBatchForm } from '@/components/admin/member-batch-form'
import { verifyAdminSession } from '@/lib/session'

/** 后台批量新增成员页：可叠加多个表单，统一提交。 */
export default async function NewMemberPage() {
  const cookieStore = await cookies()
  if (!verifyAdminSession(cookieStore.get('admin_session')?.value)) redirect('/admin')
  return (
    <main className="mx-auto max-w-3xl">
      <MemberBatchForm />
    </main>
  )
}
