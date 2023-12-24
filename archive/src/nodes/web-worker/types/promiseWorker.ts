// Describes the type of response that can be expected in the message.data when a web worker posts a completed function
export interface PromiseWorkerResponse<T> {
  promiseID: string; // The ID of the promise making this call
  success: boolean;
  message: string; // Containins a message about the response. Usually an error if present
  values: T; // The values returned to the user
}
