import React, { useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { UserPlus, Download, Cpu, UploadCloud, ChevronDown, ChevronUp } from "lucide-react";
import { toPng } from "html-to-image";
import supabase from "../pages/api/supabase";
import AvatarEditor from "react-avatar-editor";
import { playClick, playHover } from "../utils/audio";

const joinTitle = " JOIN THE CLUB";
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
  const [isExpanded, setIsExpanded] = useState(false);
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
    playClick();

    try {
      // 1. Check if user exists by email
      const { data: existingUser } = await supabase
        .from("members")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (existingUser) {
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

  const handleToggleExpand = () => {
    playClick();
    setIsExpanded(!isExpanded);
  };

  return (
    <m.div
      className="hud-panel rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px]"
      id="join"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.0, type: "spring", bounce: 0.2 }}
    >
      <h2 className="text-[clamp(1.4rem,3vw,1.8rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] flex items-center justify-center gap-2 text-glow-cyan">
        <UserPlus className="inline-block text-accent-primary align-middle animate-pulse" />
        {joinTitle}
      </h2>
      
      <div className="hud-line mb-6" />

      {/* Accompanying descriptive context box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
        <div className="md:col-span-8 font-mono text-xs text-text-secondary leading-relaxed uppercase tracking-[1px]">
          <p className="mb-2">EMRC membership grants authenticated access to research laboratories, hardware workshops, component inventories, and high-voltage testing equipment nodes.</p>
          <p className="text-accent-primary/80">Generate your unique digital identity card to initialize enrollment.</p>
        </div>
        <div className="md:col-span-4 flex justify-center">
          {!memberId && (
            <button
              onClick={handleToggleExpand}
              onMouseEnter={playHover}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-bold font-mono text-[11px] tracking-[2px] transition-all duration-300 hover:bg-accent-primary/20 hover:border-accent-primary/60 select-none pointer-events-auto"
            >
              {isExpanded ? (
                <>COLLAPSE ENROLLMENT <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>INITIALIZE ENROLLMENT <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(isExpanded || memberId) && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-accent-primary/10">
              {!memberId ? (
                <form onSubmit={handleSubmit} className="custom-form max-w-[560px] mx-auto flex flex-col gap-4 font-mono text-sm pointer-events-auto">
                  <div className="form-group w-full">
                    <input
                      type="text"
                      placeholder={placeholderName}
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="form-group w-full">
                    <input
                      type="email"
                      placeholder={placeholderEmail}
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="form-group w-full">
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                    >
                      <option value="" disabled className="bg-slate-900">{selectDeptText}</option>
                      <option value="CE" className="bg-slate-900">{deptCE}</option>
                      <option value="CSE" className="bg-slate-900">{deptCSE}</option>
                      <option value="ECE" className="bg-slate-900">{deptECE}</option>
                      <option value="EEE" className="bg-slate-900">{deptEEE}</option>
                      <option value="IT" className="bg-slate-900">{deptIT}</option>
                      <option value="ME" className="bg-slate-900">{deptME}</option>
                    </select>
                  </div>
                  <div className="form-group w-full">
                    <input
                      type="text"
                      placeholder={placeholderBatch}
                      required
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>

                  {isEditingImg && image ? (
                    <div className="image-editor-container flex flex-col items-center gap-[15px] bg-black/40 p-5 rounded-xl border border-dashed border-accent-primary/20">
                      <AvatarEditor
                        ref={editorRef}
                        image={image}
                        width={150}
                        height={150}
                        border={20}
                        borderRadius={75}
                        color={[0, 0, 0, 0.7]}
                        scale={scale}
                        rotate={0}
                        className="avatar-editor rounded-xl border border-white/5"
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
                        className="p-2.5 rounded-full bg-accent-primary text-[#111520] font-bold text-xs tracking-[1px] cursor-pointer hover:bg-accent-primary/80 transition-all duration-300"
                      >
                        {cropSaveText}
                      </button>
                    </div>
                  ) : (
                    <div className="form-group file-upload-group w-full">
                      <label htmlFor="photo-upload" className="file-upload-label flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-accent-primary bg-accent-primary/5 text-text-primary cursor-pointer transition-all duration-300 font-semibold text-center hover:bg-accent-primary/10 hover:border-accent-primary/40 text-xs">
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
                        <div className="preview-avatar-mini w-[50px] h-[50px] rounded-full overflow-hidden mx-auto mt-4 border border-accent-primary shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                          <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="p-3.5 rounded-[50px] bg-gradient-to-r from-accent-primary/80 to-accent-secondary/80 text-white font-bold text-xs tracking-[2px] cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:from-accent-primary hover:to-accent-secondary hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]"
                    disabled={isEditingImg}
                  >
                    {generateBtnText}
                  </button>
                </form>
              ) : (
                <div className="id-card-container flex flex-col items-center gap-[30px] pt-4">
                  {isExistingMember && (
                    <p className="welcome-back-msg text-center bg-[rgba(0,240,255,0.06)] p-[8px_16px] rounded-[50px] border border-accent-primary/40 font-bold text-accent-primary text-xs font-mono tracking-wider">
                      {welcomeBackText}
                    </p>
                  )}
                  <m.div
                    initial={{ scale: 0.9, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <div className="id-card w-[320px] bg-gradient-to-br from-[#101524] to-[#070b13] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-accent-primary/10 relative text-white before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-accent-primary before:to-accent-secondary" ref={cardRef}>
                      <div className="id-header p-4 flex items-center gap-[12px] border-b border-white/5">
                        <Cpu className="id-logo text-accent-primary w-8 h-8" />
                        <div>
                          <h4 className="m-0 text-xs text-white font-bold tracking-wide">{cardTitle}</h4>
                          <p className="m-0 text-[9px] text-accent-primary uppercase tracking-[1px] font-mono">{cardSubtitle}</p>
                        </div>
                      </div>
                      <div className="id-body p-6 flex flex-col items-center text-center bg-[radial-gradient(circle_at_50%_0%,rgba(112,0,255,0.08),transparent_70%)]">
                        <div className="id-avatar w-[80px] h-[80px] rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-2xl font-bold text-[#111520] mb-4 border-2 border-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.3)] overflow-hidden">
                          {croppedImage ? (
                            <img src={croppedImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            formData.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="id-details w-full">
                          <p className="id-name text-lg font-bold m-[0_0_4px_0] text-white tracking-wide">{formData.name}</p>
                          <p className="id-number font-mono text-xs text-[#a0aec0] bg-black/45 p-[3px_10px] rounded-[20px] m-[0_0_16px_0] inline-block tracking-wider border border-white/5">{memberId}</p>
                          <div className="id-info-grid grid grid-cols-[auto_1fr] gap-[6px_12px] text-left w-full text-xs font-mono">
                            <span className="id-label text-[#a0aec0] font-semibold">{labelDept}</span>
                            <span className="text-white/80">{formData.department}</span>
                            <span className="id-label text-[#a0aec0] font-semibold">{labelBatch}</span>
                            <span className="text-white/80">{formData.batch}</span>
                          </div>
                        </div>
                      </div>
                      <div className="id-card-footer p-3.5 bg-black/40 text-center text-[10px] text-[#718096] border-t border-white/5 font-mono">
                        <p className="m-0 uppercase tracking-wider">{cardFooterText}</p>
                      </div>
                    </div>
                  </m.div>

                  <button onClick={downloadIdCard} className="p-3.5 rounded-[50px] bg-gradient-to-r from-accent-primary/80 to-accent-secondary/80 text-white font-bold text-xs tracking-[2px] cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(0,240,255,0.25)] max-w-[220px] w-full pointer-events-auto">
                    <m.span className="inline-flex items-center gap-2">
                      <Download size={16} />{downloadBtnText}
                    </m.span>
                  </button>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
};

export default JoinClub;
