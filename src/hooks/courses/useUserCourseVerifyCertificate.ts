import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";
import { useSession } from "next-auth/react";

const fetchUserCourseVerifyCertificate = async (courseId: string, accessToken?: string, abortSignal?: AbortSignal) => {
  const { data } = await serverRequest<boolean>({
    method: HTTP_METHODS.GET,
    endPoint: SERVER_API_ENDPOINTS.GET_USER_COURSE_VERIFY_CERTIFICATE + courseId,
    signal: abortSignal,
    headers: {
      Authorization: "Bearer " + accessToken,
    }
  });

  return data;
};

const useUserCourseVerifyCertificate = (courseId: string) => {
  const session = useSession();

  return useQuery({
    ...queryKeys.courses.userCourseVerifyCertificate(courseId),
    queryFn: ({ signal }) => fetchUserCourseVerifyCertificate(courseId, session.data?.accessToken, signal),
    enabled: !!session.data?.accessToken
  });
};

export { useUserCourseVerifyCertificate, fetchUserCourseVerifyCertificate };
