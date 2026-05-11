import React, { useState, useRef } from "react";
import { m } from "framer-motion";
import { UserPlus, Download, Cpu } from "lucide-react";
import { toPng } from "html-to-image";
import supabase from "../pages/api/supabase";

const JoinClub = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    batch: "",
    email: ""
  });
  const [memberId, setMemberId] = useState(null);
  const cardRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Generate Unique ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newId = `EMRC-${year}-${randomNum}`;
    setMemberId(newId);
    
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        const { error } = await supabase
          .from('members')
          .insert([{ 
            name: formData.name, 
            email: formData.email, 
            department: formData.department, 
            batch: formData.batch, 
            member_id: newId 
          }]);
        if (error) console.log("Note: Could not insert member. Please check Supabase table configuration.");
      }
    } catch (err) {
      console.log("Database connection not fully configured yet. ID generated locally.");
    }
  };

  const downloadIdCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${formData.name.replace(/\s+/g, '_')}_EMRC_ID.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating ID card image:", error);
      }
    }
  };

  return (
    <m.div 
      className="glass-panel" id="join"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2><UserPlus className="inline-icon" /> Join the Club</h2>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}>
        Become a part of the EMRC family. Sign up to get your unique Member ID!
      </p>

      {!memberId ? (
        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="College Email ID" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <select 
              required
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="" disabled>Select Department</option>
              <option value="CE">Civil Engineering</option>
              <option value="CSE">Computer Science & Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="IT">Information Technology</option>
              <option value="ME">Mechanical Engineering</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Batch (e.g. 2023-2027)" 
              required 
              value={formData.batch}
              onChange={(e) => setFormData({...formData, batch: e.target.value})}
            />
          </div>
          <button type="submit" className="primary-btn">
            Generate Member ID
          </button>
        </form>
      ) : (
        <div className="id-card-container">
          <m.div 
            initial={{ scale: 0.8, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="id-card" ref={cardRef}>
              <div className="id-header">
                <Cpu className="id-logo" style={{ color: "var(--accent-primary)" }} />
                <div>
                  <h4>EMRC GEC Palakkad</h4>
                  <p>Official Member</p>
                </div>
              </div>
              <div className="id-body">
                <div className="id-avatar">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <div className="id-details">
                  <p className="id-name">{formData.name}</p>
                  <p className="id-number">{memberId}</p>
                  <div className="id-info-grid">
                    <span className="id-label">Dept:</span><span>{formData.department}</span>
                    <span className="id-label">Batch:</span><span>{formData.batch}</span>
                  </div>
                </div>
              </div>
              <div className="id-footer">
                <p>Electrical Maintenance and Research Club</p>
              </div>
            </div>
          </m.div>

          <button onClick={downloadIdCard} className="primary-btn download-btn">
            <Download size={20} /> Download ID Card
          </button>
        </div>
      )}
    </m.div>
  );
};

export default JoinClub;
