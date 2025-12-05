import { QuestionPaper } from '../types';

export const finalPapers: QuestionPaper[] = [];

export const midtermPapers: QuestionPaper[] = [];

export const questionPapers: QuestionPaper[] = [...finalPapers, ...midtermPapers];
