const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

async function run() {
  console.log('SUPABASE_URL=', url ? url : '(missing)');
  console.log('Using key from .env? ', key ? 'yes' : 'no');
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or key in .env');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false }
  });

  try {
    console.log('Attempting simple query: select 1 from users (limit 1)');
    const res = await supabase.from('users').select('id').limit(1);
    console.log('Response:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Query error:', e.message || e);
  }

  try {
    console.log('Attempting a generic GET to project url');
    const fetch = require('node-fetch');
    const r = await fetch(url, { method: 'GET' });
    console.log('HTTP GET', url, 'status', r.status);
    const text = await r.text();
    console.log('Response body snippet:', text.slice(0,200));
  } catch (e) {
    console.error('HTTP GET error:', e.message || e);
  }
}

run();
