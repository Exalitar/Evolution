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
  isUpgrading: boolean;
  upgradeProgress: number;
}

interface LaboratoryProps {
  playerName: string;
  playerLevel: number;
  playerAvatar: string;
  onNavigate: (screen: Screen) => void;
  equipment: Record<string, Equipment>;
  onUpgrade: (equipmentId: string) => void;
  isAnyUpgrading: boolean;
}

export const Laboratory: React.FC<LaboratoryProps> = ({
  playerName,
  playerLevel,
  playerAvatar,
  onNavigate,
  equipment,
  onUpgrade,
  isAnyUpgrading
}) => {
  const [currentSection, setCurrentSection] = useState<LabSection>('center');
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0 });
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const upgradeTimerRef = useRef<number | null>(null);

  const backgrounds = {
    center: '/assets/Laboratory/Center_lab.png',
    left: '/assets/Laboratory/Left_lab.png',
    right: '/assets/Laboratory/Right_lab.png'
  };

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
        (e.target as HTMLElement).closest('.lab-ui-element') ||
        (e.target as HTMLElement).closest('.dna-zoom-button')) return;
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
        (e.target as HTMLElement).closest('.lab-ui-element') ||
        (e.target as HTMLElement).closest('.dna-zoom-button')) return;
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

  const closeModal = () => {
    setSelectedEquipment(null);
  };

  useEffect(() => {
    return () => {
      if (upgradeTimerRef.current) {
        clearInterval(upgradeTimerRef.current);
      }
    };
  }, []);

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
              {/* Кнопка возврата на главную на ДНК */}
              <button 
                className="dna-zoom-button"
                onClick={() => onNavigate('main')}
              >
                <div className="zoom-arrow">↑</div>
                <span className="zoom-label">Вернуться</span>
              </button>

              <div 
                className="equipment-hotspot microscope-hotspot"
                onClick={() => handleEquipmentClick('microscope')}
              >
                <div className="equipment-label">
                  {equipment.microscope.name} (lvl {equipment.microscope.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot control-panel-hotspot"
                onClick={() => handleEquipmentClick('control_panel')}
              >
                <div className="equipment-label">
                  {equipment.control_panel.name} (lvl {equipment.control_panel.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot analyzer-hotspot"
                onClick={() => handleEquipmentClick('analyzer')}
              >
                <div className="equipment-label">
                  {equipment.analyzer.name} (lvl {equipment.analyzer.level})
                </div>
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
                <div className="equipment-label">
                  {equipment.robot_manipulator.name} (lvl {equipment.robot_manipulator.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot control-panel-left-hotspot"
                onClick={() => handleEquipmentClick('control_panel_left')}
              >
                <div className="equipment-label">
                  {equipment.control_panel_left.name} (lvl {equipment.control_panel_left.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot analyzing-module-hotspot"
                onClick={() => handleEquipmentClick('analyzing_module')}
              >
                <div className="equipment-label">
                  {equipment.analyzing_module.name} (lvl {equipment.analyzing_module.level})
                </div>
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
                <div className="equipment-label">
                  {equipment.synthesizer.name} (lvl {equipment.synthesizer.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot sequencer-hotspot"
                onClick={() => handleEquipmentClick('sequencer')}
              >
                <div className="equipment-label">
                  {equipment.sequencer.name} (lvl {equipment.sequencer.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot thermostat-hotspot"
                onClick={() => handleEquipmentClick('thermostat')}
              >
                <div className="equipment-label">
                  {equipment.thermostat.name} (lvl {equipment.thermostat.level})
                </div>
              </div>
              <div 
                className="equipment-hotspot cultivator-hotspot"
                onClick={() => handleEquipmentClick('cultivator')}
              >
                <div className="equipment-label">
                  {equipment.cultivator.name} (lvl {equipment.cultivator.level})
                </div>
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

      {/* UI элементы ФИКСИРОВАННЫЕ к экрану */}
      <div className="player-info">
        <div className="player-avatar">
          <img src={playerAvatar} alt={playerName} draggable={false} />
        </div>
        <div className="player-details">
          <div className="player-name">{playerName}</div>
          <div className="player-level">Уровень {playerLevel}</div>
        </div>
      </div>

      <button 
        className="market-button"
        onClick={() => onNavigate('market')}
      >
        <span className="market-icon">🛒</span>
        Магазин
      </button>

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
                
                {equipment[selectedEquipment].isUpgrading ? (
                  <div className="upgrade-progress-container">
                    <div 
                      className="upgrade-progress-bar"
                      style={{ width: `${equipment[selectedEquipment].upgradeProgress}%` }}
                    />
                    <span className="upgrade-progress-text">
                      {Math.ceil((10000 * (100 - equipment[selectedEquipment].upgradeProgress)) / 100 / 1000)}s
                    </span>
                  </div>
                ) : (
                  <button 
                    className={`upgrade-button ${isAnyUpgrading ? 'disabled' : ''}`}
                    onClick={() => onUpgrade(selectedEquipment)}
                    disabled={isAnyUpgrading}
                  >
                    {isAnyUpgrading ? 'Идет улучшение...' : 'Улучшить'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
