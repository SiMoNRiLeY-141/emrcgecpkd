import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

    return (
    <div className="committee-container">
      <h2>Executive Committee</h2>
      <div className="committee-members">
          {committee.map((member, index) => (
              <div key={member.id} className="member-card">
            <div className="image-wrapper">
              <Image
                src={member.photo_url}
                alt={member.name}
                className="member-image"
                width={512}
                height={512}
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 60vw, 232px"
              />
            </div>
            <h3>{member.name}</h3>
            <p>{member.position}</p>
              </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;

