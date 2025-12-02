import { supabase, PAPERS_BUCKET } from '../lib/supabase';

/**
 * Lists all files in a specific folder within the Supabase storage bucket
 * @param folderPath - Path to the folder (e.g., 'final/sem1', 'midterm/sem2')
 * @returns Array of file objects with name and metadata
 */
export async function listFilesInFolder(folderPath: string) {
  try {
    const { data, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error(`Error listing files in ${folderPath}:`, error);
      return [];
    }

    // Filter out folders, only return files
    return data?.filter(item => item.id !== null) || [];
  } catch (error) {
    console.error(`Exception listing files in ${folderPath}:`, error);
    return [];
  }
}

/**
 * Gets the public URL for a file in Supabase storage
 * @param filePath - Full path to the file (e.g., 'final/sem1/java.pdf')
 * @returns Public URL string
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(PAPERS_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Checks if a file exists in Supabase storage
 * @param filePath - Full path to the file
 * @returns Boolean indicating if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(filePath.substring(0, filePath.lastIndexOf('/')), {
        search: filePath.substring(filePath.lastIndexOf('/') + 1),
      });

    if (error) return false;
    return data && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets all PDF files from a semester folder
 * @param paperType - 'final' or 'midterm'
 * @param semester - Semester number (1-6)
 * @returns Array of file names
 */
export async function getPapersForSemester(
  paperType: 'final' | 'midterm',
  semester: number
): Promise<string[]> {
  const folderPath = `${paperType}/sem${semester}`;
  const files = await listFilesInFolder(folderPath);
  
  // Filter for PDF files only
  return files
    .filter(file => file.name.toLowerCase().endsWith('.pdf'))
    .map(file => file.name);
}
