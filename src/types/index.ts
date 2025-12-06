export type SubjectIconKey =
  | 'c'
  | 'c_lang'
  | 'cpp'
  | 'java'
  | 'java_lang'
  | 'python'
  | 'python_lang'
  | 'cloud'
  | 'cloud_custom'
  | 'analytics'
  | 'cbot'
  | 'database'
  | 'sql'
  | 'web'
  | 'web_dev'
  | 'dotnet'
  | 'graphics'
  | 'graphics_custom'
  | 'computer'
  | 'fco_custom'
  | 'communication'
  | 'security'
  | 'cyber_security'
  | 'maths'
  | 'computer_fundamental'
  | 'software_engineering'
  | 'english_communication'
  | 'environment'
  | 'ai'
  | 'network'
  | 'linux'
  | 'iot'
  | 'theory_computation';

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

export interface SubjectNote {
  id: string;
  subject: string;
  semester: number;
  title: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  fileType: 'pdf' | 'image';
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}
