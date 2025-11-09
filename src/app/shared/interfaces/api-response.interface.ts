export interface IApiListResponse<T> {
  statusCode: number;
  message: string;
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  timestamp: Date;
}
