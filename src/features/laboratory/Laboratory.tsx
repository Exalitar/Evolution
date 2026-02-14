import React, { useState, useRef, useEffect } from 'react';
import './Laboratory.css';

type Screen = "main" | "game" | "laboratory" | "premium" | "shop" | "info" | "cabinet" | "market";
type LabSection = 'center' | 'left' | 'right';

type EquipmentType =
  | 'microscope' | 'control_panel' | 'analyzer'
  | 'robot_manipulator' | 'control_panel_left' | 'analyzing_module'
  | 'synthesizer' | 'sequencer' | 'thermostat' | 'cultivator'
  | null;

interface Equipment {
  id: EquipmentType;
  name: string;
  level: number;
  description: string;
}

interface LaboratoryProps {
  playerName: string;
  playerLevel: number;
  playerAvatar: string;
  onNavigate: (screen: Screen) => void;
}

export const Laboratory: React.FC<LaboratoryProps> = ({
  playerName,
  playerLevel,
  playerAvatar,
  onNavigate
}) => {
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
    },
    robot_manipulator: {
      id: 'robot_manipulator',
      name: 'Робот-манипулятор',
      level: 1,
      description: 'Автоматизация процессов сборки ДНК'
    },
    control_panel_left: {
      id: 'control_panel_left',
      name: 'Панель управления',
      level: 1,
      description: 'Контроль всех систем лаборатории'
    },
    analyzing_module: {
      id: 'analyzing_module',
      name: 'Анализирующий модуль',
      level: 1,
      description: 'Глубокий анализ генетических структур'
    },
    synthesizer: {
      id: 'synthesizer',
      name: 'Синтезатор',
      level: 1,
      description: 'Синтез новых генетических последовательностей'
    },
    sequencer: {
      id: 'sequencer',
      name: 'Секвенатор',
      level: 1,
      description: 'Расшифровка ДНК последовательностей'
    },
    thermostat: {
      id: 'thermostat',
      name: 'Термостат',
      level: 1,
      description: 'Инкубация и культивирование образцов'
    },
    cultivator: {
      id: 'cultivator',
      name: 'Культиватор',
      level: 1,
      description: 'Выращивание клеточных культур'
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
    if ((e.target as HTMLElement).closest('.equipment-hotspot') ||
        (e.target as HTMLElement).closest('.lab-ui-element')) return;
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
    if ((e.target as HTMLElement).closest('.equipment-hotspot') ||
        (e.target as HTMLElement).closest('.lab-ui-element')) return;
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
          {/* Интерактивные зоны Block A (Center) */}
          {currentSection === 'center' && (
            <>
              <div 
                className="equipment-hotspot microscope-hotspot"
                onClick={() => handleEquipmentClick('microscope')}
              >
                <div className="equipment-label">Микроскоп</div>
              </div>
              <div 
                className="equipment-hotspot control-panel-hotspot"
                onClick={() => handleEquipmentClick('control_panel')}
              >
                <div className="equipment-label">Панель управления</div>
              </div>
              <div 
                className="equipment-hotspot analyzer-hotspot"
                onClick={() => handleEquipmentClick('analyzer')}
              >
                <div className="equipment-label">Анализатор</div>
              </div>
            </>
          )}

          {/* Интерактивные зоны Block B (Left) */}
          {currentSection === 'left' && (
            <>
              <div 
                className="equipment-hotspot robot-manipulator-hotspot"
                onClick={() => handleEquipmentClick('robot_manipulator')}
              >
                <div className="equipment-label">Робот-манипулятор</div>
              </div>
              <div 
                className="equipment-hotspot control-panel-left-hotspot"
                onClick={() => handleEquipmentClick('control_panel_left')}
              >
                <div className="equipment-label">Панель управления</div>
              </div>
              <div 
                className="equipment-hotspot analyzing-module-hotspot"
                onClick={() => handleEquipmentClick('analyzing_module')}
              >
                <div className="equipment-label">Анализирующий модуль</div>
              </div>
            </>
          )}

          {/* Интерактивные зоны Block C (Right) */}
          {currentSection === 'right' && (
            <>
              <div 
                className="equipment-hotspot synthesizer-hotspot"
                onClick={() => handleEquipmentClick('synthesizer')}
              >
                <div className="equipment-label">Синтезатор</div>
              </div>
              <div 
                className="equipment-hotspot sequencer-hotspot"
                onClick={() => handleEquipmentClick('sequencer')}
              >
                <div className="equipment-label">Секвенатор</div>
              </div>
              <div 
                className="equipment-hotspot thermostat-hotspot"
                onClick={() => handleEquipmentClick('thermostat')}
              >
                <div className="equipment-label">Термостат</div>
              </div>
              <div 
                className="equipment-hotspot cultivator-hotspot"
                onClick={() => handleEquipmentClick('cultivator')}
              >
                <div className="equipment-label">Культиватор</div>
              </div>
            </>
          )}

          {/* Навигационные кнопки между блоками */}
          {currentSection === 'center' && (
            <>
              <button 
                className="lab-nav-button left"
                onClick={() => handleSectionChange('left')}
              >
                <div className="nav-arrow left-arrow">◀</div>
                <span className="nav-label">Block B</span>
              </button>
              <button 
                className="lab-nav-button right"
                onClick={() => handleSectionChange('right')}
              >
                <div className="nav-arrow right-arrow">▶</div>
                <span className="nav-label">Block C</span>
              </button>
            </>
          )}

          {currentSection === 'left' && (
            <button 
              className="lab-nav-button right"
              onClick={() => handleSectionChange('center')}
            >
              <div className="nav-arrow right-arrow">▶</div>
              <span className="nav-label">Block A</span>
            </button>
          )}

          {currentSection === 'right' && (
            <button 
              className="lab-nav-button left"
              onClick={() => handleSectionChange('center')}
            >
              <div className="nav-arrow left-arrow">◀</div>
              <span className="nav-label">Block A</span>
            </button>
          )}
        </div>
      </div>

      {/* UI элементы ФИКСИРОВАННЫЕ к экрану (НЕ двигаются с фоном) */}
      {/* Панель игрока вверху слева - КАК НА ГЛАВНОМ ЭКРАНЕ */}
      <div className="player-info">
        <div className="player-avatar">
          <img src={playerAvatar} alt={playerName} draggable={false} />
        </div>
        <div className="player-details">
          <div className="player-name">{playerName}</div>
          <div className="player-level">Уровень {playerLevel}</div>
        </div>
      </div>

      {/* Кнопка магазина вверху справа - MARKET (другой магазин) */}
      <button 
        className="market-button"
        onClick={() => onNavigate('market')}
      >
        <span className="market-icon">🛒</span>
        Магазин
      </button>

      {/* Навигационная панель внизу - ФИКСИРОВАННАЯ */}
      <div className="bottom-navigation">
        <button className="nav-button active">
          <div className="nav-button-icon">
            <img src="/assets/Icon_button/Lab_button.png" alt="" draggable={false} />
          </div>
          <span className="nav-button-label">Лаборатория</span>
        </button>
        
        <button className="nav-button" onClick={() => onNavigate('premium')}>
          <div className="nav-button-icon">
            <img src="/assets/Icon_button/Premium_button.png" alt="" draggable={false} />
          </div>
          <span className="nav-button-label">Премиум</span>
        </button>
        
        <button className="nav-button" onClick={() => onNavigate('shop')}>
          <div className="nav-button-icon">
            <img src="/assets/Icon_button/Shop_button.png" alt="" draggable={false} />
          </div>
          <span className="nav-button-label">Магазин</span>
        </button>
        
        <button className="nav-button" onClick={() => onNavigate('info')}>
          <div className="nav-button-icon">
            <img src="/assets/Icon_button/Setting_button.png" alt="" draggable={false} />
          </div>
          <span className="nav-button-label">Информация</span>
        </button>
      </div>

      {/* Модальное окно улучшения */}
      {selectedEquipment && (
        <div className="equipment-modal-backdrop" onClick={closeModal}>
          <div className="equipment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="equipment-modal-close" onClick={closeModal}>×</button>
            
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
