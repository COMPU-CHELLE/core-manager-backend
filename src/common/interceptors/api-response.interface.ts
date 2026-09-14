export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string | null;
  type: 'success' | 'info' | 'warn' | 'error';
  data: T;
}

export interface RawResponse<T> {
  __raw: true;
  payload: ApiSuccessResponse<T>;
}
