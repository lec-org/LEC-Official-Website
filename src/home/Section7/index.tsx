import { useEffect, useRef } from 'react'
import { LEARNING_ITEMS } from './data'

export default function Section7() {
  const ref = useRef<HTMLElement>(null)

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

  return (
    <section id="section-7" ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-gray-50 px-6">
      <div className="ch-bg-num pointer-events-none absolute right-[-2vw] top-1/2 select-none font-bebas text-[clamp(16rem,40vw,38rem)] leading-none tracking-[-0.06em] text-gray-300/40">
        SIX
      </div>

      <div className="relative z-10 ml-0 md:ml-28 w-full max-w-4xl text-left">
        <div className="mb-6 flex items-center gap-5 text-sm tracking-[0.3em] text-gray-400 before:block before:h-[1.5px] before:w-[30px] before:flex-shrink-0 before:bg-accent uppercase">
          SIX · 团队制度
        </div>

        <h2 className="ch-title mb-8 cursor-default">
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span className="line-inner block" style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1), letter-spacing .6s ease, filter .85s cubic-bezier(0.76,0,0.24,1)' }}>
               <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">规范制度</span>
            </span>
          </div>
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span className="line-inner block" style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1) .08s, letter-spacing .6s ease .08s, filter .85s cubic-bezier(0.76,0,0.24,1) .08s' }}>
               <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">为成长护航</span>
            </span>
          </div>
        </h2>

        <div className="grid max-w-[1100px] gap-8 md:gap-10 md:grid-cols-2">
          <div className="space-y-10">
            <div>
              <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">考勤</div>
              <p className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .3s, transform .65s cubic-bezier(0.76,0,0.24,1) .3s' }}>
                每周 <strong className="relative font-semibold text-gray-800">28 小时</strong> 打卡，弹性安排，合理平衡学习与项目时间。
              </p>
            </div>
            <div>
              <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">例会</div>
              <p className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .45s, transform .65s cubic-bezier(0.76,0,0.24,1) .45s' }}>
                定期开展团队例会，同步学习进度，交流技术难点，规划阶段目标。
              </p>
            </div>
          </div>
          <div>
            <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">学习交流</div>
            <ul className="space-y-1">
              {LEARNING_ITEMS.map(({ title, description }, i) => (
                <li key={i} className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: `opacity .65s cubic-bezier(0.76,0,0.24,1) ${.6 + i * .1}s, transform .65s cubic-bezier(0.76,0,0.24,1) ${.6 + i * .1}s` }}>
                  <span className="mr-2 text-accent">—</span>
                  <strong className="font-semibold text-gray-800">{title}</strong>
                  <span className="text-gray-400"> — {description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .ch-title:hover .line-inner { letter-spacing: 0.15em !important; }
        .visible .line-inner { transform: translateY(0) !important; }
        .visible .body-p { opacity: 1 !important; transform: none !important; }
        .visible .ch-bg-num { transform: translateY(-50%) translateX(0); opacity: 1; }
        .ch-bg-num {
          transform: translateY(-50%) translateX(30px);
          transition: transform 1.2s cubic-bezier(0.76,0,0.24,1), opacity 1.2s cubic-bezier(0.76,0,0.24,1);
          opacity: 0;
        }
        .body-p strong {
          position: relative;
          cursor: pointer;
        }
        .body-p strong::after {
          content: ''; position: absolute; left: 0; bottom: -2px; right: 0;
          height: 1px; background: #42A5F5;
          transform: scaleX(0); transform-origin: left;
          transition: transform .5s cubic-bezier(0.76,0,0.24,1);
        }
        .body-p strong:hover::after { transform: scaleX(1); }
      `}</style>
    </section>
  )
}
