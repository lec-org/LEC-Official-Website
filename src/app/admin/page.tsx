import Link from "next/link";
import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { getMembers, getNews } from "@/lib/collections";
import { verifyAdminSession } from "@/lib/session";

/** 后台首页：未登录时内联登录表单，已登录展示两个集合的管理入口。 */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = verifyAdminSession(cookieStore.get("admin_session")?.value);
  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-sm">
        <section className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-xl font-bold text-gray-900">管理员登录</h1>
          <AdminLoginForm />
        </section>
      </main>
    );
  }
  const [members, news] = await Promise.all([getMembers(), getNews()]);
  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
        <LogoutButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link className="group rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm transition-colors hover:border-accent" href="/admin/members">
          <div className="text-3xl font-bold text-accent">{members.length}</div>
          <div className="mt-1 font-semibold text-gray-900 group-hover:text-accent">往届成员</div>
          <div className="mt-1 text-sm text-gray-500">维护成员名单、去向与 QQ 头像</div>
        </Link>
        <Link className="group rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm transition-colors hover:border-accent" href="/admin/news">
          <div className="text-3xl font-bold text-accent">{news.length}</div>
          <div className="mt-1 font-semibold text-gray-900 group-hover:text-accent">团队动态</div>
          <div className="mt-1 text-sm text-gray-500">维护首页时间线的动态内容</div>
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-400">保存会以 Git 提交写回仓库，部署平台自动重新构建后生效。</p>
    </main>
  );
}
