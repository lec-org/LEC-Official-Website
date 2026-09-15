'use client'

const items = [
  '全栈开发',
  '算法竞赛',
  '机器学习',
  '游戏开发',
  '人工智能',
  '30+ 成员',
  '科研深耕',
  '乐程软件工作室',
]

export default function Ticker() {
  return (
    <div className="overflow-hidden border-y border-gray-200/60 bg-gray-50/80 py-4">
      <div className="ticker-track flex w-max items-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            {items.flatMap((item) => [
              <span key={item + i} className="ticker-item font-bebas text-sm tracking-[0.18em] text-gray-400 transition-colors duration-200 hover:text-accent">
                {item}
              </span>,
              <span key={'sep' + item + i} className="mx-14 font-bebas text-sm text-accent">—</span>,
            ])}
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          animation: tickerScroll 18s linear infinite;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
