const { createClient } = require('@supabase/supabase-js');
const url = 'https://siotvawafzrxnchssebk.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3R2YXdhZnpyeG5jaHNzZWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1MTI1OSwiZXhwIjoyMDkxMzI3MjU5fQ.w3Zm64oQIuOnZJIC0OMfxmpD7EbqJqdudTelFyghqI8';

const supabase = createClient(url, serviceKey);

async function listUsers() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error listing users:', error);
    return;
  }
  console.log('Registered Users:');
  users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
}

listUsers();
