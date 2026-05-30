import React from "react";
import { m } from "framer-motion";

const CircuitBackground = () => {
  return (
    <div className="circuit-bg fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none overflow-hidden opacity-60">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <g
          stroke="var(--accent-primary)"
          strokeWidth="1"
          fill="none"
          opacity="0.15"
        >
          <m.path
            d="M 0,50 L 100,50 L 150,100 L 300,100 L 350,50 L 1000,50"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <m.path
            d="M 0,200 L 200,200 L 250,150 L 500,150 L 550,250 L 1000,250"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1,
            }}
            stroke="var(--accent-secondary)"
          />
          <m.circle cx="150" cy="100" r="4" fill="var(--accent-primary)" />
          <m.circle cx="300" cy="100" r="4" fill="var(--accent-primary)" />
          <m.circle cx="250" cy="150" r="4" fill="var(--accent-secondary)" />
          <m.circle cx="500" cy="150" r="4" fill="var(--accent-secondary)" />
        </g>
      </svg>
    </div>
  );
};

export default CircuitBackground;
