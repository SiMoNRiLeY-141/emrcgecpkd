import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import { playClick, playHover, playSuccess } from "../utils/audio";

const headingText = " NEWS_LETTER_SUBSCRIPTION";
const placeholderText = "ENTER_EMAIL_ID...";
const buttonText = "SUBSCRIBE";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!email) {
      setStatus("ERROR: INVALID_EMAIL_FORMAT.");
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("SUCCESS: SUBSCRIBED_TO_NODE.");
        playSuccess();
        setEmail("");
      } else {
        setStatus(data.error || "ERROR: NODE_CONNECTION_REJECTED.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("ERROR: NODE_CONNECTION_REJECTED.");
    }
  };

  return (
    <m.div
      className="hud-panel relative overflow-hidden rounded-[24px] p-6 md:p-10 mb-10 md:mb-[60px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-primary/45 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-primary/45 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-primary/45 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-primary/45 rounded-br-lg" />

      {/* Status LED */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-accent-primary/60 tracking-widest select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span>COM_STREAM: OK</span>
      </div>

      <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] text-accent-primary m-[0_auto_16px] text-center font-bold tracking-[2px] uppercase text-glow-cyan">
        {headingText}
      </h2>

      <div className="hud-line mb-8" />

      <form
        onSubmit={handleSubmit}
        className="newsletter-form flex flex-col md:flex-row gap-4 max-w-[560px] mx-auto relative pointer-events-auto font-mono text-xs"
      >
        <input
          type="email"
          placeholder={placeholderText}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={playClick}
          className="flex-1 p-3.5 rounded-xl border border-accent-primary/10 bg-black/40 text-text-primary tracking-wider transition-all duration-300 focus:outline-none focus:border-accent-primary/60 focus:bg-black/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] placeholder:text-text-secondary/30"
        />
        <m.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={playHover}
          className="p-3.5 px-8 rounded-[50px] bg-gradient-to-r from-accent-primary/80 to-accent-secondary/80 text-white font-bold tracking-[2px] cursor-pointer transition-all duration-300 hover:from-accent-primary hover:to-accent-secondary hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          {buttonText}
        </m.button>
      </form>
      {status && (
        <m.p
          className={`mt-4 text-center font-mono text-[10px] tracking-widest ${status.startsWith("SUCCESS") ? "text-emerald-400" : "text-rose-400"}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status}
        </m.p>
      )}
    </m.div>
  );
};

export default Newsletter;
