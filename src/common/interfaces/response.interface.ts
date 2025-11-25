export interface ApiResponse<T> {
  message: string;
  error: null;
  statusCode: number;
  data: T;
  cursor?: any;
}
