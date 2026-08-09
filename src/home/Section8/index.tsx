import { useEffect, useRef } from 'react'

export default function Section8() {
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
    <section id="section-8" ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-gray-100 px-6">
      <div className="ch-bg-num pointer-events-none absolute right-[-2vw] top-1/2 select-none font-bebas text-[clamp(16rem,40vw,38rem)] leading-none tracking-[-0.06em] text-gray-300/40">
        SEVEN
      </div>

      <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center md:flex">
        <div className="h-16 w-1.5 bg-accent" />
        <span className="mt-5 font-bebas text-[clamp(0.7rem,1vw,1rem)] tracking-[0.3em] text-gray-300/70" style={{ writingMode: 'vertical-rl' }}>
          LEC SOFTWARE STUDIO
        </span>
      </div>

      <div className="relative z-10 ml-0 md:ml-28 w-full max-w-4xl text-left">
        <div className="mb-6 flex items-center gap-5 text-sm tracking-[0.3em] text-gray-400 before:block before:h-[1.5px] before:w-[30px] before:flex-shrink-0 before:bg-accent uppercase">
          SEVEN · 招新报名
        </div>

        <h2 className="ch-title mb-8 cursor-default">
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span className="line-inner block" style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1), letter-spacing .6s ease, filter .85s cubic-bezier(0.76,0,0.24,1)' }}>
              <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">加入我们</span>
            </span>
          </div>
          <div className="line-wrap overflow-hidden leading-[1.15]">
            <span className="line-inner block" style={{ transform: 'translateY(110%)', letterSpacing: '-0.03em', transition: 'transform .7s cubic-bezier(0.76,0,0.24,1) .08s, letter-spacing .6s ease .08s, filter .85s cubic-bezier(0.76,0,0.24,1) .08s' }}>
               <span className="text-2xl font-bold text-gray-800 sm:text-5xl md:text-7xl lg:text-8xl">一起用代码创造世界</span>
            </span>
          </div>
        </h2>

        <p className="body-p max-w-[1000px] font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .3s, transform .65s cubic-bezier(0.76,0,0.24,1) .3s' }}>
          如果你渴望在大学期间提升编程技能，参与实际项目开发，结交志同道合的朋友，为未来的职业发展<br/>或学术深造打下坚实基础，那么，不要犹豫，加入乐程软件工作室吧！
        </p>
        <p className="body-p mb-10 max-w-[1000px] font-misans-light text-sm md:text-[1.05rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .45s, transform .65s cubic-bezier(0.76,0,0.24,1) .45s' }}>
          我们期待与你一起，在代码的海洋中遨游，用技术创造无限可能！
        </p>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[600px] space-y-1">
            <p className="body-p font-misans-light text-[1rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .55s, transform .65s cubic-bezier(0.76,0,0.24,1) .55s' }}>
              <strong className="font-semibold text-gray-800">招新时间：</strong>2026 年 8 月 — 10 月
            </p>
            <p className="body-p font-misans-light text-[1rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .61s, transform .65s cubic-bezier(0.76,0,0.24,1) .61s' }}>
              <strong className="font-semibold text-gray-800">招新对象：</strong>全体大一新生
            </p>
            <p className="body-p font-misans-light text-[1rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .67s, transform .65s cubic-bezier(0.76,0,0.24,1) .67s' }}>
              <strong className="font-semibold text-gray-800">团队地址：</strong>明理楼 C 栋 10 楼 C1010
            </p>
            <p className="body-p font-misans-light text-[1rem] leading-[1.75] text-gray-500" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .73s, transform .65s cubic-bezier(0.76,0,0.24,1) .73s' }}>
              <strong className="font-semibold text-gray-800">招新 Q 群：</strong>674764635
            </p>
          </div>
          <div className="body-p mr-0 flex flex-col items-center gap-1 md:mr-12" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .8s, transform .65s cubic-bezier(0.76,0,0.24,1) .8s' }}>
            <img src={import.meta.env.BASE_URL + 'qr.png'} alt="QQ群二维码" className="w-[120px] rounded-lg" />
            <span className="text-xs text-gray-400">乐程官方招新群</span>
          </div>
        </div>

        <blockquote className="body-p mt-10 max-w-[1000px] border-l-2 border-accent pl-5 font-misans-light text-[1rem] leading-[1.75] text-gray-400 italic" style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity .65s cubic-bezier(0.76,0,0.24,1) .85s, transform .65s cubic-bezier(0.76,0,0.24,1) .85s' }}>
          招新期间入群填写表单即可获得学长学姐一对一答疑指导<br />并加入LEC专属练习题库
        </blockquote>
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
      `}</style>
    </section>
  )
}
