import supabase from './supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from('committee').select('*');
      if (error) {
      throw error;
      }
      res.status(200).json(data);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
    }