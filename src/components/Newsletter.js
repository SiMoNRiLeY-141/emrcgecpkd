// components/Newsletter.js
import React, { useState, useEffect } from "react";
import supabase from "../pages//api/supabase";

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
      const { data, error: selectError } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        throw selectError;
      }

      if (data) {
        setStatus("You are already subscribed!");
        return;
      }

      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (insertError) {
        throw insertError;
      }

      setStatus("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error.message);
      setStatus("Subscription failed. Please try again later.");
    }
  };

  return (
    <div className="newsletter-container">
      <h2>Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default Newsletter;
