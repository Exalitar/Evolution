import { useState, useRef, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import "./styles/App.css";
import { Laboratory } from './features/laboratory/Laboratory';
import { Shop } from './features/shop/Shop';
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';


import {
  CharacterStats,
  baseCharacterStats,
  materialBonuses,
  applyMaterialToStats,
  detectCurrentFocus,
  getBaseAttackTempoFromStrike,
  MaterialBonus,
  MainFocus,
} from "./features/balance/hooks/characterStats";

import {
  materialDefinitions,
  breedingMaterialsStage1,
  breedingMaterialsStage2,
  breedingMaterialsStage3,
  breedingMaterialsStage4,
  breedingMaterialsStage5,
  MaterialDefinition,
} from "./features/balance/hooks/materialsConfig";

const API = import.meta.env.VITE_API_URL || "";

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

interface StartMaterial {
  id: CharacterId;
  name: string;
  image: string;
}

type Material = MaterialDefinition;

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

const buildAdaptiveMaterials = (
  baseMaterials: MaterialDefinition[],
  stats: CharacterStats
): MaterialDefinition[] => {
  // доступные «типы» характеристик
  const focuses = [
    "strikePower",
    "bioResource",
    "defense",
    "crit",
    "lifesteal",
    "dot",
    "stun",
  ] as const;

  type Focus = (typeof focuses)[number];

  const getRandomFocusPair = (): [Focus, Focus] => {
    const f1 = focuses[Math.floor(Math.random() * focuses.length)];
    let f2: Focus;
    do {
      f2 = focuses[Math.floor(Math.random() * focuses.length)];
    } while (f2 === f1);
    return [f1, f2];
  };

  const makePartBonus = (focus: Focus): MaterialBonus => {
    switch (focus) {
      case "strikePower":
        return { strikePower: 5 + Math.floor(Math.random() * 6) }; // 5–10
      case "bioResource":
        return { bioResource: 10 + Math.floor(Math.random() * 21) }; // 10–30
      case "defense": {
        const v = 1 + Math.floor(Math.random() * 4); // 1–4
        return {
          defenseMatrix: {
            kinetic: v,
            energy: v,
            bio: v,
            toxic: v,
            psionic: v,
            tech: v,
          },
        };
      }
      case "crit":
        return {
          critPotential: {
            critChance: 2 + Math.floor(Math.random() * 4), // 2–5
            critMultiplier: 0.1 + Math.random() * 0.3, // 0.1–0.4
          },
        };
      case "lifesteal":
        return {
          predatoryResonance: {
            lifestealPercent: 2 + Math.floor(Math.random() * 4),
            lifestealChance: 8 + Math.floor(Math.random() * 13),
          },
        };
      case "dot":
        return {
          toxicity: {
            dotDamage: 1 + Math.floor(Math.random() * 4),
            dotChance: 8 + Math.floor(Math.random() * 13),
          },
        };
      case "stun":
        return {
          neuroShock: {
            stunChance: 2 + Math.floor(Math.random() * 5),
            stunDuration: 0.2 + Math.random() * 0.5,
            stunCooldown: 5,
          },
        };
    }
  };

  const mergeBonuses = (a: MaterialBonus, b: MaterialBonus): MaterialBonus => {
    const res: MaterialBonus = { ...a };

    if (b.strikePower) {
      res.strikePower = (res.strikePower ?? 0) + b.strikePower;
    }
    if (b.bioResource) {
      res.bioResource = (res.bioResource ?? 0) + b.bioResource;
    }
    if (b.defenseMatrix) {
      res.defenseMatrix = res.defenseMatrix ?? {};
      for (const k of ["kinetic", "energy", "bio", "toxic", "psionic", "tech"] as const) {
        const v = b.defenseMatrix[k];
        if (v != null) {
          res.defenseMatrix[k] = (res.defenseMatrix[k] ?? 0) + v;
        }
      }
    }
    if (b.critPotential) {
      res.critPotential = res.critPotential ?? {};
      if (b.critPotential.critChance != null) {
        res.critPotential.critChance =
          (res.critPotential.critChance ?? 0) + b.critPotential.critChance;
      }
      if (b.critPotential.critMultiplier != null) {
        res.critPotential.critMultiplier =
          (res.critPotential.critMultiplier ?? 0) +
          b.critPotential.critMultiplier;
      }
    }
    if (b.predatoryResonance) {
      res.predatoryResonance = res.predatoryResonance ?? {};
      if (b.predatoryResonance.lifestealPercent != null) {
        res.predatoryResonance.lifestealPercent =
          (res.predatoryResonance.lifestealPercent ?? 0) +
          b.predatoryResonance.lifestealPercent;
      }
      if (b.predatoryResonance.lifestealChance != null) {
        res.predatoryResonance.lifestealChance =
          (res.predatoryResonance.lifestealChance ?? 0) +
          b.predatoryResonance.lifestealChance;
      }
    }
    if (b.toxicity) {
      res.toxicity = res.toxicity ?? {};
      if (b.toxicity.dotDamage != null) {
        res.toxicity.dotDamage =
          (res.toxicity.dotDamage ?? 0) + b.toxicity.dotDamage;
      }
      if (b.toxicity.dotChance != null) {
        res.toxicity.dotChance =
          (res.toxicity.dotChance ?? 0) + b.toxicity.dotChance;
      }
    }
    if (b.neuroShock) {
      res.neuroShock = res.neuroShock ?? {};
      if (b.neuroShock.stunChance != null) {
        res.neuroShock.stunChance =
          (res.neuroShock.stunChance ?? 0) + b.neuroShock.stunChance;
      }
      if (b.neuroShock.stunDuration != null) {
        res.neuroShock.stunDuration =
          (res.neuroShock.stunDuration ?? 0) + b.neuroShock.stunDuration;
      }
      if (b.neuroShock.stunCooldown != null) {
        res.neuroShock.stunCooldown = b.neuroShock.stunCooldown;
      }
    }

    return res;
  };

  return baseMaterials.map((mat, index) => {
    const [f1, f2] = getRandomFocusPair();
    const b1 = makePartBonus(f1);
    const b2 = makePartBonus(f2);
    const bonus = mergeBonuses(b1, b2); // ровно два типа характеристик

    return {
      ...mat,
      bonus,
    };
  });
};

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [previousScreen, setPreviousScreen] = useState<Screen>("main");

  const navigateTo = (newScreen: Screen) => {
    if (screen === "main" || screen === "laboratory") {
      setPreviousScreen(screen);
    }
    setScreen(newScreen);
  };

  const closeSecondaryScreen = () => {
    setScreen(previousScreen);
  };

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Получаем реальный Telegram ID
  const telegramId = WebApp.initDataUnsafe?.user?.id?.toString() || "dev_user_123";

  useEffect(() => {
    WebApp.ready();
  }, []);

  const [finalBioImage, setFinalBioImage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("Игрок");
  const [playerLevel, setPlayerLevel] = useState(0);
  const [lastGeneratedLevel, setLastGeneratedLevel] = useState(0);
  const [playerEP, setPlayerEP] = useState(0);
  const [playerAvatar, setPlayerAvatar] = useState<string>("/assets/Avatar/Avatar_1.png");

  const [awakeningStage, setAwakeningStage] = useState<number>(1);
  const [evolutionStage, setEvolutionStage] = useState<number>(1);
  const [currentBreedingMaterials, setCurrentBreedingMaterials] =
    useState<Material[]>([]); // Инициализируется после загрузки или генерации
  const [characterForm, setCharacterForm] = useState<number>(1);
  const [rerollsLeft, setRerollsLeft] = useState(3);

  const [draggedInitialMaterial, setDraggedInitialMaterial] = useState<Material | null>(null);
  const [isOverCenterInitial, setIsOverCenterInitial] = useState(false);

  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [draggedBreedMaterial, setDraggedBreedMaterial] = useState<Material | null>(null);
  const [isOverCenterForBreed, setIsOverCenterForBreed] = useState(false);
  const [pendingBreedSelection, setPendingBreedSelection] = useState<Material | null>(null);
  const [isBreedConfirmOpen, setIsBreedConfirmOpen] = useState(false);

  const [usedMaterials, setUsedMaterials] = useState<Set<string>>(new Set());
  const [totalUsedCount, setTotalUsedCount] = useState(0);
  const [showInfoScreen, setShowInfoScreen] = useState(false);

  const [isBreeding, setIsBreeding] = useState(false);
  const [breedingProgress, setBreedingProgress] = useState(0);
  const breedingTimerRef = useRef<number | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [isAnyUpgrading, setIsAnyUpgrading] = useState(false);
  const [playerCurrency, setPlayerCurrency] = useState(5000);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState<CharacterStats>(
    baseCharacterStats["unknown_dna"]
  );

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDefinition | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [hoveredMaterial, setHoveredMaterial] = useState<MaterialDefinition | null>(null);
  const [adaptiveMaterials, setAdaptiveMaterials] = useState<MaterialDefinition[]>(currentBreedingMaterials);

  const openMaterialModal = (materialId: string) => {
    const material = materialDefinitions.find((m) => m.id === materialId) || null;
    setSelectedMaterial(material);
    setIsMaterialModalOpen(!!material);
  };

  const closeMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setSelectedMaterial(null);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const goToScreen = (to: Screen) => {
    navigateTo(to);
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

  const latestState = useRef({
    playerLevel,
    playerEP,
    evolutionStage,
    currentStats,
    currentBreedingMaterials,
    usedMaterials,
    totalUsedCount,
    lastGeneratedLevel
  });

  // Синхронизируем Ref на каждом рендере для сохранения
  useEffect(() => {
    latestState.current = {
      playerLevel,
      playerEP,
      evolutionStage,
      currentStats,
      currentBreedingMaterials,
      usedMaterials,
      totalUsedCount,
      lastGeneratedLevel
    };
  }, [playerLevel, playerEP, evolutionStage, currentStats, currentBreedingMaterials, usedMaterials, totalUsedCount, lastGeneratedLevel]);

  // Загрузка первичного состояния (уровень с бэкенда, остальное из localStorage)
  useEffect(() => {
    const loadData = async () => {
      // Инициализируем пул материалов, если они не заданы
      if (currentBreedingMaterials.length === 0) {
        setCurrentBreedingMaterials(
          buildAdaptiveMaterials(
            breedingMaterialsStage1,
            baseCharacterStats["unknown_dna"]
          )
        );
      }

      // 2. Затем запрашиваем бэкенд (он приоритетнее для Уровня и ЭП)
      try {
        const response = await fetch(`${API}/api/user/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId })
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.level !== undefined) setPlayerLevel(userData.level);
          if (userData.lastGeneratedLevel !== undefined) setLastGeneratedLevel(userData.lastGeneratedLevel);
          if (userData.bioImage) setFinalBioImage(userData.bioImage);
          if (userData.ep !== undefined) setPlayerEP(userData.ep);
          if (userData.evolutionStage !== undefined) setEvolutionStage(userData.evolutionStage);
          if (userData.totalSynthesisCount !== undefined) setTotalUsedCount(userData.totalSynthesisCount);
          if (userData.usedMaterials !== undefined) setUsedMaterials(new Set(userData.usedMaterials));
          if (userData.currentMaterialPool) {
            try {
              const parsedPool = typeof userData.currentMaterialPool === "string"
                ? JSON.parse(userData.currentMaterialPool)
                : userData.currentMaterialPool;
              setCurrentBreedingMaterials(parsedPool);
            } catch (e) {
              console.error("Failed to parse material pool from backend", e);
            }
          }

          // Загрузка оборудования, если оно есть на бэкенде
          if (userData.equipmentData) {
            try {
              const parsedEq = typeof userData.equipmentData === "string"
                ? JSON.parse(userData.equipmentData)
                : userData.equipmentData;
              setEquipment(parsedEq);
            } catch (e) {
              console.error("Failed to parse equipment data from backend", e);
            }
          }

          // Загрузка сохраненных характеристик персонажа (Stats)
          if (userData.stats) {
            const returnedStrike = userData.stats.strikePower || 0;
            setCurrentStats({
              strikePower: returnedStrike,
              attackTempo: getBaseAttackTempoFromStrike(returnedStrike),
              bioResource: userData.stats.bioResource || 0,
              defenseMatrix: {
                kinetic: userData.stats.defKinetic || 0,
                energy: userData.stats.defEnergy || 0,
                bio: userData.stats.defBio || 0,
                toxic: userData.stats.defToxic || 0,
                psionic: userData.stats.defPsionic || 0,
                tech: userData.stats.defTech || 0,
              },
              reactiveDefense: {
                triggerChance: 0,
                parryChance: 0,
                mitigationChance: userData.stats.blockChance || 0,
                mitigationValue: userData.stats.blockMitigation || 0,
              },
              critPotential: {
                critChance: userData.stats.critChance || 0,
                critMultiplier: userData.stats.critMultiplier || 1.0,
              },
              predatoryResonance: {
                lifestealPercent: userData.stats.lifestealPercent || 0,
                lifestealChance: userData.stats.lifestealChance || 0,
              },
              toxicity: {
                dotDamage: userData.stats.dotDamage || 0,
                dotChance: userData.stats.dotChance || 0,
              },
              neuroShock: {
                stunChance: userData.stats.stunChance || 0,
                stunDuration: userData.stats.stunDuration || 0,
                stunCooldown: userData.stats.stunCooldown || 0,
              }
            });
          }
        }
      } catch (e) {
        console.error("Backend unreachable", e);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();

    // Инициализируем пул материалов, если они не заданы
    if (currentBreedingMaterials.length === 0) {
      setCurrentBreedingMaterials(
        buildAdaptiveMaterials(
          breedingMaterialsStage1,
          baseCharacterStats["unknown_dna"]
        )
      );
    }
  }, []);

  // Сохранение в БД при изменении стейта (с минимальной задержкой)
  useEffect(() => {
    if (!isDataLoaded) return; // Не сохранять ничего, пока не загрузим данные!

    const timeout = setTimeout(() => {
      const state = latestState.current;
      fetch(`${API}/api/user/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          level: state.playerLevel,
          ep: state.playerEP,
          evolutionStage: state.evolutionStage,
          stats: state.currentStats,
          equipmentData: JSON.stringify(equipment), // Сохраняем оборудование на бэкенд
          currentMaterialPool: JSON.stringify(state.currentBreedingMaterials), // Сохраняем материалы на бэкенд
          usedMaterials: Array.from(state.usedMaterials), // Преобразуем Set в массив для базы
          totalSynthesisCount: state.totalUsedCount, // Счетчик использованных материалов
          bioImage: finalBioImage,
          lastGeneratedLevel: state.lastGeneratedLevel
        })
      }).catch(console.error);
    }, 50);

    return () => clearTimeout(timeout);
  }, [playerLevel, playerEP, evolutionStage, currentStats, equipment, currentBreedingMaterials, usedMaterials, totalUsedCount, isDataLoaded, finalBioImage, lastGeneratedLevel]); // Добавлены зависимости

  // Аватарку всё еще можно хранить локально, так как это сугубо UI фича (или тоже можно унести на бэкенд потом)
  useEffect(() => {
    localStorage.setItem('playerAvatar', playerAvatar);
  }, [playerAvatar]);

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

  const calculateRequiredEP = (requirements: Array<{ id: EquipmentType, targetLevel: number }>) => {
    let totalEP = 0;
    requirements.forEach(req => {
      // Суммируем награду в ЭП за каждый уровень улучшения от 1 до targetLevel - 1
      for (let lvl = 1; lvl < req.targetLevel; lvl++) {
        totalEP += Math.floor(5 * Math.pow(1.2, lvl - 1));
      }
    });
    return totalEP;
  };

  const canBreedToLevel5 = (): { canBreed: boolean; missingRequirements: string[] } => {
    if (playerLevel !== 4) {
      return { canBreed: true, missingRequirements: [] };
    }

    const missing: string[] = [];

    const requiredEquipment: Array<{ id: EquipmentType, targetLevel: number, name: string }> = [
      { id: 'control_panel', targetLevel: 3, name: 'Панель управления' },
      { id: 'analyzer', targetLevel: 2, name: 'Анализатор' },
      { id: 'thermostat', targetLevel: 3, name: 'Термостат' }
    ];

    // Проверяем уровни приборов
    requiredEquipment.forEach(req => {
      // Приведение типа, чтобы TS не ругался на то, что id может быть null. Мы точно знаем, что ключи совпадают
      const equipmentKey = req.id as keyof typeof equipment;
      const eq = equipment[equipmentKey];

      if (eq && eq.level < req.targetLevel) {
        missing.push(`${req.name}: уровень ${eq.level}/${req.targetLevel}`);
      }
    });

    // Проверяем ЭП
    const requiredEP = calculateRequiredEP(requiredEquipment);
    if (playerEP < requiredEP) {
      missing.push(`Эволюционный Потенциал: ${playerEP} / ${requiredEP}`);
    }

    return { canBreed: missing.length === 0, missingRequirements: missing };
  };

  const handleDragStartInitial = (material: Material, e: React.DragEvent) => {
    setDraggedInitialMaterial(material);
  };

  const handleDragEndInitial = () => {
    setDraggedInitialMaterial(null);
    setIsOverCenterInitial(false);
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

    if (!draggedInitialMaterial) return;

    // Базовые статы Неопознанного ДНК (или текущие, если загрузились с БД)
    const baseStats = currentStats;

    // Бонус от стартового материала
    const bonus = materialBonuses[draggedInitialMaterial.id];
    const updatedStats = bonus
      ? applyMaterialToStats(baseStats, bonus)
      : baseStats;

    setCurrentStats(updatedStats);

    // Новые материалы для Stage1
    const newPool = buildAdaptiveMaterials(breedingMaterialsStage1, updatedStats);
    setCurrentBreedingMaterials(newPool);

    setUsedMaterials(new Set([draggedInitialMaterial.id]));
    setTotalUsedCount(1);

    setAwakeningStage(1);
    setEvolutionStage(1);
    setCharacterForm(1);
    setCurrentBreedingMaterials(breedingMaterialsStage1);

    setDraggedInitialMaterial(null);
  }

  const handleDragStartBreed = (material: Material, e: React.DragEvent) => {
    setDraggedBreedMaterial(material);
  };

  const handleDragEndBreed = () => {
    setDraggedBreedMaterial(null);
    setIsOverCenterForBreed(false);
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

    if (draggedBreedMaterial && !isBreeding) {
      setPendingBreedSelection(draggedBreedMaterial);
      setIsBreedConfirmOpen(true);
    }
  };

  const handleConfirmBreeding = () => {
    if (!pendingBreedSelection || isBreeding) return;

    setIsBreedConfirmOpen(false);
    setIsBreeding(true);
    setBreedingProgress(0);

    const nextLevel = playerLevel + 1;
    // Если следующий уровень кратен 5, запускаем генерацию заранее!
    if (nextLevel > 0 && nextLevel % 5 === 0 && nextLevel !== lastGeneratedLevel && !isGeneratingImage) {
      setIsGeneratingImage(true);
      console.log(`[ComfyUI] Начат процесс генерации через бэкенд для уровня ${nextLevel} (заранее)`);

      fetch(`${API}/api/comfy/generate`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, level: nextLevel })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.imageUrl) {
            setFinalBioImage(`${API}${data.imageUrl}`);
            setLastGeneratedLevel(nextLevel);
            console.log(`[FILE] Картинка успешно получена с бэкенда для уровня ${nextLevel}`);
          } else {
            console.error(`[FILE] Ошибка получения картинки:`, data.error);
          }
        })
        .catch(error => {
          console.error(`[FILE] Ошибка сети при запросе к бэкенду:`, error);
        })
        .finally(() => {
          setIsGeneratingImage(false);
        });
    }

    const duration = 3000;
    const updateInterval = 50;
    const steps = duration / updateInterval;
    let currentStep = 0;

    // Берём материал из текущего пула
    const material = currentBreedingMaterials.find(
      (m) => m.id === pendingBreedSelection.id
    );
    const bonus = material?.bonus;

    const timer = window.setInterval(() => {
      currentStep += 1;
      const progress = Math.min((currentStep / steps) * 100, 100);

      if (progress >= 100) {
        window.clearInterval(timer);
        breedingTimerRef.current = null;

        if (bonus) {
          setCurrentStats((prevStats) => {
            const updatedStats = applyMaterialToStats(prevStats, bonus);

            // Рандомно пересобираем бонусы всех оставшихся материалов
            setCurrentBreedingMaterials((prevMats) =>
              buildAdaptiveMaterials(prevMats, updatedStats)
            );

            // Помечаем использованный материал
            setUsedMaterials((prev) =>
              new Set([...prev, pendingBreedSelection!.id])
            );

            const newTotalCount = totalUsedCount + 1;
            setTotalUsedCount(newTotalCount);
            setCharacterForm((prev) => Math.min(prev + 1, 5));

            setPlayerLevel((prevLevel) => {
              const newPlayerLevel = prevLevel + 1;

              if (newPlayerLevel === 5) {
                setCurrentBreedingMaterials(
                  buildAdaptiveMaterials(breedingMaterialsStage2, updatedStats)
                );
                setUsedMaterials(new Set());
              }

              return newPlayerLevel;
            });

            // Переходы по стадиям каждые 5 синтезов
            if (newTotalCount > 0 && newTotalCount % 5 === 0) {
              const nextStage = Math.floor(newTotalCount / 5) + 1;

              if (nextStage === 2) {
                setAwakeningStage(2);
                setCurrentBreedingMaterials(
                  buildAdaptiveMaterials(breedingMaterialsStage2, updatedStats)
                );
              } else if (nextStage === 3) {
                setAwakeningStage(3);
                setCurrentBreedingMaterials(
                  buildAdaptiveMaterials(breedingMaterialsStage3, updatedStats)
                );
              } else if (nextStage === 4) {
                setAwakeningStage(4);
                setCurrentBreedingMaterials(
                  buildAdaptiveMaterials(breedingMaterialsStage4, updatedStats)
                );
              } else if (nextStage === 5) {
                setAwakeningStage(5);
                setCurrentBreedingMaterials(
                  buildAdaptiveMaterials(breedingMaterialsStage5, updatedStats)
                );
              }

              const newEvolutionStage = Math.min(evolutionStage + 1, 5);
              setEvolutionStage(newEvolutionStage);
            }

            return updatedStats;
          });
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

  const handleRerollMaterials = () => {
    if (rerollsLeft <= 0 || isBreeding) return;

    setCurrentBreedingMaterials(prev =>
      buildAdaptiveMaterials(prev, currentStats)
    );
    setRerollsLeft(prev => prev - 1);
  };

  const handleCancelBreeding = () => {
    setIsBreedConfirmOpen(false);
    setPendingBreedSelection(null);
  };

  const handleCentralCircleClick = () => {
    // Клик по центральному кругу
  };

  const getCharacterImage = () => {
    // Если идет генерация прямо сейчас - показываем базовую картинку или лоадер
    if (isGeneratingImage) {
      return "/assets/Material/Bio.png";
    }

    // Если уровень >= 5 и есть финальное изображение
    if (playerLevel >= 5 && finalBioImage) {
      if (finalBioImage.startsWith('/uploads')) {
        return `${API}${finalBioImage}`;
      }
      return finalBioImage;
    }

    // Для уровней 1–4 используем базовое изображение Неопознанного ДНК
    return "/assets/Material/Bio.png";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment(prev => {
        const isUpgradingCheck = Object.values(prev).some(e => e.isUpgrading);
        if (!isUpgradingCheck) {
          setIsAnyUpgrading(false);
          return prev;
        }

        const updated = { ...prev };
        let hasUpgrading = false;

        Object.keys(updated).forEach(key => {
          const item = updated[key];

          if (item.isUpgrading && item.upgradeStartTime) {
            const elapsed = Date.now() - item.upgradeStartTime;
            const progress = Math.min((elapsed / item.upgradeDuration) * 100, 100);

            if (progress >= 100) {
              const gainedEP = Math.floor(5 * Math.pow(1.2, item.level - 1));
              updated[key] = {
                ...item,
                level: item.level + 1,
                isUpgrading: false,
                upgradeProgress: 0,
                upgradeStartTime: null
              };
              setPlayerEP(prevEP => prevEP + gainedEP);
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
          {/* верхняя панель игрока и кнопка Магазин всегда видны */}
          <div
            className="player-info"
            onClick={() => {
              navigateTo("info");
            }}
          >
            <div
              className="player-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarModalOpen(true);
              }}
            >
              <img
                src={playerAvatar}
                alt="Player Avatar"
                draggable={false}
              />
            </div>
            <div className="player-details">
              <div className="player-name">{playerName}</div>
              <div className="player-level">Уровень {playerLevel}</div>
              <div className="player-ep">ЭП: {playerEP}</div>
            </div>
          </div>

          <button
            className="market-button"
            onClick={() => navigateTo("shop")}
          >
            <span className="market-icon" />
            <span className="market-label">Магазин</span>
          </button>

          {/* Центральный круг — всегда есть персонаж */}
          <div
            className={`central-circle ${isBreeding
              ? ""
              : isOverCenterForBreed
                ? "drag-over-breed"
                : "has-character"
              }`}
            onDragOver={isBreeding ? undefined : handleDragOverCenterForBreed}
            onDragLeave={isBreeding ? undefined : handleDragLeaveCenterForBreed}
            onDrop={isBreeding ? undefined : handleDropOnCenterForBreed}
            onClick={handleCentralCircleClick}
          >
            <img
              src={getCharacterImage()}
              alt="Selected Character"
              className="central-character-image"
              draggable={false}
            />

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
          </div>

          {/* Материалы + реролл справа */}
          <div className="materials-row">
            <div className="materials-container">
              {currentBreedingMaterials.map((material) => {
                const isUsed = usedMaterials.has(material.id);

                return (
                  <div
                    key={material.id}
                    className={`small-circle breeding-material ${isUsed || isBreeding ? "is-used" : ""
                      }`}
                    draggable={!isUsed && !isBreeding}
                    onDragStart={(e) => {
                      if (isUsed || isBreeding) return;
                      handleDragStartBreed(material, e);
                    }}
                    onDragEnd={handleDragEndBreed}
                    onClick={() => {
                      setHoveredMaterial(prev =>
                        prev && prev.id === material.id
                          ? null
                          : materialDefinitions.find(m => m.id === material.id) || null
                      );
                    }}
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

            <button
              className="reroll-circle-button"
              onClick={handleRerollMaterials}
              disabled={rerollsLeft <= 0 || isBreeding}
            >
              ⟳
              <span className="reroll-counter">{rerollsLeft}</span>
            </button>
          </div>

          {hoveredMaterial && (
            <div className="material-tooltip">
              <div className="material-tooltip-title">{hoveredMaterial.name}</div>
              {(() => {
                const bonus =
                  currentBreedingMaterials.find(m => m.id === hoveredMaterial.id)?.bonus;
                if (!bonus) return null;

                const lines: React.ReactNode[] = [];

                if (bonus.strikePower) {
                  lines.push(<div key="sp">Сила удара: +{bonus.strikePower}</div>);
                }

                if (bonus.bioResource) {
                  lines.push(<div key="br">Биоресурс: +{bonus.bioResource}</div>);
                }

                if (bonus.defenseMatrix) {
                  const sum =
                    (bonus.defenseMatrix.kinetic ?? 0) +
                    (bonus.defenseMatrix.energy ?? 0) +
                    (bonus.defenseMatrix.bio ?? 0) +
                    (bonus.defenseMatrix.toxic ?? 0) +
                    (bonus.defenseMatrix.psionic ?? 0) +
                    (bonus.defenseMatrix.tech ?? 0);
                  lines.push(<div key="def">Защита суммарно: +{sum}</div>);
                }

                if (bonus.critPotential) {
                  lines.push(
                    <div key="crit">
                      Крит: шанс +{bonus.critPotential.critChance ?? 0}%, множитель +
                      {(bonus.critPotential.critMultiplier ?? 0).toFixed(2)}
                    </div>
                  );
                }

                if (bonus.predatoryResonance) {
                  lines.push(
                    <div key="lifesteal">
                      Вампиризм: +{bonus.predatoryResonance.lifestealPercent ?? 0}%,
                      шанс {bonus.predatoryResonance.lifestealChance ?? 0}%
                    </div>
                  );
                }

                if (bonus.toxicity) {
                  lines.push(
                    <div key="dot">
                      Токсичность: урон {bonus.toxicity.dotDamage ?? 0},
                      шанс {bonus.toxicity.dotChance ?? 0}%
                    </div>
                  );
                }

                if (bonus.neuroShock) {
                  lines.push(
                    <div key="stun">
                      Нейрошок: шанс {bonus.neuroShock.stunChance ?? 0}%,
                      длительность {(bonus.neuroShock.stunDuration ?? 0).toFixed(1)} c
                    </div>
                  );
                }

                return lines.length ? lines : <div>Нет бонусов</div>;
              })()}
            </div>
          )}

          {/* нижняя навигация всегда доступна */}
          <BottomNavigation
            currentScreen={screen}
            onNavigate={navigateTo}
            openSettings={openSettings}
          />
        </div>
      )}

      {screen === "laboratory" && (
        <Laboratory
          playerName={playerName}
          playerLevel={playerLevel}
          playerEP={playerEP}
          playerAvatar={playerAvatar}
          onNavigate={(newScreen) => navigateTo(newScreen as Screen)}
          equipment={equipment}
          onUpgrade={handleEquipmentUpgrade}
          isAnyUpgrading={isAnyUpgrading}
          onAvatarClick={() => setIsAvatarModalOpen(true)}
          openSettings={openSettings}
        />
      )}

      {screen === "premium" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>Премиум</h2>
            <button className="close-button" onClick={closeSecondaryScreen}>✕</button>
          </div>
          <div className="secondary-content">
            <p>Премиум функции будут здесь</p>
          </div>
        </div>
      )}

      {screen === "shop" && (
        <Shop
          onClose={closeSecondaryScreen}
          playerCurrency={playerCurrency}
          onPurchase={handlePurchase}
        />
      )}

      {screen === "nftShop" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>NFT магазин</h2>
            <button className="close-button" onClick={closeSecondaryScreen}>✕</button>
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
            <button className="close-button" onClick={closeSecondaryScreen}>
              ✕
            </button>
          </div>

          <div className="info-content">
            <div className="info-character-preview">
              <img
                src={getCharacterImage()}
                alt="Неопознанный ДНК"
                className="info-character-image"
                draggable={false}
              />
              <div className="character-description">
                Неопознанный ДНК — базовое нестабильное существо с минимальными
                характеристиками. Его потенциал раскрывается через синтез материалов.
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
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar attack"
                        style={{
                          width: `${Math.min(
                            (currentStats.strikePower / 300) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="stat-description">
                      Базовый урон и частота атак.
                    </div>
                    <div className="stat-subgrid">
                      <div>Урон: {currentStats.strikePower}</div>
                      <div>
                        Скорость атаки: {currentStats.attackTempo.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 2. Биоресурс */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">💚</span>
                      <span className="stat-name">Биоресурс</span>
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar health"
                        style={{
                          width: `${Math.min(
                            (currentStats.bioResource / 400) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="stat-description">
                      Запас жизни и устойчивость к фокусу.
                    </div>
                    <div className="stat-subgrid">
                      <div>ХП: {currentStats.bioResource}</div>
                    </div>
                  </div>

                  {/* 3. Матрица защиты */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">🛡️</span>
                      <span className="stat-name">Матрица защиты</span>
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
                      Уменьшение входящего урона по разным типам.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Защита:{" "}
                        {currentStats.defenseMatrix.kinetic +
                          currentStats.defenseMatrix.energy +
                          currentStats.defenseMatrix.bio +
                          currentStats.defenseMatrix.toxic +
                          currentStats.defenseMatrix.psionic +
                          currentStats.defenseMatrix.tech}
                      </div>
                      <div>
                        Кинетическая: {currentStats.defenseMatrix.kinetic}
                      </div>
                      <div>
                        Энергетическая: {currentStats.defenseMatrix.energy}
                      </div>
                      <div>
                        Биологическая: {currentStats.defenseMatrix.bio}
                      </div>
                      <div>
                        Токсическая: {currentStats.defenseMatrix.toxic}
                      </div>
                      <div>
                        Псионическая: {currentStats.defenseMatrix.psionic}
                      </div>
                      <div>
                        Технологическая: {currentStats.defenseMatrix.tech}
                      </div>
                    </div>
                  </div>

                  {/* 4. Реактивная защита */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">🌀</span>
                      <span className="stat-name">Реактивная защита</span>
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
                      Шанс среагировать на входящий урон.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Шанс уклонения:{" "}
                        {currentStats.reactiveDefense.parryChance.toFixed(2)}%
                      </div>
                      <div>
                        Шанс блокировки:{" "}
                        {currentStats.reactiveDefense.mitigationChance.toFixed(2)}%
                      </div>
                      <div>
                        Поглощение:{" "}
                        {currentStats.reactiveDefense.mitigationValue.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* 5. Критический потенциал */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">💥</span>
                      <span className="stat-name">Критический потенциал</span>
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar attack"
                        style={{
                          width: `${Math.min(
                            currentStats.critPotential.critChance,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="stat-description">
                      Отвечает за взрывной урон.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Шанс крита:{" "}
                        {currentStats.critPotential.critChance.toFixed(2)}%
                      </div>
                      <div>
                        Увеличение крита: ×
                        {currentStats.critPotential.critMultiplier.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 6. Хищный резонанс */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">🩸</span>
                      <span className="stat-name">Хищный резонанс</span>
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
                      Откачивает жизнь у цели.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Кража здоровья:{" "}
                        {currentStats.predatoryResonance.lifestealPercent.toFixed(
                          2
                        )}
                        %
                      </div>
                      <div>
                        Шанс успеха:{" "}
                        {currentStats.predatoryResonance.lifestealChance.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* 7. Токсичность */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">☣️</span>
                      <span className="stat-name">Токсичность</span>
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar attack"
                        style={{
                          width: `${Math.min(
                            (currentStats.toxicity.dotDamage *
                              currentStats.toxicity.dotChance) /
                            60,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="stat-description">
                      Наносит урон ядом.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Шанс успеха:{" "}
                        {currentStats.toxicity.dotChance.toFixed(2)}%
                      </div>
                      <div>
                        Урон в секунду:{" "}
                        {currentStats.toxicity.dotDamage.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 8. Нейрошок */}
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">🧠</span>
                      <span className="stat-name">Нейрошок</span>
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
                      Контролирует действия противника.
                    </div>
                    <div className="stat-subgrid">
                      <div>
                        Шанс успеха:{" "}
                        {currentStats.neuroShock.stunChance.toFixed(2)}%
                      </div>
                      <div>
                        Длительность:{" "}
                        {currentStats.neuroShock.stunDuration.toFixed(2)} c
                      </div>
                      <div>
                        Кулдаун:{" "}
                        {currentStats.neuroShock.stunCooldown.toFixed(2)} c
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="info-description">
              <h3>Особенности</h3>
              <p>
                Неопознанный ДНК начинает как слабое существо, но с каждым синтезом
                материалов его характеристики могут развиваться в разные стороны:
                от мощного танка до быстрого хищника.
              </p>
            </div>

            <div className="info-stage-display">
              <div className="stage-badge">
                <span className="stage-label">Стадия эволюции</span>
                <span className="stage-number">{evolutionStage}/5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "id_person" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>ID Telegram</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content" style={{ overflowY: "auto", paddingBottom: "100px" }}>
            <p>Ваш ID: {telegramId}</p>
            <hr style={{ margin: "20px 0", borderColor: "#333" }} />
            <h4 style={{ color: "#ffd700" }}>Debug Info (Send Screenshot):</h4>
            <p style={{ wordBreak: "break-all", fontSize: "10px", lineHeight: "1.2", color: "#aaa" }}>
              WebApp Ready: {typeof WebApp !== 'undefined' ? "Yes" : "No"} <br />
              initData: {WebApp?.initData} <br />
              initDataUnsafe: {JSON.stringify(WebApp?.initDataUnsafe || {})}
            </p>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="settings-modal-backdrop" onClick={() => setIsAvatarModalOpen(false)}>
          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '400px', padding: '20px' }}
          >
            <h2 style={{ textAlign: 'center', color: '#ffd700', marginBottom: '20px', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>Выбор аватара</h2>
            <div className="avatar-selection-grid">
              {[1, 2, 3, 4, 5].map((num) => {
                const avatarUrl = `/assets/Avatar/Avatar_${num}.png`;
                return (
                  <img
                    key={num}
                    src={avatarUrl}
                    alt={`Avatar ${num}`}
                    draggable={false}
                    className={`avatar-option ${playerAvatar === avatarUrl ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayerAvatar(avatarUrl);
                    }}
                  />
                );
              })}
            </div>

            <button className="settings-close" onClick={() => setIsAvatarModalOpen(false)}>
              <span>×</span>
            </button>
          </div>
        </div>
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
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Настройки</h2>

            <button className="settings-btn" onClick={() => goToScreen("id_person")}>
              ID Telegram
            </button>

            <button className="settings-btn" onClick={() => {
              closeSettings();
              setIsAvatarModalOpen(true);
            }}>
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

      {isBreedConfirmOpen && pendingBreedSelection && (
        <div className="breed-modal-backdrop">
          <div className="breed-modal">
            <div className="breed-modal-title">
              Вы точно хотите выполнить это скрещивание?
            </div>
            <div className="breed-modal-text">
              Скрестить {pendingBreedSelection.name}?
            </div>

            {/* Блок с бонусами материала */}
            {pendingBreedSelection.bonus && (() => {
              const bonus = pendingBreedSelection.bonus!;

              const lines: React.ReactNode[] = [];

              if (bonus.strikePower) {
                lines.push(
                  <div key="sp">⚔ Сила удара: +{bonus.strikePower}</div>
                );
              }

              if (bonus.bioResource) {
                lines.push(
                  <div key="br">💚 Биоресурс: +{bonus.bioResource}</div>
                );
              }

              if (bonus.defenseMatrix) {
                const sum =
                  (bonus.defenseMatrix.kinetic ?? 0) +
                  (bonus.defenseMatrix.energy ?? 0) +
                  (bonus.defenseMatrix.bio ?? 0) +
                  (bonus.defenseMatrix.toxic ?? 0) +
                  (bonus.defenseMatrix.psionic ?? 0) +
                  (bonus.defenseMatrix.tech ?? 0);

                lines.push(
                  <div key="def">🛡 Матрица защиты: +{sum}</div>
                );
              }

              if (bonus.critPotential) {
                lines.push(
                  <div key="crit">
                    🎯 Крит: шанс +{bonus.critPotential.critChance ?? 0}%,
                    множитель +{(bonus.critPotential.critMultiplier ?? 0).toFixed(2)}
                  </div>
                );
              }

              if (bonus.predatoryResonance) {
                lines.push(
                  <div key="lifesteal">
                    🩸 Вампиризм: +{bonus.predatoryResonance.lifestealPercent ?? 0}%,
                    шанс {bonus.predatoryResonance.lifestealChance ?? 0}%
                  </div>
                );
              }

              if (bonus.toxicity) {
                lines.push(
                  <div key="dot">
                    ☣️ Токсичность: урон {bonus.toxicity.dotDamage ?? 0},
                    шанс {bonus.toxicity.dotChance ?? 0}%
                  </div>
                );
              }

              if (bonus.neuroShock) {
                lines.push(
                  <div key="stun">
                    ⚡ Нейрошок: шанс {bonus.neuroShock.stunChance ?? 0}%,
                    длительность {(bonus.neuroShock.stunDuration ?? 0).toFixed(1)} c
                  </div>
                );
              }

              return (
                <div className="breed-bonus-list">
                  {lines.length ? lines : <div>Без явных бонусов</div>}
                </div>
              );
            })()}

            {/* Требования для скрещивания 4→5 */}
            {playerLevel === 4 &&
              (() => {
                const { canBreed, missingRequirements } = canBreedToLevel5();
                if (!canBreed) {
                  return (
                    <div className="breed-requirements">
                      <div className="requirements-title">
                        ⚠️ Требования не выполнены:
                      </div>
                      <div className="requirements-list">
                        {missingRequirements.map((req, index) => (
                          <div key={index} className="requirement-item">
                            ❌ {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="breed-requirements">
                      <div className="requirements-title-success">
                        ✅ Все требования выполнены!
                      </div>
                    </div>
                  );
                }
              })()}

            <div className="breed-modal-buttons">
              <button
                className={`breed-modal-button yes ${playerLevel === 4 && !canBreedToLevel5().canBreed ? "disabled" : ""
                  }`}
                onClick={handleConfirmBreeding}
                disabled={playerLevel === 4 && !canBreedToLevel5().canBreed}
              >
                Да
              </button>
              <button
                className="breed-modal-button no"
                onClick={handleCancelBreeding}
              >
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
