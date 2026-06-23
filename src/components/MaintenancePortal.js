import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Wrench,
  CheckCircle,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import supabase from "../pages/api/supabase";
import { playClick, playHover, playSuccess } from "../utils/audio";

const portalTitle = " CAMPUS MAINTENANCE TERMINAL";
const portalDesc =
  "Report campus electrical issues directly to EMRC technicians.";
const successTitle = "TRANSMISSION SUCCESSFUL";
const successDesc =
  "Directive logged. Dispatching technicians to localized coordinates.";
const submitBtnText = "EXECUTE DIRECTIVE";
const placeholderName = "OPERATOR_NAME / DESIGNATION";
const placeholderDept = "DEPARTMENT_ID";
const placeholderLoc = "LOCATION_COORDINATES (e.g. Lab 3, Block A)";
const placeholderDesc = "DESCRIBE_FAULT_ANOMALY...";

const MaintenancePortal = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    location: "",
    issue: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [terminalLog, setTerminalLog] = useState([]);

  const addToLog = (msg) => {
    setTerminalLog((prev) =>
      [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-4),
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    playHover();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    addToLog("INITIALIZING SECURITY HANDSHAKE...");
    addToLog("UPLOADING COORDINATES TO SUPABASE NODE...");

    try {
      const { error } = await supabase.from("maintenance_requests").insert([
        {
          name: formData.name,
          department: formData.department,
          location: formData.location,
          issue: formData.issue,
        },
      ]);
      if (error) {
        console.error("Error inserting request:", error);
        addToLog("ERROR: CONNECTION TIMEOUT.");
      } else {
        addToLog("TRANSMISSION ESTABLISHED. DISPATCH CODE: EMRC-OK.");
        playSuccess();
      }
    } catch (err) {
      console.error(err);
      addToLog("CRITICAL: DISPATCH EXCEPTION ENCOUNTERED.");
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", department: "", location: "", issue: "" });
      setTerminalLog([]);
    }, 6000);
  };

  const handleToggleExpand = () => {
    playClick();
    setIsExpanded(!isExpanded);
  };

  return (
    <m.div
      className="hud-panel rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px]"
      id="maintenance"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.0, type: "spring", bounce: 0.2 }}
    >
      <h2 className="text-[clamp(1.4rem,3vw,1.8rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] flex items-center justify-center gap-2 text-glow-cyan">
        <Wrench className="inline-block text-accent-primary align-middle animate-pulse" />
        {portalTitle}
      </h2>

      <div className="hud-line mb-6" />

      {/* Accompanied telemetry contextual copy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
        <div className="md:col-span-8 font-mono text-xs text-text-secondary leading-relaxed uppercase tracking-[1px]">
          <p className="mb-2">
            Campus maintenance dispatch order form. Registered requests are
            verified, prioritized by electrical fault hazards, and routed
            directly to active technical response squads.
          </p>
          <p className="text-accent-primary/80">
            Open a maintenance dispatch ticket to file a new repair directive.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-center">
          {!submitted && (
            <button
              onClick={handleToggleExpand}
              onMouseEnter={playHover}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-bold font-mono text-[11px] tracking-[2px] transition-all duration-300 hover:bg-accent-primary/20 hover:border-accent-primary/60 select-none pointer-events-auto"
            >
              {isExpanded ? (
                <>
                  COLLAPSE DISPATCH <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  INITIALIZE DISPATCH <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(isExpanded || submitted) && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-accent-primary/10">
              {submitted ? (
                <m.div
                  className="success-message text-center p-8 bg-[rgba(0,240,255,0.04)] rounded-xl border border-accent-primary/40 shadow-[0_0_24px_rgba(0,240,255,0.1)]"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle
                    size={40}
                    className="mx-auto text-accent-primary mb-4 animate-bounce"
                  />
                  <h3 className="font-mono tracking-[3px] text-accent-primary font-bold text-lg">
                    {successTitle}
                  </h3>
                  <p className="mt-2 text-xs font-mono text-text-secondary uppercase">
                    {successDesc}
                  </p>

                  <div className="mt-6 p-4 rounded bg-black/90 border border-white/5 text-left font-mono text-[10px] text-emerald-400/90 leading-relaxed shadow-inner">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 text-white/40">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>TERMINAL STATUS READOUT</span>
                    </div>
                    {terminalLog.map((log, i) => (
                      <div key={i} className="animate-pulse">
                        {log}
                      </div>
                    ))}
                  </div>
                </m.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="custom-form max-w-[560px] mx-auto flex flex-col gap-4 font-mono text-sm pointer-events-auto"
                >
                  <div className="form-group w-full">
                    <input
                      type="text"
                      placeholder={placeholderName}
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="form-group w-full">
                    <input
                      type="text"
                      placeholder={placeholderDept}
                      required
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="form-group w-full">
                    <input
                      type="text"
                      placeholder={placeholderLoc}
                      required
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    />
                  </div>
                  <div className="form-group w-full">
                    <textarea
                      placeholder={placeholderDesc}
                      rows="3"
                      required
                      value={formData.issue}
                      onChange={(e) =>
                        handleInputChange("issue", e.target.value)
                      }
                      onFocus={playClick}
                      className="w-full p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary text-xs tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    onMouseEnter={playHover}
                    className="p-3.5 rounded-[50px] bg-gradient-to-r from-accent-primary/80 to-accent-secondary/80 text-white font-bold text-xs tracking-[2px] cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:from-accent-primary hover:to-accent-secondary hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] select-none pointer-events-auto"
                  >
                    {submitBtnText}
                  </button>
                </form>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
};

export default MaintenancePortal;
