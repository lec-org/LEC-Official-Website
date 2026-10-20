"use client";

import { useEffect, useRef } from "react";
import type confetti from "canvas-confetti";
import styles from "./admission-screen.module.css";

/** 有效录取查询开始时预先下载礼花库，避免占用首屏加载。 */
export function preloadAdmissionConfetti() {
  return import("canvas-confetti");
}

/** 录取成功页出现时，从屏幕左右下角各向中央发射一簇礼花。 */
export function AdmissionCelebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame: number | undefined;
    let launch: confetti.CreateTypes | undefined;

    void preloadAdmissionConfetti().then(({ default: confetti }) => {
      if (cancelled) return;
      launch = confetti.create(canvas, { resize: true, disableForReducedMotion: true });
      frame = requestAnimationFrame(() => {
        const { width, height } = canvas.getBoundingClientRect();
        const compact = width < 640;
        const options: confetti.Options = {
          particleCount: compact ? 85 : 130,
          spread: 50,
          startVelocity: Math.min(100, Math.max(42, width * 0.08 + height * 0.017)),
          decay: 0.92,
          gravity: 1.05,
          ticks: 200,
          scalar: compact ? 1.1 : 1.3,
          colors: ["#2563eb", "#42a5f5", "#93c5fd", "#fbbf24", "#f472b6", "#34d399"],
        };

        void launch?.({ ...options, angle: 65, origin: { x: 0.02, y: 0.99 } });
        void launch?.({ ...options, angle: 115, origin: { x: 0.98, y: 0.99 } });
      });
    }).catch(() => {
      // 礼花下载失败不影响录取结果和页面交互。
    });

    return () => {
      cancelled = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      launch?.reset();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.celebration} aria-hidden="true" />;
}
