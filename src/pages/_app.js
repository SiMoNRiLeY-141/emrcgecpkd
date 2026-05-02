import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Shortened initial loading time to improve performance metrics
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {loading && (
          <m.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="loading-screen"
            style={{ zIndex: 9999 }}
          >
            <div className="loader-circuit"></div>
            <div className="loading-text">INITIALIZING</div>
          </m.div>
        )}
      </AnimatePresence>
      
      <Component {...pageProps} />
    </LazyMotion>
  );
}
