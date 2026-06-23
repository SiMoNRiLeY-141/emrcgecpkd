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
    stiffness: 120,
    damping: 26,
    mass: 0.35,
  });

  const rotateX = useTransform(smoothProgress, [0, 0.45, 1], [10, 0, -8]);
  const rotateY = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [depth % 2 === 0 ? -9 : 9, 0, depth % 2 === 0 ? 7 : -7],
  );
  const z = useTransform(smoothProgress, [0, 0.5, 1], [-90, 70, -70]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.88, 1],
    [0.62, 1, 1, 0.72],
  );
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1, 0.96]);

  return (
    <m.section
      ref={ref}
      className={`scroll-section-3d relative z-10 [transform-style:preserve-3d] ${className}`}
      style={
        reduceMotion
          ? { position: "relative" }
          : {
              position: "relative",
              rotateX,
              rotateY,
              z,
              opacity,
              scale,
            }
      }
    >
      {children}
    </m.section>
  );
};

export default ScrollSection;
