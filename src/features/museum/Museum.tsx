import React, { useState } from 'react';
import { BottomNavigation } from '../../components/BottomNavigation/BottomNavigation';
import { CharacterStats } from '../balance/hooks/characterStats';

export interface Specimen {
    id: string;
    name: string;
    level: number;
    image: string | null;
    stats: CharacterStats;
    frozenAt: number;
}

interface MuseumProps {
    playerName: string;
    playerLevel: number;
    playerEP: number;
    playerAvatar: string;
    specimens: Specimen[];
    currentImage: string;
    onFreeze: (name: string) => void;
    onNavigate: (screen: any) => void;
    openSettings: () => void;
    onAvatarClick: () => void;
}

export const Museum: React.FC<MuseumProps> = ({
    playerName,
    playerLevel,
    playerEP,
    playerAvatar,
    specimens,
    currentImage,
    onFreeze,
    onNavigate,
    openSettings,
    onAvatarClick,
}) => {
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [freezeName, setFreezeName] = useState('');
    const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

    const handleOpenFreezeModal = () => {
        if (playerLevel <= 0) return;
        setFreezeName('');
        setIsFreezeModalOpen(true);
    };

    const handleConfirmFreeze = () => {
        if (!freezeName.trim()) return;
        onFreeze(freezeName.trim());
        setIsFreezeModalOpen(false);
        setFreezeName('');
    };

    const renderStats = (stats: CharacterStats) => (
        <div className="specimen-stats-list">
            <div className="specimen-stat-row">
                <span>⚔️ Сила удара:</span>
                <span>{stats.strikePower.toFixed(1)}</span>
            </div>
            <div className="specimen-stat-row">
                <span>💚 Биоресурс (ХП):</span>
                <span>{stats.bioResource.toFixed(1)}</span>
            </div>
            <div className="specimen-stat-row">
                <span>🛡️ Защита (сумм.):</span>
                <span>
                    {(
                        stats.defenseMatrix.kinetic +
                        stats.defenseMatrix.energy +
                        stats.defenseMatrix.bio +
                        stats.defenseMatrix.toxic +
                        stats.defenseMatrix.psionic +
                        stats.defenseMatrix.tech
                    ).toFixed(1)}
                </span>
            </div>
            <div className="specimen-stat-row">
                <span>💥 Крит. шанс:</span>
                <span>{stats.critPotential.critChance.toFixed(1)}%</span>
            </div>
            <div className="specimen-stat-row">
                <span>🩸 Вампиризм:</span>
                <span>{stats.predatoryResonance.lifestealPercent.toFixed(1)}%</span>
            </div>
            <div className="specimen-stat-row">
                <span>☣️ Токсичность (шанс):</span>
                <span>{stats.toxicity.dotChance.toFixed(1)}%</span>
            </div>
            <div className="specimen-stat-row">
                <span>🧠 Нейрошок (шанс):</span>
                <span>{stats.neuroShock.stunChance.toFixed(1)}%</span>
            </div>
        </div>
    );

    const canFreeze = playerLevel > 0;

    return (
        <div className="museum-screen">
            {/* Верхняя панель игрока */}
            <div
                className="player-info"
                onClick={() => onNavigate('info')}
            >
                <div
                    className="player-avatar"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAvatarClick();
                    }}
                >
                    <img src={playerAvatar} alt="Аватар" draggable={false} />
                </div>
                <div className="player-details">
                    <div className="player-name">{playerName}</div>
                    <div className="player-level">Уровень {playerLevel}</div>
                    <div className="player-ep">ЭП: {playerEP}</div>
                </div>
            </div>

            {/* Кнопка возврата на главную (как в лаборатории) */}
            <button
                className="dna-zoom-button"
                onClick={() => onNavigate('main')}
            >
                <img src="/assets/Icon_button/BackDNK_button.png" alt="ДНК" draggable={false} />
                <span className="zoom-label">ДНК</span>
            </button>


            {/* Заголовок + черта-разделитель */}
            <div className="museum-divider-block">
                <div className="museum-title-inline">
                    <span>🧬</span> Экспонаты
                </div>
                <div className="museum-divider-line" />
            </div>

            {/* Список экспонатов */}
            <div className="museum-content">
                <div className="museum-specimens-grid">
                    {/* Кнопка заморозки — первый элемент сетки */}
                    <div
                        className={`museum-freeze-btn ${!canFreeze ? 'museum-freeze-btn--disabled' : ''}`}
                        onClick={handleOpenFreezeModal}
                    >
                        <span className="museum-freeze-icon">❄️</span>
                        <span className="museum-freeze-label">Заморозить экспонат</span>
                        {!canFreeze && (
                            <span className="museum-freeze-hint">Нужен уровень &gt; 0</span>
                        )}
                    </div>

                    {/* Карточки замороженных экспонатов */}
                    {specimens.map((specimen) => (
                        <div
                            key={specimen.id}
                            className="specimen-card"
                            onClick={() => setSelectedSpecimen(specimen)}
                        >
                            <div className="specimen-card-name">{specimen.name}</div>
                            <div className="specimen-card-img-wrapper">
                                <img
                                    src={specimen.image || '/assets/Material/Bio.png'}
                                    alt={specimen.name}
                                    className="specimen-card-img"
                                    draggable={false}
                                />
                            </div>
                            <div className="specimen-card-level">Ур. {specimen.level}</div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Нижняя навигация */}
            <BottomNavigation
                currentScreen="museum"
                onNavigate={onNavigate}
                openSettings={openSettings}
            />

            {/* Модальное окно заморозки */}
            {isFreezeModalOpen && (
                <div className="freeze-modal-backdrop" onClick={() => setIsFreezeModalOpen(false)}>
                    <div className="freeze-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="freeze-modal-header">
                            <span className="freeze-modal-icon">❄️</span>
                            <h3>Вы точно хотите заморозить своё творение?</h3>
                        </div>

                        <div className="freeze-modal-preview">
                            <img
                                src={currentImage}
                                alt="Персонаж"
                                className="freeze-modal-img"
                                draggable={false}
                            />
                            <div className="freeze-modal-info">
                                <div>Уровень: <strong>{playerLevel}</strong></div>
                            </div>
                        </div>

                        <div className="freeze-modal-warning">
                            ⚠️ Уровень и характеристики сбросятся. ЭП сохранится.
                        </div>

                        <div className="freeze-modal-input-group">
                            <label className="freeze-modal-label">Назовите своё творение</label>
                            <input
                                className="freeze-modal-input"
                                type="text"
                                placeholder="Введите название..."
                                value={freezeName}
                                onChange={(e) => setFreezeName(e.target.value)}
                                maxLength={30}
                                autoFocus
                            />
                        </div>

                        <div className="freeze-modal-buttons">
                            <button
                                className={`freeze-modal-btn freeze-modal-btn--confirm ${!freezeName.trim() ? 'freeze-modal-btn--inactive' : ''}`}
                                onClick={handleConfirmFreeze}
                                disabled={!freezeName.trim()}
                            >
                                ❄️ Заморозить
                            </button>
                            <button
                                className="freeze-modal-btn freeze-modal-btn--cancel"
                                onClick={() => setIsFreezeModalOpen(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно просмотра экспоната */}
            {selectedSpecimen && (
                <div className="specimen-modal-backdrop" onClick={() => setSelectedSpecimen(null)}>
                    <div className="specimen-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button specimen-modal-close" onClick={() => setSelectedSpecimen(null)}>✕</button>

                        <h2 className="specimen-modal-name">{selectedSpecimen.name}</h2>

                        <div className="specimen-modal-img-wrapper">
                            <img
                                src={selectedSpecimen.image || '/assets/Material/Bio.png'}
                                alt={selectedSpecimen.name}
                                className="specimen-modal-img"
                                draggable={false}
                            />
                        </div>

                        <div className="specimen-modal-level">
                            🔬 Уровень: <strong>{selectedSpecimen.level}</strong>
                        </div>

                        <div className="specimen-modal-date">
                            🕐 {new Date(selectedSpecimen.frozenAt).toLocaleDateString('ru-RU')}
                        </div>

                        {renderStats(selectedSpecimen.stats)}
                    </div>
                </div>
            )}
        </div>
    );
};
