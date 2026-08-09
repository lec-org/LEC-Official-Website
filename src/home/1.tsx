import { useEffect, useRef } from 'react'

export default function Section1() {
  const ref = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const bgRef2 = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const smallLeftRef = useRef<HTMLSpanElement>(null)
  const smallRightRef = useRef<HTMLSpanElement>(null)
  const startRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) }
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const section = ref.current
    const bg1 = bgRef.current
    const bg2 = bgRef2.current
    const circle = circleRef.current
    const title = titleRef.current
    const smallLeft = smallLeftRef.current
    const smallRight = smallRightRef.current
    const start = startRef.current
    if (!section || !bg1 || !bg2 || !circle || !title || !smallLeft || !smallRight || !start) return

    const current = { dx: 0, dy: 0 }
    const target = { dx: 0, dy: 0 }

    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      target.dx = (e.clientX - cx) / cx
      target.dy = (e.clientY - cy) / cy
    }

    section.addEventListener('mousemove', handleMouse)

    let raf: number
    const tick = () => {
      current.dx += (target.dx - current.dx) * 0.08
      current.dy += (target.dy - current.dy) * 0.08
      const { dx, dy } = current

      bg1.style.transform = `translateY(-50%) translateX(${dx * 12}px) translateY(${dy * 6}px)`
      bg2.style.transform = `translateY(-50%) translateX(${dx * 12}px) translateY(${dy * 6}px)`
      circle.style.transform = `translate(${dx * -4}px, ${dy * -4}px)`
      title.style.transform = `translate(${dx * -4}px, ${dy * -4}px)`
      smallLeft.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`
      smallRight.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`
      start.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); section.removeEventListener('mousemove', handleMouse) }
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gray-50 px-6"
    >
      <div ref={bgRef} className="ch-bg-num pointer-events-none absolute left-[-2vw] top-1/2 select-none font-bebas text-[clamp(10rem,35vw,38rem)] leading-none tracking-[-0.06em] text-gray-200/50" style={{ transition: 'opacity 1.2s cubic-bezier(0.76,0,0.24,1)', opacity: 0 }}>
        LEC
      </div>
      <div ref={bgRef2} className="ch-bg-num pointer-events-none absolute right-[0.5vw] top-1/2 select-none font-bebas text-[clamp(10rem,35vw,38rem)] leading-none tracking-[-0.06em] text-gray-200/50" style={{ transition: 'opacity 1.2s cubic-bezier(0.76,0,0.24,1)', opacity: 0 }}>
SOF
      </div>

      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div ref={circleRef} className="flex flex-col items-center gap-8 md:flex-row md:gap-[6vw]">
          <span ref={smallLeftRef} className="whitespace-nowrap font-misans-light text-sm tracking-[0.08em] text-gray-800 uppercase">LEC SOFTWARE STUDIO</span>

          <div className="flex flex-col items-center gap-0 flex-shrink-0">
            {[
              [1, 1, 1],
              [0, 1, 1],
            ].map((row, ri) => (
              <div key={ri} className="flex gap-0">
                {row.map((v, ci) => {
                  if (v === 0) return (
                    <div key={ri + '-' + ci} className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-48 lg:w-48" />
                  )
                  const isStart = ri === 1 && ci === 2
                  return (
                    <div key={ri + '-' + ci} className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-48 lg:w-48 rounded-full" style={{ backgroundColor: '#42A5F5' }}>
                      {isStart && (
                        <a ref={startRef} href="#section-2" className="flex flex-col items-center no-underline">
                          <span className="font-misans-light text-[clamp(1.5rem,3vw,2.5rem)] text-white leading-none">→</span>
                          <span className="font-misans-light text-[clamp(0.5rem,0.8vw,0.7rem)] tracking-[0.2em] text-white/80">START</span>
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <span ref={smallRightRef} className="whitespace-nowrap font-misans-light text-[1rem] text-gray-800">加入我们，一起用代码创造世界</span>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 z-20 max-w-4xl text-left md:left-12">
        <h1 ref={titleRef} className="ch-title cursor-default">
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span
              className="line-inner block"
              style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1), letter-spacing .6s ease, filter .85s cubic-bezier(0.76,0,0.24,1)' }}
            >
<span className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-8xl lg:text-[7rem]">
                  2026招新
                </span>
            </span>
          </div>
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span
              className="line-inner block"
              style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1) .08s, letter-spacing .6s ease .08s, filter .85s cubic-bezier(0.76,0,0.24,1) .08s' }}
            >
              <span className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-8xl lg:text-[7rem]">
                乐程软件工作室
              </span>
            </span>
          </div>
        </h1>
      </div>

      <style>{`
        .ch-title:hover .line-inner { letter-spacing: 0.15em !important; }
        .visible .line-inner { transform: translateY(0) !important; color: #1f2937 !important; }
        .visible .body-p { opacity: 1 !important; transform: none !important; color: #6b7280 !important; }
        .visible .ch-bg-num { opacity: 1 !important; }
        .ch-bg-num {
          transition: opacity 1.2s cubic-bezier(0.76,0,0.24,1);
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
