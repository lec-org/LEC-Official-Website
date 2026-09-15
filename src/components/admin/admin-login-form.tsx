"use client";
import { FormEvent, useState } from "react";

/** 管理员登录表单的交互状态。 */
type LoginState = "idle" | "submitting" | "error";

/** 后台登录表单：口令校验通过后刷新页面进入管理面板。 */
export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) { window.location.reload(); return; }
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setState("error");
    setMessage(body?.error || "登录失败");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm text-gray-700">
        管理口令
        <input
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      {state === "error" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>}
      <button
        className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
