'use client'

import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = 'black' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef<number>(0);

  // 组件强依赖浏览器尺寸与 GSAP，挂载后再渲染，避免 SSR 访问 window
  const [mounted, setMounted] = useState(false);
  const [colCount, setColCount] = useState(7)
  const [rowCount, setRowCount] = useState(4)

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 1024
      if (mobile) {
        setColCount(4)
        setRowCount(7)
      } else {
        setColCount(7)
        setRowCount(4)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    mouseXRef.current = window.innerWidth / 2;
    const isMobile = window.innerWidth < 1024;
    gsap.ticker.lagSmoothing(0);

    if (isMobile) {
      rowRefs.current.forEach((row, index) => {
        if (row) {
          gsap.set(row, { x: (index % 2 === 0 ? 60 : -60) });
        }
      });
      return;
    }

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = (): void => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.5, 0.4, 0.35, 0.3, 0.25, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-full overflow-hidden relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[length:250px]"></div>
        <div className="gap-4 flex-none relative w-[200vw] h-[180vh] lg:w-[150vw] lg:h-[150vh] grid grid-rows-7 lg:grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-4 lg:grid-cols-7"
              style={{ willChange: 'transform, filter' }}
              ref={el => {
                if (el) rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: colCount }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * colCount + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-gray-100 flex items-center justify-center text-gray-900 text-[clamp(0.6rem,2vw,1.5rem)]">
                      {typeof content === 'string' && content.startsWith('http') ? (
                        <div
                          className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                          style={{ backgroundImage: `url(${content})` }}
                        />
                      ) : (
                        <div className="p-4 text-center z-[1] font-medium">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default GridMotion;