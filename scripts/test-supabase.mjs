import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env file
const envPath = path.join(rootDir, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env file');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const PAPERS_BUCKET = 'papers';

async function testBucketAccess() {
  console.log('\n=== Testing Supabase Storage Access ===\n');
  
  // Test 1: List all buckets
  console.log('1. Listing all buckets:');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('Error:', bucketsError);
  } else {
    console.log('Available buckets:', buckets?.map(b => b.name));
  }
  
  // Test 2: Get bucket details
  console.log('\n2. Getting bucket details for "papers":');
  const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket(PAPERS_BUCKET);
  if (bucketError) {
    console.error('Error:', bucketError);
  } else {
    console.log('Bucket info:', JSON.stringify(bucketInfo, null, 2));
  }
  
  // Test 3: Try listing with different options
  console.log('\n3. Listing sem1/final with different options:');
  
  // Option A: Default
  const { data: dataA, error: errorA } = await supabase.storage
    .from(PAPERS_BUCKET)
    .list('sem1/final');
  console.log('Default list:', dataA?.length || 0, 'items', errorA ? `Error: ${JSON.stringify(errorA)}` : '');
  
  // Option B: With search
  const { data: dataB, error: errorB } = await supabase.storage
    .from(PAPERS_BUCKET)
    .list('sem1/final', { search: 'pdf' });
  console.log('With search:', dataB?.length || 0, 'items', errorB ? `Error: ${JSON.stringify(errorB)}` : '');
  
  // Option C: Just sem1
  const { data: dataC, error: errorC } = await supabase.storage
    .from(PAPERS_BUCKET)
    .list('sem1');
  console.log('Just sem1:', dataC?.length || 0, 'items', errorC ? `Error: ${JSON.stringify(errorC)}` : '');
  if (dataC && dataC.length > 0) {
    console.log('  Items:', dataC.map(item => `${item.name} (${item.id ? 'file' : 'folder'})`));
  }
  
  // Test 4: Try getting a specific file URL
  console.log('\n4. Testing public URL generation:');
  const testPath = 'sem1/final/Computer Fundamentals.pdf';
  const { data: urlData } = supabase.storage
    .from(PAPERS_BUCKET)
    .getPublicUrl(testPath);
  console.log('Public URL for test file:', urlData.publicUrl);
  
  // Test 5: Try to download the file to verify it exists
  console.log('\n5. Testing file download:');
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from(PAPERS_BUCKET)
    .download(testPath);
  if (downloadError) {
    console.error('Download error:', downloadError);
  } else {
    console.log('Download successful! File size:', downloadData?.size, 'bytes');
  }
}

testBucketAccess().catch(console.error);
