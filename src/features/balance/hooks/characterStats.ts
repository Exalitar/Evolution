// src/app/features/balance/characterStats.ts

// === Типы персонажей ===

export type CharacterId =
  | "species_1"
  | "species_2"
  | "species_3"
  | "species_4"
  | "species_5";

// === Характеристики персонажа в стиле научной фантастики ===

export interface CharacterStats {
  // 1. Сила удара (базовый урон)
  strikePower: number;

  // 2. Биоресурс (здоровье)
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

  // 4. Темп атаки (скорость / инициатива)
  attackTempo: number;

  // 5. Реактивная защита
  reactiveDefense: {
    parryChance: number;        // %
    mitigationChance: number;   // %
    mitigationValue: number;    // % поглощения
  };

  // 6. Критический потенциал
  critPotential: {
    critChance: number;         // %
    critMultiplier: number;     // ×1.5, ×2 и т.п.
  };

  // 7. Хищный резонанс (вампиризм)
  predatoryResonance: {
    lifestealPercent: number;   // % от урона
    lifestealChance: number;    // %
  };

  // 8. Токсичность (dot)
  toxicity: {
    dotDamage: number;          // урон за тик
    dotChance: number;          // %
  };

  // 9. Нейрошок (стан)
  neuroShock: {
    shockDamage: number;        // урон при срабатывании
    stunChance: number;         // %
    stunDuration: number;       // сек
    stunCooldown: number;       // сек
  };
}

// === БАЗОВЫЕ СТАТЫ ПЕРСОНАЖЕЙ (сырая версия, под баланс) ===

const rawCharacterStats: Record<CharacterId, CharacterStats> = {
  // Агрессивный хищник
  species_1: {
    strikePower: 120,
    bioResource: 80,
    defenseMatrix: {
      kinetic: 40,
      energy: 25,
      bio: 20,
      toxic: 20,
      psionic: 15,
      tech: 20
    },
    attackTempo: 1.6,
    reactiveDefense: {
      parryChance: 8,
      mitigationChance: 10,
      mitigationValue: 35
    },
    critPotential: {
      critChance: 22,
      critMultiplier: 1.8
    },
    predatoryResonance: {
      lifestealPercent: 9,
      lifestealChance: 35
    },
    toxicity: {
      dotDamage: 4,
      dotChance: 18
    },
    neuroShock: {
      shockDamage: 6,
      stunChance: 10,
      stunDuration: 1.2,
      stunCooldown: 9
    }
  },

  // Танк‑титан
  species_2: {
    strikePower: 85,
    bioResource: 150,
    defenseMatrix: {
      kinetic: 55,
      energy: 50,
      bio: 40,
      toxic: 35,
      psionic: 30,
      tech: 45
    },
    attackTempo: 0.9,
    reactiveDefense: {
      parryChance: 6,
      mitigationChance: 22,
      mitigationValue: 45
    },
    critPotential: {
      critChance: 14,
      critMultiplier: 1.6
    },
    predatoryResonance: {
      lifestealPercent: 6,
      lifestealChance: 25
    },
    toxicity: {
      dotDamage: 3,
      dotChance: 14
    },
    neuroShock: {
      shockDamage: 4,
      stunChance: 16,
      stunDuration: 1.6,
      stunCooldown: 11
    }
  },

  // Быстрый спринтер
  species_3: {
    strikePower: 95,
    bioResource: 75,
    defenseMatrix: {
      kinetic: 30,
      energy: 30,
      bio: 25,
      toxic: 25,
      psionic: 25,
      tech: 25
    },
    attackTempo: 2.0,
    reactiveDefense: {
      parryChance: 10,
      mitigationChance: 12,
      mitigationValue: 33
    },
    critPotential: {
      critChance: 26,
      critMultiplier: 1.9
    },
    predatoryResonance: {
      lifestealPercent: 8,
      lifestealChance: 40
    },
    toxicity: {
      dotDamage: 5,
      dotChance: 22
    },
    neuroShock: {
      shockDamage: 5,
      stunChance: 12,
      stunDuration: 1.1,
      stunCooldown: 8
    }
  },

  // Универсал
  species_4: {
    strikePower: 100,
    bioResource: 100,
    defenseMatrix: {
      kinetic: 40,
      energy: 40,
      bio: 35,
      toxic: 35,
      psionic: 30,
      tech: 35
    },
    attackTempo: 1.3,
    reactiveDefense: {
      parryChance: 9,
      mitigationChance: 14,
      mitigationValue: 38
    },
    critPotential: {
      critChance: 20,
      critMultiplier: 1.7
    },
    predatoryResonance: {
      lifestealPercent: 7,
      lifestealChance: 30
    },
    toxicity: {
      dotDamage: 4,
      dotChance: 18
    },
    neuroShock: {
      shockDamage: 5,
      stunChance: 13,
      stunDuration: 1.3,
      stunCooldown: 10
    }
  },

  // Защитный страж
  species_5: {
    strikePower: 90,
    bioResource: 120,
    defenseMatrix: {
      kinetic: 50,
      energy: 45,
      bio: 45,
      toxic: 40,
      psionic: 35,
      tech: 50
    },
    attackTempo: 1.1,
    reactiveDefense: {
      parryChance: 7,
      mitigationChance: 20,
      mitigationValue: 42
    },
    critPotential: {
      critChance: 16,
      critMultiplier: 1.6
    },
    predatoryResonance: {
      lifestealPercent: 7,
      lifestealChance: 30
    },
    toxicity: {
      dotDamage: 3,
      dotChance: 16
    },
    neuroShock: {
      shockDamage: 4,
      stunChance: 15,
      stunDuration: 1.4,
      stunCooldown: 10
    }
  }
};

