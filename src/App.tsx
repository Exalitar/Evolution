import "./App.css";

function App() {
  const handleStart = () => {
    // здесь потом покажешь основной экран игры
    console.log("Игра запущена");
  };

  return (
    <div className="start-screen">
      {/* Если нужен только фон на весь экран, можно оставить только кнопку */}
      <button className="start-button" onClick={handleStart}>
        Играть
      </button>
    </div>
  );
}

export default App;
