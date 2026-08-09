import { useEffect, useRef } from 'react'
import GridMotion from '../../components/GridMotion'

import { ACHIEVEMENT_IMAGES } from './data'

export default function Section4() {
  const ref = useRef<HTMLElement>(null)

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
      id="section-4"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-gray-100 px-6"
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <GridMotion items={ACHIEVEMENT_IMAGES} gradientColor="#ffffff" />
      </div>

      <div className="ch-bg-num pointer-events-none absolute right-[-2vw] top-1/2 select-none font-bebas text-[clamp(16rem,40vw,38rem)] leading-none tracking-[-0.06em] text-gray-300/40">
        THREE
      </div>

      <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center md:flex">
        <div className="h-16 w-1.5 bg-accent" />
        <span className="mt-5 font-bebas text-[clamp(0.7rem,1vw,1rem)] tracking-[0.3em] text-gray-300/70" style={{ writingMode: 'vertical-rl' }}>
          LEC SOFTWARE STUDIO
        </span>
      </div>

      <div className="relative z-10 ml-0 w-full max-w-4xl text-left md:ml-28">
        <div className="mb-6 flex items-center gap-5 text-sm tracking-[0.3em] text-gray-400 before:block before:h-[1.5px] before:w-[30px] before:flex-shrink-0 before:bg-accent uppercase">
          THREE · 团队成就
        </div>

        <h2 className="ch-title mb-8 cursor-default">
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span
              className="line-inner block"
style={{
                    transform: 'translateY(110%)',
                    letterSpacing: '-0.03em',
                    color: '#42A5F5',
                    transition:
                      'transform .7s cubic-bezier(0.76,0,0.24,1), letter-spacing .6s ease, filter .85s cubic-bezier(0.76,0,0.24,1), color .7s cubic-bezier(0.76,0,0.24,1)',
                  }}
                >
                  <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">
                    硕果累累
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
                用作品说话
              </span>
            </span>
          </div>
        </h2>

        <div className="grid max-w-[1100px] gap-8 md:gap-10 md:grid-cols-3">
          <div>
            <div className="mb-3 font-bebas text-5xl leading-none text-accent">100+</div>
            <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">
              学科竞赛
            </div>
            <p
              className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition:
                  'opacity .65s cubic-bezier(0.76,0,0.24,1) .3s, transform .65s cubic-bezier(0.76,0,0.24,1) .3s',
              }}
            >
              累计获省、国赛奖项
              <strong className="relative font-semibold text-gray-800"> 百余项 </strong>
              ，涵盖 ICPC/CCPC、服务外包、天梯赛、挑战杯等多个赛道。
            </p>
          </div>
          <div>
            <div className="mb-3 font-bebas text-5xl leading-none text-accent">100+</div>
            <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">
              奖学金
            </div>
            <p
              className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition:
                  'opacity .65s cubic-bezier(0.76,0,0.24,1) .6s, transform .65s cubic-bezier(0.76,0,0.24,1) .6s',
              }}
            >
              历届成员累计获得
              <strong className="relative font-semibold text-gray-800"> 百余人次 </strong>
              校级及以上奖学金，含国家奖学金、校长奖学金、特等奖学金等。
            </p>
          </div>
          <div>
            <div className="mb-3 font-bebas text-5xl leading-none text-accent">10+</div>
            <div className="mb-3 border-b border-gray-300/40 pb-2 text-sm tracking-[0.15em] text-gray-400 uppercase">
              科研立项
            </div>
            <p
              className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition:
                  'opacity .65s cubic-bezier(0.76,0,0.24,1) .45s, transform .65s cubic-bezier(0.76,0,0.24,1) .45s',
              }}
            >
              团队项目多次获校级开放实验以及省级、国家级大创立项，多个课题进入培育计划，
              <strong className="relative font-semibold text-gray-800">持续产出 </strong>
              科研成果。
            </p>
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
