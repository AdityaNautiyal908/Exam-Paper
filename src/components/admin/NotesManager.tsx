import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { SubjectNote, Semester } from '../../types';
import subjectsConfig from '../../data/subjects.config.json';
import { fetchNotesBySubject, uploadNote, deleteNote } from '../../services/notesService';

export default function NotesManager() {
  const { user } = useUser();
  const [semester, setSemester] = useState<Semester>(1);
  const [subjectId, setSubjectId] = useState(subjectsConfig[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter subjects based on selected semester
  const availableSubjects = subjectsConfig.filter(subject =>
    subject.semesters && subject.semesters.includes(semester)
  );

  // Load notes when semester or subject changes
  useEffect(() => {
    loadNotes();
  }, [semester, subjectId]);

  const loadNotes = async () => {
    const subject = subjectsConfig.find(s => s.id === subjectId);
    if (!subject) return;

    setIsLoading(true);
    try {
      const fetchedNotes = await fetchNotesBySubject(subject.subject, semester);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterChange = (newSemester: Semester) => {
    setSemester(newSemester);
    const firstSubject = subjectsConfig.find(s => s.semesters && s.semesters.includes(newSemester));
    if (firstSubject) {
      setSubjectId(firstSubject.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      
      if (!validTypes.includes(selectedFile.type)) {
        setStatus({ type: 'error', message: 'Please upload a PDF or image file (PNG, JPG, WEBP).' });
        return;
      }
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !noteTitle.trim()) {
      setStatus({ type: 'error', message: 'Please provide both a title and a file.' });
      return;
    }

    if (!user?.id) {
      setStatus({ type: 'error', message: 'User not authenticated.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const subject = subjectsConfig.find(s => s.id === subjectId);
      if (!subject) {
        throw new Error('Subject not found');
      }

      await uploadNote(file, {
        subject: subject.subject,
        semester,
        title: noteTitle,
        uploadedBy: user.id,
      });

      setStatus({
        type: 'success',
        message: 'Note uploaded successfully!',
      });
      
      // Reset form
      setFile(null);
      setNoteTitle('');
      const fileInput = document.getElementById('note-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Reload notes
      await loadNotes();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload note. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteNote(noteId);
      setStatus({ type: 'success', message: 'Note deleted successfully!' });
      await loadNotes();
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to delete note. Please try again.' });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Study Notes</h2>
            <p className="text-gray-500 text-sm">Add notes for students (PDF or images)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semester Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value) as Semester)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                {availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note Title</label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g., Chapter 1 - Introduction to Programming"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF or Image)</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-500 transition-colors text-center group">
              <input
                type="file"
                id="note-file-upload"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                {file ? (
                  <>
                    <FileText className="w-10 h-10 text-indigo-500 mb-3" />
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 transition-colors mb-3" />
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF or image files (PNG, JPG, WEBP)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file || !noteTitle.trim()}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-[0.98] ${
              isUploading || !file || !noteTitle.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25 hover:-translate-y-0.5'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Note'}
          </button>
        </form>
      </div>

      {/* Manage Existing Notes */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Existing Notes</h2>
            <p className="text-gray-500 text-sm">View and delete uploaded notes</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Viewing notes for:</strong> {subjectsConfig.find(s => s.id === subjectId)?.subject} - Semester {semester}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No notes uploaded for this subject yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate mb-1">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {note.fileType.toUpperCase()}
                      </span>
                      <span>{formatFileSize(note.fileSize)}</span>
                      <span>Uploaded {formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
