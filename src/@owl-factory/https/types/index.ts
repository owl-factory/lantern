export interface ServerResponse<T>{
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, unknown>;
}
