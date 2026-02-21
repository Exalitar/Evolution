import { useState, useRef, useEffect } from 'react';
import "./styles/App.css";
import { Laboratory } from './features/laboratory/Laboratory';
import { Shop } from './features/shop/Shop';

import {
  CharacterStats,
  baseCharacterStats,
  materialBonuses,
  applyMaterialToStats
} from "./features/balance/hooks/characterStats";

type CharacterId =
  | "species_1"
  | "species_2"
  | "species_3"
  | "species_4"
  | "species_5";

type Screen =
  | "start"
  | "main"
  | "laboratory"
  | "premium"
  | "shop"
  | "info"
  | "market"
  | "nftShop"
  | "settings"
  | "id_person"
  | "avatar"
  | "language"
  | "referal";

interface Material {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface StartMaterial {
  id: CharacterId;
  name: string;
  image: string;
}

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
  upgradeStartTime: number | null; // Добавьте это!
  upgradeDuration: number; // И это!
}

const startMaterials: StartMaterial[] = [
  { id: "species_1", name: "Хищник", image: "/assets/Material/Malecula1.jpg" },
  { id: "species_2", name: "Титан", image: "/assets/Material/Malecula2.jpg" },
  { id: "species_3", name: "Спринтер", image: "/assets/Material/Malecula3.jpg" },
  { id: "species_4", name: "Универсал", image: "/assets/Material/Malecula4.jpg" },
  { id: "species_5", name: "Страж", image: "/assets/Material/Malecula5.jpg" },
];

const breedingMaterialsStage1: Material[] = [
  { id: "m1_1", name: "Водород", image: "/assets/Material/Malecula1.jpg", description: "Материал 1‑1 для 1 пробуждения" },
  { id: "m1_2", name: "Литий", image: "/assets/Material/Malecula2.jpg", description: "Материал 1‑2 для 1 пробуждения" },
  { id: "m1_3", name: "Бериллий", image: "/assets/Material/Malecula3.jpg", description: "Материал 1‑3 для 1 пробуждения" },
  { id: "m1_4", name: "Бор", image: "/assets/Material/Malecula4.jpg", description: "Материал 1‑4 для 1 пробуждения" },
  { id: "m1_5", name: "Углерод", image: "/assets/Material/Malecula5.jpg", description: "Материал 1‑5 для 1 пробуждения" },
];

const breedingMaterialsStage2: Material[] = [
  { id: "m2_1", name: "Материал 2‑1", image: "/assets/Material/Malecula6.jpg", description: "Материал 2‑1 для 2 пробуждения" },
  { id: "m2_2", name: "Материал 2‑2", image: "/assets/Material/Malecula7.jpg", description: "Материал 2‑2 для 2 пробуждения" },
  { id: "m2_3", name: "Материал 2‑3", image: "/assets/Material/Malecula8.jpg", description: "Материал 2‑3 для 2 пробуждения" },
  { id: "m2_4", name: "Материал 2‑4", image: "/assets/Material/Malecula9.jpg", description: "Материал 2‑4 для 2 пробуждения" },
  { id: "m2_5", name: "Материал 2‑5", image: "/assets/Material/Malecula10.jpg", description: "Материал 2‑5 для 2 пробуждения" },
];

const breedingMaterialsStage3: Material[] = [
  { id: "m3_1", name: "Материал 3‑1", image: "/assets/Material/Malecula11.jpg", description: "Материал 3‑1 для 3 пробуждения" },
  { id: "m3_2", name: "Материал 3‑2", image: "/assets/Material/Malecula12.jpg", description: "Материал 3‑2 для 3 пробуждения" },
  { id: "m3_3", name: "Материал 3‑3", image: "/assets/Material/Malecula13.jpg", description: "Материал 3‑3 для 3 пробуждения" },
  { id: "m3_4", name: "Материал 3‑4", image: "/assets/Material/Malecula14.jpg", description: "Материал 3‑4 для 3 пробуждения" },
  { id: "m3_5", name: "Материал 3‑5", image: "/assets/Material/Malecula15.jpg", description: "Материал 3‑5 для 3 пробуждения" },
];

