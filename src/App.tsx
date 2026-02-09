import { useState } from "react";
import "./styles/App.css";


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
  | "market";


interface Material {
  id: string;
  name: string;
  image: string;
  description: string;
}


interface CharacterStats {
  attack: number;
  health: number;
  defense: number;
  attackSpeed: number;
}


interface MaterialBonus {
  attack: number;
  health: number;
  defense: number;
  attackSpeed: number;
}


type MaterialBonusMap = Record<CharacterId, MaterialBonus>;


interface StartMaterial {
  id: CharacterId;
  name: string;
  image: string;
}


const startMaterials: StartMaterial[] = [
  { id: "species_1", name: "Хищник", image: "/assets/Material/Malecula1.jpg" },
  { id: "species_2", name: "Титан", image: "/assets/Material/Malecula2.jpg" },
  { id: "species_3", name: "Спринтер", image: "/assets/Material/Malecula3.jpg" },
  { id: "species_4", name: "Универсал", image: "/assets/Material/Malecula4.jpg" },
  { id: "species_5", name: "Страж", image: "/assets/Material/Malecula5.jpg" },
];


const breedingMaterialsStage1: Material[] = [
  { id: "m1_1", name: "Материал 1‑1", image: "/assets/Material/Malecula1.jpg", description: "Материал 1‑1 для 1 пробуждения" },
  { id: "m1_2", name: "Материал 1‑2", image: "/assets/Material/Malecula2.jpg", description: "Материал 1‑2 для 1 пробуждения" },
  { id: "m1_3", name: "Материал 1‑3", image: "/assets/Material/Malecula3.jpg", description: "Материал 1‑3 для 1 пробуждения" },
  { id: "m1_4", name: "Материал 1‑4", image: "/assets/Material/Malecula4.jpg", description: "Материал 1‑4 для 1 пробуждения" },
  { id: "m1_5", name: "Материал 1‑5", image: "/assets/Material/Malecula5.jpg", description: "Материал 1‑5 для 1 пробуждения" },
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


const initialCharacterStats: Record<CharacterId, CharacterStats> = {
  species_1: { attack: 120, health: 80, defense: 60, attackSpeed: 1.5 },
  species_2: { attack: 70, health: 150, defense: 100, attackSpeed: 0.8 },
  species_3: { attack: 90, health: 70, defense: 50, attackSpeed: 2.0 },
  species_4: { attack: 85, health: 100, defense: 80, attackSpeed: 1.2 },
  species_5: { attack: 75, health: 110, defense: 110, attackSpeed: 1.0 }
};


const materialBonuses: Record<string, MaterialBonusMap> = {
  "m1_1": {
    species_1: { attack: 15, health: 5, defense: 3, attackSpeed: 0.1 },
    species_2: { attack: 5, health: 20, defense: 10, attackSpeed: 0.05 },
    species_3: { attack: 10, health: 3, defense: 2, attackSpeed: 0.15 },
    species_4: { attack: 8, health: 10, defense: 6, attackSpeed: 0.08 },
    species_5: { attack: 6, health: 12, defense: 12, attackSpeed: 0.06 }
  },
  "m1_2": {
    species_1: { attack: 12, health: 8, defense: 4, attackSpeed: 0.12 },
    species_2: { attack: 6, health: 18, defense: 12, attackSpeed: 0.04 },
    species_3: { attack: 11, health: 5, defense: 3, attackSpeed: 0.18 },
    species_4: { attack: 9, health: 11, defense: 7, attackSpeed: 0.09 },
    species_5: { attack: 7, health: 13, defense: 13, attackSpeed: 0.07 }
  },
  "m1_3": {
    species_1: { attack: 18, health: 6, defense: 5, attackSpeed: 0.09 },
    species_2: { attack: 7, health: 22, defense: 11, attackSpeed: 0.06 },
    species_3: { attack: 13, health: 4, defense: 4, attackSpeed: 0.16 },
    species_4: { attack: 10, health: 12, defense: 8, attackSpeed: 0.1 },
    species_5: { attack: 8, health: 14, defense: 14, attackSpeed: 0.08 }
  },
  "m1_4": {
    species_1: { attack: 14, health: 7, defense: 6, attackSpeed: 0.11 },
    species_2: { attack: 8, health: 19, defense: 13, attackSpeed: 0.07 },
    species_3: { attack: 12, health: 6, defense: 5, attackSpeed: 0.17 },
    species_4: { attack: 11, health: 13, defense: 9, attackSpeed: 0.11 },
    species_5: { attack: 9, health: 15, defense: 15, attackSpeed: 0.09 }
  },
  "m1_5": {
    species_1: { attack: 16, health: 9, defense: 7, attackSpeed: 0.13 },
    species_2: { attack: 9, health: 21, defense: 14, attackSpeed: 0.08 },
    species_3: { attack: 14, health: 7, defense: 6, attackSpeed: 0.19 },
    species_4: { attack: 12, health: 14, defense: 10, attackSpeed: 0.12 },
    species_5: { attack: 10, health: 16, defense: 16, attackSpeed: 0.1 }
  },
  
  "m2_1": {
    species_1: { attack: 20, health: 10, defense: 8, attackSpeed: 0.14 },
    species_2: { attack: 10, health: 25, defense: 16, attackSpeed: 0.09 },
    species_3: { attack: 16, health: 8, defense: 7, attackSpeed: 0.21 },
    species_4: { attack: 14, health: 16, defense: 12, attackSpeed: 0.13 },
    species_5: { attack: 12, health: 18, defense: 18, attackSpeed: 0.11 }
  },
  "m2_2": {
    species_1: { attack: 22, health: 11, defense: 9, attackSpeed: 0.15 },
    species_2: { attack: 11, health: 27, defense: 17, attackSpeed: 0.1 },
    species_3: { attack: 18, health: 9, defense: 8, attackSpeed: 0.23 },
    species_4: { attack: 15, health: 17, defense: 13, attackSpeed: 0.14 },
    species_5: { attack: 13, health: 19, defense: 19, attackSpeed: 0.12 }
  },
  "m2_3": {
    species_1: { attack: 24, health: 12, defense: 10, attackSpeed: 0.16 },
    species_2: { attack: 12, health: 29, defense: 18, attackSpeed: 0.11 },
    species_3: { attack: 20, health: 10, defense: 9, attackSpeed: 0.25 },
    species_4: { attack: 16, health: 18, defense: 14, attackSpeed: 0.15 },
    species_5: { attack: 14, health: 20, defense: 20, attackSpeed: 0.13 }
  },
  "m2_4": {
    species_1: { attack: 26, health: 13, defense: 11, attackSpeed: 0.17 },
    species_2: { attack: 13, health: 31, defense: 19, attackSpeed: 0.12 },
    species_3: { attack: 22, health: 11, defense: 10, attackSpeed: 0.27 },
    species_4: { attack: 17, health: 19, defense: 15, attackSpeed: 0.16 },
    species_5: { attack: 15, health: 21, defense: 21, attackSpeed: 0.14 }
  },
  "m2_5": {
    species_1: { attack: 28, health: 14, defense: 12, attackSpeed: 0.18 },
    species_2: { attack: 14, health: 33, defense: 20, attackSpeed: 0.13 },
    species_3: { attack: 24, health: 12, defense: 11, attackSpeed: 0.29 },
    species_4: { attack: 18, health: 20, defense: 16, attackSpeed: 0.17 },
    species_5: { attack: 16, health: 22, defense: 22, attackSpeed: 0.15 }
  },


  "m3_1": {
    species_1: { attack: 30, health: 15, defense: 13, attackSpeed: 0.19 },
    species_2: { attack: 15, health: 35, defense: 22, attackSpeed: 0.14 },
    species_3: { attack: 26, health: 13, defense: 12, attackSpeed: 0.31 },
    species_4: { attack: 20, health: 22, defense: 18, attackSpeed: 0.18 },
    species_5: { attack: 18, health: 24, defense: 24, attackSpeed: 0.16 }
  },
  "m3_2": {
    species_1: { attack: 32, health: 16, defense: 14, attackSpeed: 0.2 },
    species_2: { attack: 16, health: 37, defense: 23, attackSpeed: 0.15 },
    species_3: { attack: 28, health: 14, defense: 13, attackSpeed: 0.33 },
    species_4: { attack: 21, health: 23, defense: 19, attackSpeed: 0.19 },
    species_5: { attack: 19, health: 25, defense: 25, attackSpeed: 0.17 }
  },
  "m3_3": {
    species_1: { attack: 34, health: 17, defense: 15, attackSpeed: 0.21 },
    species_2: { attack: 17, health: 39, defense: 24, attackSpeed: 0.16 },
    species_3: { attack: 30, health: 15, defense: 14, attackSpeed: 0.35 },
    species_4: { attack: 22, health: 24, defense: 20, attackSpeed: 0.2 },
    species_5: { attack: 20, health: 26, defense: 26, attackSpeed: 0.18 }
  },
  "m3_4": {
    species_1: { attack: 36, health: 18, defense: 16, attackSpeed: 0.22 },
    species_2: { attack: 18, health: 41, defense: 25, attackSpeed: 0.17 },
    species_3: { attack: 32, health: 16, defense: 15, attackSpeed: 0.37 },
    species_4: { attack: 23, health: 25, defense: 21, attackSpeed: 0.21 },
    species_5: { attack: 21, health: 27, defense: 27, attackSpeed: 0.19 }
  },
  "m3_5": {
    species_1: { attack: 38, health: 19, defense: 17, attackSpeed: 0.23 },
    species_2: { attack: 19, health: 43, defense: 26, attackSpeed: 0.18 },
    species_3: { attack: 34, health: 17, defense: 16, attackSpeed: 0.39 },
    species_4: { attack: 24, health: 26, defense: 22, attackSpeed: 0.22 },
    species_5: { attack: 22, health: 28, defense: 28, attackSpeed: 0.2 }
  },


  "m4_1": {
    species_1: { attack: 40, health: 20, defense: 18, attackSpeed: 0.24 },
    species_2: { attack: 20, health: 45, defense: 28, attackSpeed: 0.19 },
    species_3: { attack: 36, health: 18, defense: 17, attackSpeed: 0.41 },
    species_4: { attack: 26, health: 28, defense: 24, attackSpeed: 0.23 },
    species_5: { attack: 24, health: 30, defense: 30, attackSpeed: 0.21 }
  },
  "m4_2": {
    species_1: { attack: 42, health: 21, defense: 19, attackSpeed: 0.25 },
    species_2: { attack: 21, health: 47, defense: 29, attackSpeed: 0.2 },
    species_3: { attack: 38, health: 19, defense: 18, attackSpeed: 0.43 },
    species_4: { attack: 27, health: 29, defense: 25, attackSpeed: 0.24 },
    species_5: { attack: 25, health: 31, defense: 31, attackSpeed: 0.22 }
  },
  "m4_3": {
    species_1: { attack: 44, health: 22, defense: 20, attackSpeed: 0.26 },
    species_2: { attack: 22, health: 49, defense: 30, attackSpeed: 0.21 },
    species_3: { attack: 40, health: 20, defense: 19, attackSpeed: 0.45 },
    species_4: { attack: 28, health: 30, defense: 26, attackSpeed: 0.25 },
    species_5: { attack: 26, health: 32, defense: 32, attackSpeed: 0.23 }
  },
  "m4_4": {
    species_1: { attack: 46, health: 23, defense: 21, attackSpeed: 0.27 },
    species_2: { attack: 23, health: 51, defense: 31, attackSpeed: 0.22 },
    species_3: { attack: 42, health: 21, defense: 20, attackSpeed: 0.47 },
    species_4: { attack: 29, health: 31, defense: 27, attackSpeed: 0.26 },
    species_5: { attack: 27, health: 33, defense: 33, attackSpeed: 0.24 }
  },
  "m4_5": {
    species_1: { attack: 48, health: 24, defense: 22, attackSpeed: 0.28 },
    species_2: { attack: 24, health: 53, defense: 32, attackSpeed: 0.23 },
    species_3: { attack: 44, health: 22, defense: 21, attackSpeed: 0.49 },
    species_4: { attack: 30, health: 32, defense: 28, attackSpeed: 0.27 },
    species_5: { attack: 28, health: 34, defense: 34, attackSpeed: 0.25 }
  },


  "m5_1": {
    species_1: { attack: 50, health: 25, defense: 23, attackSpeed: 0.29 },
    species_2: { attack: 25, health: 55, defense: 34, attackSpeed: 0.24 },
    species_3: { attack: 46, health: 23, defense: 22, attackSpeed: 0.51 },
    species_4: { attack: 32, health: 34, defense: 30, attackSpeed: 0.28 },
    species_5: { attack: 30, health: 36, defense: 36, attackSpeed: 0.26 }
  },
  "m5_2": {
    species_1: { attack: 52, health: 26, defense: 24, attackSpeed: 0.3 },
    species_2: { attack: 26, health: 57, defense: 35, attackSpeed: 0.25 },
    species_3: { attack: 48, health: 24, defense: 23, attackSpeed: 0.53 },
    species_4: { attack: 33, health: 35, defense: 31, attackSpeed: 0.29 },
    species_5: { attack: 31, health: 37, defense: 37, attackSpeed: 0.27 }
  },
  "m5_3": {
    species_1: { attack: 54, health: 27, defense: 25, attackSpeed: 0.31 },
    species_2: { attack: 27, health: 59, defense: 36, attackSpeed: 0.26 },
    species_3: { attack: 50, health: 25, defense: 24, attackSpeed: 0.55 },
    species_4: { attack: 34, health: 36, defense: 32, attackSpeed: 0.3 },
    species_5: { attack: 32, health: 38, defense: 38, attackSpeed: 0.28 }
  },
  "m5_4": {
    species_1: { attack: 56, health: 28, defense: 26, attackSpeed: 0.32 },
    species_2: { attack: 28, health: 61, defense: 37, attackSpeed: 0.27 },
    species_3: { attack: 52, health: 26, defense: 25, attackSpeed: 0.57 },
    species_4: { attack: 35, health: 37, defense: 33, attackSpeed: 0.31 },
    species_5: { attack: 33, health: 39, defense: 39, attackSpeed: 0.29 }
  },
  "m5_5": {
    species_1: { attack: 58, health: 29, defense: 27, attackSpeed: 0.33 },
    species_2: { attack: 29, health: 63, defense: 38, attackSpeed: 0.28 },
    species_3: { attack: 54, health: 27, defense: 26, attackSpeed: 0.59 },
    species_4: { attack: 36, health: 38, defense: 34, attackSpeed: 0.32 },
    species_5: { attack: 34, health: 40, defense: 40, attackSpeed: 0.3 }
  }
};


function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);
  const [playerName, setPlayerName] = useState("Игрок");
  const [playerLevel, setPlayerLevel] = useState(1);


  const [awakeningStage, setAwakeningStage] = useState<number>(1);
  const [evolutionStage, setEvolutionStage] = useState<number>(1);
  const [currentBreedingMaterials, setCurrentBreedingMaterials] = useState<Material[]>(breedingMaterialsStage1);
  const [characterForm, setCharacterForm] = useState<number>(1);
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);


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


  const [characterStats, setCharacterStats] = useState<CharacterStats>({
    attack: 0,
    health: 0,
    defense: 0,
    attackSpeed: 0
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
      setCharacterStats(initialCharacterStats[characterId]);
      
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
    
    if (draggedBreedMaterial && selectedCharacter) {
      setPendingBreedSelection(draggedBreedMaterial);
      setIsBreedConfirmOpen(true);
    }
  };


  const handleConfirmBreeding = () => {
    if (!pendingBreedSelection || !selectedCharacter) {
      setIsBreedConfirmOpen(false);
      return;
    }


    const bonus = materialBonuses[pendingBreedSelection.id]?.[selectedCharacter];
    if (bonus) {
      setCharacterStats((prev) => ({
        attack: prev.attack + bonus.attack,
        health: prev.health + bonus.health,
        defense: prev.defense + bonus.defense,
        attackSpeed: Math.round((prev.attackSpeed + bonus.attackSpeed) * 100) / 100
      }));
    }


    setUsedMaterials(prev => new Set([...prev, pendingBreedSelection.id]));
    
    const newTotalCount = totalUsedCount + 1;
    setTotalUsedCount(newTotalCount);


    setCharacterForm((prev) => Math.min(prev + 1, 5));
    
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
    
    setIsBreedConfirmOpen(false);
    setPendingBreedSelection(null);
  };


  const handleCancelBreeding = () => {
    setIsBreedConfirmOpen(false);
    setPendingBreedSelection(null);
  };


  const handleCentralCircleClick = () => {
    // Клик по центральному кругу (можно оставить пустым)
  };


  const getCharacterImage = () => {
    if (!selectedCharacter) return "";
    const speciesNum = selectedCharacter.split("_")[1];
    
    // Используем Mob1.jpg и mob2.gif.mp4 вместо Bio1 и Bio2
    if (speciesNum === "1") {
      return `/assets/Material/Mob1.jpg`;
    } else if (speciesNum === "2") {
      return `/assets/Material/Mob2.gif`;
    } else {
      return `/assets/Material/Bio${speciesNum}.jpg`;
    }
  };


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
              <div className="player-info">
                <div className="player-avatar">
                  <img src={getCharacterImage()} alt="Player Avatar" draggable={false} />
                </div>
                <div className="player-details">
                  <div className="player-name">{playerName}</div>
                  <div className="player-level">Уровень {playerLevel}</div>
                </div>
              </div>


              <button className="market-button" onClick={() => setScreen("market")}>
                <div className="market-icon">🛒</div>
                <span>Магазин</span>
              </button>
            </>
          )}


          <div 
            className={`central-circle ${
              !selectedCharacter 
                ? (isOverCenterInitial ? 'drag-over' : '') 
                : (isOverCenterForBreed ? 'drag-over-breed' : 'has-character')
            }`}
            onDragOver={!selectedCharacter ? handleDragOverCenterInitial : handleDragOverCenterForBreed}
            onDragLeave={!selectedCharacter ? handleDragLeaveCenterInitial : handleDragLeaveCenterForBreed}
            onDrop={!selectedCharacter ? handleDropOnCenterInitial : handleDropOnCenterForBreed}
            onClick={selectedCharacter ? handleCentralCircleClick : undefined}
          >
            {!selectedCharacter ? (
              <div className="central-placeholder">
                Перетащите материал сюда
              </div>
            ) : (
              <img 
                src={getCharacterImage()} 
                alt="Selected Character" 
                className="central-character-image"
                draggable={false}
              />
            )}
          </div>


          {/* НОВЫЙ КОНТЕЙНЕР ДЛЯ МАТЕРИАЛОВ */}
          <div className="materials-container">
            {currentBreedingMaterials.map((material, index) => {
              const isDraggingThis = selectedCharacter 
                ? draggedBreedMaterial?.id === material.id
                : draggedInitialMaterial?.id === material.id;
              const isUsed = usedMaterials.has(material.id);
              
              return (
                <div
                  key={material.id}
                  className={`small-circle breeding-material ${isDraggingThis ? 'is-dragging' : ''} ${isUsed ? 'is-used' : ''}`}
                  draggable={!isUsed}
                  onDragStart={(e) => {
                    if (isUsed) return;
                    if (selectedCharacter) {
                      handleDragStartBreed(material, e);
                    } else {
                      handleDragStartInitial(material, e);
                    }
                  }}
                  onDrag={handleDrag}
                  onDragEnd={selectedCharacter ? handleDragEndBreed : handleDragEndInitial}
                  onMouseEnter={() => !isUsed && selectedCharacter && setHoveredMaterial(material.id)}
                  onMouseLeave={() => setHoveredMaterial(null)}
                >
                  <img 
                    src={material.image} 
                    alt={material.name}
                    className="small-circle-image"
                    draggable={false}
                  />
                  <div className="small-circle-name">{material.name}</div>
                  
                  {hoveredMaterial === material.id && !isUsed && selectedCharacter && materialBonuses[material.id]?.[selectedCharacter] && (
                    <div className="material-requirements-tooltip">
                      <div className="tooltip-title">Бонусы:</div>
                      <div className="tooltip-bonuses">
                        <span>⚔️ +{materialBonuses[material.id][selectedCharacter].attack}</span>
                        <span>❤️ +{materialBonuses[material.id][selectedCharacter].health}</span>
                        <span>🛡️ +{materialBonuses[material.id][selectedCharacter].defense}</span>
                        <span>⚡ +{materialBonuses[material.id][selectedCharacter].attackSpeed.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
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


              <button className="nav-button" onClick={() => setScreen("shop")}>
                <div className="nav-button-icon">
                  <img src="/assets/Icon_button/Shop_button.png" alt="Магазин" draggable={false} />
                </div>
                <span className="nav-button-label">Магазин</span>
              </button>


              <button className="nav-button" onClick={() => setScreen("info")}>
                <div className="nav-button-icon">
                  <img src="/assets/Icon_button/Setting_button.png" alt="Информация" draggable={false} />
                </div>
                <span className="nav-button-label">Информация</span>
              </button>
            </div>
          )}
        </div>
      )}


      {screen === "laboratory" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>Лаборатория</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content">
            <p>Содержимое лаборатории будет здесь</p>
          </div>
        </div>
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
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>Игровой магазин</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content">
            <p>Магазин будет здесь</p>
          </div>
        </div>
      )}


      {screen === "market" && (
        <div className="secondary-screen">
          <div className="secondary-header">
            <h2>Магазин</h2>
            <button className="close-button" onClick={() => setScreen("main")}>✕</button>
          </div>
          <div className="secondary-content">
            <p>Это другой магазин</p>
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
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">⚔️</span>
                      <span className="stat-name">Атака</span>
                      <span className="stat-value">{characterStats.attack}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div className="stat-bar attack" style={{ width: `${Math.min((characterStats.attack / 300) * 100, 100)}%` }} />
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-name">Здоровье</span>
                      <span className="stat-value">{characterStats.health}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div className="stat-bar health" style={{ width: `${Math.min((characterStats.health / 350) * 100, 100)}%` }} />
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">🛡️</span>
                      <span className="stat-name">Защита</span>
                      <span className="stat-value">{characterStats.defense}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div className="stat-bar defense" style={{ width: `${Math.min((characterStats.defense / 250) * 100, 100)}%` }} />
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-header">
                      <span className="stat-icon">⚡</span>
                      <span className="stat-name">Скорость атаки</span>
                      <span className="stat-value">{characterStats.attackSpeed.toFixed(2)}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div className="stat-bar speed" style={{ width: `${Math.min((characterStats.attackSpeed / 5.0) * 100, 100)}%` }} />
                    </div>
                  </div>
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


      {isBreedConfirmOpen && pendingBreedSelection && selectedCharacter && (
        <div className="breed-modal-backdrop">
          <div className="breed-modal">
            <div className="breed-modal-title">Подтвердить скрещивание?</div>
            <div className="breed-modal-text">Использовать {pendingBreedSelection.name}?</div>
            {materialBonuses[pendingBreedSelection.id]?.[selectedCharacter] && (
              <div className="breed-modal-info">
                <div className="breed-modal-bonus">
                  <div className="bonus-title">Получите бонусы:</div>
                  <div className="bonus-stats">
                    <span>⚔️ +{materialBonuses[pendingBreedSelection.id][selectedCharacter].attack}</span>
                    <span>❤️ +{materialBonuses[pendingBreedSelection.id][selectedCharacter].health}</span>
                    <span>🛡️ +{materialBonuses[pendingBreedSelection.id][selectedCharacter].defense}</span>
                    <span>⚡ +{materialBonuses[pendingBreedSelection.id][selectedCharacter].attackSpeed.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="breed-modal-buttons">
              <button className="breed-modal-button yes" onClick={handleConfirmBreeding}>Да</button>
              <button className="breed-modal-button no" onClick={handleCancelBreeding}>Нет</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default App;
