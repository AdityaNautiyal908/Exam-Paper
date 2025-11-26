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

export interface PaperFile {
  id: string;
  label: string;
  fileName: string;
  filePath: string;
}

export interface QuestionPaper {
  id: string;
  subject: string;
  category: string;
  color: string;
  icon: SubjectIconKey;
  files: PaperFile[];
}

export type FilterCategory = 'All' | 'Programming' | 'Database' | 'Web' | 'Core' | 'Advanced';