// === Оценка «силы» персонажа для баланса ===

export const getCharacterPower = (s: CharacterStats): number => {
  const defenseSum =
    s.defenseMatrix.kinetic +
    s.defenseMatrix.energy +
    s.defenseMatrix.bio +
    s.defenseMatrix.toxic +
    s.defenseMatrix.psionic +
    s.defenseMatrix.tech;

  const baseDamageBlock =
    s.strikePower * 1.0 +
    s.attackTempo * 40 +
    s.critPotential.critChance * 1.3 +
    s.critPotential.critMultiplier * 20;

  const survivabilityBlock =
    s.bioResource * 0.7 +
    defenseSum * 0.5 +
    s.reactiveDefense.parryChance * 1.2 +
    s.reactiveDefense.mitigationChance * 1.0 +
    s.reactiveDefense.mitigationValue * 1.0;

  const vampPoisonControlBlock =
    (s.predatoryResonance.lifestealPercent *
      s.predatoryResonance.lifestealChance) /
      3 +
    (s.toxicity.dotDamage * s.toxicity.dotChance) / 2.5 +
    (s.neuroShock.shockDamage *
      s.neuroShock.stunChance *
      s.neuroShock.stunDuration) /
      (s.neuroShock.stunCooldown || 1);

  return baseDamageBlock + survivabilityBlock + vampPoisonControlBlock;
};

// Нормализация статов к целевой «мощности»

const TARGET_POWER = 1000;

