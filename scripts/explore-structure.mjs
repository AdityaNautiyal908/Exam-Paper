import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
const envPath = path.join(rootDir, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function exploreStructure() {
  console.log('=== Exploring Supabase Storage Structure ===\n');
  
  // List root
  console.log('1. Root of bucket:');
  const { data: root, error: rootErr } = await supabase.storage.from('papers').list('');
  if (rootErr) console.error('Error:', rootErr);
  else {
    console.log('Items:', root?.map(i => `${i.name} (${i.id ? 'FILE' : 'FOLDER'})`));
    console.log('Count:', root?.length);
  }
  
  // List sem1
  console.log('\n2. Inside sem1:');
  const { data: sem1, error: sem1Err } = await supabase.storage.from('papers').list('sem1');
  if (sem1Err) console.error('Error:', sem1Err);
  else {
    console.log('Items:', sem1?.map(i => `${i.name} (${i.id ? 'FILE' : 'FOLDER'})`));
    console.log('Count:', sem1?.length);
  }
  
  // List sem1/final
  console.log('\n3. Inside sem1/final:');
  const { data: final, error: finalErr } = await supabase.storage.from('papers').list('sem1/final');
  if (finalErr) console.error('Error:', finalErr);
  else {
    console.log('Items:', final?.map(i => `${i.name} (${i.id ? 'FILE' : 'FOLDER'})`));
    console.log('Count:', final?.length);
    if (final && final.length > 0) {
      console.log('\nFirst file details:', JSON.stringify(final[0], null, 2));
    }
  }
  
  // Try listing with limit
  console.log('\n4. sem1/final with limit 100:');
  const { data: final2, error: final2Err } = await supabase.storage
    .from('papers')
    .list('sem1/final', { limit: 100, offset: 0 });
  if (final2Err) console.error('Error:', final2Err);
  else console.log('Count:', final2?.length);
}

exploreStructure().catch(console.error);
