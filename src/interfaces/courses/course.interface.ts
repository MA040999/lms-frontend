export interface ICourse {
  id: string;
  title: string;
  synopsis: string;
  takeaways: string[];
  imageURL: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
  modules: Module[];
  _count: ICourseCount;
}

export interface ICourseCount {
  modules: number;
  enrollments: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lectures: Lecture[];
  _count: ModuleCount;
}

export interface ModuleCount {
  lectures: number;
}

export interface Lecture {
  id: string;
  moduleId: string;
  title: string;
  type: string;
  preview: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
