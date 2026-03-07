import React from 'react';
import { CharacterStats } from '../balance/hooks/characterStats';

interface InfoScreenProps {
    onClose: () => void;
    characterImage: string;
    currentStats: CharacterStats | null;
    evolutionStage: number;
    isGeneratingImage?: boolean; // Передаем состояние генерации
}

export const InfoScreen: React.FC<InfoScreenProps> = ({
    onClose,
    characterImage,
    currentStats,
    evolutionStage,
    isGeneratingImage = false,
}) => {
    return (
        <div className="info-screen">
            <div className="info-header">
                <h2>Характеристики персонажа</h2>
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className="info-content">
                <div className="info-character-preview">
                    {isGeneratingImage ? (
                        <div className="info-character-image generating-overlay">
                            <div className="generating-loader">Генерируется новая форма...</div>
                        </div>
                    ) : (
                        <img
                            src={characterImage}
                            alt="Персонаж"
                            className="info-character-image"
                            draggable={false}
                        />
                    )}
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
                                            width: `${Math.min((currentStats.strikePower / 300) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="stat-description">Базовый урон и частота атак.</div>
                                <div className="stat-subgrid">
                                    <div>Урон: {currentStats.strikePower}</div>
                                    <div>Скорость атаки: {currentStats.attackTempo.toFixed(2)}</div>
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
                                            width: `${Math.min((currentStats.bioResource / 400) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="stat-description">Запас жизни и устойчивость к фокусу.</div>
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
                                <div className="stat-description">Уменьшение входящего урона по разным типам.</div>
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
                                    <div>Кинетическая: {currentStats.defenseMatrix.kinetic}</div>
                                    <div>Энергетическая: {currentStats.defenseMatrix.energy}</div>
                                    <div>Биологическая: {currentStats.defenseMatrix.bio}</div>
                                    <div>Токсическая: {currentStats.defenseMatrix.toxic}</div>
                                    <div>Псионическая: {currentStats.defenseMatrix.psionic}</div>
                                    <div>Технологическая: {currentStats.defenseMatrix.tech}</div>
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
                                <div className="stat-description">Шанс среагировать на входящий урон.</div>
                                <div className="stat-subgrid">
                                    <div>Шанс уклонения: {currentStats.reactiveDefense.parryChance.toFixed(2)}%</div>
                                    <div>Шанс блокировки: {currentStats.reactiveDefense.mitigationChance.toFixed(2)}%</div>
                                    <div>Поглощение: {currentStats.reactiveDefense.mitigationValue.toFixed(2)}%</div>
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
                                            width: `${Math.min(currentStats.critPotential.critChance, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="stat-description">Отвечает за взрывной урон.</div>
                                <div className="stat-subgrid">
                                    <div>Шанс крита: {currentStats.critPotential.critChance.toFixed(2)}%</div>
                                    <div>Увеличение крита: ×{currentStats.critPotential.critMultiplier.toFixed(2)}</div>
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
                                <div className="stat-description">Откачивает жизнь у цели.</div>
                                <div className="stat-subgrid">
                                    <div>Кража здоровья: {currentStats.predatoryResonance.lifestealPercent.toFixed(2)}%</div>
                                    <div>Шанс успеха: {currentStats.predatoryResonance.lifestealChance.toFixed(2)}%</div>
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
                                                (currentStats.toxicity.dotDamage * currentStats.toxicity.dotChance) / 60,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <div className="stat-description">Наносит урон ядом.</div>
                                <div className="stat-subgrid">
                                    <div>Шанс успеха: {currentStats.toxicity.dotChance.toFixed(2)}%</div>
                                    <div>Урон в секунду: {currentStats.toxicity.dotDamage.toFixed(2)}</div>
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
                                                (currentStats.neuroShock.stunChance * currentStats.neuroShock.stunDuration) /
                                                (currentStats.neuroShock.stunCooldown || 1),
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <div className="stat-description">Контролирует действия противника.</div>
                                <div className="stat-subgrid">
                                    <div>Шанс успеха: {currentStats.neuroShock.stunChance.toFixed(2)}%</div>
                                    <div>Длительность: {currentStats.neuroShock.stunDuration.toFixed(2)} c</div>
                                    <div>Кулдаун: {currentStats.neuroShock.stunCooldown.toFixed(2)} c</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="info-description">
                    <h3>Особенности</h3>
                    <p>
                        Неопознанный ДНК начинает как слабое существо, но с каждым синтезом
                        материалов его характеристики могут развиваться в разные стороны: от
                        мощного танка до быстрого хищника.
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
    );
};
