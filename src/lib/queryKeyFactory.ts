import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  courses: {
    detail: (courseId: string) => [courseId],
    list: null,
  },
})