import '@/styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) {
      return;
    }

    let cancelled = false;

    import('@microsoft/clarity')
      .then(({ default: Clarity }) => {
        if (!cancelled) {
          Clarity.init(projectId);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return <Component {...pageProps} />;
}
