"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Verify, ChatSquareCode } from "reicon-react";
import { findAdmissionStatus, type AdmissionStatus } from "@/lib/admission";
import { AdmissionCelebration, preloadAdmissionConfetti } from "./admission-celebration";
import { AdmissionTransition, type AdmissionTransitionPhase } from "./admission-transition";
import styles from "./admission-screen.module.css";

/** 录取查询表单的初始、提交、结果和错误状态。 */
type QueryState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "result"; status: AdmissionStatus }
  | { kind: "error"; message: string; field?: "studentId" | "name" };

/** 本地匹配后暂存的查询结果，在转场覆盖页面时统一展示。 */
type QueryOutcome = Extract<QueryState, { kind: "result" | "error" }>;

const resultContent = {
  accepted: {
    title: "成功录取",
    ambient: "WELCOME",
  },
  interview_failed: {
    title: "未录取",
    ambient: "ONWARD",
  },
};

/** 在不可滚动的整屏内切换学生身份表单和录取查询结果。 */
export function AdmissionScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [queryState, setQueryState] = useState<QueryState>({ kind: "idle" });
  const [transitionPhase, setTransitionPhase] = useState<AdmissionTransitionPhase | null>(null);
  const studentIdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  const pendingOutcomeRef = useRef<QueryOutcome | null>(null);
  const transitionLockRef = useRef(false);
  const isSubmitting = queryState.kind === "submitting" || transitionPhase !== null;
  const result = queryState.kind === "result" ? resultContent[queryState.status] : null;

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    let layoutWidth = window.innerWidth;
    screen.style.setProperty("--admission-height", `${screen.clientHeight}px`);

    function updateLayout() {
      if (!screen) return;
      const width = window.innerWidth;
      // 手机键盘和地址栏只改变高度时，保留原有布局；旋转屏幕后才重新计算。
      if (window.matchMedia("(pointer: coarse)").matches && width === layoutWidth) return;
      if (document.activeElement instanceof HTMLInputElement) return;
      layoutWidth = width;
      screen.style.removeProperty("--admission-height");
      screen.style.setProperty("--admission-height", `${screen.clientHeight}px`);
    }

    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    if (queryState.kind === "result" && transitionPhase === null) {
      resultTitleRef.current?.focus({ preventScroll: true });
    }
  }, [queryState.kind, transitionPhase]);

  function revealOutcome() {
    if (!pendingOutcomeRef.current) return;
    setQueryState(pendingOutcomeRef.current);
    pendingOutcomeRef.current = null;
    setTransitionPhase("revealing");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || transitionLockRef.current) return;

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
    transitionLockRef.current = true;
    setQueryState({ kind: "submitting" });
    setTransitionPhase("covering");

    try {
      const status = findAdmissionStatus(query);
      if (status === null) {
        pendingOutcomeRef.current = { kind: "error", message: "未查询到信息，请确认填写无误" };
      } else {
        pendingOutcomeRef.current = { kind: "result", status };
        if (status === "accepted" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          void preloadAdmissionConfetti().catch(() => {
            // 转场继续播放，礼花加载失败不影响查询结果。
          });
        }
      }
    } catch {
      pendingOutcomeRef.current = { kind: "error", message: "查询失败，请稍后重试" };
    }
  }

  const studentIdInvalid = queryState.kind === "error" && queryState.field === "studentId";
  const nameInvalid = queryState.kind === "error" && queryState.field === "name";
  const inputClassName = `${styles.input} w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 aria-invalid:border-red-400`;

  return (
    <div ref={screenRef} className={styles.screen} aria-busy={isSubmitting}>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isSubmitting ? "正在查询录取信息" : queryState.kind === "error" ? queryState.message : ""}
      </div>
      <div className={styles.pageContent} inert={isSubmitting}>
        <div aria-hidden="true" className={`${styles.ambient} font-bebas`}>{result?.ambient ?? "ADMISSION"}</div>
        <header className={styles.header}>
          <span className="font-bebas text-2xl tracking-widest text-gray-800">LEC<span className="text-accent">.</span></span>
          <Link href="/" prefetch={false} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <span aria-hidden="true">←</span>
            返回官网
          </Link>
        </header>

        {result ? (
          <main className={`${styles.resultMain} ${styles.letterResult}`} aria-labelledby="admission-result-title">
            <div className={styles.resultContent}>
              <div aria-hidden="true" className={styles.resultMark}>
                {queryState.kind === "result" && queryState.status === "accepted" ? (
                  <Verify size={85} />
                ) : (
                  <ChatSquareCode size={65} />
                )}
              </div>
              <p className={styles.resultEyebrow}>2026 · 乐程软件工作室</p>
              <h1 ref={resultTitleRef} id="admission-result-title" tabIndex={-1} aria-describedby="admission-result-description" className={styles.resultTitle}>
                {result.title}
              </h1>
              {queryState.kind === "result" && queryState.status === "accepted" ? (
                <div id="admission-result-description" className={styles.invitation}>
                  <p className={styles.salutation}><span className={styles.studentName}>{name}</span> 同学：</p>
                  <p>恭喜你通过面试！</p>
                  <p>我们一直关注着你在招新期间的出色表现，现在，乐程软件工作室正式向你发出邀请——</p>
                  <p className={styles.invitationHighlight}>加入我们，一起用代码创造世界！</p>
                  <div className={styles.signature}>
                    <p><time dateTime="2026-10-24">2026.10.24</time></p>
                    <p>乐程软件工作室</p>
                  </div>
                </div>
              ) : (
                <div id="admission-result-description" className={styles.invitation}>
                  <p className={styles.salutation}><span className={styles.studentName}>{name}</span> 同学：</p>
                  <p>感谢你参加本次招新！</p>
                  <p>我们一直关注着你的表现，看到了你的认真与努力。但遗憾的是，经过综合评定，这一次我们未能为你留出一个名额。</p>
                  <p>希望你不要气馁，在热爱的领域继续闪闪发光。</p>
                  <div className={styles.signature}>
                    <p><time dateTime="2026-10-24">2026.10.24</time></p>
                    <p>乐程软件工作室</p>
                  </div>
                </div>
              )}
              <button
                type="button"
                className={`${styles.queryAgain} rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`}
                onClick={() => {
                  setQueryState({ kind: "idle" });
                  if (window.matchMedia("(min-width: 768px)").matches) {
                    requestAnimationFrame(() => studentIdRef.current?.focus({ preventScroll: true }));
                  }
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
              <h1 className={styles.title}>招新录取<span>结果查询</span></h1>
              <p className={`${styles.studio} font-misans-light`}>乐程软件工作室</p>
            </div>

            <div className={`${styles.panel} rounded-3xl border border-gray-200/80 bg-white shadow-[0_16px_64px_-32px_rgba(15,23,42,0.18)]`}>
              <form aria-busy={isSubmitting} noValidate onSubmit={submit}>
                <fieldset disabled={isSubmitting} className={styles.fields}>
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
                    className={`${styles.submit} group flex w-full items-center justify-center gap-3 rounded-xl bg-accent px-5 text-sm font-medium tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60`}
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
              <div id="admission-message">
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
      {queryState.kind === "result" && queryState.status === "accepted" && transitionPhase === null && (
        <AdmissionCelebration />
      )}
      {transitionPhase && (
        <AdmissionTransition
          phase={transitionPhase}
          onCovered={() => setTransitionPhase("code")}
          onCodeComplete={revealOutcome}
          onRevealed={() => {
            transitionLockRef.current = false;
            setTransitionPhase(null);
          }}
        />
      )}
    </div>
  );
}
