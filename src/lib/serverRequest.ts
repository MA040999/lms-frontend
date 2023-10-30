import axios, {
  AxiosHeaders,
  AxiosResponse,
  GenericAbortSignal,
  RawAxiosRequestHeaders,
} from "axios";
import HTTP_METHODS from "../utils/httpsMethods";
import { SERVER_URL } from "@/utils/constants";

interface ServerRequest {
  method: HTTP_METHODS;
  endPoint: string;
  body?: any;
  params?: any;
  headers?: RawAxiosRequestHeaders | AxiosHeaders;
  signal?: GenericAbortSignal;
}

export const serverRequest = async <T>({
  endPoint,
  method,
  body,
  headers,
  params,
  signal,
}: ServerRequest) => {
  try {
    let data: AxiosResponse<T> = await axios({
      method,
      url: SERVER_URL + endPoint,
      data: body,
      params,
      headers,
      signal,
    });

    return data;
  } catch (error: any) {
    throw error;
  }
};
