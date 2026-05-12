import React, { useState, useRef } from "react";
import { m } from "framer-motion";
import { UserPlus, Download, Cpu, UploadCloud } from "lucide-react";
import { toPng } from "html-to-image";
import supabase from "../pages/api/supabase";
import AvatarEditor from "react-avatar-editor";

const JoinClub = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    batch: "",
    email: "",
  });
  const [memberId, setMemberId] = useState(null);
  const cardRef = useRef(null);

  // Image editing states
  const editorRef = useRef(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [isEditingImg, setIsEditingImg] = useState(false);
  const [isExistingMember, setIsExistingMember] = useState(false);

  const handleSaveImage = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      setCroppedImage(canvasScaled.toDataURL());
      setIsEditingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Check if user exists by email
      const { data: existingUser } = await supabase
        .from("members")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (existingUser) {
        // User exists! Reuse their details.
        setFormData({
          name: existingUser.name,
          email: existingUser.email,
          department: existingUser.department,
          batch: existingUser.batch,
        });
        setMemberId(existingUser.member_id);
        setIsExistingMember(true);
        return;
      }

      // 2. Generate Unique ID if new
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const newId = `EMRC-${year}-${randomNum}`;
      setMemberId(newId);
      setIsExistingMember(false);

      const { error } = await supabase.from("members").insert([
        {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          batch: formData.batch,
          member_id: newId,
        },
      ]);
      if (error)
        console.log(
          "Note: Could not insert member. Please check Supabase table configuration.",
          error,
        );
    } catch (err) {
      console.log("Error checking or inserting to supabase:", err);
      // Fallback local ID generation if DB is completely unavailable
      if (!memberId) {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        setMemberId(`EMRC-${year}-${randomNum}`);
      }
    }
  };

  const downloadIdCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = `${formData.name.replace(/\s+/g, "_")}_EMRC_ID.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating ID card image:", error);
      }
    }
  };

  return (
    <m.div
      className="glass-panel"
      id="join"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2>
        <UserPlus className="inline-icon" /> Join the Club
      </h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "var(--text-secondary)",
        }}
      >
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="College Email ID"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="" disabled>
                Select Department
              </option>
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
              onChange={(e) =>
                setFormData({ ...formData, batch: e.target.value })
              }
            />
          </div>

          {isEditingImg && image ? (
            <div className="image-editor-container">
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={150}
                height={150}
                border={20}
                borderRadius={75}
                color={[0, 0, 0, 0.6]}
                scale={scale}
                rotate={0}
                className="avatar-editor"
              />
              <input
                type="range"
                value={scale}
                min="1"
                max="3"
                step="0.05"
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="zoom-slider"
              />
              <button
                type="button"
                onClick={handleSaveImage}
                className="primary-btn small-btn"
              >
                Crop & Save Photo
              </button>
            </div>
          ) : (
            <div className="form-group file-upload-group">
              <label htmlFor="photo-upload" className="file-upload-label">
                <UploadCloud className="inline-icon" />
                {croppedImage
                  ? "Change Profile Photo"
                  : "Upload Profile Photo (Optional)"}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                    setIsEditingImg(true);
                  }
                }}
                style={{ display: "none" }}
              />
              {croppedImage && !isEditingImg && (
                <div className="preview-avatar-mini">
                  <img src={croppedImage} alt="Preview" />
                </div>
              )}
            </div>
          )}

          <button type="submit" className="primary-btn" disabled={isEditingImg}>
            Generate Member ID
          </button>
        </form>
      ) : (
        <div className="id-card-container">
          {isExistingMember && (
            <p
              className="welcome-back-msg"
              style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
            >
              Welcome back! Here is your existing ID card.
            </p>
          )}
          <m.div
            initial={{ scale: 0.8, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="id-card" ref={cardRef}>
              <div className="id-header">
                <Cpu
                  className="id-logo"
                  style={{ color: "var(--accent-primary)" }}
                />
                <div>
                  <h4>EMRC GEC Palakkad</h4>
                  <p>Official Member</p>
                </div>
              </div>
              <div className="id-body">
                <div className="id-avatar">
                  {croppedImage ? (
                    <img
                      src={croppedImage}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    formData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="id-details">
                  <p className="id-name">{formData.name}</p>
                  <p className="id-number">{memberId}</p>
                  <div className="id-info-grid">
                    <span className="id-label">Dept:</span>
                    <span>{formData.department}</span>
                    <span className="id-label">Batch:</span>
                    <span>{formData.batch}</span>
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
