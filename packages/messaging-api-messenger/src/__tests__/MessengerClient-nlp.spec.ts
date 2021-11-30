import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #setNLPConfigs', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setNLPConfigs({
    nlpEnabled: true,
    customToken: '1234567890',
  });

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/nlp_configs?nlp_enabled=true&custom_token=1234567890&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #enableNLP', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.enableNLP();

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/nlp_configs?nlp_enabled=true&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #disableNLP', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.disableNLP();

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/nlp_configs?nlp_enabled=false&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
