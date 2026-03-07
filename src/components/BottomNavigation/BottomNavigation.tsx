import React from 'react';

export type Screen =
    | "start" | "main" | "laboratory" | "premium" | "shop"
    | "info" | "market" | "nftShop" | "settings" | "id_person"
    | "avatar" | "language" | "referal";

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
                <span className="nav-button-label">Лаборатория</span>
            </button>

            <button
                className={`nav-button ${currentScreen === 'premium' ? 'active' : ''}`}
                onClick={() => onNavigate("premium")}
            >
                <div className="nav-button-icon">
                    <img
                        src="/assets/Icon_button/Premium_button.png"
                        alt="Премиум"
                        draggable={false}
                    />
                </div>
                <span className="nav-button-label">Премиум</span>
            </button>

            <button
                className={`nav-button ${currentScreen === 'nftShop' ? 'active' : ''}`}
                onClick={() => onNavigate("nftShop")}
            >
                <div className="nav-button-icon">
                    <img
                        src="/assets/Icon_button/Shop_button.png"
                        alt="NFT магазин"
                        draggable={false}
                    />
                </div>
                <span className="nav-button-label">NFT магазин</span>
            </button>

            <button className="nav-button" onClick={openSettings}>
                <div className="nav-button-icon">
                    <img
                        src="/assets/Icon_button/Setting_button.png"
                        alt="Настройки"
                        draggable={false}
                    />
                </div>
                <span className="nav-button-label">Настройки</span>
            </button>
        </div>
    );
};
