import '@/styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) {
      return;
    }

    let cancelled = false;
    let initialized = false;

    const initClarity = async () => {
      if (initialized || cancelled) {
        return;
      }

      initialized = true;

      try {
        const { default: Clarity } = await import('@microsoft/clarity');
        if (!cancelled) {
          Clarity.init(projectId);
        }
      } catch {}
    };

    const startClarity = () => {
      cleanupListeners();
      initClarity();
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', startClarity);
      window.removeEventListener('keydown', startClarity);
      window.removeEventListener('scroll', startClarity);
    };

    window.addEventListener('pointerdown', startClarity, { once: true });
    window.addEventListener('keydown', startClarity, { once: true });
    window.addEventListener('scroll', startClarity, { once: true, passive: true });

    return () => {
      cancelled = true;
      cleanupListeners();
    };
  }, []);

  return <Component {...pageProps} />;
}
