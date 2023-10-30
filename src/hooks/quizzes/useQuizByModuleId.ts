import { useQuery } from "@tanstack/react-query";
import HTTP_METHODS from "../../utils/httpsMethods";
import { serverRequest } from "@/lib/serverRequest";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import { queryKeys } from "@/lib/queryKeyFactory";
import { IQuiz } from "@/interfaces/quizzes/quiz.interface";

const fetchQuizByModuleId = async (
  moduleId: string,
  abortSignal?: AbortSignal
) => {
  const { data } = await serverRequest<IQuiz>({
    method: HTTP_METHODS.GET,
    endPoint: SERVER_API_ENDPOINTS.GET_QUIZ_BY_MODULE + `/${moduleId}/quiz`,
    signal: abortSignal,
  });

  return data;
};

const useQuizByModuleId = (moduleId: string) => {
  return useQuery({
    ...queryKeys.quizzes.module(moduleId),
    queryFn: ({ signal }) => fetchQuizByModuleId(moduleId, signal),
  });
};

export { useQuizByModuleId, fetchQuizByModuleId };
