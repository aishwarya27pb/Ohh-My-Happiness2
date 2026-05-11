const { createClient } = require('@supabase/supabase-js');
const url = 'https://siotvawafzrxnchssebk.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3R2YXdhZnpyeG5jaHNzZWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1MTI1OSwiZXhwIjoyMDkxMzI3MjU5fQ.w3Zm64oQIuOnZJIC0OMfxmpD7EbqJqdudTelFyghqI8';

const supabase = createClient(url, serviceKey);

async function checkSchema() {
  console.log('Checking profiles table...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching from profiles:', error);
  } else {
    console.log('Profiles table exists. Columns:', data.length > 0 ? Object.keys(data[0]) : 'No rows to check columns');
  }
  
  console.log('Checking if there are any triggers (via information_schema if possible)...');
  // Usually we can't easily query triggers via the JS client unless we have a RPC or it's allowed.
  // But we can check if there's a profiles table at all.
}

checkSchema();
