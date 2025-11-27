import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');
const finalDir = path.join(assetsDir, 'final');
const midtermDir = path.join(assetsDir, 'midterm');
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

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const isImageFile = (fileName) => 
  IMAGE_EXTENSIONS.some(ext => fileName.toLowerCase().endsWith(ext));

const isPdfFile = (fileName) => fileName.toLowerCase().endsWith('.pdf');

function ensurePaths() {
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Assets directory not found: ${assetsDir}`);
  }
  if (!fs.existsSync(configPath)) {
    throw new Error(`Subject config not found: ${configPath}`);
  }
  
  // Create directory structure if it doesn't exist
  [finalDir, midtermDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    SEMESTERS.forEach(sem => {
      const semDir = path.join(dir, `sem${sem}`);
      if (!fs.existsSync(semDir)) {
        fs.mkdirSync(semDir, { recursive: true });
      }
    });
  });
}

function loadConfig() {
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

function gatherFilesFromDir(dir, extensions) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext);
    })
    .map((file) => ({
      name: file,
      normalized: normalize(file),
    }));
}

function gatherPapersForSemester(baseDir, semester) {
  const semDir = path.join(baseDir, `sem${semester}`);
  return gatherFilesFromDir(semDir, ['.pdf']);
}

ensurePaths();
const config = loadConfig();

const allFinalPapers = [];
const allMidtermPapers = [];
const usedFiles = { final: {}, midterm: {} };

SEMESTERS.forEach(sem => {
  usedFiles.final[sem] = new Set();
  usedFiles.midterm[sem] = new Set();
});

// Generate Final Papers (PDFs) per semester
SEMESTERS.forEach(semester => {
  const files = gatherPapersForSemester(finalDir, semester);
  
  config.forEach((subject) => {
    const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

    const matchedFiles = files
      .filter((file) => matchers.some((matcher) => file.normalized.includes(matcher)))
      .sort((a, b) => a.name.localeCompare(b.name));

    matchedFiles.forEach((file) => usedFiles.final[semester].add(file.name));

    if (matchedFiles.length === 0) return;

    const filesPayload = matchedFiles.map((file, index) => ({
      id: `${subject.id}-final-sem${semester}-${slugify(file.name)}-${index + 1}`,
      label: labelFromFile(file.name, index),
      fileName: file.name,
      filePath: `/assets/final/sem${semester}/${file.name}`,
      fileType: 'pdf',
    }));

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
});

// Generate Midterm Papers (PDFs) per semester
SEMESTERS.forEach(semester => {
  const files = gatherPapersForSemester(midtermDir, semester);
  
  config.forEach((subject) => {
    const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

    const matchedFiles = files
      .filter((file) => matchers.some((matcher) => file.normalized.includes(matcher)))
      .sort((a, b) => a.name.localeCompare(b.name));

    matchedFiles.forEach((file) => usedFiles.midterm[semester].add(file.name));

    if (matchedFiles.length === 0) return;

    const filesPayload = matchedFiles.map((file, index) => ({
      id: `${subject.id}-midterm-sem${semester}-${slugify(file.name)}-${index + 1}`,
      label: labelFromFile(file.name, index),
      fileName: file.name,
      filePath: `/assets/midterm/sem${semester}/${file.name}`,
      fileType: 'pdf',
    }));

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
});

// Warnings for unmatched files
SEMESTERS.forEach(semester => {
  const finalFiles = gatherPapersForSemester(finalDir, semester);
  const unmatchedFinal = finalFiles.filter((file) => !usedFiles.final[semester].has(file.name));
  if (unmatchedFinal.length > 0) {
    console.warn(`[papers] Unmatched final papers (sem${semester}): ${unmatchedFinal.map((f) => f.name).join(', ')}`);
  }

  const midtermFiles = gatherPapersForSemester(midtermDir, semester);
  const unmatchedMidterm = midtermFiles.filter((file) => !usedFiles.midterm[semester].has(file.name));
  if (unmatchedMidterm.length > 0) {
    console.warn(`[papers] Unmatched midterm papers (sem${semester}): ${unmatchedMidterm.map((f) => f.name).join(', ')}`);
  }
});

const generated = `import { QuestionPaper } from '../types';

export const finalPapers: QuestionPaper[] = ${JSON.stringify(allFinalPapers, null, 2)};

export const midtermPapers: QuestionPaper[] = ${JSON.stringify(allMidtermPapers, null, 2)};

export const questionPapers: QuestionPaper[] = [...finalPapers, ...midtermPapers];
`;

fs.writeFileSync(outputPath, generated);
console.log(`[papers] Generated: ${allFinalPapers.length} final, ${allMidtermPapers.length} midterm papers.`);
