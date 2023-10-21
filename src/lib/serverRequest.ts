import axios, { AxiosResponse, GenericAbortSignal } from "axios";
import HTTP_METHODS from "../utils/httpsMethods";
import { SERVER_URL } from "@/utils/constants";

export const serverRequest = async <T>(
  method: HTTP_METHODS,
  endPoint: string,
  body?: any,
  params?: any,
  signal?: GenericAbortSignal
)=> {
  try {
    let data: AxiosResponse<T> = await axios({
      method,
      url: SERVER_URL + endPoint,
      data: body,
      params,
      signal,
    });

    return data;
  } catch (error: any) {
    throw error;
  }
};
