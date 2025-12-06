import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { SubjectNote } from '../types';
import { fetchNotesBySubject, downloadNote } from '../services/notesService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface NotesSectionProps {
  subject: string;
  semester: number;
  isAuthenticated: boolean;
}

export default function NotesSection({ subject, semester, isAuthenticated }: NotesSectionProps) {
  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes();
    } else {
      setLoading(false);
    }
  }, [subject, semester, isAuthenticated]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await fetchNotesBySubject(subject, semester);
      setNotes(fetchedNotes);
      setError(null);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note: SubjectNote) => {
    try {
      await downloadNote(note.filePath, note.fileName);
    } catch (err) {
      console.error('Error downloading note:', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Not authenticated - show sign in prompt
  if (!isAuthenticated) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            📚 Subject Notes Available
          </h3>
          <p className="text-gray-600 mb-4">
            Sign in to access exclusive study notes for this subject
          </p>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign In to View Notes
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  // No notes available
  if (notes.length === 0) {
    return (
      <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600">No notes available for this subject yet</p>
        </div>
      </div>
    );
  }

  // Display notes
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Study Notes ({notes.length})
      </h3>
      
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate mb-1">
                  {note.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {note.fileType.toUpperCase()}
                  </span>
                  <span>{formatFileSize(note.fileSize)}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(note)}
                className="ml-4 w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
                title="Download Note"
              >
                <div className="w-6 h-6">
                  <DotLottieReact
                    src="https://lottie.host/a96bf700-12b7-48e6-8234-01699667e118/tCeh1QTY7j.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
