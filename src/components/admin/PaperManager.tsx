import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Semester, PaperType } from '../../types';
import { listPapersInFolder, deletePDFFromSupabase, updatePDFInSupabase } from '../../utils/uploadToSupabase';
import { clearPapersCache } from '../../hooks/usePapers';

interface PaperFile {
  name: string;
  id: string;
  created_at: string;
}

interface PaperManagerProps {
  semester: Semester;
  paperType: PaperType;
}

export default function PaperManager({ semester, paperType }: PaperManagerProps) {
  const [papers, setPapers] = useState<PaperFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [replacingFile, setReplacingFile] = useState<string | null>(null);

  // Load papers when semester or paperType changes
  useEffect(() => {
    loadPapers();
  }, [semester, paperType]);

  const loadPapers = async () => {
    setIsLoading(true);
    setError(null);

    const result = await listPapersInFolder(semester, paperType);

    if (result.success && result.files) {
      setPapers(result.files);
    } else {
      setError(result.error || 'Failed to load papers');
    }

    setIsLoading(false);
  };

  const handleDelete = async (fileName: string) => {
    const Swal = (await import('sweetalert2')).default;
    
    const result = await Swal.fire({
      title: 'Delete Paper?',
      html: `Are you sure you want to delete<br/><strong>"${fileName}"</strong>?<br/><br/>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingFile(fileName);
    const filePath = `${paperType}/sem${semester}/${fileName}`;

    const deleteResult = await deletePDFFromSupabase(filePath);

    if (deleteResult.success) {
      // Remove from list
      setPapers(papers.filter(p => p.name !== fileName));
      // Clear cache so changes reflect immediately
      clearPapersCache();
      
      await Swal.fire({
        title: 'Deleted!',
        text: 'Paper has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await Swal.fire({
        title: 'Error!',
        text: `Failed to delete paper: ${deleteResult.error}`,
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    }

    setDeletingFile(null);
  };

  const handleReplace = async (fileName: string, newFile: File) => {
    const Swal = (await import('sweetalert2')).default;
    
    setReplacingFile(fileName);
    const filePath = `${paperType}/sem${semester}/${fileName}`;

    const result = await updatePDFInSupabase(filePath, newFile);

    if (result.success) {
      // Clear cache so changes reflect immediately
      clearPapersCache();
      
      await Swal.fire({
        title: 'Success!',
        text: 'Paper replaced successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Reload papers to get updated info
      await loadPapers();
    } else {
      await Swal.fire({
        title: 'Error!',
        text: `Failed to replace paper: ${result.error}`,
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    }

    setReplacingFile(null);
  };

  const handleFileSelect = (fileName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReplace(fileName, file);
    }
  };

  // Group papers by subject
  const groupedPapers = papers.reduce((acc, paper) => {
    // Extract subject name from filename (before "paper-")
    const match = paper.name.match(/^(.+?)\s+paper-/i);
    const subject = match ? match[1].trim() : 'Other';
    
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(paper);
    return acc;
  }, {} as Record<string, PaperFile[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading papers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-red-900">Error loading papers</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No papers found</p>
        <p className="text-sm text-gray-500 mt-1">
          Upload some papers for {paperType === 'final' ? 'Final Term' : 'Mid-Term'} Semester {semester}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedPapers).map(([subject, subjectPapers]) => (
        <div key={subject} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">{subject}</h4>
            <p className="text-sm text-gray-600 mt-0.5">
              {subjectPapers.length} paper{subjectPapers.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {subjectPapers.map((paper) => (
              <div
                key={paper.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{paper.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(paper.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Replace Button */}
                  <label
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-all cursor-pointer
                      ${replacingFile === paper.name
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }
                    `}
                  >
                    {replacingFile === paper.name ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Replacing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Replace</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(paper.name, e)}
                      disabled={replacingFile === paper.name || deletingFile === paper.name}
                    />
                  </label>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(paper.name)}
                    disabled={deletingFile === paper.name || replacingFile === paper.name}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-all
                      ${deletingFile === paper.name || replacingFile === paper.name
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }
                    `}
                  >
                    {deletingFile === paper.name ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
