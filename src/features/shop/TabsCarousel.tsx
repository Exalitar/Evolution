import React, { useRef, useState, useEffect } from 'react';

export interface TabsCarouselItem {
  id: string;
  label: string;
}

interface TabsCarouselProps {
  items: TabsCarouselItem[];
  activeId: string;
  onSelect: (id: string) => void;
  height?: number;
  autoSpeed?: number; // px в секунду
}

export const TabsCarousel: React.FC<TabsCarouselProps> = ({
  items,
  activeId,
  onSelect,
  height = 40,
  autoSpeed = 20
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState(0); // текущий сдвиг (px, отрицательный)
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const [loopWidth, setLoopWidth] = useState(0); // ширина одного набора вкладок
  const lastTimeRef = useRef<number | null>(null);

  // посчитать ширину одного цикла вкладок
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // один цикл — первая половина детей
    const children = Array.from(track.children);
    const half = children.length / 2;
    const firstLoop = children.slice(0, half) as HTMLElement[];

    const width = firstLoop.reduce((sum, el) => sum + el.offsetWidth, 0);
    setLoopWidth(width);
  }, [items.length]);

  // авто‑движение
  useEffect(() => {
    if (loopWidth <= 0) return;

    let frameId: number;

    const step = (time: number) => {
      if (dragging) {
        lastTimeRef.current = time;
        frameId = requestAnimationFrame(step);
        return;
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }

      const dt = (time - lastTimeRef.current) / 1000; // сек
      lastTimeRef.current = time;

      const delta = autoSpeed * dt; // px
      setOffset((prev) => normalizeOffset(prev - delta, loopWidth));

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      lastTimeRef.current = null;
    };
  }, [autoSpeed, loopWidth, dragging]);

  // нормализация оффсета в пределах [-loopWidth, 0]
  const normalizeOffset = (value: number, width: number) => {
    if (width === 0) return value;
    let v = value;
    while (v <= -width) v += width;
    while (v > 0) v -= width;
    return v;
  };

  // pointer‑drag (мышь + тач)
  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!trackRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = offset;
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || loopWidth <= 0) return;
    const dx = e.clientX - dragStartX.current;
    const next = dragStartOffset.current + dx;
    setOffset(normalizeOffset(next, loopWidth));
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="tabs-carousel-container"
      style={{ height }}
    >
      <div
        className="tabs-carousel-track"
        ref={trackRef}
        style={{
          transform: `translateX(${offset}px)`
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* дублируем массив дважды для бесконечного цикла */}
        {[...items, ...items].map((item, index) => (
          <button
            key={item.id + '-' + index}
            className={
              'shop-tab-button' +
              (item.id === activeId ? ' active' : '')
            }
            type="button"
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
