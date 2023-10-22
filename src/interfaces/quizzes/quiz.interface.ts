export interface IQuiz {
  id: string;
  moduleId: string;
  courseId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  options: Option[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Option {
  text: string;
  correct: boolean;
}
