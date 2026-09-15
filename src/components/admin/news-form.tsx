"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

/** 编辑表单显示和提交动态所需的初始数据。 */
export type NewsFormInitialValues = { id: string; date: string; desc: string };

/** 新建与编辑动态共用表单的输入参数。 */
type NewsFormProps = { mode: "create" | "edit"; initialValues?: NewsFormInitialValues };

/** 动态保存 API 的最小响应体。 */
type NewsApiResponse = { error?: string };

const inputClassName = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none";

/** 管理员用于新增或编辑团队动态的表单。 */
export function NewsForm({ mode, initialValues }: NewsFormProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [desc, setDesc] = useState(initialValues?.desc ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const response = await fetch(mode === "create" ? "/api/news" : `/api/news/${initialValues?.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, desc }),
    });
    const body = (await response.json().catch(() => null)) as NewsApiResponse | null;
    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error || "保存失败");
      return;
    }
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm text-gray-700">
        日期
        <input className={inputClassName} onChange={(event) => setDate(event.target.value)} required type="month" value={date} />
      </label>
      <label className="block text-sm text-gray-700">
        动态内容
        <textarea
          className={`${inputClassName} min-h-28`}
          maxLength={500}
          onChange={(event) => setDesc(event.target.value)}
          placeholder="如：恭喜某某同学获得某某比赛国家二等奖！"
          required
          value={desc}
        />
      </label>
      {status === "error" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>}
      <div className="pt-2">
        <button
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={status === "submitting"}
          type="submit"
        >
          {status === "submitting" ? "保存中..." : mode === "create" ? "新增动态" : "保存修改"}
        </button>
      </div>
    </form>
  );
}
