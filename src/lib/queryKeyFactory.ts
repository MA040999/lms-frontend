import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  courses: {
    detail: (courseId: string) => [courseId],
    userCourseProgress: (courseId: string) => [courseId],
    userCourseVerifyCertificate: (courseId: string) => [courseId],
    list: null,
  },
  quizzes: {
    module: (moduleId: string) => [moduleId]
  }
})