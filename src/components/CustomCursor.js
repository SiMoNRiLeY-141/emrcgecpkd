import React, { useEffect, useState, useRef } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for actual cursor coordinate
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for outer ring lag effect
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const outerX = useSpring(mouseX, springConfig);
  const outerY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch device / pointer availability
    const checkPointer = () => {
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsMobile(!hasFinePointer);
    };

    checkPointer();
    window.addEventListener("resize", checkPointer);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    // Detect hovers on interactive elements globally
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.closest(".member-card") ||
        target.closest(".news-item") ||
        target.closest("[role='button']");

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("resize", checkPointer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none mix-blend-screen">
      {/* Outer Spring Ring */}
      <m.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-primary pointer-events-none flex items-center justify-center"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          boxShadow: isHovered
            ? "0 0 12px var(--accent-secondary)"
            : "0 0 6px var(--accent-primary)",
          rotate: isHovered ? 180 : 0,
          scale: isClicked ? 0.75 : 1,
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 20 },
          height: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { duration: 0.6, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 10 },
        }}
      >
        {/* Dynamic HUD Reticle ticks */}
        <m.span
          className="absolute w-1.5 h-[1.5px] bg-accent-primary left-[-1.5px]"
          animate={{
            backgroundColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          }}
        />
        <m.span
          className="absolute w-1.5 h-[1.5px] bg-accent-primary right-[-1.5px]"
          animate={{
            backgroundColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          }}
        />
        <m.span
          className="absolute w-[1.5px] h-1.5 bg-accent-primary top-[-1.5px]"
          animate={{
            backgroundColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          }}
        />
        <m.span
          className="absolute w-[1.5px] h-1.5 bg-accent-primary bottom-[-1.5px]"
          animate={{
            backgroundColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          }}
        />
      </m.div>

      {/* Inner Dot */}
      <m.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-primary rounded-full pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? "var(--accent-secondary)" : "var(--accent-primary)",
          boxShadow: isHovered
            ? "0 0 8px var(--accent-secondary)"
            : "0 0 4px var(--accent-primary)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
      />
    </div>
  );
};

export default CustomCursor;
