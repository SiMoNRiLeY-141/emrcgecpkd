import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Committee = ({ initialCommittee = [] }) => {
  const [committee, setCommittee] = useState(initialCommittee);
  const hasInitialData = initialCommittee.length > 0;

  useEffect(() => {
    if (hasInitialData) {
      return;
    }

      const fetchCommittee = async () => {
          try {
              const response = await fetch('/api/committee');
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setCommittee(data);
          } catch (error) {
              console.error('Error fetching committee data:', error);
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

    return (
    <motion.div 
      className="glass-panel"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <h2>Executive Committee</h2>
      <div className="committee-members">
          {committee.map((member) => (
              <motion.div key={member.id} className="member-card" variants={itemVariants}>
            <div className="image-wrapper">
              <Image
                src={member.photo_url}
                alt={member.name}
                className="member-image"
                width={256}
                height={256}
                loading="lazy"
                fetchPriority="low"
                quality={68}
                sizes="(max-width: 768px) 30vw, 185px"
              />
            </div>
            <h3>{member.name}</h3>
            <p>{member.position}</p>
              </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Committee;
