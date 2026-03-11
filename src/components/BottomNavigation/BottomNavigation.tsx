import React from 'react';

export type Screen =
    | "start" | "main" | "laboratory" | "premium" | "shop"
    | "info" | "market" | "nftShop" | "settings" | "id_person"
    | "avatar" | "language" | "referal" | "arena" | "museum";

interface BottomNavigationProps {
    currentScreen: Screen | string;
    onNavigate: (screen: any) => void;
    openSettings: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    currentScreen,
    onNavigate,
    openSettings,
}) => {
    return (
        <div className="bottom-navigation">
            <div className="nav-item">
                <button
                    className={`nav-button ${currentScreen === 'laboratory' ? 'active' : ''}`}
                    onClick={() => onNavigate("laboratory")}
                >
                    <div className="nav-button-icon">
                        <img
                            src="/assets/Icon_button/Lab_button.png"
                            alt="Лаборатория"
                            draggable={false}
                        />
                    </div>
                </button>
                <span className="nav-button-label">Лаборатория</span>
            </div>

            <div className="nav-item">
                <button
                    className={`nav-button ${currentScreen === 'arena' ? 'active' : ''}`}
                    onClick={() => onNavigate("arena")}
                >
                    <div className="nav-button-icon">
                        <img
                            src="/assets/Icon_button/Arena_button.png"
                            alt="Арена"
                            className="scaled-icon"
                            draggable={false}
                        />
                    </div>
                </button>
                <span className="nav-button-label">Арена</span>
            </div>

            <div className="nav-item">
                <button
                    className={`nav-button ${currentScreen === 'museum' ? 'active' : ''}`}
                    onClick={() => onNavigate("museum")}
                >
                    <div className="nav-button-icon">
                        <img
                            src="/assets/Icon_button/Museum_button.png"
                            alt="Экспонаты"
                            className="scaled-icon"
                            draggable={false}
                        />
                    </div>
                </button>
                <span className="nav-button-label">Экспонаты</span>
            </div>

            <div className="nav-item">
                <button
                    className={`nav-button ${currentScreen === 'nftShop' ? 'active' : ''}`}
                    onClick={() => onNavigate("nftShop")}
                >
                    <div className="nav-button-icon">
                        <img
                            src="/assets/Icon_button/NFT_button.png"
                            alt="NFT магазин"
                            className="scaled-icon"
                            draggable={false}
                        />
                    </div>
                </button>
                <span className="nav-button-label">NFT магазин</span>
            </div>

            <div className="nav-item">
                <button className={`nav-button ${currentScreen === 'settings' ? 'active' : ''}`} onClick={openSettings}>
                    <div className="nav-button-icon">
                        <img
                            src="/assets/Icon_button/Setting_button.png"
                            alt="Настройки"
                            draggable={false}
                        />
                    </div>
                </button>
                <span className="nav-button-label">Настройки</span>
            </div>
        </div>
    );
};
