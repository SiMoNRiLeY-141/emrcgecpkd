import React, { useEffect, useState, useRef } from "react";

const StatsMonitor = () => {
  const [fps, setFps] = useState(60);
  const [visible, setVisible] = useState(false);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    setVisible(true);

    let animationFrameId;

    const loop = () => {
      framesRef.current++;
      const time = performance.now();
      
      if (time >= lastTimeRef.current + 1000) {
        setFps(Math.round((framesRef.current * 1000) / (time - lastTimeRef.current)));
        framesRef.current = 0;
        lastTimeRef.current = time;
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[99] pointer-events-none font-mono text-[10px] bg-black/85 border border-accent-primary/30 text-accent-primary px-2.5 py-1.5 rounded shadow-[0_0_12px_rgba(0,240,255,0.25)] flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>SYS_STAT: <span className="font-bold text-[11px]">{fps} FPS</span></span>
    </div>
  );
};

export default StatsMonitor;