const normalizeStatsToTargetPower = (stats: CharacterStats): CharacterStats => {
  const currentPower = getCharacterPower(stats);
  const k = TARGET_POWER / currentPower;

  const scale = (v: number, power = 1) => v * Math.pow(k, power);

  return {
    strikePower: Math.round(scale(stats.strikePower)),
    bioResource: Math.round(scale(stats.bioResource)),
    defenseMatrix: {
      kinetic: Math.round(scale(stats.defenseMatrix.kinetic)),
      energy: Math.round(scale(stats.defenseMatrix.energy)),
      bio: Math.round(scale(stats.defenseMatrix.bio)),
      toxic: Math.round(scale(stats.defenseMatrix.toxic)),
      psionic: Math.round(scale(stats.defenseMatrix.psionic)),
      tech: Math.round(scale(stats.defenseMatrix.tech))
    },
    attackTempo: Number(scale(stats.attackTempo, 0.3).toFixed(2)),
    reactiveDefense: {
      parryChance: Number(scale(stats.reactiveDefense.parryChance, 0.5).toFixed(2)),
      mitigationChance: Number(
        scale(stats.reactiveDefense.mitigationChance, 0.5).toFixed(2)
      ),
      mitigationValue: Number(
        scale(stats.reactiveDefense.mitigationValue, 0.5).toFixed(2)
      )
    },
    critPotential: {
      critChance: Number(scale(stats.critPotential.critChance, 0.5).toFixed(2)),
      critMultiplier: Number(
        scale(stats.critPotential.critMultiplier, 0.3).toFixed(2)
      )
    },
    predatoryResonance: {
      lifestealPercent: Number(
        scale(stats.predatoryResonance.lifestealPercent, 0.5).toFixed(2)
      ),
      lifestealChance: Number(
        scale(stats.predatoryResonance.lifestealChance, 0.5).toFixed(2)
      )
    },
    toxicity: {
      dotDamage: Number(scale(stats.toxicity.dotDamage, 0.7).toFixed(2)),
      dotChance: Number(scale(stats.toxicity.dotChance, 0.5).toFixed(2))
    },
    neuroShock: {
      shockDamage: Number(scale(stats.neuroShock.shockDamage, 0.7).toFixed(2)),
      stunChance: Number(scale(stats.neuroShock.stunChance, 0.5).toFixed(2)),
      stunDuration: Number(scale(stats.neuroShock.stunDuration, 0.3).toFixed(2)),
      stunCooldown: Number(scale(stats.neuroShock.stunCooldown, 0.3).toFixed(2))
    }
  };
};

// Итоговые базовые статы после нормализации
export const baseCharacterStats: Record<CharacterId, CharacterStats> = {
  species_1: normalizeStatsToTargetPower(rawCharacterStats.species_1),
  species_2: normalizeStatsToTargetPower(rawCharacterStats.species_2),
  species_3: normalizeStatsToTargetPower(rawCharacterStats.species_3),
  species_4: normalizeStatsToTargetPower(rawCharacterStats.species_4),
  species_5: normalizeStatsToTargetPower(rawCharacterStats.species_5)
};

// === БОНУСЫ МАТЕРИАЛОВ ===

export interface MaterialBonus {
  strikePower?: number;
  bioResource?: number;
  defenseMatrix?: Partial<CharacterStats["defenseMatrix"]>;
  attackTempo?: number;
  reactiveDefense?: Partial<CharacterStats["reactiveDefense"]>;
  critPotential?: Partial<CharacterStats["critPotential"]>;
  predatoryResonance?: Partial<CharacterStats["predatoryResonance"]>;
  toxicity?: Partial<CharacterStats["toxicity"]>;
  neuroShock?: Partial<CharacterStats["neuroShock"]>;
}

export type MaterialBonusMap = Record<CharacterId, MaterialBonus>;

