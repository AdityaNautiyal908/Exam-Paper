import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { BookOpen, CheckCircle, AlertCircle, Loader2, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import subjectsConfig from '../../data/subjects.config.json';
import { Semester, SubjectNote } from '../../types';
import { useIsAdmin } from '../../utils/auth';
import { uploadNote, deleteNote, fetchNotesBySubject } from '../../services/notesService';
import { useEffect } from 'react';



export default function NotesDashboard() {
  const { user } = useUser();
  const { isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();
  
  const [semester, setSemester] = useState<Semester>(1);
  const [subjectId, setSubjectId] = useState(subjectsConfig[0].id);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Filter subjects based on selected semester
  const availableSubjects = subjectsConfig.filter(subject => 
    subject.semesters && subject.semesters.includes(semester)
  );

  // Reset subject selection when semester changes
  const handleSemesterChange = (newSemester: Semester) => {
    setSemester(newSemester);
    const firstSubject = subjectsConfig.find(s => s.semesters && s.semesters.includes(newSemester));
    if (firstSubject) {
      setSubjectId(firstSubject.id);
    }
  };

  // Load notes for selected subject
  useEffect(() => {
    loadNotes();
  }, [subjectId, semester]);

  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      const subject = subjectsConfig.find(s => s.id === subjectId);
      if (subject) {
        const fetchedNotes = await fetchNotesBySubject(subject.subject, semester);
        setNotes(fetchedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type (PDF or images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setStatus({ type: 'error', message: 'Please select a PDF or image file (JPG, PNG).' });
        return;
      }
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setStatus({ type: 'error', message: 'Please provide a title and select a file.' });
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
        title,
        uploadedBy: user?.id || ''
      });

      setStatus({ 
        type: 'success', 
        message: 'Note uploaded successfully!' 
      });
      setFile(null);
      setTitle('');
      
      // Reset file input
      const fileInput = document.getElementById('note-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Reload notes
      await loadNotes();
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to upload note. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(noteId);
      setStatus({ type: 'success', message: 'Note deleted successfully!' });
      await loadNotes();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to delete note.' });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading notes dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Admin</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-green-100 rounded-xl">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Study Notes</h1>
            <p className="text-gray-500 text-sm">Add notes for students to access</p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Semester and Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value) as Semester)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1 - Introduction"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File (PDF, Image, Word, or PowerPoint)
            </label>
            <div className="relative">
              <input
                id="note-file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              <label
                htmlFor="note-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-gray-50"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG, Word (DOC/DOCX), or PowerPoint (PPT/PPTX)
                </span>
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {status && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={isUploading || !file || !title.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              isUploading || !file || !title.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload Note'
            )}
          </button>
        </form>

        {/* Existing Notes */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Existing Notes</h2>
          </div>

          {loadingNotes ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notes uploaded for this subject yet.
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">{note.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{note.fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(note.fileSize)} • {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
