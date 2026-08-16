// src/pages/api/news.js
import { NEWS_CARD_SELECT } from "../../lib/supabaseContent";
import supabase from "./supabase";

export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=60",
  );

  try {
    const newsQuery = supabase.from("news").select(NEWS_CARD_SELECT);
    const orderedNewsQuery =
      typeof newsQuery.order === "function"
        ? newsQuery.order("created_at", { ascending: false })
        : newsQuery;

    const { data, error } = await orderedNewsQuery;
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
