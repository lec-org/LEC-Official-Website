import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NewsForm } from "@/components/admin/news-form";
import { verifyAdminSession } from "@/lib/session";

/** 后台新增动态页。 */
export default async function NewNewsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  return (
    <main className="mx-auto max-w-xl">
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/news">
        返回动态管理
      </Link>
      <section className="mt-3 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">新增动态</h1>
        <NewsForm mode="create" />
      </section>
    </main>
  );
}
