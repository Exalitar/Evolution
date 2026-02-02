import { useState } from 'react';

export const useEvolution = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const evolve = () => {
    setScore(prevScore => {
      const newScore = prevScore + 1;

      if (newScore % 10 === 0) {
        setLevel(prevLevel => prevLevel + 1);
      }

      return newScore;
    });
  };

  return { score, level, evolve };
};
