import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import subjectsConfig from '../../data/subjects.config.json';
import { Semester, PaperType } from '../../types';
import { useIsAdmin } from '../../utils/auth';
import { uploadPDFToSupabase } from '../../utils/uploadToSupabase';


export default function AdminDashboard() {
  const { user } = useUser();
  const { isAdmin, isLoading } = useIsAdmin();
  const [semester, setSemester] = useState<Semester>(1);
  const [paperType, setPaperType] = useState<PaperType>('final');
  const [subjectId, setSubjectId] = useState(subjectsConfig[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    const userRole = (user.publicMetadata?.role as string) || 'not set';
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">You don't have permission to access this page.</p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Your role:</span> {userRole}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Required role:</span> admin
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setStatus({ type: 'error', message: 'Please upload a PDF file.' });
        return;
      }
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      // Get subject name from config
      const subject = subjectsConfig.find(s => s.id === subjectId);
      if (!subject) {
        throw new Error('Subject not found');
      }
      
      // Upload to Supabase Storage
      const result = await uploadPDFToSupabase(
        file,
        semester,
        paperType,
        subject.subject
      );

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setStatus({ 
        type: 'success', 
        message: `Paper uploaded successfully! File: ${file.name}. Run 'npm run sync:papers' to update the paper list.` 
      });
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload paper. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Question Paper</h1>
            <p className="text-gray-500 text-sm">Add new papers to the repository</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semester Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value) as Semester)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Paper Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value as PaperType)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="final">Final Term</option>
                <option value="midterm">Mid-Term</option>
              </select>
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              {subjectsConfig.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-500 transition-colors text-center group">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
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
                    <p className="text-xs text-gray-500 mt-1">PDF files only</p>
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
            disabled={isUploading || !file}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-[0.98] ${
              isUploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25 hover:-translate-y-0.5'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Paper'}
          </button>
        </form>
      </div>
    </div>
  );
}
