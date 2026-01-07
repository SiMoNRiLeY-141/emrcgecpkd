import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Committee = () => {
  const [committee, setCommittee] = useState([]);

  useEffect(() => {
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
  }, []);

    return (
    <div className="committee-container">
      <h2>Executive Committee</h2>
      <div className="committee-members">
          {committee.map((member) => (
              <div key={member.id} className="member-card">
            <div className="image-wrapper">
              <Image
                src={member.photo_url}
                alt={member.name}
                className="member-image"
                width={512}
                height={512}
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

