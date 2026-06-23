import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { playHover, playClick } from "../utils/audio";

const titleText = " EXECUTIVE_COMMITTEE_NODES";
const OPTIMIZED_COMMITTEE_PREFIX =
  "/storage/v1/object/public/images/committee/optimized/";

const getOptimizedCommitteePhotoUrl = (photoUrl) => {
  if (!photoUrl || !photoUrl.includes("/storage/v1/object/public/images/committee/")) {
    return photoUrl;
  }

  const fileName = photoUrl.split("/").pop();
  if (!fileName) return photoUrl;

  const baseName = fileName.replace(/\.[^.]+$/, "");
  return `${photoUrl.split("/storage/v1/object/public/images/committee/")[0]}${OPTIMIZED_COMMITTEE_PREFIX}${baseName}-w232.webp`;
};

const Committee = ({ initialCommittee = [] }) => {
  const [committee, setCommittee] = useState(initialCommittee);
  const hasInitialData = initialCommittee.length > 0;

  useEffect(() => {
    if (hasInitialData) return;

    const fetchCommittee = async () => {
      try {
        const response = await fetch("/api/committee");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCommittee(data || []);
      } catch (error) {
        console.error("Error fetching committee data:", error);
        setCommittee([]);
      }
    };

    fetchCommittee();
  }, [hasInitialData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
  };

  return (
    <m.div
      className="hud-panel relative overflow-hidden rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
    >
      {/* HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-primary/45 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-primary/45 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-primary/45 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-primary/45 rounded-br-lg" />

      {/* Live system state */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-accent-primary/60 tracking-widest select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>NODES_SECURE</span>
      </div>

      <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] uppercase text-glow-cyan">
        {titleText}
      </h2>

      <div className="hud-line mb-8" />

      <div className="committee-members grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 md:gap-8">
        {committee.map((member) => (
          <m.div
            key={member.id}
            onMouseEnter={playHover}
            onClick={playClick}
            className="member-card group bg-black/40 border border-accent-primary/10 hover:border-accent-primary/50 rounded-xl p-6 text-center transition-all duration-300 relative overflow-hidden hover:shadow-[0_8px_24px_rgba(0,240,255,0.1)] select-none pointer-events-auto cursor-pointer"
            variants={itemVariants}
          >
            {/* Card inner bracket guides */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/10 group-hover:border-accent-primary/50 transition-colors" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/10 group-hover:border-accent-primary/50 transition-colors" />
            
            <div className="image-wrapper w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 group-hover:from-accent-primary/80 group-hover:to-accent-secondary/80 transition-all duration-300">
              <Image
                src={getOptimizedCommitteePhotoUrl(member.photo_url)}
                alt={member.name}
                className="member-image w-full h-full object-cover rounded-full border-2 border-slate-950"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
                quality={68}
                sizes="128px"
              />
            </div>
            <h3 className="text-white font-bold text-base tracking-wide mb-1 transition-colors group-hover:text-accent-primary">{member.name}</h3>
            <p className="text-text-secondary/70 font-mono text-xs uppercase tracking-[2px] m-0 group-hover:text-accent-secondary transition-colors">{member.position}</p>
          </m.div>
        ))}
      </div>
    </m.div>
  );
};

export default Committee;
