import { serverRequest } from "@/lib/serverRequest";
import HTTP_METHODS from "@/utils/httpsMethods";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface PostUserLectureProgressData {
  courseId: string;
  moduleId: string;
  lectureId: string;
}

const postUserLectureProgress = (postUserLectureProgressData: PostUserLectureProgressData, accessToken?: string) => {
  return serverRequest({
    method: HTTP_METHODS.POST,
    endPoint: SERVER_API_ENDPOINTS.POST_USER_LECTURE_PROGRESS,
    body: postUserLectureProgressData,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

const usePostUserLectureProgress = () => {
  const session = useSession();

  return useMutation({
    mutationFn: (postUserLectureProgressData: PostUserLectureProgressData) =>
      postUserLectureProgress(postUserLectureProgressData, session.data?.accessToken),
  });
};

export { postUserLectureProgress, usePostUserLectureProgress };
