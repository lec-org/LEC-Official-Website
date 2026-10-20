"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { AdmissionStatus } from "@/lib/admission";
import styles from "./admission-screen.module.css";

/** 录取查询表单的初始、提交、结果和错误状态。 */
type QueryState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "result"; status: AdmissionStatus }
  | { kind: "error"; message: string; field?: "studentId" | "name" };

const resultContent = {
  accepted: {
    title: "录取成功",
    description: "欢迎加入乐程软件工作室，一起用代码创造世界。",
    ambient: "WELCOME",
  },
  interview_failed: {
    title: "未通过面试",
    description: "感谢你参与本次招新，期待未来与你再次相遇。",
    ambient: "ONWARD",
  },
};

/** 在不可滚动的整屏内切换学生身份表单和录取查询结果。 */
export function AdmissionScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [queryState, setQueryState] = useState<QueryState>({ kind: "idle" });
  const studentIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  const isSubmitting = queryState.kind === "submitting";
  const result = queryState.kind === "result" ? resultContent[queryState.status] : null;

  useEffect(() => {
    const viewport = window.visualViewport;
    const screen = screenRef.current;
    if (!viewport || !screen) return;

    // 软键盘弹出时跟随可视区域缩小，保持输入框和提交按钮可见。
    function updateViewport() {
      if (!viewport || !screen) return;
      screen.style.height = `${viewport.height}px`;
      screen.style.top = `${viewport.offsetTop}px`;
    }

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (queryState.kind === "result") resultTitleRef.current?.focus({ preventScroll: true });
  }, [queryState.kind]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const query = { studentId: studentId.trim(), name: name.trim() };
    setStudentId(query.studentId);
    setName(query.name);

    if (!/^[0-9]{12}$/.test(query.studentId)) {
      setQueryState({ kind: "error", message: "请输入 12 位数字学号", field: "studentId" });
      studentIdRef.current?.focus();
      return;
    }
    if (!query.name) {
      setQueryState({ kind: "error", message: "请输入姓名", field: "name" });
      nameRef.current?.focus();
      return;
    }

    studentIdRef.current?.blur();
    nameRef.current?.blur();
    setQueryState({ kind: "submitting" });

    try {
      const response = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const body: unknown = await response.json();

      if (response.status === 400 && typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
        setQueryState({ kind: "error", message: body.error });
        return;
      }
      if (!response.ok || typeof body !== "object" || body === null || !("status" in body)) {
        throw new Error("Invalid admission response");
      }
      if (body.status === null) {
        setQueryState({ kind: "error", message: "未查询到信息，请确认填写无误" });
        return;
      }
      if (body.status !== "accepted" && body.status !== "interview_failed") {
        throw new Error("Invalid admission status");
      }

      setQueryState({ kind: "result", status: body.status });
    } catch {
      setQueryState({ kind: "error", message: "查询失败，请稍后重试" });
    }
  }

  const studentIdInvalid = queryState.kind === "error" && queryState.field === "studentId";
  const nameInvalid = queryState.kind === "error" && queryState.field === "name";
  const inputClassName = `${styles.input} w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 aria-invalid:border-red-400`;

  return (
    <div ref={screenRef} className={styles.screen}>
      <div aria-hidden="true" className={`${styles.ambient} font-bebas`}>{result?.ambient ?? "ADMISSION"}</div>
      <header className={styles.header}>
        <span className="font-bebas text-2xl tracking-widest text-gray-800">LEC<span className="text-accent">.</span></span>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
          <span aria-hidden="true">←</span>
          返回首页
        </Link>
      </header>

      {result ? (
        <main className={styles.resultMain} aria-labelledby="admission-result-title">
          <div className={styles.resultContent}>
            <div aria-hidden="true" className={styles.resultMark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-9">
                {queryState.kind === "result" && queryState.status === "accepted" ? (
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <><circle cx="12" cy="12" r="8" /><path d="M12 11v5m0-9v.5" strokeLinecap="round" /></>
                )}
              </svg>
            </div>
            <p className={styles.resultEyebrow}>2026 · 查询结果</p>
            <h1 ref={resultTitleRef} id="admission-result-title" tabIndex={-1} aria-describedby="admission-result-description" className={styles.resultTitle}>
              {result.title}
            </h1>
            <p id="admission-result-description" className={styles.resultDescription}>{result.description}</p>
            <button
              type="button"
              className={`${styles.queryAgain} rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`}
              onClick={() => {
                setQueryState({ kind: "idle" });
                requestAnimationFrame(() => studentIdRef.current?.focus({ preventScroll: true }));
              }}
            >
              重新查询
            </button>
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <div className={styles.intro}>
            <div className={styles.eyebrow}><span aria-hidden="true" />2026 · ADMISSION</div>
            <h1 className={styles.title}>招新录取<span>信息查询</span></h1>
            <p className={`${styles.studio} font-misans-light`}>乐程软件工作室</p>
          </div>

          <div className={`${styles.panel} rounded-3xl border border-gray-200/80 bg-white shadow-[0_16px_64px_-32px_rgba(15,23,42,0.18)]`}>
            <form aria-busy={isSubmitting} noValidate onSubmit={submit}>
              <fieldset disabled={isSubmitting} className={`${styles.fields} disabled:opacity-60`}>
                <legend className="sr-only">录取信息查询</legend>
                <div>
                  <label htmlFor="admission-student-id" className="flex items-center justify-between text-sm font-medium text-gray-800">
                    学号
                    <span className="font-misans-light text-xs font-normal text-gray-500">12 位数字</span>
                  </label>
                  <input
                    ref={studentIdRef}
                    id="admission-student-id"
                    name="studentId"
                    type="text"
                    inputMode="numeric"
                    enterKeyHint="next"
                    autoComplete="off"
                    spellCheck={false}
                    pattern="[0-9]{12}"
                    required
                    placeholder="请输入 12 位学号"
                    className={inputClassName}
                    aria-invalid={studentIdInvalid}
                    aria-describedby={studentIdInvalid ? "admission-message" : undefined}
                    value={studentId}
                    onChange={(event) => {
                      setStudentId(event.target.value);
                      setQueryState({ kind: "idle" });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="admission-name" className="text-sm font-medium text-gray-800">姓名</label>
                  <input
                    ref={nameRef}
                    id="admission-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="search"
                    required
                    placeholder="请输入姓名"
                    className={inputClassName}
                    aria-invalid={nameInvalid}
                    aria-describedby={nameInvalid ? "admission-message" : undefined}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setQueryState({ kind: "idle" });
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className={`${styles.submit} group flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 text-sm font-medium tracking-widest text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-wait`}
                >
                  {isSubmitting ? "查询中…" : "查询"}
                  {isSubmitting ? (
                    <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      <path d="M4 12h16m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </fieldset>
            </form>
            <div id="admission-message" role="status" aria-live="polite" aria-atomic="true">
              {isSubmitting && <p className="sr-only">正在查询录取信息</p>}
              {queryState.kind === "error" && (
                <p className={`${styles.message} text-sm leading-relaxed text-red-700`}>
                  {queryState.message}
                </p>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
