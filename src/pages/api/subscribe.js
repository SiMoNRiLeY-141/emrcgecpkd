// src/pages/api/subscribe.js
import supabase from "./supabase";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "POST") {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (error && error.code !== "23505") {
        throw error;
      }

      return res.status(200).json({
        message: "Thanks! Your subscription is confirmed.",
      });
    } catch (error) {
      console.error("Error subscribing:", error);
      return res
        .status(500)
        .json({ error: "Subscription failed. Please try again later." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
