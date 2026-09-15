import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NewsForm } from "@/components/admin/news-form";
import { getNews } from "@/lib/collections";
import { verifyAdminSession } from "@/lib/session";

/** 后台编辑动态页接收的路径参数。 */
type EditNewsPageProps = { params: Promise<{ id: string }> };

/** 后台编辑动态页：按 id 加载现有动态并进入编辑表单。 */
export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  const { id } = await params;
  const news = await getNews();
  const item = news.find((n) => n.id === id);
  if (!item) notFound();
  return (
    <main className="mx-auto max-w-xl">
      <Link className="text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin/news">
        返回动态管理
      </Link>
      <section className="mt-3 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">编辑动态（{item.id}）</h1>
        <NewsForm initialValues={item} mode="edit" />
      </section>
    </main>
  );
}
