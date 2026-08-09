import { Fragment, useEffect, useRef, useState, type ComponentType } from 'react'
import LenisScroll from '../components/LenisScroll'
import LoadingScreen from '../components/LoadingScreen'
import QuoteSection from '../components/QuoteSection'
import Ticker from '../components/Ticker'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Section5 from './Section5'
import Section6 from './Section6'
import Section7 from './Section7'
import Section8 from './Section8'

type HomeSection = {
  id: string
  label: string
  anchor?: string
  Component: ComponentType
}

const sections: HomeSection[] = [
  { id: 'progress-section-0', label: '首页', Component: Section1 },
  { id: 'progress-section-1', label: '团队概况', anchor: 'section-2', Component: Section2 },
  { id: 'progress-section-2', label: '团队历史', anchor: 'section-3', Component: Section3 },
  { id: 'progress-section-3', label: '团队成就', anchor: 'section-4', Component: Section4 },
  { id: 'progress-section-4', label: '成员去向', anchor: 'section-5', Component: Section5 },
  { id: 'progress-section-5', label: '技术方向', anchor: 'section-6', Component: Section6 },
  { id: 'progress-section-6', label: '团队制度', anchor: 'section-7', Component: Section7 },
  { id: 'progress-section-7', label: '招新报名', anchor: 'section-8', Component: Section8 },
]

function ScrollProgress({ items }: { items: HomeSection[] }) {
  const [active, setActive] = useState(0)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const elements = items
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    sectionsRef.current = elements

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = items.findIndex(({ id }) => id === entry.target.id)
            if (index >= 0) setActive(index)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [items])

  const handleClick = (index: number) => {
    document.getElementById(items[index].id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 md:flex">
      {items.map(({ id }, index) => (
        <button key={id} type="button" onClick={() => handleClick(index)} className="group flex items-center">
          <div
            className={`rounded-full transition-all duration-300 ${index === active ? 'w-5 bg-accent' : 'w-1.5 bg-gray-300'}`}
            style={{ height: '2px' }}
          />
        </button>
      ))}
    </div>
  )
}

function FixedNav({ items }: { items: HomeSection[] }) {
  const navItems = items
    .filter(({ anchor }) => anchor)
    .map(({ label, anchor }) => ({ label, href: `#${anchor}` }))
  const rows = [navItems.slice(0, 4), navItems.slice(4)]

  return (
    <nav className="fixed left-1/2 top-4 z-40 flex -translate-x-1/2 flex-col gap-y-1 rounded-full border border-gray-200/60 bg-white/70 px-6 py-3 md:flex-row md:gap-x-10 md:px-8">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center gap-x-4 md:gap-10">
          {row.map(({ label, href }) => (
            <a key={href} href={href} className="whitespace-nowrap font-sans text-[0.65rem] tracking-[0.1em] text-gray-800 no-underline transition-colors hover:text-accent md:text-sm">
              {label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  )
}

function HomeSections({ items }: { items: HomeSection[] }) {
  return (
    <div>
      {items.map(({ id, Component }, index) => (
        <Fragment key={id}>
          <div id={id}>
            <Component />
          </div>
          {index === 0 && <Ticker />}
          {index === 1 && (
            <QuoteSection
              bg="blue"
              text={'用代码创造无限可能，\n让青春在团队中绽放最耀眼的光芒'}
              attr="乐程软件工作室 · 2026 招新"
              ambient="CODE"
            />
          )}
          {index === 4 && <Ticker />}
          {index === 6 && (
            <QuoteSection
              bg="white"
              text={'如果你渴望在大学期间提升编程技能，\n参与实际项目开发，结交志同道合的朋友'}
              attr="加入我们，一起用代码创造世界"
              ambient="DREAM"
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative">
      <ScrollProgress items={sections} />
      <FixedNav items={sections} />
      <LenisScroll>
        <HomeSections items={sections} />
      </LenisScroll>
      <LoadingScreen onFinish={() => {}} />
    </div>
  )
}
