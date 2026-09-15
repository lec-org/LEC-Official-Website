'use client'

import { useEffect, useRef } from 'react'

interface Props {
  bg: 'blue' | 'white'
  text: string
  attr: string
  ambient: string
}

const bgMap = {
  blue: 'bg-accent text-white',
  white: 'bg-white text-black',
}

const ambientMap = {
  blue: 'text-white/10',
  white: 'text-black/5',
}

const attrMap = {
  blue: 'text-white/50',
  white: 'text-black/40',
}

const scrambleChars = '零一二三四五六七八九十百千万亿ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst!@#$%^&*+=<>?/|~'

function doScramble(el: HTMLElement, final: string) {
  const lines = final.split('\n')
  const SPEED = 0.35
  el.innerHTML = ''
  const allSpans: HTMLElement[] = []
  lines.forEach((line, li) => {
    if (li > 0) el.appendChild(document.createElement('br'))
    line.split('').forEach(() => {
      const s = document.createElement('span')
      s.className = 'schar'
      s.style.display = 'inline-block'
      el.appendChild(s)
      allSpans.push(s)
    })
  })
  const chars = lines.join('').split('')
  let progress = 0

  function tick() {
    progress = Math.min(progress + SPEED, chars.length)
    allSpans.forEach((s, i) => {
      if (i < Math.floor(progress)) {
        s.textContent = chars[i]
        s.style.opacity = '1'
      } else {
        s.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        s.style.opacity = String(0.15 + Math.random() * 0.3)
      }
    })
    if (Math.floor(progress) < chars.length) {
      requestAnimationFrame(tick)
    } else {
      allSpans.forEach((s, i) => {
        s.textContent = chars[i]
        s.style.opacity = '1'
      })
    }
  }
  tick()
}

export default function QuoteSection({ bg, text, attr, ambient }: Props) {
  const ref = useRef<HTMLElement>(null)
  const done = useRef(false)
  const ambientRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = el.querySelector<HTMLElement>('.scramble-text')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true
          el.classList.add('visible')
          if (st) setTimeout(() => doScramble(st, text), 200)
          io.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [text])

  useEffect(() => {
    const section = ref.current
    const ambientEl = ambientRef.current
    const contentEl = contentRef.current
    if (!section || !ambientEl || !contentEl) return

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
      ambientEl.style.transform = `translate(${dx * 12}px, ${dy * 6}px)`
      contentEl.style.transform = `translate(${dx * -4}px, ${dy * -4}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); section.removeEventListener('mousemove', handleMouse) }
  }, [])

  return (
    <section
      ref={ref}
      className={`relative flex min-h-[80vh] items-center justify-center overflow-hidden px-[8vw] text-center ${bgMap[bg]}`}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={ambientRef} className={`select-none font-bebas text-[clamp(8rem,22vw,20rem)] leading-none tracking-[-0.06em] ${ambientMap[bg]}`}>
          {ambient}
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 max-w-[1200px]">
        <p className="scramble-text font-serif text-[clamp(1.6rem,4.5vw,3.5rem)] font-semibold leading-[1.6] tracking-[-0.02em]">
          {text}
        </p>
        <p className={`q-attr mt-10 text-[0.7rem] tracking-[0.25em] uppercase ${attrMap[bg]}`}>
          {attr}
        </p>
      </div>

      <style>{`
        .q-attr {
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.76,0,0.24,1) .5s;
        }
        .visible .q-attr { opacity: 1; }
        .scramble-text .schar { display: inline-block; }
      `}</style>
    </section>
  )
}
