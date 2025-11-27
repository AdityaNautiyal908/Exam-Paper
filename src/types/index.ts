export type SubjectIconKey =
  | 'c'
  | 'java'
  | 'python'
  | 'cloud'
  | 'analytics'
  | 'database'
  | 'web'
  | 'graphics'
  | 'computer'
  | 'communication';

export type PaperType = 'final' | 'midterm';
export type FileType = 'pdf' | 'image';
export type Semester = 1 | 2 | 3 | 4 | 5 | 6;

export interface PaperFile {
  id: string;
  label: string;
  fileName: string;
  filePath: string;
  fileType: FileType;
}

export interface QuestionPaper {
  id: string;
  subject: string;
  category: string;
  color: string;
  icon: SubjectIconKey;
  files: PaperFile[];
  paperType: PaperType;
  semester: Semester;
}

export type FilterCategory = 'All' | 'Programming' | 'Database' | 'Web' | 'Core' | 'Advanced';
