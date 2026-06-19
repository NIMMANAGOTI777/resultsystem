import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envPath = 'c:/Users/ADMIN/OneDrive/goal/Desktop/zphs/.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*([^\r\n]+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*([^\r\n]+)/);

const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

const supabase = createClient(url, key);

async function test() {
  console.log("Testing connection...");
  const { data, error } = await supabase.from('schools').select('*');
  if (error) {
    console.error("Error fetching schools:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success fetching schools:", data);
  }
}

test();
