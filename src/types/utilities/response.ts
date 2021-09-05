export interface ServerResponse<T>{
  success: boolean;
  message: string;
  data: T;
}
