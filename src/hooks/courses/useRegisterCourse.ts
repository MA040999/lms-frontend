import { queryKeys } from "@/lib/queryKeyFactory";
import { serverRequest } from "@/lib/serverRequest";
import HTTP_METHODS from "@/utils/httpsMethods";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface RegisterCourseData {
  courseId: string;
}

const registerCourse = (
  registerCourseData: RegisterCourseData,
  accessToken?: string
) => {
  return serverRequest({
    method: HTTP_METHODS.POST,
    endPoint: SERVER_API_ENDPOINTS.ENROLL_COURSE,
    body: registerCourseData,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

const useRegisterCourse = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registerCourseData: RegisterCourseData) =>
      registerCourse(registerCourseData, session.data?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.list.queryKey });
    },
  });
};

export { registerCourse, useRegisterCourse };
