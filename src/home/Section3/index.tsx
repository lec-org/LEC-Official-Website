import { useEffect, useRef, useState } from 'react'
import { HISTORY } from './data'

export default function Section3() {
  const ref = useRef<HTMLElement>(null)
  const [showUpdates, setShowUpdates] = useState(false)

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
      id="section-3"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-gray-50 px-6"
    >
      <div className="ch-bg-num pointer-events-none absolute right-[-2vw] top-1/2 select-none font-bebas text-[clamp(16rem,40vw,38rem)] leading-none tracking-[-0.06em] text-gray-300/40">
        TWO
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: showUpdates ? 'translateX(-100%)' : 'translateX(0)' }}
        >
          <div className="flex-[0_0_100%] min-w-0">
            <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="w-full max-w-4xl text-left md:ml-28">
                <div className="mb-6 flex items-center gap-5 text-sm tracking-[0.3em] text-gray-400 before:block before:h-[1.5px] before:w-[30px] before:flex-shrink-0 before:bg-accent uppercase">
                  TWO · 团队历史
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
                        从零出发
                      </span>
                    </span>
                  </div>
                  <div className="line-wrap overflow-hidden leading-[1.15]">
                    <span
                      className="line-inner block"
                      style={{
                        transform: 'translateY(110%)',
                        letterSpacing: '-0.03em',
                        color: '#42A5F5',
                        transition:
                          'transform .7s cubic-bezier(0.76,0,0.24,1) .08s, letter-spacing .6s ease .08s, filter .85s cubic-bezier(0.76,0,0.24,1) .08s, color .7s cubic-bezier(0.76,0,0.24,1) .08s',
                      }}
                    >
                      <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">
                        十余年之路
                      </span>
                    </span>
                  </div>
                </h2>

                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center gap-4">
                      <span className="font-bebas text-2xl leading-none text-accent">01</span>
                      <span className="border-b border-gray-300/40 pb-1 text-sm tracking-[0.15em] text-gray-400 uppercase">
                        创立 · 2010
                      </span>
                    </div>
                    <p
                      className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
                      style={{
                        opacity: 0,
                        transform: 'translateY(24px)',
                        color: '#42A5F5',
                        transition:
                          'opacity .65s cubic-bezier(0.76,0,0.24,1) .3s, transform .65s cubic-bezier(0.76,0,0.24,1) .3s, color .65s cubic-bezier(0.76,0,0.24,1) .3s',
                      }}
                    >
                      乐程软件工作室正式成立，怀着
                      <strong className="relative font-semibold text-gray-800">
                        {' '}
                        “学以致用，服务学校，走向社会”{' '}
                      </strong>
                      的宗旨。开启学生软件开发与科研探索之路。
                    </p>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-4">
                      <span className="font-bebas text-2xl leading-none text-accent">02</span>
                      <span className="border-b border-gray-300/40 pb-1 text-sm tracking-[0.15em] text-gray-400 uppercase">
                        沉淀 · 2010–2015
                      </span>
                    </div>
                    <p
                      className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
                      style={{
                        opacity: 0,
                        transform: 'translateY(24px)',
                        color: '#42A5F5',
                        transition:
                          'opacity .65s cubic-bezier(0.76,0,0.24,1) .4s, transform .65s cubic-bezier(0.76,0,0.24,1) .4s, color .65s cubic-bezier(0.76,0,0.24,1) .4s',
                      }}
                    >
                      团队创立初期，沉淀技术基础，积累项目经验。
                    </p>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-4">
                      <span className="font-bebas text-2xl leading-none text-accent">03</span>
                      <span className="border-b border-gray-300/40 pb-1 text-sm tracking-[0.15em] text-gray-400 uppercase">
                        突破 · 2016–2020
                      </span>
                    </div>
                    <p
                      className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
                      style={{
                        opacity: 0,
                        transform: 'translateY(24px)',
                        transition:
                          'opacity .65s cubic-bezier(0.76,0,0.24,1) .5s, transform .65s cubic-bezier(0.76,0,0.24,1) .5s, color .65s cubic-bezier(0.76,0,0.24,1) .5s',
                      }}
                    >
                      保研、就业齐发展，在各项学科竞赛中崭露头角，获省、国赛奖项数十项。
                    </p>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-4">
                      <span className="font-bebas text-2xl leading-none text-accent">04</span>
                      <span className="border-b border-gray-300/40 pb-1 text-sm tracking-[0.15em] text-gray-400 uppercase">
                        壮大 · 2021–2026
                      </span>
                    </div>
                    <p
                      className="body-p font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500"
                      style={{
                        opacity: 0,
                        transform: 'translateY(24px)',
                        transition:
                          'opacity .65s cubic-bezier(0.76,0,0.24,1) .6s, transform .65s cubic-bezier(0.76,0,0.24,1) .6s, color .65s cubic-bezier(0.76,0,0.24,1) .6s',
                      }}
                    >
                      团队规模扩大至 30 余人 ，技术方向拓展至 Agent 开发、图形学、机器学习等
                      <strong className="relative font-semibold text-gray-800"> 前沿领域 </strong>
                      ，成员去向覆盖字节、腾讯、阿里等一线互联网企业及电子科大、川大等
                      <strong className="relative font-semibold text-gray-800"> 知名高校 </strong>。
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden w-full lg:block lg:w-[700px] lg:flex-shrink-0 lg:mr-6">
                <div className="rounded-2xl border border-gray-200/60 bg-white/60 p-6">
                  <div className="mb-4 font-bebas text-sm tracking-[0.3em] text-accent uppercase">
                    团队动态
                  </div>
                  <div
                    className="timeline-scroll relative h-[65vh] min-h-[460px] w-full overflow-y-auto"
                    data-lenis-prevent
                  >
