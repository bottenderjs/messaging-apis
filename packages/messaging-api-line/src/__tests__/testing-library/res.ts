import { MockedResponse, ResponseTransformer, response } from 'msw';
import { v4 as uuidv4 } from 'uuid';

export function res(
  ...transformers: ResponseTransformer[]
): MockedResponse | Promise<MockedResponse> {
  // A custom response composition chain that adds
  // X-Line-Request-Id header to each `res()` call.
  return response((_res) => {
    if (!_res.headers.has('X-Line-Request-Id')) {
      _res.headers.set('X-Line-Request-Id', uuidv4());
    }
    return _res;
  }, ...transformers);
}
