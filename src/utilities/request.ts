import fetch from "cross-fetch";

// The default request initialization. 
const defaultRequestInit: RequestInit = {
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json"
  },
  redirect: "follow",
  referrerPolicy: "no-referrer"
}

// TODO - load in from env variable
const thisDomain = "http://localhost:3000";

/**
 * Formats the URL. Serverside requests require an absolute URL; this adds it 
 * if the environment variable is set
 * @param url The url to format properly
 */
function formatURL(url: string) {
  if (url.charAt(0) === "/") { return thisDomain + url }
  return url;
}

/**
 * Converts an object into URI parameters
 * @param data The data object to convert into URI parameters
 */
export function toURLParams(data?: Record<string, string>) {
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
async function get(
  url: string,
  data?: string | string[][] | Record<string, string> | URLSearchParams | undefined,
  requestInit: RequestInit = defaultRequestInit
) {
  const myUrl = new URLSearchParams(data).toString()
  console.log(myUrl)
  requestInit.method = "GET";
  // TODO - convert data to url params
  const urlParams = toURLParams(data);
  console.log(urlParams)
  const response = await fetch(formatURL(url) + urlParams, requestInit);
  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Runs a standard get request
 * @param url The url of the API to request
 * @param data The data to send through the Post request
 * @param requestInit  The request instructions
 */
async function post(
  url: string,
  data: Record<string, unknown>,
  requestInit: RequestInit = defaultRequestInit
) {
  requestInit.method = "POST";
  requestInit.body = JSON.stringify(data);

  const response = await fetch(formatURL(url), requestInit);
  return response.json(); // parses JSON response into native JavaScript objects
}

const request = {
  get,
  post
}

export default request;