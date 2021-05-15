import fetch from "cross-fetch";
import { ServerResponse } from "types/utilities";

// The default request initialization.
const defaultRequestInit: RequestInit = {
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

// TODO - load in from env variable
const thisDomain = "http://localhost:3000";

/**
 * Formats the URL. Serverside requests require an absolute URL; this adds it 
 * if the environment variable is set
 * @param url The url to format properly
 */
function formatURL(url: string) {
  if (url.charAt(0) === "/") { return thisDomain + url; }
  return url;
}

/**
 * Converts an object into URI parameters
 * @param data The data object to convert into URI parameters
 */
export function toURLParams(data?: Record<string, string | unknown>): string {
  if (!data) { return ""; }

  let urlParams = "?";
  const keys = Object.keys(data);
  if (keys.length === 0) { return ""; }

  keys.forEach((key: string) => {
    if (data[key] === undefined || data[key] === "") { return; }
    urlParams += `${key}=${data[key]}&`
  });
  if (urlParams === "?") { return ""; }

  return urlParams;
}

/**
 * Runs a standard get request
 * @param url The url of the API to request
 * @param requestInit  The request instructions
 */
async function get<T>(
  url: string,
  data?: Record<string, string>,
  requestInit: RequestInit = defaultRequestInit
): Promise<ServerResponse<T>> {
  requestInit.body = undefined;
  requestInit.method = "GET";
  // TODO - convert data to url params
  const urlParams = toURLParams(data);
  const response = await fetch(formatURL(url + urlParams), requestInit);
  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Runs a standard post request
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function post<T>(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
): Promise<ServerResponse<T>> {
  requestInit.method = "POST";
  return postlike(url, data, requestInit);
}

/**
 * Runs a standard put request
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function put<T>(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
): Promise<ServerResponse<T>> {
  requestInit.method = "PUT";
  return postlike(url, data, requestInit);
}

/**
 * Runs a standard put request
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function patch<T>(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
): Promise<ServerResponse<T>> {
  requestInit.method = "PATCH";
  return postlike(url, data, requestInit);
}

/**
 * Runs a standard put request
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function del<T>(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
): Promise<ServerResponse<T>> {
  requestInit.method = "DELETE";
  return postlike(url, data, requestInit);
}

/**
 * A standard postlike request, sending an object with a specific REST method
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function postlike<T>(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
):Promise<ServerResponse<T>> {
  requestInit.body = JSON.stringify(data);
  const response = await fetch(formatURL(url), requestInit);
  return response.json(); // parses JSON response into native JavaScript objects
}

export const request = {
  get,
  post,
  put,
  patch,
  delete: del,
};
export const rest = request;
export default request;
