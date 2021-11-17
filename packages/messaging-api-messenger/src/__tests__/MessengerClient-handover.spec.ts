import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #passThreadControl', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.passThreadControl(
    constants.USER_ID,
    123456789,
    'free formed text for another app'
  );

  expect(res).toEqual({ success: true });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/pass_thread_control?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: constants.USER_ID,
    },
    target_app_id: 123456789,
    metadata: 'free formed text for another app',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #passThreadControlToPageInbox', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.passThreadControlToPageInbox(
    constants.USER_ID,
    'free formed text for another app'
  );

  expect(res).toEqual({ success: true });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/pass_thread_control?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: constants.USER_ID,
    },
    target_app_id: 263902037430900,
    metadata: 'free formed text for another app',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #takeThreadControl', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.takeThreadControl(
    constants.USER_ID,
    'free formed text for another app'
  );

  expect(res).toEqual({ success: true });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/take_thread_control?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: constants.USER_ID,
    },
    metadata: 'free formed text for another app',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #requestThreadControl', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.requestThreadControl(
    constants.USER_ID,
    'free formed text for primary app'
  );

  expect(res).toEqual({ success: true });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/request_thread_control?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: constants.USER_ID,
    },
    metadata: 'free formed text for primary app',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getSecondaryReceivers', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getSecondaryReceivers();

  expect(res).toEqual([
    { id: '12345678910', name: "David's Composer" },
    { id: '23456789101', name: 'Messenger Rocks' },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/secondary_receivers?fields=id,name&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getThreadOwner', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getThreadOwner(constants.USER_ID);

  expect(res).toEqual({ appId: '12345678910' });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/thread_owner?recipient=USER_ID&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
