import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { MemberForm } from "@/components/admin/member-form";
import { getMembers } from "@/lib/collections";
import { verifyAdminSession } from "@/lib/session";

/** 后台编辑成员页接收的路径参数。 */
type EditMemberPageProps = { params: Promise<{ id: string }> };

/** 后台编辑成员页：按 id 加载现有成员并进入编辑表单。 */
export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  const { id } = await params;
  const members = await getMembers();
  const member = members.find((m) => m.id === id);
  if (!member) notFound();
  return (
    <main className="mx-auto max-w-xl">
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/members">
        返回成员管理
      </Link>
      <section className="mt-3 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">编辑成员（{member.id}）</h1>
        <MemberForm initialValues={member} mode="edit" />
      </section>
    </main>
  );
}
