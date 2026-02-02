declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export const useTelegramWebApp = () => {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
};
