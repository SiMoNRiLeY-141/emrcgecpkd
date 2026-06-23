import React, { useEffect } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const railItems = ["Power", "Repair", "Research", "Events", "Members"];

const usePageProgress = () => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      progress.set(window.scrollY / scrollableHeight);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [progress]);

  return progress;
};

const ScrollScene3D = () => {
  const reduceMotion = useReducedMotion();
  const pageProgress = usePageProgress();
  const smoothProgress = useSpring(pageProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [12, -18]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-22, 28]);
  const translateY = useTransform(smoothProgress, [0, 1], ["0%", "-18%"]);
  const signalY = useTransform(smoothProgress, [0, 1], ["-10%", "92%"]);
  const progressScale = useTransform(smoothProgress, [0, 1], [0.02, 1]);

  return (
    <div
      className="scroll-scene-3d fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,240,255,0.08),transparent_32%,rgba(112,0,255,0.1)_72%,transparent)]" />
      <m.div
        className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] max-w-[760px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        style={
          reduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                y: translateY,
              }
        }
      >
        <div className="absolute inset-[14%] rounded-[18px] border border-accent-primary/20 bg-[linear-gradient(135deg,rgba(0,240,255,0.1),rgba(112,0,255,0.07))] shadow-[0_0_80px_rgba(0,240,255,0.08)] [transform:translateZ(-120px)]" />
        <div className="absolute inset-[5%] rounded-[22px] border border-white/10 [transform:translateZ(-40px)]" />
        <div className="absolute inset-x-[20%] top-[16%] h-[68%] rounded-[14px] border border-accent-secondary/30 [transform:rotateY(64deg)_translateZ(80px)]" />
        <div className="absolute inset-y-[18%] left-[18%] w-[64%] rounded-[14px] border border-accent-primary/25 [transform:rotateX(68deg)_translateZ(70px)]" />

        <m.div
          className="absolute left-1/2 top-0 h-[18%] w-[3px] -translate-x-1/2 rounded-full bg-accent-primary shadow-[0_0_24px_rgba(0,240,255,0.65)]"
          style={reduceMotion ? undefined : { y: signalY }}
        />

        {railItems.map((item, index) => (
          <div
            key={item}
            className="absolute flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2px] text-accent-primary/75"
            style={{
              left: `${12 + index * 16}%`,
              top: `${24 + (index % 2) * 34}%`,
              transform: `translateZ(${80 + index * 18}px) rotateY(${index % 2 ? -18 : 18}deg)`,
            }}
          >
            <span className="h-2 w-2 rounded-[2px] bg-accent-primary shadow-[0_0_18px_rgba(0,240,255,0.6)]" />
            {item}
          </div>
        ))}
      </m.div>

      <div className="absolute right-4 top-1/2 hidden h-[34vh] w-px -translate-y-1/2 bg-white/10 md:block">
        <m.div
          className="h-full w-px origin-top bg-gradient-to-b from-accent-primary to-accent-secondary shadow-[0_0_18px_rgba(0,240,255,0.45)]"
          style={{ scaleY: reduceMotion ? 1 : progressScale }}
        />
      </div>
    </div>
  );
};

export default ScrollScene3D;
