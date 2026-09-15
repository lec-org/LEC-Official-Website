import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/delete-button";
import { LogoutButton } from "@/components/admin/logout-button";
import { getNews } from "@/lib/collections";
import { verifyAdminSession } from "@/lib/session";

/** 后台团队动态列表：按存储顺序（最新在前）展示全部动态。 */
export default async function AdminNewsPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  const news = await getNews();
  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">团队动态（{news.length}）</h1>
        <div className="flex items-center gap-4">
          <Link className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" href="/admin/news/new">
            新增动态
          </Link>
          <LogoutButton />
        </div>
      </div>
      {news.length === 0 ? (
        <p className="rounded-2xl border border-gray-200/60 bg-white p-6 text-sm text-gray-500 shadow-sm">暂无动态，点击“新增动态”添加第一条。</p>
      ) : (
        <section className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm">
          <ul className="divide-y divide-gray-100">
            {news.map((item) => (
              <li className="flex items-center justify-between gap-3 py-2 text-sm" key={item.id}>
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="flex-shrink-0 font-mono text-xs text-accent">{item.date}</span>
                  <span className="truncate text-gray-700">{item.desc}</span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <Link className="text-gray-500 transition-colors hover:text-accent" href={`/admin/news/${item.id}`}>
                    编辑
                  </Link>
                  <DeleteButton confirmMessage={`确定删除这条 ${item.date} 的动态吗？删除会以提交写回仓库。`} path={`news/${item.id}`} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link className="mt-6 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin">
        返回内容管理
      </Link>
    </main>
  );
}
