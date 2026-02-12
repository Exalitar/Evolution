import React, { useState, useRef, useEffect } from 'react';
import './Laboratory.css';

type LabSection = 'center' | 'left' | 'right';
type EquipmentType = 'microscope' | 'control_panel' | 'analyzer' | null;

interface Equipment {
  id: EquipmentType;
  name: string;
  level: number;
  description: string;
}

export const Laboratory = () => {
  const [currentSection, setCurrentSection] = useState<LabSection>('center');
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0 });
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const backgrounds = {
    center: '/assets/Laboratory/Center_lab.png',
    left: '/assets/Laboratory/Left_lab.png',
    right: '/assets/Laboratory/Right_lab.png'
  };

  const [equipment, setEquipment] = useState<Record<string, Equipment>>({
    microscope: {
      id: 'microscope',
      name: 'Микроскоп',
      level: 1,
      description: 'Улучшите для более детального анализа ДНК'
    },
    control_panel: {
      id: 'control_panel',
      name: 'Панель управления',
      level: 1,
      description: 'Улучшите для ускорения процессов синтеза'
    },
    analyzer: {
      id: 'analyzer',
      name: 'Анализатор',
      level: 1,
      description: 'Улучшите для повышения точности экспериментов'
    }
  });

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

  const handleSectionChange = (newSection: LabSection) => {
    const prevSection = currentSection;
    setCurrentSection(newSection);
    setInitialPosition(prevSection, newSection);
  };

  useEffect(() => {
    setInitialPosition('center', 'center');
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.equipment-hotspot')) return;
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
    if ((e.target as HTMLElement).closest('.equipment-hotspot')) return;
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

  const handleEquipmentClick = (equipmentId: EquipmentType) => {
    setSelectedEquipment(equipmentId);
  };

  const handleUpgrade = (equipmentId: string) => {
    setEquipment(prev => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        level: prev[equipmentId].level + 1
      }
    }));
  };

  const closeModal = () => {
    setSelectedEquipment(null);
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
        >
          {/* Интерактивные зоны только для центральной секции */}
          {currentSection === 'center' && (
            <>
              {/* Левая зона - Микроскоп */}
              <div
                className="equipment-hotspot microscope-hotspot"
                onClick={() => handleEquipmentClick('microscope')}
                title="Микроскоп"
              />

              {/* Центральная зона - Панель управления */}
              <div
                className="equipment-hotspot control-panel-hotspot"
                onClick={() => handleEquipmentClick('control_panel')}
                title="Панель управления"
              />

              {/* Правая зона - Анализатор */}
              <div
                className="equipment-hotspot analyzer-hotspot"
                onClick={() => handleEquipmentClick('analyzer')}
                title="Анализатор"
              />
            </>
          )}
        </div>
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

      {/* Модальное окно улучшения */}
      {selectedEquipment && (
        <div className="equipment-modal-backdrop" onClick={closeModal}>
          <div className="equipment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="equipment-modal-close" onClick={closeModal}>✕</button>
            
            <div className="equipment-modal-content">
              <h2 className="equipment-modal-title">
                {equipment[selectedEquipment].name}
              </h2>
              
              <div className="equipment-level-display">
                <span className="level-label">Уровень</span>
                <span className="level-number">{equipment[selectedEquipment].level}</span>
              </div>
              
              <p className="equipment-description">
                {equipment[selectedEquipment].description}
              </p>
              
              <div className="equipment-stats">
                <div className="stat-row">
                  <span className="stat-label">Производительность:</span>
                  <span className="stat-value">+{equipment[selectedEquipment].level * 10}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Эффективность:</span>
                  <span className="stat-value">+{equipment[selectedEquipment].level * 5}%</span>
                </div>
              </div>
              
              <div className="equipment-upgrade-section">
                <div className="upgrade-cost">
                  <span className="cost-label">Стоимость улучшения:</span>
                  <span className="cost-value">{equipment[selectedEquipment].level * 1000} 💎</span>
                </div>
                
                <button 
                  className="upgrade-button"
                  onClick={() => handleUpgrade(selectedEquipment)}
                >
                  Улучшить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
