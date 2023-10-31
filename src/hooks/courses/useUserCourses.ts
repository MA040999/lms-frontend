import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import { IUserCourse } from "@/interfaces/courses/course.interface";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";
import { useSession } from "next-auth/react";

const fetchUserCourses = async (accessToken?: string, abortSignal?: AbortSignal) => {
  const { data } = await serverRequest<IUserCourse>({
    method: HTTP_METHODS.GET,
    endPoint: SERVER_API_ENDPOINTS.GET_USER_COURSES,
    signal: abortSignal,
    headers: {
      Authorization: "Bearer " + accessToken,
    }
  });

  return data;
};

const useUserCourses = () => {
  const session = useSession();

  return useQuery({
    ...queryKeys.courses.list,
    queryFn: ({ signal }) => fetchUserCourses(session.data?.accessToken, signal),
    enabled: !!session.data?.accessToken
  });
};

export { useUserCourses, fetchUserCourses };
