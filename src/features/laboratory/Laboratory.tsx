import React, { useState, useRef, useEffect } from 'react';
import './Laboratory.css';

type LabSection = 'center' | 'left' | 'right';

export const Laboratory = () => {
  const [currentSection, setCurrentSection] = useState<LabSection>('center');
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const backgrounds = {
    center: '/assets/Laboratory/Center_lab.png',
    left: '/assets/Laboratory/Left_lab.png',
    right: '/assets/Laboratory/Right_lab.png'
  };

  // Вычисление максимального сдвига
  const getMaxOffset = () => {
    if (!containerRef.current || !imageRef.current) return { min: 0, max: 0 };
    
    const screenWidth = containerRef.current.offsetWidth;
    const imageWidth = imageRef.current.offsetWidth;
    
    if (imageWidth > screenWidth) {
      const maxRight = 0;
      const maxLeft = -(imageWidth - screenWidth);
      return { min: maxLeft, max: maxRight };
    }
    
    return { min: 0, max: 0 };
  };

  // Функция для установки начальной позиции при смене секции
  const setInitialPosition = (from: LabSection, to: LabSection) => {
    setTimeout(() => {
      const { min, max } = getMaxOffset();
      
      if (to === 'center') {
        if (from === 'left') {
          setPosition({ x: max });
        } else if (from === 'right') {
          setPosition({ x: min });
        } else {
          setPosition({ x: (max + min) / 2 });
        }
      } else if (to === 'left') {
        setPosition({ x: min });
      } else if (to === 'right') {
        setPosition({ x: max });
      }
    }, 50);
  };

  // Обработка переходов между секциями
  const handleSectionChange = (newSection: LabSection) => {
    const prevSection = currentSection;
    setCurrentSection(newSection);
    setInitialPosition(prevSection, newSection);
  };

  // Начальная установка центра при первой загрузке
  useEffect(() => {
    setInitialPosition('center', 'center');
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const { min, max } = getMaxOffset();
    
    setPosition({
      x: Math.max(min, Math.min(max, newX))
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
    const { min, max } = getMaxOffset();
    
    setPosition({
      x: Math.max(min, Math.min(max, newX))
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
          ref={imageRef}
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
            onClick={() => handleSectionChange('left')}
          >
            <div className="nav-arrow left-arrow">←</div>
            <span className="nav-label">Block B</span>
          </button>

          <button
            className="lab-nav-button right"
            onClick={() => handleSectionChange('right')}
          >
            <div className="nav-arrow right-arrow">→</div>
            <span className="nav-label">Block C</span>
          </button>
        </>
      )}

      {currentSection === 'left' && (
        <button
          className="lab-nav-button right"
          onClick={() => handleSectionChange('center')}
        >
          <div className="nav-arrow right-arrow">→</div>
          <span className="nav-label">Block A</span>
        </button>
      )}

      {currentSection === 'right' && (
        <button
          className="lab-nav-button left"
          onClick={() => handleSectionChange('center')}
        >
          <div className="nav-arrow left-arrow">←</div>
          <span className="nav-label">Block A</span>
        </button>
      )}
    </div>
  );
};
