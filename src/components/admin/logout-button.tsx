"use client";

/** 清除后台会话并刷新页面。 */
export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  return <button className="text-sm text-gray-500 transition-colors hover:text-gray-900" onClick={logout} type="button">退出登录</button>;
}
