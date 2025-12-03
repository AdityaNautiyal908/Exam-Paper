import { supabase, PAPERS_BUCKET } from '../lib/supabase';

/**
 * Lists all PDF files in a specific folder
 * @param semester - Semester number (1-6)
 * @param paperType - 'final' or 'midterm'
 * @returns Promise with array of file objects
 */
export async function listPapersInFolder(
  semester: number,
  paperType: 'final' | 'midterm'
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const folderPath = `${paperType}/sem${semester}`;
    
    const { data: files, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('[list] Error:', error);
      return { success: false, error: error.message };
    }

    // Filter out folders and non-PDF files
    const pdfFiles = files?.filter(file => 
      file.id !== null && file.name.toLowerCase().endsWith('.pdf')
    ) || [];

    return { success: true, files: pdfFiles };
  } catch (error) {
    console.error('[list] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
}

/**
 * Updates/replaces an existing PDF file in Supabase Storage
 * @param filePath - The path of the file to replace
 * @param newFile - The new PDF file
 * @returns Promise with success status
 */
export async function updatePDFInSupabase(
  filePath: string,
  newFile: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file type
    if (newFile.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (newFile.size > maxSize) {
      return { success: false, error: 'File size must be less than 10MB' };
    }

    // Upload with upsert to replace existing file
    const { error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .upload(filePath, newFile, {
        cacheControl: '3600',
        upsert: true, // This replaces the existing file
      });

    if (error) {
      console.error('[update] Error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(PAPERS_BUCKET)
      .getPublicUrl(filePath);

    console.log('[update] Success! Updated:', filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('[update] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update file',
    };
  }
}



/**
 * Uploads a PDF file to Supabase Storage
 * @param file - The PDF file to upload
 * @param semester - Semester number (1-6)
 * @param paperType - 'final' or 'midterm'
 * @param subjectName - Name of the subject
 * @returns Promise with the public URL of the uploaded file
 */
export async function uploadPDFToSupabase(
  file: File,
  semester: number,
  paperType: 'final' | 'midterm',
  subjectName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 10MB' };
    }

    // Get existing files to determine the next number
    const folderPath = `${paperType}/sem${semester}`;
    const { data: existingFiles, error: listError } = await supabase.storage
      .from(PAPERS_BUCKET)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
      });

    if (listError) {
      console.error('[upload] Error listing files:', listError);
    }

    // Count existing files for this subject
    const sanitizedSubject = subjectName.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    const subjectFiles = existingFiles?.filter(f => 
      f.name.toLowerCase().includes(sanitizedSubject.toLowerCase())
    ) || [];
    
    const nextNumber = subjectFiles.length + 1;
    const fileName = `${sanitizedSubject} paper-${nextNumber}.pdf`;
    
    // Construct the storage path: final/sem1/SUBJECT_NAME_paper-1.pdf
    const filePath = `${folderPath}/${fileName}`;

    console.log('[upload] Uploading to:', filePath);

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('[upload] Error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to upload file to storage' 
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(PAPERS_BUCKET)
      .getPublicUrl(filePath);

    console.log('[upload] Success! URL:', urlData.publicUrl);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('[upload] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Deletes a PDF file from Supabase Storage
 * @param filePath - The path of the file to delete
 */
export async function deletePDFFromSupabase(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[delete] Attempting to delete file:', filePath);
    console.log('[delete] Bucket:', PAPERS_BUCKET);
    
    const { data, error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .remove([filePath]);

    console.log('[delete] Response data:', data);
    console.log('[delete] Response error:', error);

    if (error) {
      console.error('[delete] Delete failed:', error);
      return { success: false, error: error.message };
    }

    console.log('[delete] ✓ File deleted successfully:', filePath);
    return { success: true };
  } catch (error) {
    console.error('[delete] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
