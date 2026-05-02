import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for a premium intro feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="loading-screen"
          >
            <div className="loader-circuit"></div>
            <div className="loading-text">INITIALIZING</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Component {...pageProps} />
        </motion.div>
      )}
    </>
  );
}
