interface IApiBaseResponse {
  statusCode: number;
  message: string;
  timestamp: Date;
}

export interface IApiPaginationParams {
  page?: number;
  limit?: number;
}

export interface IApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiListResponse<T> extends IApiBaseResponse {
  data: {
    data: T[];
    meta: IApiPagination;
  };
}

export interface IApiResponse<T> extends IApiBaseResponse {
  data: T;
}
