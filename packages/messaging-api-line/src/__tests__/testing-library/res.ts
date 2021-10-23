import { MockedResponse, ResponseTransformer, context, response } from 'msw';
import { v4 as uuidv4 } from 'uuid';

export function res(
  ...transformers: ResponseTransformer[]
): MockedResponse | Promise<MockedResponse> {
  // A custom response composition chain that adds
  // X-Line-Request-Id header to each `res()` call.
  return response(...transformers, context.set('X-Line-Request-Id', uuidv4()));
}
