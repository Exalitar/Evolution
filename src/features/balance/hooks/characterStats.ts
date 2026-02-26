// src/app/features/balance/characterStats.ts

// ===== Тип персонажа =====

export type CharacterId = "unknown_dna";

// ===== Основные характеристики персонажа =====

export interface CharacterStats {
  // 1. Сила удара + темп атаки
  strikePower: number;   // общее «очко» силы удара
  attackTempo: number;   // итоговый темп атаки (ударов в секунду)

  // 2. Биоресурс
  bioResource: number;

  // 3. Матрица защиты — 6 типов
  defenseMatrix: {
    kinetic: number;
    energy: number;
    bio: number;
    toxic: number;
    psionic: number;
    tech: number;
  };

  // 4. Реактивная защита (детальный вариант)
  reactiveDefense: {
    triggerChance: number;    // общий шанс срабатывания реактивной защиты, %
    parryChance: number;      // шанс, что сработавшая защита будет «уклонением», %
    mitigationChance: number; // шанс, что сработавшая защита будет «блоком», %
    mitigationValue: number;  // сколько урона блок поглощает, %
  };

  // 5. Критический потенциал
  critPotential: {
    critChance: number;     // шанс крита, %
    critMultiplier: number; // множитель крита, например 1.5 = +50%
  };

  // 6. Хищный резонанс (вампиризм)
  predatoryResonance: {
    lifestealPercent: number; // % от нанесённого урона, который лечит
    lifestealChance: number;  // шанс срабатывания, %
  };

  // 7. Токсичность (dot)
  toxicity: {
    dotDamage: number; // урон в секунду
    dotChance: number; // шанс наложить эффект, %
  };

  // 8. Нейрошок (стан)
  neuroShock: {
    stunChance: number;   // шанс успеха, %
    stunDuration: number; // длительность стана, сек
    stunCooldown: number; // кулдаун способности, сек
  };
}

// ===== Вспомогательная функция: темп атаки от силы удара =====

export const getBaseAttackTempoFromStrike = (strikePower: number): number => {
  if (strikePower <= 0) return 0;

  const minStrike = 1;
  const maxStrike = 100;   // условный максимум очков силы
  const minTempo = 0.3;    // очень медленно
  const maxTempo = 1.8;    // очень быстро

  const clamped = Math.min(Math.max(strikePower, minStrike), maxStrike);
  const t = (clamped - minStrike) / (maxStrike - minStrike); // 0..1
  const tempo = minTempo + (maxTempo - minTempo) * t * 0.7;  // сглаживаем
  return Number(tempo.toFixed(2));
};

// ===== Базовые статы Неопознанного ДНК =====

const baseUnknownDNA: CharacterStats = {
  strikePower: 0,
  attackTempo: 0,
  bioResource: 10,

  defenseMatrix: {
    kinetic: 0,
    energy: 0,
    bio: 0,
    toxic: 0,
    psionic: 0,
    tech: 0,
  },

  reactiveDefense: {
    triggerChance: 0,
    parryChance: 0,
    mitigationChance: 0,
    mitigationValue: 0,
  },

  critPotential: {
    critChance: 0,
    critMultiplier: 1,
  },

  predatoryResonance: {
    lifestealPercent: 0,
    lifestealChance: 0,
  },

  toxicity: {
    dotDamage: 0,
    dotChance: 0,
  },

  neuroShock: {
    stunChance: 0,
    stunDuration: 0,
    stunCooldown: 0,
  },
};

export const baseCharacterStats: Record<CharacterId, CharacterStats> = {
  unknown_dna: baseUnknownDNA,
};

// ===== Бонусы материалов =====
export interface MaterialBonus {
  strikePower?: number;
  bioResource?: number;
  defenseMatrix?: Partial<CharacterStats["defenseMatrix"]>;
  reactiveDefense?: Partial<CharacterStats["reactiveDefense"]>;
  critPotential?: Partial<CharacterStats["critPotential"]>;
  predatoryResonance?: Partial<CharacterStats["predatoryResonance"]>;
  toxicity?: Partial<CharacterStats["toxicity"]>;
  neuroShock?: Partial<CharacterStats["neuroShock"]>;
}

export type MaterialBonusMap = Record<string, MaterialBonus>;

