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
      className="glass-panel"
      id="maintenance"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
    >
      <h2>
        <Wrench className="inline-icon" />{portalTitle}
      </h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "var(--text-secondary)",
        }}
      >
        {portalDesc}
      </p>

      {submitted ? (
        <m.div
          className="success-message"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle size={48} color="var(--accent-primary)" />
          <h3>{successTitle}</h3>
          <p>{successDesc}</p>
        </m.div>
      ) : (
        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <input
              type="text"
              placeholder={placeholderName}
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder={placeholderDept}
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder={placeholderLoc}
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder={placeholderDesc}
              rows="4"
              required
              value={formData.issue}
              onChange={(e) =>
                setFormData({ ...formData, issue: e.target.value })
              }
            ></textarea>
          </div>
          <button type="submit" className="primary-btn">
            {submitBtnText}
          </button>
        </form>
      )}
    </m.div>
  );
};

export default MaintenancePortal;
