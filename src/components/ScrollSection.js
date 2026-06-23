import React, { useEffect, useRef } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const useElementProgress = (ref) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travelDistance = viewportHeight + rect.height;
      const currentProgress = (viewportHeight - rect.top) / travelDistance;

      progress.set(clamp(currentProgress, 0, 1));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [progress, ref]);

  return progress;
};

const ScrollSection = ({ children, depth = 0, className = "" }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const sectionProgress = useElementProgress(ref);
  const smoothProgress = useSpring(sectionProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  // Immersive 3D appearance (scale & tilt, instead of simple translation)
  const opacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0],
  );

  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.78, 1, 0.82]);

  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [22, 0, -22]);

  return (
    <m.section
      ref={ref}
      className={`relative z-10 w-full min-h-[75vh] flex flex-col justify-center my-20 md:my-36 pointer-events-none [transform-style:preserve-3d] ${className}`}
      style={
        reduceMotion
          ? { opacity: 1 }
          : {
              opacity,
              scale,
              rotateX,
            }
      }
    >
      <div className="w-full pointer-events-auto">{children}</div>
    </m.section>
  );
};

export default ScrollSection;
