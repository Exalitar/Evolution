import { useState } from "react";
import "./styles/App.css";

type CharacterId = "char1" | "char2" | "char3"; // временно любые id

function App() {
  const [screen, setScreen] = useState<"start" | "choose" | "game">("start");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);

  const handleStart = () => {
    setScreen("choose");
  };

  const handleChooseCharacter = (id: CharacterId) => {
    setSelectedCharacter(id);
    setScreen("game");
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

      {screen === "choose" && (
        <div className="choose-screen">
          <div className="choose-card">
            <h1 className="choose-title">Выбор персонажа</h1>
            <div className="choose-list">
              <button onClick={() => handleChooseCharacter("char1")}>
                Персонаж 1
              </button>
              <button onClick={() => handleChooseCharacter("char2")}>
                Персонаж 2
              </button>
              <button onClick={() => handleChooseCharacter("char3")}>
                Персонаж 3
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "game" && selectedCharacter && (
        <div className="game-screen">
          <div className="game-score">Очки: 0</div>

          <div className="game-layout">
            <div className="game-character">
              {/* Тут потом поставишь картинку персонажа по selectedCharacter */}
              <div className="character-placeholder">{selectedCharacter}</div>
            </div>

            <div className="game-molecules">
              {/* 5 «слотов» под молекулы */}
              <div className="molecule-slot">M1</div>
              <div className="molecule-slot">M2</div>
              <div className="molecule-slot">M3</div>
              <div className="molecule-slot">M4</div>
              <div className="molecule-slot">M5</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
