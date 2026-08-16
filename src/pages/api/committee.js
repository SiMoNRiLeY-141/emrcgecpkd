import { COMMITTEE_SELECT } from "../../lib/supabaseContent";
import supabase from "./supabase";

export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=60",
  );

  try {
    const { data, error } = await supabase
      .from("committee")
      .select(COMMITTEE_SELECT)
      .order("id", { ascending: true });
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
