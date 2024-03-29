import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import { ICourse } from "@/interfaces/courses/course.interface";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";

const fetchCourses = async (abortSignal?: AbortSignal) => {
  const { data } = await serverRequest<ICourse[]>({
    method: HTTP_METHODS.GET,
    endPoint: SERVER_API_ENDPOINTS.GET_COURSES,
    signal: abortSignal,
  });

  return data;
};

const useCourses = () => {
  return useQuery({
    ...queryKeys.courses.list,
    queryFn: ({ signal }) => fetchCourses(signal),
  });
};

export { useCourses, fetchCourses };
