import React, { useRef } from "react";
import {
  m,
  useReducedMotion,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

const ScrollSection = ({ children, depth = 0, className = "" }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  // High-performance native scroll observer (eliminates layout-thrashing getBoundingClientRect scroll listeners)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
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
      <div className="w-full relative pointer-events-auto">{children}</div>
    </m.section>
  );
};

export default ScrollSection;
