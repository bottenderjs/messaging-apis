import ViberClient from '../ViberClient';

import {
  constants,
  getCurrentContext,
  setupViberServer,
} from './testing-library';

setupViberServer();

it('should support #setWebhook with default settings', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const res = await viber.setWebhook('https://4a16faff.ngrok.io/');

  expect(res).toEqual({
    status: 0,
    statusMessage: 'ok',
    eventTypes: [
      'delivered',
      'seen',
      'failed',
      'subscribed',
      'unsubscribed',
      'conversation_started',
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://chatapi.viber.com/pa/set_webhook');
  expect(request?.body).toEqual({ url: 'https://4a16faff.ngrok.io/' });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('X-Viber-Auth-Token')).toBe(
    '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9'
  );
});

it('should support #setWebhook with custom settings', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const reply = {
    status: 0,
    statusMessage: 'ok',
    eventTypes: ['delivered', 'seen', 'conversation_started'],
  };

  const res = await viber.setWebhook('https://4a16faff.ngrok.io/', {
    eventTypes: ['delivered', 'seen', 'conversation_started'],
    sendName: true,
    sendPhoto: true,
  });

  expect(res).toEqual(reply);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://chatapi.viber.com/pa/set_webhook');
  expect(request?.body).toEqual({
    url: 'https://4a16faff.ngrok.io/',
    event_types: ['delivered', 'seen', 'conversation_started'],
    send_name: true,
    send_photo: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('X-Viber-Auth-Token')).toBe(
    '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9'
  );
});

it('should support #removeWebhook', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const res = await viber.removeWebhook();

  expect(res).toEqual({
    status: 0,
    statusMessage: 'ok',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://chatapi.viber.com/pa/set_webhook');
  expect(request?.body).toEqual({ url: '' });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('X-Viber-Auth-Token')).toBe(
    '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9'
  );
});
