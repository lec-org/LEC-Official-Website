import { useEffect, useRef, useState, useCallback } from 'react'

import type { TechItem } from './data'
import { TECH_ITEMS } from './data'

export default function Section6() {
  const ref = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<TechItem | null>(null)
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setSelected(null)
      setClosing(false)
    }, 500)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible')
          io.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="section-6"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-gray-100 px-6"
    >
      <div className="ch-bg-num pointer-events-none absolute right-[-2vw] top-1/2 select-none font-bebas text-[clamp(16rem,40vw,38rem)] leading-none tracking-[-0.06em] text-gray-300/40">
        FIVE
      </div>

      <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center md:flex">
        <div className="h-16 w-1.5 bg-accent" />
        <span className="mt-5 font-bebas text-[clamp(0.7rem,1vw,1rem)] tracking-[0.3em] text-gray-300/70" style={{ writingMode: 'vertical-rl' }}>
          LEC SOFTWARE STUDIO
        </span>
      </div>

      <div className="relative z-10 ml-0 md:ml-28 w-full max-w-4xl text-left">
        <div className="mb-6 flex items-center gap-5 text-sm tracking-[0.3em] text-gray-400 before:block before:h-[1.5px] before:w-[30px] before:flex-shrink-0 before:bg-accent uppercase">
          FIVE · 技术方向
        </div>

        <h2 className="ch-title mb-8 cursor-default">
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span
              className="line-inner block"
              style={{
                transform: 'translateY(110%)',
                letterSpacing: '-0.03em',
                transition:
                  'transform .7s cubic-bezier(0.76,0,0.24,1), letter-spacing .6s ease, filter .85s cubic-bezier(0.76,0,0.24,1)',
              }}
            >
              <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">
                多元技术
              </span>
            </span>
          </div>
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span
              className="line-inner block"
              style={{
                transform: 'translateY(110%)',
                letterSpacing: '-0.03em',
                transition:
                  'transform .7s cubic-bezier(0.76,0,0.24,1) .08s, letter-spacing .6s ease .08s, filter .85s cubic-bezier(0.76,0,0.24,1) .08s',
              }}
            >
              <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">
                总有一款适合你
              </span>
            </span>
          </div>
        </h2>

        {TECH_ITEMS.length > 0 && (
          <div className="grid max-w-[1000px] gap-3 md:gap-4 md:grid-cols-2">
            {/* 点击卡片了解更详细的方向内容 */}
            {TECH_ITEMS.map((t, i) => (
              <div
                key={t.name}
                className="tech-item cursor-pointer rounded-sm border border-gray-200/60 bg-white/50 px-4 py-4 md:px-6 md:py-5 transition-all duration-300 hover:bg-white hover:shadow-md"
                data-hover-scale
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: `opacity .35s cubic-bezier(0.76,0,0.24,1) ${0.12 + i * 0.04}s, transform .35s cubic-bezier(0.76,0,0.24,1) ${0.12 + i * 0.04}s, box-shadow .3s ease, background-color .3s ease`,
                }}
                onClick={() => {
                  setSelected(t)
                  setClosing(false)
                }}
              >
                <div className="mb-1 font-bebas text-xs tracking-[0.15em] text-accent uppercase">
                  0{i + 1}
                </div>
                <div className="mb-1 text-base font-semibold text-gray-800">{t.name}</div>
                <div className="font-misans-light text-sm leading-relaxed text-gray-400">
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        )}

        <blockquote
          className="body-p mt-8 max-w-[1000px] border-l-2 border-accent pl-5 font-misans-light text-[1rem] leading-[1.75] text-gray-400 italic"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition:
              'opacity .65s cubic-bezier(0.76,0,0.24,1) .7s, transform .65s cubic-bezier(0.76,0,0.24,1) .7s',
          }}
        >
          点击卡片了解详情
        </blockquote>
      </div>

      {selected && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 ${closing ? 'overlay-fade-out' : 'overlay-fade-in'}`}
          onClick={handleClose}
        >
          <div
            className={`bg-white rounded-xl shadow-lg overflow-hidden flex w-[90vw] max-w-[1000px] h-auto max-h-[85vh] relative ${closing ? 'animate-[slideOutLeft_0.5s_cubic-bezier(0.4,0,0.2,1)]' : 'animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)]'}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center z-10 transition-colors"
              data-hover-scale
              onClick={handleClose}
            >
              <span className="text-gray-800 text-lg leading-none">✕</span>
            </button>

            <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-14 overflow-y-auto card-content">
              <div className="mb-1 font-bebas text-xs tracking-[0.15em] text-accent uppercase">
                TECH
              </div>
              <h3 className="text-[clamp(1.5rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em] text-gray-900 mb-4">
                {selected.name}
              </h3>
              <p
                className="text-[15px] sm:text-[17px] leading-[1.65] text-gray-700"
                dangerouslySetInnerHTML={{ __html: selected.detail }}
              />
            </div>

            <div className="hidden sm:block w-[30%] bg-gray-50 ml-auto" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100vw); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-100vw); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .overlay-fade-in { animation: fadeIn .4s ease; }
        .overlay-fade-out { animation: fadeOut .5s ease forwards; }
        .card-content { scrollbar-width: none; -ms-overflow-style: none; }
        .card-content::-webkit-scrollbar { display: none; }
        .ch-title:hover .line-inner { letter-spacing: 0.15em !important; }
        .visible .line-inner { transform: translateY(0) !important; }
        .visible .tech-item { opacity: 1 !important; transform: none !important; }
        .visible .ch-bg-num { transform: translateY(-50%) translateX(0); opacity: 1; }
        .ch-bg-num {
          transform: translateY(-50%) translateX(30px);
          transition: transform 1.2s cubic-bezier(0.76,0,0.24,1), opacity 1.2s cubic-bezier(0.76,0,0.24,1);
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
