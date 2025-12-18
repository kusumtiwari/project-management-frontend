export interface ApiResponse<T> {
  status: number;
  data: {
    success: boolean;
    data: T;
    message?: string;
  };
}
