export interface HttpRequestOptions {
  url: string;
  queryParameters?: {
    [key: string]: string | number | boolean;
  };
  headers?: {
    [key: string]: string;
  };
}

export interface IHttpClient {
  get(options: HttpRequestOptions): Promise<any>;
}
