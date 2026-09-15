import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MemberForm } from "@/components/admin/member-form";
import { verifyAdminSession } from "@/lib/session";

/** 后台新增成员页。 */
export default async function NewMemberPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  return (
    <main className="mx-auto max-w-xl">
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/members">
        返回成员管理
      </Link>
      <section className="mt-3 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">新增成员</h1>
        <MemberForm mode="create" />
      </section>
    </main>
  );
}
