import type { CSSProperties } from 'react'
import styles from './admission-screen.module.css'

/** 查询转场依次经历的蓝色覆盖、源码展示和结果揭示阶段。 */
export type AdmissionTransitionPhase = 'covering' | 'code' | 'revealing'

/** 由查询页控制的转场阶段及各段动画完成回调。 */
type AdmissionTransitionProps = {
  phase: AdmissionTransitionPhase
  onCovered: () => void
  onCodeComplete: () => void
  onRevealed: () => void
}

const sourceLines = [
  '<main class="admission">',
  '  <header>',
  '    <span>LEC · 2026</span>',
  '    <p>乐程软件工作室</p>',
  '  </header>',
  '  <section',
  '    class="query-result"',
  '    aria-live="polite"',
  '  >',
  '    <div class="status">',
  '      <h1></h1>',
  '      <p>数据请求中...</p>',
  '    </div>',
  '    <button type="button">',
  '      重新查询',
  '    </button>',
  '  </section>',
  '  <footer>',
  '    <a href="/">返回官网</a>',
  '  </footer>',
  '</main>',
]

/** 以整屏蓝色和逐行白色源码衔接查询表单与最终结果。 */
export function AdmissionTransition({
  phase,
  onCovered,
  onCodeComplete,
  onRevealed,
}: AdmissionTransitionProps) {
  return (
    <div
      className={styles.transition}
      data-phase={phase}
      aria-hidden="true"
      onAnimationEnd={event => {
        if (event.target !== event.currentTarget) return
        if (phase === 'covering') onCovered()
        if (phase === 'revealing') onRevealed()
      }}
    >
      <pre
        className={styles.transitionCode}
        style={{ '--line-count': sourceLines.length } as CSSProperties}
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && phase === 'code') onCodeComplete()
        }}
      >
        <code>
          {sourceLines.map((line, index) => (
            <span
              key={line}
              className={styles.codeLine}
              style={{ '--line-index': index } as CSSProperties}
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
