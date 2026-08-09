import { useEffect, useRef, useState, useCallback } from 'react'

interface TechItem {
  name: string
  desc: string
  detail: string
}

const techs: TechItem[] = [
  {
    name: '全栈开发',
    desc: 'Web 全栈 / API 设计 / 数据库 / 部署',
    detail:
      '全栈开发覆盖从用户界面到服务端的完整技术链路，是软件背后的"大脑"也是用户面前的"脸面"。在这里，你将学习如何构建用户能直接看到和操作的界面，同时掌握支撑系统稳定运行的后端能力，成为能够独立完成完整产品开发的全能型开发者。<br />我们会带你从 HTML、CSS、JavaScript 开始，到 Vue、React 等现代框架与 TypeScript，再逐步深入服务端开发、数据库、缓存、接口设计以及部署运维，通过真实项目打通前后端，建立完整的工程化开发思维。<br /><br /><b>你将学习</b><br />HTML、CSS、JavaScript、TypeScript<br />Vue / React 等现代框架<br />Java / Go / Node.js<br />MySQL、Redis<br />RESTful API 开发与 Spring Boot 等框架<br />Linux 与服务器部署、Git 协作<br /><br /><b>适合你</b><br />喜欢从界面到系统全程掌控，想亲手做出完整产品，对架构与性能优化同样感兴趣的全面型选手。',
  },
  {
    name: 'Agent 开发',
    desc: '智能体 / 自动化 / AI 应用',
    detail:
      'Agent 开发是当前 AI 领域最具活力的方向之一。你将学习如何构建能够自主感知、决策和行动的智能体系统，从大语言模型（LLM）的调用与微调，到工具调用、多智能体协作，逐步掌握 AI 应用开发的核心能力。<br />我们会带你从 Prompt 工程开始，逐步深入到 RAG、Function Calling、智能体框架等前沿技术，并通过实际项目将 AI 能力落地到真实场景中。<br /><br /><b>你将学习</b><br />大语言模型（LLM）调用与微调<br />Prompt 工程与 RAG<br />智能体框架（LangChain / AutoGPT）<br />工具调用与多智能体协作<br />AI 应用开发与部署<br /><br /><b>适合你</b><br />对 AI 前沿技术充满好奇，希望亲手构建智能系统，用代码创造真正"聪明"的产品。',
  },
  {
    name: '游戏开发',
    desc: 'Unity / Unreal 引擎',
    detail:
      '游戏开发融合了程序、设计、图形学和创意，是最具综合性的技术方向之一。在这里，你将学习游戏逻辑、角色控制、场景搭建、动画系统等内容，并体验从零完成一款游戏的全过程。<br />无论是 2D 还是 3D 游戏，我们都鼓励成员参与 Game Jam、课程项目以及独立游戏开发，在实践中不断提升自己的开发能力。<br /><br /><b>你将学习</b><br />Unity / Unreal Engine<br />C# / C++<br />游戏逻辑开发<br />UI、动画与物理系统<br />游戏项目协作<br /><br /><b>适合你</b><br />热爱游戏，希望亲手创造游戏世界，对创意开发充满兴趣。',
  },
  {
    name: '机器学习',
    desc: '数据分析 / 模型训练 / 深度学习 / AI',
    detail:
      '机器学习是人工智能的重要基础，研究如何让计算机通过数据学习规律并完成预测、分类等任务。你将学习机器学习的基本原理、常见模型以及模型训练方法，并通过真实数据集完成实践项目。<br />课程会循序渐进，从 Python 基础到机器学习算法，再到深度学习、神经网络，并在此基础上进阶到 NLP、计算机视觉、大语言模型等前沿 AI 方向，为后续 Agent 与 AI 应用开发打下坚实基础。<br /><br /><b>你将学习</b><br />Python 数据分析<br />NumPy、Pandas<br />Scikit-learn<br />PyTorch、神经网络<br />深度学习与模型训练<br />NLP / 计算机视觉<br />大语言模型（LLM）与 AI 应用<br /><br /><b>适合你</b><br />喜欢数学和数据分析，希望通过模型与 AI 技术解决实际问题，对智能应用开发充满兴趣。',
  },
  {
    name: '图形学',
    desc: '渲染 / 三维建模 / 实时交互',
    detail:
      '图形学研究如何利用计算机生成和渲染图像，是游戏开发、数字孪生、AR/VR 等领域的重要基础。在这里，你将学习三维图形渲染、光照、材质、Shader 等知识，理解画面背后的实现原理。<br />如果你喜欢炫酷的视觉效果，或者希望深入了解 Three.js、OpenGL 等图形技术，这里会是一个非常有趣的方向。<br /><br /><b>你将学习</b><br />OpenGL<br />WebGL / Three.js<br />Shader 编程<br />三维数学基础<br />渲染管线原理<br /><br /><b>适合你</b><br />对图形、动画和三维世界感兴趣，希望创造具有视觉冲击力的作品。',
  },
  {
    name: '算法',
    desc: '算法竞赛 / 数据结构 / 算法设计',
    detail:
      '算法与数据结构是计算机科学的基石，也是许多技术方向的重要基础。在这里，你将学习如何分析问题、设计高效算法，并通过代码将思路转化为解决方案。我们会从基础的数据结构开始，逐步深入到图论、动态规划、搜索、字符串算法等经典内容，培养严谨的逻辑思维和问题分析能力。<br />除了日常学习，我们还会组织算法训练、经验分享和竞赛交流，鼓励成员参加蓝桥杯、CCPC、ICPC 等各类算法竞赛，在实践中不断提升自己。<br /><br /><b>你将学习</b><br />数据结构与算法基础<br />C++ 程序设计<br />图论、动态规划、贪心、搜索等经典算法<br />算法竞赛训练与解题思维<br /><br /><b>适合你</b><br />喜欢思考、热爱挑战，希望不断提升逻辑能力，对竞赛或技术研究感兴趣。',
  },
]

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

        {techs.length > 0 && (
          <div className="grid max-w-[1000px] gap-3 md:gap-4 md:grid-cols-2">
            {/* 点击卡片了解更详细的方向内容 */}
            {techs.map((t, i) => (
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
