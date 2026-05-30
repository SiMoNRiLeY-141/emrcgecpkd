import React, { useState, useRef } from "react";
import { m } from "framer-motion";
import { UserPlus, Download, Cpu, UploadCloud } from "lucide-react";
import { toPng } from "html-to-image";
import supabase from "../pages/api/supabase";
import AvatarEditor from "react-avatar-editor";

const joinTitle = " Join the Club";
const joinDesc = "Become a part of the EMRC family. Sign up to get your unique Member ID!";
const placeholderName = "Full Name";
const placeholderEmail = "College Email ID";
const selectDeptText = "Select Department";
const deptCE = "Civil Engineering";
const deptCSE = "Computer Science & Engineering";
const deptECE = "Electronics & Communication";
const deptEEE = "Electrical & Electronics";
const deptIT = "Information Technology";
const deptME = "Mechanical Engineering";
const placeholderBatch = "Batch (e.g. 2023-2027)";
const cropSaveText = "Crop & Save Photo";
const photoChangeText = "Change Profile Photo";
const photoUploadText = "Upload Profile Photo (Optional)";
const generateBtnText = "Generate Member ID";
const welcomeBackText = "Welcome back! Here is your existing ID card.";
const cardTitle = "EMRC GEC Palakkad";
const cardSubtitle = "Official Member";
const labelDept = "Dept:";
const labelBatch = "Batch:";
const cardFooterText = "Electrical Maintenance and Research Club";
const downloadBtnText = " Download ID Card";

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
      className="glass-panel bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      id="join"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        <UserPlus className="inline-icon inline-block mr-2 text-accent-primary align-middle" />{joinTitle}
      </h2>
      <p className="text-center mb-[30px] text-text-secondary">
        {joinDesc}
      </p>

      {!memberId ? (
        <form onSubmit={handleSubmit} className="custom-form max-w-[600px] mx-auto flex flex-col gap-5">
          <div className="form-group w-full">
            <input
              type="text"
              placeholder={placeholderName}
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
          </div>
          <div className="form-group w-full">
            <input
              type="email"
              placeholder={placeholderEmail}
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
          </div>
          <div className="form-group w-full">
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <option value="" disabled>
                {selectDeptText}
              </option>
              <option value="CE">{deptCE}</option>
              <option value="CSE">{deptCSE}</option>
              <option value="ECE">{deptECE}</option>
              <option value="EEE">{deptEEE}</option>
              <option value="IT">{deptIT}</option>
              <option value="ME">{deptME}</option>
            </select>
          </div>
          <div className="form-group w-full">
            <input
              type="text"
              placeholder={placeholderBatch}
              required
              value={formData.batch}
              onChange={(e) =>
                setFormData({ ...formData, batch: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
          </div>

          {isEditingImg && image ? (
            <div className="image-editor-container flex flex-col items-center gap-[15px] bg-[rgba(0,0,0,0.2)] p-5 rounded-xl border border-dashed border-glass-border">
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
                className="avatar-editor rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
              />
              <input
                type="range"
                value={scale}
                min="1"
                max="3"
                step="0.05"
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="zoom-slider w-full max-w-[200px] accent-accent-primary"
              />
              <button
                type="button"
                onClick={handleSaveImage}
                className="primary-btn small-btn p-[10px_20px] text-[0.9rem] rounded-[50px] border-none bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-bold cursor-pointer transition-all duration-300 font-inherit uppercase tracking-[1px] flex items-center justify-center gap-2.5 hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(112,0,255,0.4)]"
              >
                {cropSaveText}
              </button>
            </div>
          ) : (
            <div className="form-group file-upload-group w-full">
              <label htmlFor="photo-upload" className="file-upload-label flex items-center justify-center gap-2.5 p-[15px_20px] rounded-xl border border-dashed border-accent-primary bg-[rgba(0,240,255,0.05)] text-text-primary cursor-pointer transition-all duration-300 font-semibold text-center hover:bg-[rgba(0,240,255,0.15)] hover:-translate-y-0.5">
                <UploadCloud className="inline-icon text-accent-primary align-middle mr-2" />
                {croppedImage ? photoChangeText : photoUploadText}
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
                <div className="preview-avatar-mini w-[50px] h-[50px] rounded-full overflow-hidden mx-auto mt-4 border-2 border-accent-primary">
                  <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="primary-btn p-[15px_30px] rounded-[50px] border-none bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-bold text-[1.1rem] cursor-pointer transition-all duration-300 font-inherit uppercase tracking-[1px] flex items-center justify-center gap-2.5 hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(112,0,255,0.4)]"
            disabled={isEditingImg}
          >
            {generateBtnText}
          </button>
        </form>
      ) : (
        <div className="id-card-container flex flex-col items-center gap-[30px]">
          {isExistingMember && (
            <p className="welcome-back-msg text-center bg-[rgba(0,240,255,0.1)] p-[10px_20px] rounded-[50px] border border-accent-primary mb-0 font-bold text-accent-primary">
              {welcomeBackText}
            </p>
          )}
          <m.div
            initial={{ scale: 0.8, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="id-card w-[350px] bg-gradient-to-br from-[#1a1f2e] to-[#111520] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/10 relative text-white before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[5px] before:bg-gradient-to-r before:from-accent-primary before:to-accent-secondary" ref={cardRef}>
              <div className="id-header p-5 flex items-center gap-[15px] border-b border-white/5">
                <Cpu
                  className="id-logo text-accent-primary w-10 h-10 rounded-lg"
                />
                <div>
                  <h4 className="m-0 text-[1.1rem] text-white font-bold">{cardTitle}</h4>
                  <p className="m-0 text-[0.8rem] text-accent-primary uppercase tracking-[1px]">{cardSubtitle}</p>
                </div>
              </div>
              <div className="id-body p-[30px_20px] flex flex-col items-center text-center bg-[radial-gradient(circle_at_50%_0%,rgba(112,0,255,0.15),transparent_70%)]">
                <div className="id-avatar w-[90px] h-[90px] rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-[2.5rem] font-bold text-[#111520] mb-[15px] border-4 border-[#1a1f2e] shadow-[0_5px_15px_rgba(0,0,0,0.3)] overflow-hidden">
                  {croppedImage ? (
                    <img
                      src={croppedImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    formData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="id-details">
                  <p className="id-name text-[1.4rem] font-bold m-[0_0_5px_0] text-white">{formData.name}</p>
                  <p className="id-number font-mono text-[1.1rem] text-[#a0aec0] bg-[rgba(0,0,0,0.3)] p-[4px_12px] rounded-[20px] m-[0_0_20px_0] inline-block">{memberId}</p>
                  <div className="id-info-grid grid grid-cols-[auto_1fr] gap-[8px_15px] text-left w-full text-[0.9rem]">
                    <span className="id-label text-[#a0aec0] font-semibold">{labelDept}</span>
                    <span>{formData.department}</span>
                    <span className="id-label text-[#a0aec0] font-semibold">{labelBatch}</span>
                    <span>{formData.batch}</span>
                  </div>
                </div>
              </div>
              <div className="id-card-footer p-[15px] bg-[rgba(0,0,0,0.3)] text-center text-[0.8rem] text-[#718096] border-t border-white/5">
                <p className="m-0">{cardFooterText}</p>
              </div>
            </div>
          </m.div>

          <button onClick={downloadIdCard} className="primary-btn download-btn p-[15px_30px] rounded-[50px] border-none bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-bold text-[1.1rem] cursor-pointer transition-all duration-300 font-inherit uppercase tracking-[1px] flex items-center justify-center gap-2.5 hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(112,0,255,0.4)] max-w-[250px] w-full">
            <m.span className="inline-flex items-center gap-2">
              <Download size={20} />{downloadBtnText}
            </m.span>
          </button>
        </div>
      )}
    </m.div>
  );
};

export default JoinClub;
