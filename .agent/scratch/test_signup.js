const { createClient } = require('@supabase/supabase-js');
const url = 'https://siotvawafzrxnchssebk.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3R2YXdhZnpyeG5jaHNzZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTEyNTksImV4cCI6MjA5MTMyNzI1OX0.izpejkcGhpgF0eYtAzvw8YTczcJbFLUpEsECpFGUWok';

const supabase = createClient(url, anonKey);

async function testSignup() {
  const email = 'test' + Math.random().toString(36).substring(7) + '@example.com';
  const password = 'Password123!';
  
  console.log(`Testing signup with ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'customer',
        first_name: 'Test',
        last_name: 'User'
      }
    }
  });
  
  if (error) {
    console.error('Signup Error:', error);
  } else {
    console.log('Signup Successful:', data.user.id);
  }
}

testSignup();
