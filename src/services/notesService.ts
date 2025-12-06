import { supabase } from '../lib/supabase';
import { SubjectNote } from '../types';

/**
 * Fetch all notes for a specific subject and semester
 */
export async function fetchNotesBySubject(
  subject: string,
  semester: number
): Promise<SubjectNote[]> {
  const { data, error } = await supabase
    .from('subject_notes')
    .select('*')
    .eq('subject', subject)
    .eq('semester', semester)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }

  return (data || []).map((note) => ({
    id: note.id,
    subject: note.subject,
    semester: note.semester,
    title: note.title,
    filePath: note.file_path,
    fileName: note.file_name,
    fileSize: note.file_size,
    fileType: note.file_type,
    uploadedBy: note.uploaded_by,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  }));
}

/**
 * Upload a new note (admin only)
 */
export async function uploadNote(
  file: File,
  metadata: {
    subject: string;
    semester: number;
    title: string;
    uploadedBy: string;
  }
): Promise<SubjectNote> {
  // Upload file to Supabase storage
  const fileName = `${metadata.subject}_${Date.now()}_${file.name}`;
  const filePath = `notes/${metadata.semester}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('notes')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('notes')
    .getPublicUrl(filePath);

  // Insert note record into database
  const { data, error } = await supabase
    .from('subject_notes')
    .insert({
      subject: metadata.subject,
      semester: metadata.semester,
      title: metadata.title,
      file_path: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type.includes('pdf') ? 'pdf' : 'image',
      uploaded_by: metadata.uploadedBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating note record:', error);
    throw error;
  }

  return {
    id: data.id,
    subject: data.subject,
    semester: data.semester,
    title: data.title,
    filePath: data.file_path,
    fileName: data.file_name,
    fileSize: data.file_size,
    fileType: data.file_type,
    uploadedBy: data.uploaded_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Delete a note (admin only)
 */
export async function deleteNote(noteId: string): Promise<void> {
  // First, get the note to find the file path
  const { data: note, error: fetchError } = await supabase
    .from('subject_notes')
    .select('file_path')
    .eq('id', noteId)
    .single();

  if (fetchError) {
    console.error('Error fetching note:', fetchError);
    throw fetchError;
  }

  // Extract file path from URL
  const url = new URL(note.file_path);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf('notes')).join('/');

  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('notes')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    // Continue with database deletion even if storage deletion fails
  }

  // Delete note record from database
  const { error: deleteError } = await supabase
    .from('subject_notes')
    .delete()
    .eq('id', noteId);

  if (deleteError) {
    console.error('Error deleting note record:', deleteError);
    throw deleteError;
  }
}

/**
 * Download a note file
 */
export async function downloadNote(filePath: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(filePath);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(filePath, '_blank');
  }
}
