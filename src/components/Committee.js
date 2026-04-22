import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Committee = () => {
  const [committee, setCommittee] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
              } finally {
                setIsLoading(false);
          }
      };

    fetchCommittee();
  }, []);

    return (
    <div className="committee-container">
      <h2>Executive Committee</h2>
      <div className="committee-members">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`committee-skeleton-${index}`}
                  className="member-card member-card-skeleton"
                  aria-hidden="true"
                >
                  <div className="image-wrapper skeleton-circle" />
                  <div className="skeleton-line skeleton-line-name" />
                  <div className="skeleton-line skeleton-line-role" />
                </div>
              ))
            : committee.map((member) => (
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

