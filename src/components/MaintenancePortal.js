import React, { useState } from "react";
import { m } from "framer-motion";
import { Wrench, CheckCircle } from "lucide-react";
import supabase from "../pages/api/supabase";

const portalTitle = " Maintenance Request";
const portalDesc = "Report electrical issues around the campus. Our club members will review and assist in repairs.";
const successTitle = "Request Submitted successfully!";
const successDesc = "We'll look into the issue as soon as possible.";
const submitBtnText = "Submit Request";
const placeholderName = "Your Name / Designation";
const placeholderDept = "Department";
const placeholderLoc = "Location of Issue (e.g. Lab 3, Block A)";
const placeholderDesc = "Describe the electrical issue...";

const MaintenancePortal = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    location: "",
    issue: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("maintenance_requests").insert([
        {
          name: formData.name,
          department: formData.department,
          location: formData.location,
          issue: formData.issue,
        },
      ]);
      if (error) console.error("Error inserting request:", error);
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", department: "", location: "", issue: "" });
    }, 5000);
  };

  return (
    <m.div
      className="glass-panel bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      id="maintenance"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        <Wrench className="inline-icon inline-block mr-2 text-accent-primary align-middle" />{portalTitle}
      </h2>
      <p className="text-center mb-[30px] text-text-secondary">
        {portalDesc}
      </p>

      {submitted ? (
        <m.div
          className="success-message text-center p-10 bg-[rgba(0,240,255,0.1)] rounded-2xl border border-accent-primary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle size={48} className="mx-auto text-accent-primary" />
          <h3 className="mt-[15px] text-text-primary font-bold text-xl">{successTitle}</h3>
          <p className="mt-2 text-text-secondary">{successDesc}</p>
        </m.div>
      ) : (
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
              type="text"
              placeholder={placeholderDept}
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
          </div>
          <div className="form-group w-full">
            <input
              type="text"
              placeholder={placeholderLoc}
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            />
          </div>
          <div className="form-group w-full">
            <textarea
              placeholder={placeholderDesc}
              rows="4"
              required
              value={formData.issue}
              onChange={(e) =>
                setFormData({ ...formData, issue: e.target.value })
              }
              className="w-full p-[15px_20px] rounded-xl border border-glass-border bg-[rgba(0,0,0,0.2)] [[data-theme=light]_&]:bg-[rgba(255,255,255,0.5)] text-text-primary text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="primary-btn p-[15px_30px] rounded-[50px] border-none bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-bold text-[1.1rem] cursor-pointer transition-all duration-300 font-inherit uppercase tracking-[1px] flex items-center justify-center gap-2.5 hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(112,0,255,0.4)]"
          >
            {submitBtnText}
          </button>
        </form>
      )}
    </m.div>
  );
};

export default MaintenancePortal;
