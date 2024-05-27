import React, { useState, useEffect } from 'react';
import supabase from '../pages/api/supabase';
import Image from 'next/image';

const Committee = () => {
  const [committee, setCommittee] = useState([]);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const { data, error } = await supabase.from('committee').select('*');
        if (error) {
          throw error;
        }
        console.log('Fetched committee data:', data);
        setCommittee(data);
      } catch (error) {
        console.error('Error fetching committee data:', error.message);
      }
    };
  
    fetchCommittee();
  }, []);

  return (
    <div className="committee-container">
      <h2>Executive Committee</h2>
      <div className="committee-members">
        {committee.map((member, index) => (
          <div key={index} className="member-card">
            <div className="image-wrapper">
              <Image src={member.photo_url} alt={member.name} width={512} height={512} />
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