// Пример: сюда нужно перенести все твои материалы m1_1..m5_5
export const materialBonuses: Record<string, MaterialBonusMap> = {
  m1_1: {
    species_1: {
      strikePower: 12,
      bioResource: 6,
      defenseMatrix: { kinetic: 5 },
      attackTempo: 0.05,
      critPotential: { critChance: 3, critMultiplier: 0.05 },
      predatoryResonance: { lifestealPercent: 2 },
      toxicity: { dotDamage: 1, dotChance: 3 },
      neuroShock: { stunChance: 2 }
    },
    species_2: {
      strikePower: 8,
      bioResource: 10,
      defenseMatrix: { energy: 6 },
      attackTempo: 0.03,
      critPotential: { critChance: 2, critMultiplier: 0.04 },
      predatoryResonance: { lifestealPercent: 1 },
      toxicity: { dotDamage: 1, dotChance: 2 },
      neuroShock: { stunChance: 2 }
    },
    species_3: {
      strikePower: 11,
      bioResource: 5,
      defenseMatrix: { kinetic: 3 },
      attackTempo: 0.06,
      critPotential: { critChance: 4, critMultiplier: 0.06 },
      predatoryResonance: { lifestealPercent: 2 },
      toxicity: { dotDamage: 1, dotChance: 3 },
      neuroShock: { stunChance: 1 }
    },
    species_4: {
      strikePower: 9,
      bioResource: 8,
      defenseMatrix: { bio: 4 },
      attackTempo: 0.04,
      critPotential: { critChance: 3, critMultiplier: 0.05 },
      predatoryResonance: { lifestealPercent: 2 },
      toxicity: { dotDamage: 1, dotChance: 2 },
      neuroShock: { stunChance: 2 }
    },
    species_5: {
      strikePower: 7,
      bioResource: 9,
      defenseMatrix: { tech: 5 },
      attackTempo: 0.03,
      critPotential: { critChance: 2, critMultiplier: 0.04 },
      predatoryResonance: { lifestealPercent: 2 },
      toxicity: { dotDamage: 1, dotChance: 2 },
      neuroShock: { stunChance: 2 }
    }
  }
  // m1_2, m1_3, ... добавляешь здесь по аналогии
};

// === РАНДОМ 5–10% ДЛЯ БОНУСОВ ===

const applyRandomSpread = (base: number | undefined): number => {
  if (!base) return 0;
  const spread = Math.random() * 0.05 + 0.05; // 5–10%
  const sign = Math.random() < 0.5 ? -1 : 1;
  return Number((base + base * spread * sign).toFixed(2));
};

// Применение бонуса материала к статам персонажа
export const applyMaterialToStats = (
  stats: CharacterStats,
  bonus: MaterialBonus
): CharacterStats => {
  const next: CharacterStats = JSON.parse(JSON.stringify(stats));

  next.strikePower += applyRandomSpread(bonus.strikePower);
  next.bioResource += applyRandomSpread(bonus.bioResource);
  next.attackTempo = Number(
    (next.attackTempo + applyRandomSpread(bonus.attackTempo) / 10).toFixed(2)
  );

  if (bonus.defenseMatrix) {
    for (const key of Object.keys(bonus.defenseMatrix) as Array<
      keyof CharacterStats["defenseMatrix"]
    >) {
      next.defenseMatrix[key] += applyRandomSpread(bonus.defenseMatrix[key]);
    }
  }

  if (bonus.reactiveDefense) {
    for (const key of Object.keys(bonus.reactiveDefense) as Array<
      keyof CharacterStats["reactiveDefense"]
    >) {
      next.reactiveDefense[key] += applyRandomSpread(
        bonus.reactiveDefense[key]
      );
    }
  }

  if (bonus.critPotential) {
    for (const key of Object.keys(bonus.critPotential) as Array<
      keyof CharacterStats["critPotential"]
    >) {
      next.critPotential[key] += applyRandomSpread(bonus.critPotential[key]);
    }
  }

  if (bonus.predatoryResonance) {
    for (const key of Object.keys(bonus.predatoryResonance) as Array<
      keyof CharacterStats["predatoryResonance"]
    >) {
      next.predatoryResonance[key] += applyRandomSpread(
        bonus.predatoryResonance[key]
      );
    }
  }

  if (bonus.toxicity) {
    for (const key of Object.keys(bonus.toxicity) as Array<
      keyof CharacterStats["toxicity"]
    >) {
      next.toxicity[key] += applyRandomSpread(bonus.toxicity[key]);
    }
  }

  if (bonus.neuroShock) {
    for (const key of Object.keys(bonus.neuroShock) as Array<
      keyof CharacterStats["neuroShock"]
    >) {
      next.neuroShock[key] += applyRandomSpread(bonus.neuroShock[key]);
    }
  }

  return next;
};
