const { createClient } = require('@supabase/supabase-js');
const url = 'https://siotvawafzrxnchssebk.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3R2YXdhZnpyeG5jaHNzZWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1MTI1OSwiZXhwIjoyMDkxMzI3MjU5fQ.w3Zm64oQIuOnZJIC0OMfxmpD7EbqJqdudTelFyghqI8';

const supabase = createClient(url, serviceKey);

async function resetPassword() {
  const email = 'omhtesting1@gmail.com';
  const newPassword = 'AdminPassword123!';
  
  console.log(`Attempting to reset password for ${email}...`);
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.error('User not found!');
    return;
  }
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );
  
  if (error) {
    console.error('Error resetting password:', error);
  } else {
    console.log('Password reset successfully to: AdminPassword123!');
  }
}

resetPassword();
