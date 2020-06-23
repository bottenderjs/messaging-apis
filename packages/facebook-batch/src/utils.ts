import { BatchRequestErrorInfo } from './types';

export function getErrorMessage(errInfo: BatchRequestErrorInfo): string {
  try {
    const message = errInfo.response.body?.error?.message;
    return message;
  } catch (_) {
    return '';
  }
}

export function isError613(errInfo: BatchRequestErrorInfo): boolean {
  const message = getErrorMessage(errInfo);
  return /#613/.test(message);
}
