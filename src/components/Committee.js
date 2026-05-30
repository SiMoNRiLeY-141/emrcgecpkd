import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";

const titleText = "Executive Committee";

const Committee = ({ initialCommittee = [] }) => {
  const [committee, setCommittee] = useState(initialCommittee);
  const hasInitialData = initialCommittee.length > 0;

  useEffect(() => {
    if (hasInitialData) {
      return;
    }

    const fetchCommittee = async () => {
      try {
        const response = await fetch("/api/committee");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCommittee(data);
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <m.div
      className="glass-panel bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        {titleText}
      </h2>
      <div className="committee-members grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 md:gap-[30px]">
        {committee.map((member) => (
          <m.div
            key={member.id}
            className="member-card group bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] border border-glass-border rounded-[20px] p-[20px_15px] md:p-[30px_20px] text-center transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative overflow-hidden hover:-translate-y-2 hover:border-accent-primary hover:shadow-[0_15px_30px_-10px_rgba(0,240,255,0.2)] before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:transition-[left] before:duration-600 before:ease-in-out hover:before:left-full"
            variants={itemVariants}
          >
            <div className="image-wrapper w-[130px] h-[130px] md:w-40 md:h-40 mx-auto mb-5 rounded-full p-1 bg-gradient-to-br from-accent-primary to-accent-secondary transition-transform duration-400 ease-out group-hover:scale-105 group-hover:rotate-[5deg]">
              <Image
                src={member.photo_url}
                alt={member.name}
                className="member-image w-full h-full object-cover rounded-full border-4 border-bg-color"
                width={256}
                height={256}
                loading="lazy"
                fetchPriority="low"
                quality={68}
                sizes="(max-width: 768px) 30vw, 185px"
              />
            </div>
            <h3 className="text-text-primary font-kalam text-[1.4rem] md:text-[1.6rem] mb-1.5">{member.name}</h3>
            <p className="text-accent-primary text-[0.95rem] uppercase tracking-[1.5px] m-0 font-semibold">{member.position}</p>
          </m.div>
        ))}
      </div>
    </m.div>
  );
};

export default Committee;
