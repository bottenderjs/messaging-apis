import { JsonObject } from 'type-fest';
import { OnRequestFunction } from 'messaging-api-common';

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

export type BatchConfig = {
  delay?: number;
  shouldRetry?: (err: BatchRequestErrorInfo) => boolean;
  retryTimes?: number;
  includeHeaders?: boolean;
};

export type ClientConfig = {
  accessToken: string;
  appId?: string;
  appSecret?: string;
  version?: string;
  origin?: string;
  onRequest?: OnRequestFunction;
  skipAppSecretProof?: boolean;
};

export type BatchRequestItem = {
  method: string;
  relativeUrl: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  dependsOn?: string;
  omitResponseOnSuccess?: boolean;
  responseAccessPath?: string;
};

export type BatchResponseBeforeParse = {
  code: number;
  headers?: { name: string; value: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: string;
};

export type BatchResponseItem = {
  code: number;
  headers?: { name: string; value: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>;
};
