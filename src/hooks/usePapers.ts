import { useState, useEffect } from 'react';
import { supabase, PAPERS_BUCKET } from '../lib/supabase';
import subjectsConfig from '../data/subjects.config.json';
import { QuestionPaper } from '../types';

// Cache configuration
const CACHE_KEY = 'papers_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  finalPapers: QuestionPaper[];
  midtermPapers: QuestionPaper[];
  timestamp: number;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const labelFromFile = (fileName: string, fallbackIndex: number) => {
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

const normalize = (value: string) => value.toLowerCase();

async function listFilesInFolder(folderPath: string) {
  try {
    const { data, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error(`[usePapers] Error listing files in ${folderPath}:`, error);
      return [];
    }

    const files = data?.filter(item => item.id !== null) || [];
    return files;
  } catch (error) {
    console.error(`[usePapers] Exception listing files in ${folderPath}:`, error);
    return [];
  }
}

function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(PAPERS_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

async function gatherPapersForSemester(paperType: 'final' | 'midterm', semester: number) {
  const folderPath = `${paperType}/sem${semester}`;
  const files = await listFilesInFolder(folderPath);
  
  const pdfFiles = files
    .filter(file => file.name.toLowerCase().endsWith('.pdf'))
    .map(file => ({
      name: file.name,
      normalized: normalize(file.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return pdfFiles;
}

async function fetchPapersFromSupabase(): Promise<{ finalPapers: QuestionPaper[]; midtermPapers: QuestionPaper[] }> {
  console.log('[usePapers] Fetching papers from Supabase...');
  
  const allFinalPapers: QuestionPaper[] = [];
  const allMidtermPapers: QuestionPaper[] = [];

  // Generate Final Papers
  for (const semester of SEMESTERS) {
    const files = await gatherPapersForSemester('final', semester);
    
    subjectsConfig.forEach((subject) => {
      const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

      const matchedFiles = files.filter((file) =>
        matchers.some((matcher) => file.normalized.includes(matcher))
      );

      if (matchedFiles.length === 0) return;

      const filesPayload = matchedFiles.map((file, index) => {
        const filePath = `final/sem${semester}/${file.name}`;
        return {
          id: `${subject.id}-final-sem${semester}-${slugify(file.name)}-${index + 1}`,
          label: labelFromFile(file.name, index),
          fileName: file.name,
          filePath: getPublicUrl(filePath),
          fileType: 'pdf' as const,
        };
      });

      allFinalPapers.push({
        id: `${subject.id}-final-sem${semester}`,
        subject: subject.subject,
        category: subject.category,
        color: subject.color,
        icon: subject.icon as any,
        files: filesPayload,
        paperType: 'final',
        semester: semester as 1 | 2 | 3 | 4 | 5 | 6,
      });
    });
  }

  // Generate Midterm Papers
  for (const semester of SEMESTERS) {
    const files = await gatherPapersForSemester('midterm', semester);
    
    subjectsConfig.forEach((subject) => {
      const matchers = subject.matchers?.map(normalize) ?? [normalize(subject.subject)];

      const matchedFiles = files.filter((file) =>
        matchers.some((matcher) => file.normalized.includes(matcher))
      );

      if (matchedFiles.length === 0) return;

      const filesPayload = matchedFiles.map((file, index) => {
        const filePath = `midterm/sem${semester}/${file.name}`;
        return {
          id: `${subject.id}-midterm-sem${semester}-${slugify(file.name)}-${index + 1}`,
          label: labelFromFile(file.name, index),
          fileName: file.name,
          filePath: getPublicUrl(filePath),
          fileType: 'pdf' as const,
        };
      });

      allMidtermPapers.push({
        id: `${subject.id}-midterm-sem${semester}`,
        subject: subject.subject,
        category: subject.category,
        color: subject.color,
        icon: subject.icon as any,
        files: filesPayload,
        paperType: 'midterm',
        semester: semester as 1 | 2 | 3 | 4 | 5 | 6,
      });
    });
  }

  console.log(`[usePapers] ✓ Fetched: ${allFinalPapers.length} final, ${allMidtermPapers.length} midterm papers`);
  
  return { finalPapers: allFinalPapers, midtermPapers: allMidtermPapers };
}

export function usePapers() {
  const [finalPapers, setFinalPapers] = useState<QuestionPaper[]>([]);
  const [midtermPapers, setMidtermPapers] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPapers() {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed: CachedData = JSON.parse(cachedData);
          const age = Date.now() - parsed.timestamp;
          
          if (age < CACHE_TTL) {
            console.log('[usePapers] Using cached data');
            setFinalPapers(parsed.finalPapers);
            setMidtermPapers(parsed.midtermPapers);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from Supabase
        const { finalPapers: fetchedFinal, midtermPapers: fetchedMidterm } = await fetchPapersFromSupabase();
        
        // Update state
        setFinalPapers(fetchedFinal);
        setMidtermPapers(fetchedMidterm);
        
        // Cache the results
        const cacheData: CachedData = {
          finalPapers: fetchedFinal,
          midtermPapers: fetchedMidterm,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        
        setIsLoading(false);
      } catch (err) {
        console.error('[usePapers] Error loading papers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load papers');
        setIsLoading(false);
      }
    }

    loadPapers();
  }, []);

  return { finalPapers, midtermPapers, isLoading, error };
}

// Export function to clear cache (call after admin upload)
export function clearPapersCache() {
  localStorage.removeItem(CACHE_KEY);
  console.log('[usePapers] Cache cleared');
}
