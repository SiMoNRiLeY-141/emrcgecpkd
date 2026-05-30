// components/Newsletter.js
import React, { useState, useEffect } from "react";
import { m } from "framer-motion";

const headingText = "Subscribe to our Newsletter";
const placeholderText = "Enter your email";
const buttonText = "Subscribe";

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

    if (!email) {
      setStatus("Please enter a valid email address.");
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
        setStatus(data.message);
        setEmail("");
      } else {
        setStatus(data.error || "Subscription failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("Subscription failed. Please try again later.");
    }
  };

  return (
    <m.div
      className="glass-panel newsletter-container bg-glass-bg backdrop-blur-[16px] border border-glass-border rounded-[20px] md:rounded-[24px] p-[25px_15px] md:p-10 mb-10 md:mb-[60px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <h2 className="text-[clamp(1.8rem,4vw,2.2rem)] text-text-primary m-[0_auto_40px] text-center relative w-fit block font-bold after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-accent-primary after:to-accent-secondary after:rounded-[4px]">
        {headingText}
      </h2>
      <form onSubmit={handleSubmit} className="newsletter-form flex flex-col md:flex-row gap-[15px] max-w-[600px] mx-auto relative">
        <input
          type="email"
          placeholder={placeholderText}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 py-[18px] px-[30px] rounded-[50px] border border-glass-border bg-[rgba(0,0,0,0.4)] text-white text-base font-inherit transition-all duration-300 focus:outline-none focus:border-accent-primary focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] focus:bg-[rgba(0,0,0,0.6)]"
        />
        <m.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-[15px] px-[35px] rounded-[50px] border-none bg-gradient-to-br from-accent-primary to-accent-secondary text-black font-extrabold text-[1.1rem] cursor-pointer transition-all duration-300 font-inherit uppercase tracking-[1px] w-full md:w-auto hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(112,0,255,0.5)] hover:text-white"
        >
          {buttonText}
        </m.button>
      </form>
      {status && (
        <m.p
          className="status-message text-accent-primary mt-4 text-center font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status}
        </m.p>
      )}
    </m.div>
  );
};

export default Newsletter;
