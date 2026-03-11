// src/features/balance/materialsConfig.ts
import { MaterialBonus } from "./characterStats";

export interface MaterialDefinition {
  id: string;
  name: string;
  shortName?: string;
  image: string;
  description: string;
  bonus: MaterialBonus;
}

export const materialDefinitions: MaterialDefinition[] = [
  // ===== Стадия 1 =====
  {
    id: "m1_1",
    name: "Водород",
    shortName: "H",
    image: "/assets/Material/Malecula1.jpg",
    description: "Базовый усилитель урона и темпа атаки.",
    bonus: {
      strikePower: 10,
    },
  },
  {
    id: "m1_2",
    name: "Гелий",
    shortName: "He",
    image: "/assets/Material/Malecula2.jpg",
    description: "Укрепляет биоресурс и защиту.",
    bonus: {
      bioResource: 20,
      defenseMatrix: {
        kinetic: 4,
        energy: 4,
      },
    },
  },
  {
    id: "m1_3",
    name: "Литий",
    shortName: "Li",
    image: "/assets/Material/Malecula3.jpg",
    description: "Даёт крит и вампиризм.",
    bonus: {
      critPotential: {
        critChance: 3,
        critMultiplier: 0.05,
      },
      predatoryResonance: {
        lifestealPercent: 2,
        lifestealChance: 5,
      },
    },
  },
  {
    id: "m1_4",
    name: "Бериллий",
    shortName: "Be",
    image: "/assets/Material/Malecula4.jpg",
    description: "Усиливает токсичность.",
    bonus: {
      toxicity: {
        dotDamage: 2,
        dotChance: 8,
      },
    },
  },
  {
    id: "m1_5",
    name: "Бор",
    shortName: "B",
    image: "/assets/Material/Malecula5.jpg",
    description: "Баланс урона и защиты.",
    bonus: {
      strikePower: 6,
      bioResource: 10,
      defenseMatrix: {
        bio: 3,
        toxic: 3,
      },
    },
  },

  // ===== Стадия 2 =====
  {
    id: "m2_1",
    name: "Углерод",
    shortName: "C",
    image: "/assets/Material/Malecula6.jpg",
    description: "Продвинутый усилитель урона.",
    bonus: {
      strikePower: 15,
    },
  },
  {
    id: "m2_2",
    name: "Азот",
    shortName: "N",
    image: "/assets/Material/Malecula7.jpg",
    description: "Ускоряет атаки.",
    bonus: {
      defenseMatrix: {
        kinetic: 5,
        energy: 5,
        tech: 5,
      },
    },
  },
  {
    id: "m2_3",
    name: "Кислород",
    shortName: "O",
    image: "/assets/Material/Malecula8.jpg",
    description: "Дает много биоресурса.",
    bonus: {
      bioResource: 35,
    },
  },
  {
    id: "m2_4",
    name: "Фтор",
    shortName: "F",
    image: "/assets/Material/Malecula9.jpg",
    description: "Укрепляет защитную матрицу.",
    bonus: {
      defenseMatrix: {
        kinetic: 5,
        energy: 5,
        tech: 5,
      },
    },
  },
  {
    id: "m2_5",
    name: "Неон",
    shortName: "Ne",
    image: "/assets/Material/Malecula10.jpg",
    description: "Дополнительный критический потенциал.",
    bonus: {
      critPotential: {
        critChance: 4,
        critMultiplier: 0.08,
      },
    },
  },

  // ===== Стадия 3 =====
  {
    id: "m3_1",
    name: "Натрий",
    shortName: "Na",
    image: "/assets/Material/Malecula11.jpg",
    description: "Сильный прирост урона и крита.",
    bonus: {
      strikePower: 18,
      critPotential: {
        critChance: 5,
      },
    },
  },
  {
    id: "m3_2",
    name: "Магний",
    shortName: "Mg",
    image: "/assets/Material/Malecula12.jpg",
    description: "Биоресурс + защита.",
    bonus: {
      bioResource: 40,
      defenseMatrix: {
        kinetic: 6,
        bio: 6,
      },
    },
  },
  {
    id: "m3_3",
    name: "Алюминий",
    shortName: "Al",
    image: "/assets/Material/Malecula13.jpg",
    description: "Усиливает вампиризм.",
    bonus: {
      predatoryResonance: {
        lifestealPercent: 3,
        lifestealChance: 7,
      },
    },
  },
  {
    id: "m3_4",
    name: "Кремний",
    shortName: "Si",
    image: "/assets/Material/Malecula14.jpg",
    description: "Усиливает DOT‑эффекты.",
    bonus: {
      toxicity: {
        dotDamage: 3,
        dotChance: 10,
      },
    },
  },
  {
    id: "m3_5",
    name: "Фосфор",
    shortName: "P",
    image: "/assets/Material/Malecula15.jpg",
    description: "Добавляет нейрошок‑контроль.",
    bonus: {
      neuroShock: {
        stunChance: 4,
        stunDuration: 0.3,
      },
    },
  },

  // ===== Стадия 4 =====
  {
    id: "m4_1",
    name: "Сера",
    shortName: "S",
    image: "/assets/Material/Malecula16.jpg",
    description: "Большой буст урона.",
    bonus: {
      strikePower: 22,
    },
  },
  {
    id: "m4_2",
    name: "Хлор",
    shortName: "Cl",
    image: "/assets/Material/Malecula17.jpg",
    description: "Сильное ускорение атак.",
    bonus: {
      defenseMatrix: {
        kinetic: 5,
        energy: 5,
        tech: 5,
      },
    },
  },
  {
    id: "m4_3",
    name: "Аргон",
    shortName: "Ar",
    image: "/assets/Material/Malecula18.jpg",
    description: "Сильный защитный коктейль.",
    bonus: {
      defenseMatrix: {
        kinetic: 7,
        energy: 7,
        bio: 7,
      },
    },
  },
  {
    id: "m4_4",
    name: "Калий",
    shortName: "K",
    image: "/assets/Material/Malecula19.jpg",
    description: "Реактивная защита.",
    bonus: {
      reactiveDefense: {
        parryChance: 3,
        mitigationChance: 4,
        mitigationValue: 4,
      },
    },
  },
  {
    id: "m4_5",
    name: "Кальций",
    shortName: "Ca",
    image: "/assets/Material/Malecula20.jpg",
    description: "Крит + вампиризм.",
    bonus: {
      critPotential: {
        critChance: 4,
        critMultiplier: 0.1,
      },
      predatoryResonance: {
        lifestealPercent: 3,
      },
    },
  },

  // ===== Стадия 5 =====
  {
    id: "m5_1",
    name: "Скандий",
    shortName: "Sc",
    image: "/assets/Material/Malecula21.jpg",
    description: "Максимальный буст урона.",
    bonus: {
      strikePower: 30,
    },
  },
  {
    id: "m5_2",
    name: "Титан",
    shortName: "Ti",
    image: "/assets/Material/Malecula22.jpg",
    description: "Максимальный буст биоресурса.",
    bonus: {
      bioResource: 60,
    },
  },
  {
    id: "m5_3",
    name: "Ванадий",
    shortName: "V",
    image: "/assets/Material/Malecula23.jpg",
    description: "Топовая защита.",
    bonus: {
      defenseMatrix: {
        kinetic: 10,
        energy: 10,
        bio: 10,
        toxic: 8,
        tech: 8,
      },
    },
  },
  {
    id: "m5_4",
    name: "Хром",
    shortName: "Cr",
    image: "/assets/Material/Malecula24.jpg",
    description: "Топовый крит и контроль.",
    bonus: {
      critPotential: {
        critChance: 6,
        critMultiplier: 0.12,
      },
      neuroShock: {
        stunChance: 5,
      },
    },
  },
  {
    id: "m5_5",
    name: "Марганец",
    shortName: "Mn",
    image: "/assets/Material/Malecula25.jpg",
    description: "Сильный гибридный буст.",
    bonus: {
      strikePower: 15,
      bioResource: 30,
      predatoryResonance: {
        lifestealPercent: 4,
      },
    },
  },
];

// Если тебе нужны массивы по стадиям:
export const breedingMaterialsStage1 = materialDefinitions.filter((m) =>
  m.id.startsWith("m1_")
);
export const breedingMaterialsStage2 = materialDefinitions.filter((m) =>
  m.id.startsWith("m2_")
);
export const breedingMaterialsStage3 = materialDefinitions.filter((m) =>
  m.id.startsWith("m3_")
);
export const breedingMaterialsStage4 = materialDefinitions.filter((m) =>
  m.id.startsWith("m4_")
);
export const breedingMaterialsStage5 = materialDefinitions.filter((m) =>
  m.id.startsWith("m5_")
);
