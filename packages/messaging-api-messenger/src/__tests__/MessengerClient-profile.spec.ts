import { rest } from 'msw';

import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

const messengerServer = setupMessengerServer();

it('should support #getMessengerProfile', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getMessengerProfile([
    'get_started',
    'persistent_menu',
  ]);

  expect(res).toEqual([
    {
      getStarted: {
        payload: 'GET_STARTED',
      },
    },
    {
      persistentMenu: [
        {
          locale: 'default',
          composerInputDisabled: true,
          callToActions: [
            {
              type: 'postback',
              title: 'Restart Conversation',
              payload: 'RESTART',
            },
          ],
        },
      ],
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=get_started,persistent_menu&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setMessengerProfile', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setMessengerProfile({
    getStarted: {
      payload: 'GET_STARTED',
    },
    persistentMenu: [
      {
        locale: 'default',
        composerInputDisabled: true,
        callToActions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
        ],
      },
    ],
  });

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    get_started: {
      payload: 'GET_STARTED',
    },
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: true,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteMessengerProfile', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteMessengerProfile([
    'get_started',
    'persistent_menu',
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['get_started', 'persistent_menu'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGetStarted', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getGetStarted();

  expect(res).toEqual({
    payload: 'GET_STARTED',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=get_started&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGetStarted to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getGetStarted();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=get_started&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setGetStarted', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setGetStarted('GET_STARTED');

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    get_started: {
      payload: 'GET_STARTED',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteGetStarted', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteGetStarted();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['get_started'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getPersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getPersistentMenu();

  expect(res).toEqual([
    {
      locale: 'default',
      composerInputDisabled: true,
      callToActions: [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
        {
          type: 'web_url',
          title: 'Powered by ALOHA.AI, Yoctol',
          url: 'https://www.yoctol.com/',
        },
      ],
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=persistent_menu&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getPersistentMenu to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getPersistentMenu();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=persistent_menu&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setPersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setPersistentMenu([
    {
      type: 'postback',
      title: 'Restart Conversation',
      payload: 'RESTART',
    },
    {
      type: 'web_url',
      title: 'Powered by ALOHA.AI, Yoctol',
      url: 'https://www.yoctol.com/',
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
          {
            type: 'web_url',
            title: 'Powered by ALOHA.AI, Yoctol',
            url: 'https://www.yoctol.com/',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setPersistentMenu to respond success result if input is a full PersistentMenu, not MenuItem[]', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setPersistentMenu([
    {
      locale: 'default',
      composerInputDisabled: false,
      callToActions: [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
        {
          type: 'web_url',
          title: 'Powered by ALOHA.AI, Yoctol',
          url: 'https://www.yoctol.com/',
        },
      ],
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
          {
            type: 'web_url',
            title: 'Powered by ALOHA.AI, Yoctol',
            url: 'https://www.yoctol.com/',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setPersistentMenu with disabled input', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const items = [
    {
      type: 'postback',
      title: 'Restart Conversation',
      payload: 'RESTART',
    },
  ];

  const res = await messenger.setPersistentMenu(items, {
    composerInputDisabled: true,
  });

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: true,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deletePersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deletePersistentMenu();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['persistent_menu'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getUserPersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getUserPersistentMenu(constants.USER_ID);

  expect(res).toEqual([
    {
      locale: 'default',
      composerInputDisabled: true,
      callToActions: [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
        {
          type: 'web_url',
          title: 'Powered by ALOHA.AI, Yoctol',
          url: 'https://www.yoctol.com/',
        },
      ],
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?psid=USER_ID&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getUserPersistentMenu to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/custom_user_settings',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getUserPersistentMenu(constants.USER_ID);

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?psid=USER_ID&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setUserPersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setUserPersistentMenu(constants.USER_ID, [
    {
      type: 'postback',
      title: 'Restart Conversation',
      payload: 'RESTART',
    },
    {
      type: 'web_url',
      title: 'Powered by ALOHA.AI, Yoctol',
      url: 'https://www.yoctol.com/',
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    psid: 'USER_ID',
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
          {
            type: 'web_url',
            title: 'Powered by ALOHA.AI, Yoctol',
            url: 'https://www.yoctol.com/',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setUserPersistentMenu with full PersistentMenu, not MenuItem[]', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setUserPersistentMenu(constants.USER_ID, [
    {
      locale: 'default',
      composerInputDisabled: false,
      callToActions: [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
        {
          type: 'web_url',
          title: 'Powered by ALOHA.AI, Yoctol',
          url: 'https://www.yoctol.com/',
        },
      ],
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    psid: 'USER_ID',
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
          {
            type: 'web_url',
            title: 'Powered by ALOHA.AI, Yoctol',
            url: 'https://www.yoctol.com/',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setUserPersistentMenu with disabled input', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const items = [
    {
      type: 'postback',
      title: 'Restart Conversation',
      payload: 'RESTART',
    },
  ];

  const res = await messenger.setUserPersistentMenu(constants.USER_ID, items, {
    composerInputDisabled: true,
  });

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    psid: 'USER_ID',
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: true,
        call_to_actions: [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
        ],
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteUserPersistentMenu', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteUserPersistentMenu(constants.USER_ID);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/custom_user_settings?psid=USER_ID&params=[%22persistent_menu%22]&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGreeting', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getGreeting();

  expect(res).toEqual([
    {
      locale: 'default',
      text: 'Hello!',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=greeting&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getGreeting to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getGreeting();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=greeting&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setGreeting', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setGreeting('Hello!');

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    greeting: [
      {
        locale: 'default',
        text: 'Hello!',
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setGreeting with multi-locale greetings', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setGreeting([
    {
      locale: 'default',
      text: 'Hello!',
    },
    {
      locale: 'zh_TW',
      text: '哈囉！',
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    greeting: [
      {
        locale: 'default',
        text: 'Hello!',
      },
      {
        locale: 'zh_TW',
        text: '哈囉！',
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteGreeting', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteGreeting();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['greeting'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getIceBreakers', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getIceBreakers();

  expect(res).toEqual([
    {
      question: 'Where are you located?',
      payload: 'LOCATION_POSTBACK_PAYLOAD',
    },
    {
      question: 'What are your hours?',
      payload: 'HOURS_POSTBACK_PAYLOAD',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=ice_breakers&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getIceBreakers to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getIceBreakers();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=ice_breakers&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setIceBreakers', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setIceBreakers([
    {
      question: 'Where are you located?',
      payload: 'LOCATION_POSTBACK_PAYLOAD',
    },
    {
      question: 'What are your hours?',
      payload: 'HOURS_POSTBACK_PAYLOAD',
    },
  ]);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    ice_breakers: [
      {
        question: 'Where are you located?',
        payload: 'LOCATION_POSTBACK_PAYLOAD',
      },
      {
        question: 'What are your hours?',
        payload: 'HOURS_POSTBACK_PAYLOAD',
      },
    ],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteIceBreakers', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteIceBreakers();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['ice_breakers'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getWhitelistedDomains', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getWhitelistedDomains();

  expect(res).toEqual(['http://www.yoctol.com/']);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=whitelisted_domains&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getWhitelistedDomains to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getWhitelistedDomains();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=whitelisted_domains&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setWhitelistedDomains', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setWhitelistedDomains(['www.yoctol.com']);

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    whitelisted_domains: ['www.yoctol.com'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteWhitelistedDomains', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteWhitelistedDomains();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['whitelisted_domains'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getAccountLinkingURL', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getAccountLinkingURL();

  expect(res).toEqual(
    'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
  );

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=account_linking_url&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getAccountLinkingURL to respond null when data is an empty array', async () => {
  messengerServer.use(
    rest.get(
      'https://graph.facebook.com/:version/me/messenger_profile',
      (_req, res, ctx) => {
        return res(
          ctx.json({
            data: [],
          })
        );
      }
    )
  );

  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getAccountLinkingURL();

  expect(res).toEqual(null);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?fields=account_linking_url&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setAccountLinkingURL', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.setAccountLinkingURL(
    'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
  );

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    account_linking_url:
      'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteAccountLinkingURL', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deleteAccountLinkingURL();

  expect(res).toEqual({
    result: 'success',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messenger_profile?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    fields: ['account_linking_url'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
