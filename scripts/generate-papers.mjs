import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
const envPath = path.join(rootDir, '.env');
let envVars = {};

// Try loading from .env file if it exists
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
}

// Prioritize process.env (for Vercel/CI) over .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: Missing Supabase environment variables. Paper generation may fail if not provided via process.env.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const PAPERS_BUCKET = 'papers';

const configPath = path.join(rootDir, 'src', 'data', 'subjects.config.json');
const outputPath = path.join(rootDir, 'src', 'utils', 'papers.generated.ts');

const SEMESTERS = [1, 2, 3, 4, 5, 6];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const labelFromFile = (fileName, fallbackIndex) => {
  const base = fileName.replace(/\.(pdf|png|jpg|jpeg|webp)$/i, '');
  const paperMatch = base.match(/paper[\s-_]*(\d+)/i);
  if (paperMatch) {
    return `Paper ${paperMatch[1]}`;
  }
  const numberMatch = base.match(/(\d+)/);
  if (numberMatch) {
    return `Paper ${numberMatch[1]}`;
  }
  return `File ${fallbackIndex + 1}`;
};

const normalize = (value) => value.toLowerCase();

/**
 * Lists all files in a specific folder within the Supabase storage bucket
 */
async function listFilesInFolder(folderPath) {
  try {
    console.log(`[supabase] Attempting to list files in bucket "${PAPERS_BUCKET}", path: "${folderPath}"`);
    
    const { data, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error(`[supabase] Error listing files in ${folderPath}:`, JSON.stringify(error, null, 2));
      return [];
    }

    if (!data) {
      console.warn(`[supabase] No data returned for ${folderPath}`);
      return [];
    }

    console.log(`[supabase] Raw data from ${folderPath}:`, data.length, 'items');
    
    // Filter out folders, only return files
    const files = data?.filter(item => item.id !== null) || [];
    console.log(`[supabase] After filtering folders: ${files.length} files`);
    
    return files;
  } catch (error) {
    console.error(`[supabase] Exception listing files in ${folderPath}:`, error);
    return [];
  }
}

/**
 * Gets the public URL for a file in Supabase storage
 */
function getPublicUrl(filePath) {
  const { data } = supabase.storage
    .from(PAPERS_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function loadConfig() {
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

async function gatherPapersForSemester(paperType, semester) {
  // Supabase storage structure: final/sem1, final/sem2, midterm/sem1, etc.
  const folderPath = `${paperType}/sem${semester}`;
  console.log(`[papers] Fetching files from: ${folderPath}`);
  const files = await listFilesInFolder(folderPath);
  
  console.log(`[papers] Found ${files.length} files in ${folderPath}`);
  if (files.length > 0) {
    console.log(`[papers] Sample files:`, files.slice(0, 3).map(f => f.name));
  }
  
  // Filter for PDF files only and normalize
  const pdfFiles = files
    .filter(file => file.name.toLowerCase().endsWith('.pdf'))
    .map(file => ({
      name: file.name,
      normalized: normalize(file.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`[papers] ${pdfFiles.length} PDF files in ${folderPath}`);
  return pdfFiles;
}

async function generatePapers() {
  console.log('[papers] Starting paper generation from Supabase storage...');
  
  const config = loadConfig();
  const allFinalPapers = [];
  const allMidtermPapers = [];
  const usedFiles = { final: {}, midterm: {} };

  SEMESTERS.forEach(sem => {
    usedFiles.final[sem] = new Set();
    usedFiles.midterm[sem] = new Set();
  });

  // Generate Final Papers per semester
  for (const semester of SEMESTERS) {
    const files = await gatherPapersForSemester('final', semester);
    
    config.forEach((subject) => {
      const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

      const matchedFiles = files.filter((file) =>
        matchers.some((matcher) => file.normalized.includes(matcher))
      );

      matchedFiles.forEach((file) => usedFiles.final[semester].add(file.name));

      if (matchedFiles.length === 0) return;

      const filesPayload = matchedFiles.map((file, index) => {
        const filePath = `final/sem${semester}/${file.name}`;
        return {
          id: `${subject.id}-final-sem${semester}-${slugify(file.name)}-${index + 1}`,
          label: labelFromFile(file.name, index),
          fileName: file.name,
          filePath: getPublicUrl(filePath),
          fileType: 'pdf',
        };
      });

      allFinalPapers.push({
        id: `${subject.id}-final-sem${semester}`,
        subject: subject.subject,
        category: subject.category,
        color: subject.color,
        icon: subject.icon,
        files: filesPayload,
        paperType: 'final',
        semester: semester,
      });
    });

    // Log unmatched files
    const unmatchedFinal = files.filter((file) => !usedFiles.final[semester].has(file.name));
    if (unmatchedFinal.length > 0) {
      console.warn(`[papers] Unmatched final papers (sem${semester}): ${unmatchedFinal.map((f) => f.name).join(', ')}`);
    }
  }

  // Generate Midterm Papers per semester
  for (const semester of SEMESTERS) {
    const files = await gatherPapersForSemester('midterm', semester);
    
    config.forEach((subject) => {
      const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

      const matchedFiles = files.filter((file) =>
        matchers.some((matcher) => file.normalized.includes(matcher))
      );

      matchedFiles.forEach((file) => usedFiles.midterm[semester].add(file.name));

      if (matchedFiles.length === 0) return;

      const filesPayload = matchedFiles.map((file, index) => {
        const filePath = `midterm/sem${semester}/${file.name}`;
        return {
          id: `${subject.id}-midterm-sem${semester}-${slugify(file.name)}-${index + 1}`,
          label: labelFromFile(file.name, index),
          fileName: file.name,
          filePath: getPublicUrl(filePath),
          fileType: 'pdf',
        };
      });

      allMidtermPapers.push({
        id: `${subject.id}-midterm-sem${semester}`,
        subject: subject.subject,
        category: subject.category,
        color: subject.color,
        icon: subject.icon,
        files: filesPayload,
        paperType: 'midterm',
        semester: semester,
      });
    });

    // Log unmatched files
    const unmatchedMidterm = files.filter((file) => !usedFiles.midterm[semester].has(file.name));
    if (unmatchedMidterm.length > 0) {
      console.warn(`[papers] Unmatched midterm papers (sem${semester}): ${unmatchedMidterm.map((f) => f.name).join(', ')}`);
    }
  }

  const generated = `import { QuestionPaper } from '../types';

export const finalPapers: QuestionPaper[] = ${JSON.stringify(allFinalPapers, null, 2)};

export const midtermPapers: QuestionPaper[] = ${JSON.stringify(allMidtermPapers, null, 2)};

export const questionPapers: QuestionPaper[] = [...finalPapers, ...midtermPapers];
`;

  fs.writeFileSync(outputPath, generated);
  console.log(`[papers] ✓ Generated: ${allFinalPapers.length} final, ${allMidtermPapers.length} midterm papers from Supabase.`);
}

// Run the generation
generatePapers().catch(error => {
  console.error('[papers] Error generating papers:', error);
  process.exit(1);
});
