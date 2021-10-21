import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #setMyCommands', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setMyCommands({
    commands: [{ command: 'command', description: 'my command' }],
    scope: { type: 'default' },
    languageCode: 'en',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setMyCommands'
  );
  expect(request?.body).toEqual({
    commands: [{ command: 'command', description: 'my command' }],
    scope: { type: 'default' },
    language_code: 'en',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setMyCommands shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setMyCommands(
    [{ command: 'command', description: 'my command' }],
    {
      scope: { type: 'default' },
      languageCode: 'en',
    }
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setMyCommands'
  );
  expect(request?.body).toEqual({
    commands: [{ command: 'command', description: 'my command' }],
    scope: { type: 'default' },
    language_code: 'en',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteMyCommands', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteMyCommands({
    scope: { type: 'default' },
    languageCode: 'en',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteMyCommands'
  );
  expect(request?.body).toEqual({
    scope: { type: 'default' },
    language_code: 'en',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getMyCommands', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getMyCommands({
    scope: { type: 'default' },
    languageCode: 'en',
  });

  expect(res).toEqual([{ command: 'command', description: 'my command' }]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMyCommands'
  );
  expect(request?.body).toEqual({
    scope: { type: 'default' },
    language_code: 'en',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
