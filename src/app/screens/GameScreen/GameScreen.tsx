import { useEvolution } from '../../../features/evolution/hooks/useEvolution';

export const GameScreen = () => {
  const { score, level, evolve } = useEvolution();

  return (
    <div
      style={{
        padding: 16,
        fontFamily: 'sans-serif',
        textAlign: 'center',
      }}
    >
      <h1>Evolution Game</h1>
      <p>Уровень: {level}</p>
      <p>Очки: {score}</p>

      <button
        onClick={evolve}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          cursor: 'pointer',
          marginTop: 12,
        }}
      >
        Эволюционировать
      </button>
    </div>
  );
};
