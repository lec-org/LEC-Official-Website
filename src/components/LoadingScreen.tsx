import { useEffect, useRef, useState } from 'react'

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'loader' | 'intro' | 'done'>('loader')
  const numRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const volRef = useRef<HTMLParagraphElement>(null)
  const phraseRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const DURATION = 1800
    const start = performance.now()

    function tick(now: number) {
      const p = Math.min((now - start) / DURATION, 1)
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p
      const count = Math.floor(eased * 100)
      if (numRef.current) numRef.current.textContent = String(count)
      if (fillRef.current) fillRef.current.style.width = count + '%'

      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        if (numRef.current) numRef.current.textContent = '100'
        if (fillRef.current) fillRef.current.style.width = '100%'
        setTimeout(() => {
          loaderRef.current?.classList.add('fade-out')
          setPhase('intro')
        }, 200)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (phase !== 'intro') return

    requestAnimationFrame(() => {
      setTimeout(() => lineRef.current?.classList.add('full'), 80)
    })
    setTimeout(() => volRef.current?.classList.add('in'), 900)
    setTimeout(() => phraseRef.current?.classList.add('in'), 1200)
    setTimeout(() => {
      introRef.current?.classList.add('gone')
      setTimeout(() => {
        setPhase('done')
        onFinish()
      }, 1000)
    }, 2600)
  }, [phase, onFinish])

  return (
    <>
      <style>{`
        .loader-content {
          text-align: center; pointer-events: none;
        }
        .fade-out { opacity: 0; }
        .gone { opacity: 0 !important; }
        .in { opacity: 1 !important; transform: none !important; }
        .full { width: min(300px, 40vw) !important; }
      `}</style>

      <div
        ref={loaderRef}
        className="fixed inset-0 z-[9000] flex items-center justify-center bg-white"
        style={{ pointerEvents: 'none', transition: 'opacity .5s ease' }}
      >
        <div className="loader-content">
          <div
            ref={numRef}
             className="font-bebas text-[clamp(5rem,18vw,14rem)] leading-none tracking-[-0.04em] text-black"
          >
            0
          </div>
          <div className="mx-auto mt-6 h-px w-[200px] overflow-hidden bg-black/12">
            <div ref={fillRef} className="h-full w-0 bg-[#42A5F5]" style={{ transition: 'width .05s linear' }} />
          </div>
          <p className="mt-6 font-sans text-[0.68rem] tracking-[0.3em] text-black/50 uppercase">
            LEC · 乐程软件工作室 · 2026
          </p>
        </div>
      </div>

      <div
        ref={introRef}
        className="fixed inset-0 z-[8999] flex flex-col items-center justify-center bg-white"
        style={{
          pointerEvents: 'none',
          transition: 'opacity 1s cubic-bezier(0.76,0,0.24,1)',
        }}
      >
        <h2
          ref={phraseRef}
          className="font-serif text-[clamp(2rem,7vw,7rem)] font-bold leading-none tracking-[-0.04em] text-black"
          style={{
            opacity: 0,
            transform: 'translateY(28px) scale(.96)',
            transition: 'opacity .9s cubic-bezier(0.76,0,0.24,1), transform .7s cubic-bezier(0.76,0,0.24,1)',
          }}
        >
          一起用代码创造世界
        </h2>
        <div
          ref={lineRef}
          className="mt-8 mb-8 h-px bg-[#42A5F5]"
          style={{
            width: 0,
            transition: 'width 1s cubic-bezier(0.77,0,0.175,1)',
          }}
        />
        <p
          ref={volRef}
          className="font-bebas text-[0.75rem] tracking-[0.45em] text-black/30"
          style={{ opacity: 0, transform: 'translateY(6px)', transition: 'opacity .5s, transform .5s' }}
        >
          LEC · 乐程软件工作室 · 2026 
        </p>
      </div>
    </>
  )
}