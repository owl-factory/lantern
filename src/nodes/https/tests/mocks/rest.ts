
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

export enum MOCK_URL {
  SUCCESS = "/success",
  FAIL = "/fail",
  ERROR = "/error"
}

function urlResponse(url: string, docs: any[]) {
  switch (url) {
    case MOCK_URL.SUCCESS:
      return {
        success: true,
        data: { docs: [ { id: "1"} ] },
        message: "",
      };
    case MOCK_URL.FAIL:
      return {
        success: false,
        data: { docs: [] },
        message: "Mock error",
      };
    case MOCK_URL.ERROR:
    default:
      throw "Error";
  }
}

async function mock_get<_T>(
  url: string,
  _data?: Record<string, string>,
  _requestInit = defaultRequestInit
) {
  return urlResponse(url, []);
}

async function mock_post<_T>(
  url: string,
  data: Record<string, unknown>,
  _requestInit = defaultRequestInit
) {
  return urlResponse(url, (data as any).docs);
}

export const request = {
  get: mock_get,
  post: mock_post,
  put: mock_post,
  patch: mock_post,
  delete: mock_post,
};
export const rest = request;