// импортируем конфиг материалов, где у каждого есть свой bonus
import { materialDefinitions } from "./materialsConfig";

// строим карту id материала → его бонус
export const materialBonuses: MaterialBonusMap = materialDefinitions.reduce(
  (acc, material) => {
    acc[material.id] = material.bonus as MaterialBonus;
    return acc;
  },
  {} as MaterialBonusMap
);

// ===== Рандом 5–10% и применение бонусов =====

const applyRandomSpread = (base: number | undefined): number => {
  if (!base) return 0;
  const spread = Math.random() * 0.05 + 0.05; // 5–10%
  const sign = Math.random() < 0.5 ? -1 : 1;
  return Number((base + base * spread * sign).toFixed(2));
};

export const applyMaterialToStats = (
  stats: CharacterStats,
  bonus: MaterialBonus
): CharacterStats => {
  const next: CharacterStats = JSON.parse(JSON.stringify(stats));

  // Сила удара и пересчёт темпа
  if (bonus.strikePower) {
    next.strikePower += applyRandomSpread(bonus.strikePower);
    next.attackTempo = getBaseAttackTempoFromStrike(next.strikePower);
  }

  // Биоресурс
  if (bonus.bioResource) {
    next.bioResource += applyRandomSpread(bonus.bioResource);
  }

  // Матрица защиты
  if (bonus.defenseMatrix) {
    (Object.keys(bonus.defenseMatrix) as Array<
      keyof CharacterStats["defenseMatrix"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.defenseMatrix![k]);
      next.defenseMatrix[k] += add;
    });
  }

  // Реактивная защита
  if (bonus.reactiveDefense) {
    (Object.keys(bonus.reactiveDefense) as Array<
      keyof CharacterStats["reactiveDefense"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.reactiveDefense![k]);
      next.reactiveDefense[k] =
        (next.reactiveDefense[k] ?? 0) + add;
    });
  }

  // Критический потенциал
  if (bonus.critPotential) {
    (Object.keys(bonus.critPotential) as Array<
      keyof CharacterStats["critPotential"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.critPotential![k]);
      next.critPotential[k] += add;
    });
  }

  // Хищный резонанс
  if (bonus.predatoryResonance) {
    (Object.keys(bonus.predatoryResonance) as Array<
      keyof CharacterStats["predatoryResonance"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.predatoryResonance![k]);
      next.predatoryResonance[k] += add;
    });
  }

  // Токсичность
  if (bonus.toxicity) {
    (Object.keys(bonus.toxicity) as Array<
      keyof CharacterStats["toxicity"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.toxicity![k]);
      next.toxicity[k] += add;
    });
  }

  // Нейрошок
  if (bonus.neuroShock) {
    (Object.keys(bonus.neuroShock) as Array<
      keyof CharacterStats["neuroShock"]
    >).forEach((k) => {
      const add = applyRandomSpread(bonus.neuroShock![k]);
      next.neuroShock[k] += add;
    });
  }

  return next;
};

export type MainFocus =
  | 'strikePower'
  | 'bioResource'
  | 'defense'
  | 'crit'
  | 'lifesteal'
  | 'dot'
  | 'stun';

export interface AdaptiveMaterialBonus extends MaterialBonus {
  mainFocus: MainFocus;
}

// вычисляем, какая характеристика сейчас «сильная» у персонажа
export const detectCurrentFocus = (stats: CharacterStats): MainFocus => {
  const totals = {
    strikePower: stats.strikePower,
    bioResource: stats.bioResource,
    defense:
      stats.defenseMatrix.kinetic +
      stats.defenseMatrix.energy +
      stats.defenseMatrix.bio +
      stats.defenseMatrix.toxic +
      stats.defenseMatrix.psionic +
      stats.defenseMatrix.tech,
    crit:
      stats.critPotential.critChance * stats.critPotential.critMultiplier,
    lifesteal:
      stats.predatoryResonance.lifestealPercent *
      stats.predatoryResonance.lifestealChance,
    dot: stats.toxicity.dotDamage * stats.toxicity.dotChance,
    stun: stats.neuroShock.stunChance * stats.neuroShock.stunDuration,
  };

  return (Object.keys(totals) as MainFocus[]).reduce((best, key) =>
    totals[key] > totals[best] ? key : best
  );
};