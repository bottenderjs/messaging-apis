import { JsonObject } from 'type-fest';

export type BatchRequestOptions = {
  name?: string;
  dependsOn?: string;
};

export type BatchRequest = {
  method: string;
  relativeUrl: string;
  name?: string;
  body?: JsonObject;
  responseAccessPath?: string;
} & BatchRequestOptions;

export type QueueItem = {
  request: BatchRequest;
  resolve: (value?: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
  retry?: number;
};

export type BatchResponse<T extends JsonObject = JsonObject> = {
  code: number;
  headers?: { name: string; value: string }[];
  body: T;
};

export type BatchErrorResponse = BatchResponse<{
  error: {
    type: string;
    message: string;
    code: number;
  };
}>;

export type BatchRequestErrorInfo = {
  request: BatchRequest;
  response: BatchErrorResponse;
};
