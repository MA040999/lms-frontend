import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import { Module } from "@/interfaces/courses/course.interface";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";
import { useSession } from "next-auth/react";

const fetchUserCourseProgress = async (courseId: string, accessToken?: string, abortSignal?: AbortSignal) => {
  const { data } = await serverRequest<Module[]>({
    method: HTTP_METHODS.GET,
    endPoint: SERVER_API_ENDPOINTS.GET_USER_COURSE_PROGRESS + courseId + '/progress',
    signal: abortSignal,
    headers: {
      Authorization: "Bearer " + accessToken,
    }
  });

  return data;
};

const useUserCourseProgress = (courseId: string) => {
  const session = useSession();

  return useQuery({
    ...queryKeys.courses.userCourseProgress(courseId),
    queryFn: ({ signal }) => fetchUserCourseProgress(courseId, session.data?.accessToken, signal),
    enabled: !!session.data?.accessToken
  });
};

export { useUserCourseProgress, fetchUserCourseProgress };