<div className="relative space-y-4 md:space-y-8 pb-2">
                  <div className="absolute bottom-0 right-[16px] md:right-[18px] top-0 w-px bg-gray-300/60" />
                  {HISTORY.map((h, i) => (
                    <div key={`${h.date}-${i}`} className="relative pr-10 md:pr-16">
                      <div className="text-right">
                        <div className="font-bebas text-[1.2rem] md:text-[1.6rem] leading-none text-accent">
                          {h.date}
                        </div>
                        <p className="font-misans-light mt-1 md:mt-2 text-sm md:text-[1.05rem] leading-[1.75] text-gray-500">
                          {h.desc}
                        </p>
                      </div>
                      <div className="absolute right-[10px] md:right-3 top-1 flex h-3 w-3 items-center justify-center">
                        <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>

          <div className="flex flex-[0_0_100%] min-w-0 items-center justify-center px-6 md:px-0">
            <div className="w-full max-w-[700px]">
              <div className="mb-4 font-bebas text-sm tracking-[0.3em] text-accent uppercase">
                团队动态
              </div>
              <div
                className="timeline-scroll relative h-[65vh] min-h-[460px] w-full overflow-y-auto"
                data-lenis-prevent
              >
<div className="relative space-y-4 md:space-y-8 pb-2">
                  <div className="absolute bottom-0 right-[16px] md:right-[18px] top-0 w-px bg-gray-300/60" />
                  {HISTORY.map((h, i) => (
                    <div key={`${h.date}-${i}`} className="relative pr-10 md:pr-16">
                      <div className="text-right">
                        <div className="font-bebas text-[1.2rem] md:text-[1.6rem] leading-none text-accent">
                          {h.date}
                        </div>
                        <p className="font-misans-light mt-1 md:mt-2 text-sm md:text-[1.05rem] leading-[1.75] text-gray-500">
                          {h.desc}
                        </p>
                      </div>
                      <div className="absolute right-[10px] md:right-3 top-1 flex h-3 w-3 items-center justify-center">
                        <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowUpdates(!showUpdates)}
        className="absolute bottom-8 right-8 z-20 rounded-full border border-accent px-6 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white lg:hidden"
      >
        {showUpdates ? '返回' : '团队动态'}
      </button>

      <style>{`
        .ch-title:hover .line-inner { letter-spacing: 0.15em !important; }
        .visible .line-inner { transform: translateY(0) !important; color: #1f2937 !important; }
        .visible .body-p { opacity: 1 !important; transform: none !important; color: #6b7280 !important; }
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
        .timeline-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .timeline-scroll::-webkit-scrollbar { width: 6px; }
        .timeline-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .timeline-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </section>
  )
}
