// pages/api/keep-alive.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from('your_table').select('*').limit(1);
    if (error) throw error;
    res.status(200).json({ message: 'Supabase pinged successfully', data });
  } catch (error) {
    res.status(500).json({ message: 'Error pinging Supabase', error });
  }
}
