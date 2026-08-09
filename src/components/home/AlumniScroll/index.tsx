import { useState } from 'react'

import { GRADE_LABELS, MEMBERS_ALL } from './data'

export default function AlumniScroll() {
  const [activeGrade, setActiveGrade] = useState('2025')

  const filtered = MEMBERS_ALL.filter(m => m.grade === activeGrade)

  return (
    <div className="flex h-[650px] md:h-[680px] flex-col rounded-2xl border border-gray-200/60 bg-white/60 p-4 md:p-8">
      <h3 className="mb-4 text-xl font-bold tracking-[-0.02em] text-gray-900">往届成员</h3>
      <div className="mb-2 md:mb-6 flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 pb-1 md:pb-3">
        {GRADE_LABELS.map(g => (
          <button
            key={g}
            onClick={() => setActiveGrade(g)}
            data-hover-scale
            className={`font-misans-light text-sm tracking-[0.08em] pb-0 md:pb-1 transition-colors ${activeGrade === g ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {g}级
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
        {filtered.map(m => (
          <div
            key={m.name}
            className="relative flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 h-16 md:gap-4 md:px-5 md:h-20"
          >
            {m.type && (
              <span
                className={`absolute top-1.5 right-2 rounded px-1 text-[0.55rem] md:text-[0.6rem] ${m.type === '深造' ? 'bg-violet-500/10 text-violet-500' : 'bg-accent/10 text-accent'}`}
              >
                {m.type}
              </span>
            )}
            <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm md:text-base font-semibold text-accent overflow-hidden">
              {m.qq ? (
                <img
                  src={`http://q1.qlogo.cn/g?b=qq&nk=${m.qq}&s=100`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                m.name[0]
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm md:text-base font-semibold text-gray-800">
                {m.name}
              </div>
              <div className="line-clamp-2 font-misans-light text-xs md:text-sm leading-tight text-gray-400">
                {m.dest}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
