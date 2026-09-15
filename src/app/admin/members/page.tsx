import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/delete-button";
import { LogoutButton } from "@/components/admin/logout-button";
import { getMembers } from "@/lib/collections";
import { verifyAdminSession } from "@/lib/session";

/** 后台成员列表：按届分组展示全部成员。 */
export default async function AdminMembersPage() {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get("admin_session")?.value)) redirect("/admin");
  const members = await getMembers();
  const grades = [...new Set(members.map((m) => m.grade))].sort((a, b) => b.localeCompare(a));
  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">往届成员（{members.length}）</h1>
        <div className="flex items-center gap-4">
          <Link className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" href="/admin/members/new">
            新增成员
          </Link>
          <LogoutButton />
        </div>
      </div>
      {grades.length === 0 ? (
        <p className="rounded-2xl border border-gray-200/60 bg-white p-6 text-sm text-gray-500 shadow-sm">暂无成员，点击“新增成员”添加第一位。</p>
      ) : (
        <div className="space-y-6">
          {grades.map((grade) => (
            <section key={grade} className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm">
              <h2 className="mb-2 font-semibold text-gray-900">{grade} 级</h2>
              <ul className="divide-y divide-gray-100">
                {members.filter((m) => m.grade === grade).map((m) => (
                  <li className="flex items-center justify-between gap-3 py-2 text-sm" key={m.id}>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900">{m.name}</span>
                      <span className="ml-2 text-gray-500">{m.dest}</span>
                      {m.type && (
                        <span className={`ml-2 rounded px-1 text-xs ${m.type === "深造" ? "bg-violet-500/10 text-violet-500" : "bg-accent/10 text-accent"}`}>
                          {m.type}
                        </span>
                      )}
                      {m.qq && <span className="ml-2 text-gray-400">QQ {m.qq}</span>}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <Link className="text-gray-500 transition-colors hover:text-accent" href={`/admin/members/${m.id}`}>
                        编辑
                      </Link>
                      <DeleteButton confirmMessage={`确定删除成员「${m.name}」吗？删除会以提交写回仓库。`} path={`members/${m.id}`} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <Link className="mt-6 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900" href="/admin">
        返回内容管理
      </Link>
    </main>
  );
}
