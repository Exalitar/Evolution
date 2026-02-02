import { useEffect } from 'react';
import { GameScreen } from './app/screens/GameScreen/GameScreen';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

export const App = () => {
  const tg = useTelegramWebApp();

  useEffect(() => {
    if (!tg) return;
    console.log('Telegram WebApp initData:', tg.initDataUnsafe);
    tg.ready();
  }, [tg]);

  return <GameScreen />;
};
