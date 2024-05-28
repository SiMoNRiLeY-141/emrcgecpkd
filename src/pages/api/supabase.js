// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tptqglihfsppnrrtukvw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdHFnbGloZnNwcG5ycnR1a3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzNzU1MjEsImV4cCI6MjAzMTk1MTUyMX0.L5pEU7VE4X8YoWw6Y5s8mhZYMSuVn2wMtqelroHqwC4';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
