import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import { ICourse } from "@/interfaces/courses/course.interface";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";

const fetchCourseById = async (courseId: string, abortSignal?: AbortSignal) => {
  const { data } = await serverRequest<ICourse>(
    HTTP_METHODS.GET,
    SERVER_API_ENDPOINTS.GET_COURSES + `/${courseId}`,
    undefined,
    undefined,
    abortSignal
  );

  return data;
};

const useCourseById = (courseId: string) => {
  return useQuery({
    ...queryKeys.courses.detail(courseId),
    queryFn: ({ signal }) => fetchCourseById(courseId, signal),
  });
};

export { useCourseById, fetchCourseById };
