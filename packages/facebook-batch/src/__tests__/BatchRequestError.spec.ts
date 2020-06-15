import BatchRequestError from '../BatchRequestError';
import { BatchRequest, BatchResponse } from '../types';

it('should work', async () => {
  const request: BatchRequest = {
    method: 'POST',
    relativeUrl: 'me/feed',
    body: 'message=Test status update&amp;link=http://developers.facebook.com/',
  };
  const response: BatchResponse = {
    code: 403,
    headers: [
      { name: 'WWW-Authenticate', value: 'OAuth…' },
      { name: 'Content-Type', value: 'text/javascript; charset=UTF-8' },
    ],
    body:
      '{"error":{"type":"OAuthException","message": "Invalid parameter","code": 100}}',
  };
  const error = new BatchRequestError({ request, response });

  expect(error.inspect()).toMatchSnapshot();
});

it('should have better error message', async () => {
  const request: BatchRequest = {
    method: 'POST',
    relativeUrl: 'me/feed',
    body: 'message=Test status update&amp;link=http://developers.facebook.com/',
  };
  const response: BatchResponse = {
    code: 403,
    headers: [
      { name: 'WWW-Authenticate', value: 'OAuth…' },
      { name: 'Content-Type', value: 'text/javascript; charset=UTF-8' },
    ],
    body:
      '{"error":{"type":"OAuthException","message": "Invalid parameter","code": 100}}',
  };
  const error = new BatchRequestError({ request, response });

  expect(error.message).toEqual('Batch Request Error - Invalid parameter');
});