const breedingMaterialsStage4: Material[] = [
  { id: "m4_1", name: "Материал 4‑1", image: "/assets/Material/Malecula16.jpg", description: "Материал 4‑1 для 4 пробуждения" },
  { id: "m4_2", name: "Материал 4‑2", image: "/assets/Material/Malecula17.jpg", description: "Материал 4‑2 для 4 пробуждения" },
  { id: "m4_3", name: "Материал 4‑3", image: "/assets/Material/Malecula18.jpg", description: "Материал 4‑3 для 4 пробуждения" },
  { id: "m4_4", name: "Материал 4‑4", image: "/assets/Material/Malecula19.jpg", description: "Материал 4‑4 для 4 пробуждения" },
  { id: "m4_5", name: "Материал 4‑5", image: "/assets/Material/Malecula20.jpg", description: "Материал 4‑5 для 4 пробуждения" },
];

const breedingMaterialsStage5: Material[] = [
  { id: "m5_1", name: "Материал 5‑1", image: "/assets/Material/Malecula21.jpg", description: "Материал 5‑1 для 5 пробуждения" },
  { id: "m5_2", name: "Материал 5‑2", image: "/assets/Material/Malecula22.jpg", description: "Материал 5‑2 для 5 пробуждения" },
  { id: "m5_3", name: "Материал 5‑3", image: "/assets/Material/Malecula23.jpg", description: "Материал 5‑3 для 5 пробуждения" },
  { id: "m5_4", name: "Материал 5‑4", image: "/assets/Material/Malecula24.jpg", description: "Материал 5‑4 для 5 пробуждения" },
  { id: "m5_5", name: "Материал 5‑5", image: "/assets/Material/Malecula25.jpg", description: "Материал 5‑5 для 5 пробуждения" },
];

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);
  const [finalBioImage, setFinalBioImage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("Игрок");
  const [playerLevel, setPlayerLevel] = useState(1);

  const [awakeningStage, setAwakeningStage] = useState<number>(1);
  const [evolutionStage, setEvolutionStage] = useState<number>(1);
  const [currentBreedingMaterials, setCurrentBreedingMaterials] = useState<Material[]>(breedingMaterialsStage1);
  const [characterForm, setCharacterForm] = useState<number>(1);

  const [draggedInitialMaterial, setDraggedInitialMaterial] = useState<Material | null>(null);
  const [isOverCenterInitial, setIsOverCenterInitial] = useState(false);

  const [draggedBreedMaterial, setDraggedBreedMaterial] = useState<Material | null>(null);
  const [isOverCenterForBreed, setIsOverCenterForBreed] = useState(false);
  const [pendingBreedSelection, setPendingBreedSelection] = useState<Material | null>(null);
  const [isBreedConfirmOpen, setIsBreedConfirmOpen] = useState(false);

  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [usedMaterials, setUsedMaterials] = useState<Set<string>>(new Set());
  const [totalUsedCount, setTotalUsedCount] = useState(0);
  const [showInfoScreen, setShowInfoScreen] = useState(false);

  const [isBreeding, setIsBreeding] = useState(false);
  const [breedingProgress, setBreedingProgress] = useState(0);
  const breedingTimerRef = useRef<number | null>(null);

  const [isAnyUpgrading, setIsAnyUpgrading] = useState(false);
  const [playerCurrency, setPlayerCurrency] = useState(5000);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState<CharacterStats | null>(null);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const goToScreen = (to: Screen) => {
    setScreen(to);
    setIsSettingsOpen(false);
  };

  const [equipment, setEquipment] = useState<Record<string, Equipment>>({
    microscope: {
      id: 'microscope',
      name: 'Микроскоп',
      level: 1,
      description: 'Улучшите для более детального анализа ДНК',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    control_panel: {
      id: 'control_panel',
      name: 'Панель управления',
      level: 1,
      description: 'Улучшите для ускорения процессов синтеза',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    analyzer: {
      id: 'analyzer',
      name: 'Анализатор',
      level: 1,
      description: 'Улучшите для повышения точности экспериментов',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    // ... остальные объекты с теми же полями
    robot_manipulator: {
      id: 'robot_manipulator',
      name: 'Робот-манипулятор',
      level: 1,
      description: 'Автоматизация процессов сборки ДНК',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    control_panel_left: {
      id: 'control_panel_left',
      name: 'Панель управления',
      level: 1,
      description: 'Контроль всех систем лаборатории',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    analyzing_module: {
      id: 'analyzing_module',
      name: 'Анализирующий модуль',
      level: 1,
      description: 'Глубокий анализ генетических структур',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    synthesizer: {
      id: 'synthesizer',
      name: 'Синтезатор',
      level: 1,
      description: 'Синтез новых генетических последовательностей',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    sequencer: {
      id: 'sequencer',
      name: 'Секвенатор',
      level: 1,
      description: 'Расшифровка ДНК последовательностей',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    thermostat: {
      id: 'thermostat',
      name: 'Термостат',
      level: 1,
      description: 'Инкубация и культивирование образцов',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    },
    cultivator: {
      id: 'cultivator',
      name: 'Культиватор',
      level: 1,
      description: 'Выращивание клеточных культур',
      isUpgrading: false,
      upgradeProgress: 0,
      upgradeStartTime: null,
      upgradeDuration: 10000
    }
  });

  const handleStart = () => setScreen("main");

  const getMaterialCharacterId = (materialId: string): CharacterId => {
    const mapping: Record<string, CharacterId> = {
      "m1_1": "species_1",
      "m1_2": "species_2",
      "m1_3": "species_3",
      "m1_4": "species_4",
      "m1_5": "species_5"
    };
    return mapping[materialId] || "species_1";
  };

  const handleEquipmentUpgrade = (equipmentId: string) => {
    if (isAnyUpgrading) return;

    setIsAnyUpgrading(true);
    
    setEquipment(prev => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        isUpgrading: true,
        upgradeStartTime: Date.now()
      }
    }));
  };

  const handlePurchase = (itemId: string, price: number) => {
    setPlayerCurrency(prev => prev - price);
    
    // Здесь можно добавить логику для применения купленного товара
    console.log(`Куплен товар: ${itemId} за ${price} кристаллов`);
    
    // Примеры применения товаров:
    if (itemId === 'boost_breeding_speed') {
      // Активировать ускорение скрещивания
    } else if (itemId === 'premium_material_pack') {
      // Добавить материалы в инвентарь
    }
    // и т.д.
  };

  const canBreedToLevel5 = (): { canBreed: boolean; missingRequirements: string[] } => {
    if (playerLevel !== 4) {
      return { canBreed: true, missingRequirements: [] };
    }

    const missing: string[] = [];

    if (equipment.control_panel.level < 3) {
      missing.push(`Панель управления: уровень ${equipment.control_panel.level}/3`);
    }
    if (equipment.analyzer.level < 2) {
      missing.push(`Анализатор: уровень ${equipment.analyzer.level}/2`);
    }
    if (equipment.thermostat.level < 3) {
      missing.push(`Термостат: уровень ${equipment.thermostat.level}/3`);
    }

    return { canBreed: missing.length === 0, missingRequirements: missing };
  };

  const handleDragStartInitial = (material: Material, e: React.DragEvent) => {
    setDraggedInitialMaterial(material);
    setIsDragging(true);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEndInitial = () => {
    setDraggedInitialMaterial(null);
    setIsOverCenterInitial(false);
    setIsDragging(false);
    setDragPosition(null);
  };

  const handleDragOverCenterInitial = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverCenterInitial(true);
  };

  const handleDragLeaveCenterInitial = () => {
    setIsOverCenterInitial(false);
  };

  const handleDropOnCenterInitial = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverCenterInitial(false);
    
    if (draggedInitialMaterial && !selectedCharacter) {
      const characterId = getMaterialCharacterId(draggedInitialMaterial.id);
      
      setSelectedCharacter(characterId);
      setCurrentStats(baseCharacterStats[characterId]);
      
      setUsedMaterials(new Set([draggedInitialMaterial.id]));
      setTotalUsedCount(1);
      
      setAwakeningStage(1);
      setEvolutionStage(1);
      setCharacterForm(1);
      setCurrentBreedingMaterials(breedingMaterialsStage1);
      
      setDraggedInitialMaterial(null);
      setIsDragging(false);
      setDragPosition(null);
    }
  };

  const handleDragStartBreed = (material: Material, e: React.DragEvent) => {
    setDraggedBreedMaterial(material);
    setIsDragging(true);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEndBreed = () => {
    setDraggedBreedMaterial(null);
    setIsOverCenterForBreed(false);
    setIsDragging(false);
    setDragPosition(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragOverCenterForBreed = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverCenterForBreed(true);
  };

  const handleDragLeaveCenterForBreed = () => {
    setIsOverCenterForBreed(false);
  };

  const handleDropOnCenterForBreed = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverCenterForBreed(false);

    if (draggedBreedMaterial && selectedCharacter && !isBreeding) {
      setPendingBreedSelection(draggedBreedMaterial);
      setIsBreedConfirmOpen(true);
    }
  };

  const handleConfirmBreeding = () => {
    if (!pendingBreedSelection || !selectedCharacter || !currentStats) {
      setIsBreedConfirmOpen(false);
      return;
    }

    // Проверка требований для 4→5
    if (playerLevel === 4) {
      const { canBreed } = canBreedToLevel5();
      if (!canBreed) {
        return;
      }
    }

    setIsBreedConfirmOpen(false);
    setIsBreeding(true);
    setBreedingProgress(0);

    const breedDuration = 5000;
    const updateInterval = 100;

    let progress = 0;
    const timer = window.setInterval(() => {
      progress += (updateInterval / breedDuration) * 100;

      if (progress >= 100) {
        clearInterval(timer);

        const bonusMap = materialBonuses[pendingBreedSelection.id];
        const bonus = bonusMap?.[selectedCharacter];

        if (bonus) {
          // применяем новый модуль характеристик
          const updatedStats = applyMaterialToStats(currentStats, bonus);
          setCurrentStats(updatedStats);
        }

        setUsedMaterials((prev) => new Set([...prev, pendingBreedSelection.id]));

        const newTotalCount = totalUsedCount + 1;
        setTotalUsedCount(newTotalCount);
        setCharacterForm((prev) => Math.min(prev + 1, 5));

        const newPlayerLevel = playerLevel + 1;
        setPlayerLevel(newPlayerLevel);

        if (newPlayerLevel === 5) {
          const materialNumber = pendingBreedSelection.id.replace("m", "").replace("_", "-");
          setFinalBioImage(`/assets/Material/Bio${materialNumber}.jpg`);

          setCurrentBreedingMaterials(breedingMaterialsStage2);
          setUsedMaterials(new Set());
        }

        if (newTotalCount > 0 && newTotalCount % 5 === 0) {
          const nextStage = Math.floor(newTotalCount / 5) + 1;
          if (nextStage === 2) {
            setAwakeningStage(2);
            setCurrentBreedingMaterials(breedingMaterialsStage2);
          } else if (nextStage === 3) {
            setAwakeningStage(3);
            setCurrentBreedingMaterials(breedingMaterialsStage3);
          } else if (nextStage === 4) {
            setAwakeningStage(4);
            setCurrentBreedingMaterials(breedingMaterialsStage4);
          } else if (nextStage === 5) {
            setAwakeningStage(5);
            setCurrentBreedingMaterials(breedingMaterialsStage5);
          }

          const newEvolutionStage = Math.min(evolutionStage + 1, 5);
          setEvolutionStage(newEvolutionStage);
        }

        setIsBreeding(false);
        setBreedingProgress(0);
        setPendingBreedSelection(null);
      } else {
        setBreedingProgress(progress);
      }
    }, updateInterval);

    breedingTimerRef.current = timer;
  };

  const handleCancelBreeding = () => {
    setIsBreedConfirmOpen(false);
    setPendingBreedSelection(null);
  };

  const handleCentralCircleClick = () => {
    // Клик по центральному кругу
  };

  const getCharacterImage = () => {
    if (!selectedCharacter) return "";
    
    // Если уровень 5 и есть финальное изображение
    if (playerLevel === 5 && finalBioImage) {
      return finalBioImage;
    }
    
    // Для уровней 1-4 используем базовое изображение Bio
    return "/assets/Material/Bio.png";
  };

  // ========== ДОБАВЬТЕ useEffect ЗДЕСЬ (ПЕРЕД return) ==========
  useEffect(() => {
    const saved = localStorage.getItem('equipment');
    if (saved) {
      setEquipment(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => {
        const updated = { ...prev };
        let hasUpgrading = false;

        Object.keys(updated).forEach(key => {
          const item = updated[key];
          
          if (item.isUpgrading && item.upgradeStartTime) {
            const elapsed = Date.now() - item.upgradeStartTime;
            const progress = Math.min((elapsed / item.upgradeDuration) * 100, 100);

            if (progress >= 100) {
              updated[key] = {
                ...item,
                level: item.level + 1,
                isUpgrading: false,
                upgradeProgress: 0,
                upgradeStartTime: null
              };
            } else {
              updated[key] = {
                ...item,
                upgradeProgress: progress
              };
              hasUpgrading = true;
            }
          }
        });

        setIsAnyUpgrading(hasUpgrading);
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]); // Выполнится каждый раз когда equipment изменится

  return (
    <>
      {screen === "start" && (
        <div className="start-screen">
          <button className="start-button" onClick={handleStart}>
            Играть
          </button>
        </div>
      )}

      {screen === "main" && (
        <div className="main-screen">
           {selectedCharacter && (
              <>
                <div
                  className="player-info"
                  onClick={() => {
                    setScreen("info");
                  }}
                >
                  <div className="player-avatar">
                    <img
                      src={getCharacterImage()}
                      alt="Player Avatar"
                      draggable={false}
                    />
                  </div>
                  <div className="player-details">
                    <div className="player-name">{playerName}</div>
                    <div className="player-level">Уровень {playerLevel}</div>
                  </div>
                </div>

                {/* ТОЛЬКО ЭТА КНОПКА */}
                <button
                  className="market-button"
                  onClick={() => setScreen("shop")}
                >
                  <span className="market-icon" />
                  <span className="market-label">Магазин</span>
                </button>
              </>
            )}

          <div
            className={`central-circle ${
              !selectedCharacter
                ? isOverCenterInitial
                  ? "drag-over"
                  : ""
                : isOverCenterForBreed && !isBreeding
                ? "drag-over-breed"
                : "has-character"
            }`}
            onDragOver={
              isBreeding
                ? undefined
                : !selectedCharacter
                ? handleDragOverCenterInitial
                : handleDragOverCenterForBreed
            }
            onDragLeave={
              isBreeding
                ? undefined
                : !selectedCharacter
                ? handleDragLeaveCenterInitial
                : handleDragLeaveCenterForBreed
            }
            onDrop={
              isBreeding
                ? undefined
                : !selectedCharacter
                ? handleDropOnCenterInitial
                : handleDropOnCenterForBreed
            }
            onClick={selectedCharacter ? handleCentralCircleClick : undefined}
          >
            {!selectedCharacter ? (
              <div className="central-placeholder">
                Перетащите материал сюда, чтобы начать
              </div>
            ) : (
              <>
                <img
                  src={getCharacterImage()}
                  alt="Selected Character"
                  className="central-character-image"
                  draggable={false}
                />
                
                {/* Таймер скрещивания */}
                {isBreeding && (
                  <div className="breeding-timer-overlay">
                    <div 
                      className="breeding-progress-bar"
                      style={{ width: `${breedingProgress}%` }}
                    />
                    <span className="breeding-timer-text">
                      {Math.ceil((5000 * (100 - breedingProgress)) / 100 / 1000)}s
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="materials-container">
            {currentBreedingMaterials.map((material) => {
              const isDraggingThis = selectedCharacter 
                ? draggedBreedMaterial?.id === material.id
                : draggedInitialMaterial?.id === material.id;
              const isUsed = usedMaterials.has(material.id);
              
              return (
                <div
                  key={material.id}
                  className={`small-circle breeding-material ${
                    isDraggingThis ? "is-dragging" : ""
                  } ${isUsed || isBreeding ? "is-used" : ""}`}
                  draggable={!isUsed && !isBreeding}
                  onDragStart={(e) => {
                    if (isUsed || isBreeding) return;
                    if (selectedCharacter) {
                      handleDragStartBreed(material, e);
                    } else {
                      handleDragStartInitial(material, e);
                    }
                  }}
                  onDrag={handleDrag}
                  onDragEnd={selectedCharacter ? handleDragEndBreed : handleDragEndInitial}
                >
                  <img
                    src={material.image}
                    alt={material.name}
                    className="small-circle-image"
                    draggable={false}
                  />
                  <div className="small-circle-name">{material.name}</div>
                </div>
              );
            })}
          </div>

          {isDragging && dragPosition && (draggedBreedMaterial || draggedInitialMaterial) && (
            <div 
              className="dragging-ghost"
              style={{
                left: `${dragPosition.x}px`,
                top: `${dragPosition.y}px`,
              }}
            >
              <img 
                src={(draggedBreedMaterial || draggedInitialMaterial)!.image} 
                alt="Dragging"
                className="dragging-ghost-image"
                draggable={false}
              />
            </div>
          )}

          {selectedCharacter && (
            <div className="bottom-navigation">
              <button className="nav-button" onClick={() => setScreen("laboratory")}>
                <div className="nav-button-icon">
                  <img src="/assets/Icon_button/Lab_button.png" alt="Лаборатория" draggable={false} />
                </div>
                <span className="nav-button-label">Лаборатория</span>
              </button>

              <button className="nav-button" onClick={() => setScreen("premium")}>
                <div className="nav-button-icon">
                  <img src="/assets/Icon_button/Premium_button.png" alt="Премиум" draggable={false} />
                </div>
                <span className="nav-button-label">Премиум</span>
              </button>

              <button className="nav-button" onClick={() => setScreen("nftShop")}>
                <div className="nav-button-icon">
                  <img src="assets/Icon_button/Shop_button.png" alt="" draggable={false} />
                </div>
                <span className="nav-button-label">NFT магазин</span>
              </button>

              <button className="nav-button" onClick={openSettings}>
                <div className="nav-button-icon">
                  <img
                    src="/assets/Icon_button/Setting_button.png"
                    alt=""
                    draggable={false}
                  />
                </div>
                <span className="nav-button-label">Настройки</span>
              </button>
            </div>
          )}
        </div>
      )}

      {screen === 'laboratory' && (
        <Laboratory
          playerName={playerName}
          playerLevel={playerLevel}
          playerAvatar={getCharacterImage()} // ← Используйте функцию getCharacterImage
          onNavigate={(newScreen) => setScreen(newScreen as Screen)}
          equipment={equipment}
          onUpgrade={handleEquipmentUpgrade}
          isAnyUpgrading={isAnyUpgrading}
        />
      )}

      {screen === "premium" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>Премиум</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content">
            <p>Премиум функции будут здесь</p>
          </div>
        </div>
      )}

      {screen === "shop" && (
        <Shop 
          onClose={() => setScreen("main")}
          playerCurrency={playerCurrency}
          onPurchase={handlePurchase}
        />
      )}

      {screen === "nftShop" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>NFT магазин</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content">
            {/* Здесь потом сделаем сетку NFT как в основном магазине */}
            <p>Здесь будет NFT‑маркетплейс</p>
          </div>
        </div>
      )}

      {screen === "info" && (
        <div className="info-screen">
          <div className="info-header">
            <h2>Характеристики персонажа</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          
          <div className="info-content">
            {selectedCharacter ? (
              <>
                <div className="info-character-preview">
                  <img src={getCharacterImage()} alt={selectedCharacter} className="info-character-image" draggable={false} />
                  <div className="info-character-name">
                    {selectedCharacter === "species_1" && "Хищник"}
                    {selectedCharacter === "species_2" && "Титан"}
                    {selectedCharacter === "species_3" && "Спринтер"}
                    {selectedCharacter === "species_4" && "Универсал"}
                    {selectedCharacter === "species_5" && "Страж"}
                  </div>
                </div>
                
                <div className="info-stats-list">
                  {currentStats && (
                    <>
                      {/* 1. Сила удара */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">⚔️</span>
                          <span className="stat-name">Сила удара</span>
                          <span className="stat-value">{currentStats.strikePower}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar attack"
                            style={{ width: `${Math.min((currentStats.strikePower / 300) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="stat-description">
                          Базовый наносимый урон всеми атаками. Эффективен в коротких боях,
                          усиливается скоростью и критическим потенциалом.
                        </div>
                      </div>

                      {/* 2. Биоресурс */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">💚</span>
                          <span className="stat-name">Биоресурс</span>
                          <span className="stat-value">{currentStats.bioResource}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar health"
                            style={{ width: `${Math.min((currentStats.bioResource / 400) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="stat-description">
                          Общий запас жизненной энергии организма. Повышает выживаемость,
                          может усиливать вампиризм и сопротивления.
                        </div>
                      </div>

                      {/* 3. Матрица защиты (покажем 6 типов строкой) */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">🛡️</span>
                          <span className="stat-name">Матрица защиты</span>
                          <span className="stat-value">
                            {currentStats.defenseMatrix.kinetic +
                              currentStats.defenseMatrix.energy +
                              currentStats.defenseMatrix.bio +
                              currentStats.defenseMatrix.toxic +
                              currentStats.defenseMatrix.psionic +
                              currentStats.defenseMatrix.tech}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar defense"
                            style={{
                              width: `${Math.min(
                                ((currentStats.defenseMatrix.kinetic +
                                  currentStats.defenseMatrix.energy +
                                  currentStats.defenseMatrix.bio +
                                  currentStats.defenseMatrix.toxic +
                                  currentStats.defenseMatrix.psionic +
                                  currentStats.defenseMatrix.tech) /
                                  600) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="stat-description">
                          Система сопротивлений организма. Кинетическая, энергетическая,
                          биологическая, токсическая, псионическая и технологическая защита
                          снижают урон соответствующего типа.
                        </div>
                      </div>

                      {/* 4. Темп атаки */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">⚡</span>
                          <span className="stat-name">Темп атаки</span>
                          <span className="stat-value">{currentStats.attackTempo.toFixed(2)}</span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar speed"
                            style={{ width: `${Math.min((currentStats.attackTempo / 3) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="stat-description">
                          Определяет, кто ходит первым и насколько часто атакует. При высоком
                          значении позволяет навязывать инициативу и прерывать действия врага.
                        </div>
                      </div>

                      {/* 5. Реактивная защита */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">🌀</span>
                          <span className="stat-name">Реактивная защита</span>
                          <span className="stat-value">
                            Парир: {currentStats.reactiveDefense.parryChance}% · Сопрот:{" "}
                            {currentStats.reactiveDefense.mitigationChance}% /
                            {currentStats.reactiveDefense.mitigationValue}%
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar defense"
                            style={{
                              width: `${Math.min(
                                (currentStats.reactiveDefense.parryChance +
                                  currentStats.reactiveDefense.mitigationChance) /
                                  2,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="stat-description">
                          Сложная защитная система. Парирование даёт шанс полностью избежать
                          урона, сопротивление частично поглощает 33–50% входящего урона.
                        </div>
                      </div>

                      {/* 6. Критический потенциал */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">💥</span>
                          <span className="stat-name">Критический потенциал</span>
                          <span className="stat-value">
                            {currentStats.critPotential.critChance}% ×
                            {currentStats.critPotential.critMultiplier.toFixed(2)}
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar attack"
                            style={{ width: `${Math.min(currentStats.critPotential.critChance, 100)}%` }}
                          />
                        </div>
                        <div className="stat-description">
                          Отвечает за взрывной урон. Включает шанс критического удара и
                          множитель урона критов.
                        </div>
                      </div>

                      {/* 7. Хищный резонанс (вампиризм) */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">🩸</span>
                          <span className="stat-name">Хищный резонанс</span>
                          <span className="stat-value">
                            {currentStats.predatoryResonance.lifestealPercent}% ·{" "}
                            {currentStats.predatoryResonance.lifestealChance}%
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar health"
                            style={{
                              width: `${Math.min(
                                (currentStats.predatoryResonance.lifestealPercent *
                                  currentStats.predatoryResonance.lifestealChance) /
                                  50,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="stat-description">
                          Восстанавливает здоровье за счёт нанесённого урона. Особенно силён
                          при высокой скорости атак.
                        </div>
                      </div>

                      {/* 8. Токсичность */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">☣️</span>
                          <span className="stat-name">Токсичность</span>
                          <span className="stat-value">
                            {currentStats.toxicity.dotDamage} / {currentStats.toxicity.dotChance}%
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar attack"
                            style={{
                              width: `${Math.min(
                                (currentStats.toxicity.dotDamage * currentStats.toxicity.dotChance) / 60,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="stat-description">
                          Наносит урон со временем. Сочетает периодический урон и шанс
                          наложения эффекта.
                        </div>
                      </div>

                      {/* 9. Нейрошок */}
                      <div className="stat-item">
                        <div className="stat-header">
                          <span className="stat-icon">🧠</span>
                          <span className="stat-name">Нейрошок</span>
                          <span className="stat-value">
                            урн {currentStats.neuroShock.shockDamage} · шанс{" "}
                            {currentStats.neuroShock.stunChance}% ·{" "}
                            {currentStats.neuroShock.stunDuration}s / cd{" "}
                            {currentStats.neuroShock.stunCooldown}s
                          </span>
                        </div>
                        <div className="stat-bar-container">
                          <div
                            className="stat-bar control"
                            style={{
                              width: `${Math.min(
                                (currentStats.neuroShock.stunChance *
                                  currentStats.neuroShock.stunDuration) /
                                  (currentStats.neuroShock.stunCooldown || 1),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="stat-description">
                          Контрольная характеристика: шанс оглушить врага, длительность стана и
                          откат после срабатывания.
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="info-description">
                  <h3>Особенности</h3>
                  <p>
                    {selectedCharacter === "species_1" && "Высокая атака и скорость, но слабая защита. Идеален для агрессивного стиля игры."}
                    {selectedCharacter === "species_2" && "Максимальное здоровье и защита. Медленный, но очень живучий персонаж."}
                    {selectedCharacter === "species_3" && "Самый быстрый персонаж в игре. Наносит частые удары, но хрупок."}
                    {selectedCharacter === "species_4" && "Сбалансированные характеристики. Подходит для универсальной стратегии."}
                    {selectedCharacter === "species_5" && "Специализируется на защите. Отлично выдерживает атаки врагов."}
                  </p>
                </div>
                
                <div className="info-stage-display">
                  <div className="stage-badge">
                    <span className="stage-label">Стадия эволюции</span>
                    <span className="stage-number">{evolutionStage}/5</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="info-no-character">
                <p>Персонаж еще не выбран</p>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "id_person" && (
        <div>Здесь будет экран с ID Telegram</div>
      )}

      {screen === "avatar" && (
        <div>Экран смены аватара</div>
      )}

      {screen === "language" && (
        <div>Экран выбора языка</div>
      )}

      {screen === "referal" && (
        <div>Экран с реферальной ссылкой</div>
      )}

      {isSettingsOpen && (
        <div className="settings-modal-backdrop" onClick={closeSettings}>
          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
          >
            <h2>Настройки</h2>

            <button className="settings-btn" onClick={() => goToScreen("id_person")}>
              ID Telegram
            </button>

            <button className="settings-btn" onClick={() => goToScreen("avatar")}>
              Смена аватара
            </button>

            <button className="settings-btn" onClick={() => goToScreen("language")}>
              Смена языка
            </button>

            <button className="settings-btn" onClick={() => goToScreen("referal")}>
              Реферальная ссылка
            </button>

            <button className="settings-close" onClick={closeSettings}>
              <span>×</span>
            </button>
          </div>
        </div>
      )}

      {isBreedConfirmOpen && pendingBreedSelection && selectedCharacter && (
        <div className="breed-modal-backdrop">
          <div className="breed-modal">
            <div className="breed-modal-title">Вы точно хотите выполнить это скрещивание?</div>
            <div className="breed-modal-text">
              Скрестить {pendingBreedSelection.name}?
            </div>

            {materialBonuses[pendingBreedSelection.id]?.[selectedCharacter] && (
              <div className="breed-modal-info">
                <div className="breed-modal-bonus">
                  <div className="bonus-title">Бонусы (примерные):</div>
                  <div className="bonus-stats">
                    <span>⚔ Сила удара: +{materialBonuses[pendingBreedSelection.id][selectedCharacter].strikePower}</span>
                    <span>💚 Биоресурс: +{materialBonuses[pendingBreedSelection.id][selectedCharacter].bioResource}</span>
                    <span>🛡 Матрица защиты: +{materialBonuses[pendingBreedSelection.id][selectedCharacter].defenseMatrix?.kinetic ?? 0}</span>
                    <span>⚡ Темп атаки: +{materialBonuses[pendingBreedSelection.id][selectedCharacter].attackTempo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Требования для скрещивания 4→5 */}
            {playerLevel === 4 && (() => {
              const { canBreed, missingRequirements } = canBreedToLevel5();
              if (!canBreed) {
                return (
                  <div className="breed-requirements">
                    <div className="requirements-title">⚠️ Требования не выполнены:</div>
                    <div className="requirements-list">
                      {missingRequirements.map((req, index) => (
                        <div key={index} className="requirement-item">❌ {req}</div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="breed-requirements">
                    <div className="requirements-title-success">✅ Все требования выполнены!</div>
                  </div>
                );
              }
            })()}

            <div className="breed-modal-buttons">
              <button
                className={`breed-modal-button yes ${playerLevel === 4 && !canBreedToLevel5().canBreed ? 'disabled' : ''}`}
                onClick={handleConfirmBreeding}
                disabled={playerLevel === 4 && !canBreedToLevel5().canBreed}
              >
                Да
              </button>
              <button className="breed-modal-button no" onClick={handleCancelBreeding}>
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
