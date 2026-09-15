"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** 删除按钮的输入参数：path 为 /api 下的资源路径。 */
type DeleteButtonProps = { path: string; confirmMessage: string };

/** 删除 API 的最小错误响应。 */
type DeleteResponse = { error?: string };

/** 确认后删除指定后台资源并刷新列表。 */
export function DeleteButton({ path, confirmMessage }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(confirmMessage)) return;
    setDeleting(true);
    setError("");
    const response = await fetch(`/api/${path}`, { method: "DELETE" });
    const body = (await response.json().catch(() => null)) as DeleteResponse | null;
    if (!response.ok) {
      setDeleting(false);
      setError(body?.error || "删除失败");
      return;
    }
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button className="text-sm text-red-500 transition-colors hover:text-red-700 disabled:opacity-50" disabled={deleting} onClick={remove} type="button">
        {deleting ? "删除中..." : "删除"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </span>
  );
}
