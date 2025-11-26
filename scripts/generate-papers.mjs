import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');
const configPath = path.join(rootDir, 'src', 'data', 'subjects.config.json');
const outputPath = path.join(rootDir, 'src', 'utils', 'papers.generated.ts');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const labelFromFile = (fileName, fallbackIndex) => {
  const base = fileName.replace(/\.pdf$/i, '');
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

function ensurePaths() {
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Assets directory not found: ${assetsDir}`);
  }
  if (!fs.existsSync(configPath)) {
    throw new Error(`Subject config not found: ${configPath}`);
  }
}

function loadConfig() {
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

function gatherFiles() {
  return fs
    .readdirSync(assetsDir)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map((file) => ({
      name: file,
      normalized: normalize(file),
    }));
}

ensurePaths();
const config = loadConfig();
const files = gatherFiles();
const usedFiles = new Set();

const questionPapers = config.map((subject) => {
  const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

  const matchedFiles = files
    .filter((file) => matchers.some((matcher) => file.normalized.includes(matcher)))
    .sort((a, b) => a.name.localeCompare(b.name));

  matchedFiles.forEach((file) => usedFiles.add(file.name));

  const filesPayload = matchedFiles.map((file, index) => ({
    id: `${subject.id}-${slugify(file.name)}-${index + 1}`,
    label: labelFromFile(file.name, index),
    fileName: file.name,
    filePath: `/assets/${file.name}`,
  }));

  if (filesPayload.length === 0) {
    console.warn(`[papers] No PDF files matched for subject "${subject.subject}"`);
  }

  return {
    id: subject.id,
    subject: subject.subject,
    category: subject.category,
    color: subject.color,
    icon: subject.icon,
    files: filesPayload,
  };
});

const unmatchedFiles = files.filter((file) => !usedFiles.has(file.name));
if (unmatchedFiles.length > 0) {
  console.warn(
    `[papers] The following files were not matched to any subject: ${unmatchedFiles
      .map((file) => file.name)
      .join(', ')}`
  );
}

const generated = `import { QuestionPaper } from '../types';

export const questionPapers: QuestionPaper[] = ${JSON.stringify(questionPapers, null, 2)};
`;

fs.writeFileSync(outputPath, generated);
console.log(`[papers] Generated manifest with ${questionPapers.length} subjects.`);

