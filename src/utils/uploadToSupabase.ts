import { supabase, PAPERS_BUCKET } from '../lib/supabase';

/**
 * Generates a filename for the uploaded PDF
 * Format: SUBJECT_NAME_paper-timestamp.pdf
 */
function generateFileName(subjectName: string): string {
  const timestamp = Date.now();
  const sanitizedSubject = subjectName.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
  return `${sanitizedSubject} paper-${timestamp}.pdf`;
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

    // Generate filename
    const fileName = generateFileName(subjectName);
    
    // Construct the storage path: final/sem1/SUBJECT_NAME_paper-timestamp.pdf
    const filePath = `${paperType}/sem${semester}/${fileName}`;

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
    const { error } = await supabase.storage
      .from(PAPERS_BUCKET)
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
