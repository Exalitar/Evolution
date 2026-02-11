import React, { useState, useRef, useEffect } from 'react';
import './Laboratory.css';

type LabSection = 'center' | 'left' | 'right';

export const Laboratory = () => {
  const [currentSection, setCurrentSection] = useState<LabSection>('center');
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const backgrounds = {
    center: '/assets/Laboratory/Center_lab.png',
    left: '/assets/Laboratory/Left_lab.png',
    right: '/assets/Laboratory/Right_lab.png'
  };

  // Сброс позиции при смене секции
  useEffect(() => {
    setPosition({ x: 0 });
  }, [currentSection]);

  // Вычисление максимального сдвига
  const getMaxOffset = () => {
    if (!containerRef.current) return 0;
    const screenWidth = containerRef.current.offsetWidth;
    const screenHeight = containerRef.current.offsetHeight;
    
    // Вычисляем ширину изображения при высоте 100vh
    // Пропорция: 1536 / 1024 (ширина / высота оригинала)
    const imageWidth = screenHeight * (1536 / 1024);
    
    // Если изображение шире экрана, можем двигать
    return Math.max(0, (imageWidth - screenWidth) / 2);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const maxOffset = getMaxOffset();
    
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const maxOffset = getMaxOffset();
    
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="laboratory-page">
      <div
        ref={containerRef}
        className="laboratory-background-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="laboratory-background"
          style={{
            backgroundImage: `url(${backgrounds[currentSection]})`,
            transform: `translateX(${position.x}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        />
      </div>

      {/* Навигационные кнопки */}
      {currentSection === 'center' && (
        <>
          <button
            className="lab-nav-button left"
            onClick={() => setCurrentSection('left')}
          >
            <div className="nav-arrow left-arrow">←</div>
            <span className="nav-label">Левый блок</span>
          </button>

          <button
            className="lab-nav-button right"
            onClick={() => setCurrentSection('right')}
          >
            <div className="nav-arrow right-arrow">→</div>
            <span className="nav-label">Правый блок</span>
          </button>
        </>
      )}

      {currentSection === 'left' && (
        <button
          className="lab-nav-button right"
          onClick={() => setCurrentSection('center')}
        >
          <div className="nav-arrow right-arrow">→</div>
          <span className="nav-label">Центр</span>
        </button>
      )}

      {currentSection === 'right' && (
        <button
          className="lab-nav-button left"
          onClick={() => setCurrentSection('center')}
        >
          <div className="nav-arrow left-arrow">←</div>
          <span className="nav-label">Центр</span>
        </button>
      )}
    </div>
  );
};
