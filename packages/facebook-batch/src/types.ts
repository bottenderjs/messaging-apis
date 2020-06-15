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

export type BatchResponse = {
  code: number;
  headers?: { name: string; value: string }[];
  body: string;
};

export type BatchRequestErrorInfo = {
  request: BatchRequest;
  response: BatchResponse;
};
