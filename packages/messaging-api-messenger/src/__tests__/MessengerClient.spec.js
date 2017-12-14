import fs from 'fs';

import MockAdapter from 'axios-mock-adapter';
import FormData from 'form-data';

import Messenger from '../Messenger';
import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const APP_SECRET = '1WDVGY78';

const createMock = () => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

let axios;
let _create;
beforeEach(() => {
  axios = require('axios'); // eslint-disable-line global-require
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

describe('connect', () => {
  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.11/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN, '2.6');

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('constructor', () => {
  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.11/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN, '2.6'); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('#version', () => {
  it('should return version of graph api', () => {
    expect(new MessengerClient(ACCESS_TOKEN).version).toEqual('2.11');
    expect(new MessengerClient(ACCESS_TOKEN, 'v2.6').version).toEqual('2.6');
    expect(new MessengerClient(ACCESS_TOKEN, '2.6').version).toEqual('2.6');
    expect(() => {
      // eslint-disable-next-line no-new
      new MessengerClient(ACCESS_TOKEN, 2.6);
    }).toThrow('Type of `version` must be string.');
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new MessengerClient(ACCESS_TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#accessToken', () => {
  it('should return underlying access token', () => {
    const client = new MessengerClient(ACCESS_TOKEN);
    expect(client.accessToken).toBe(ACCESS_TOKEN);
  });
});

describe('page info', () => {
  describe('#getPageInfo', () => {
    it('should response page info', async () => {
      const { client, mock } = createMock();
      const reply = {
        name: 'Bot Demo',
        id: '1895382890692546',
      };

      mock.onGet(`/me?access_token=${ACCESS_TOKEN}`).reply(200, reply);

      const res = await client.getPageInfo();

      expect(res).toEqual(reply);
    });
  });
});

describe('subscription', () => {
  describe('#createSubscription', () => {
    it('should set default fields', async () => {
      const { client, mock } = createMock();
      const reply = {
        success: true,
      };

      mock
        .onPost(`/54321/subscriptions?access_token=${ACCESS_TOKEN}`, {
          object: 'page',
          callback_url: 'https://mycallback.com',
          fields:
            'messages,messaging_postbacks,messaging_optins,messaging_referrals,messaging_handovers,messaging_policy_enforcement',
          verify_token: '1234567890',
        })
        .reply(200, reply);

      const res = await client.createSubscription({
        app_id: '54321',
        callback_url: 'https://mycallback.com',
        verify_token: '1234567890',
      });

      expect(res).toEqual(reply);
    });

    it('should set other optional parameters', async () => {
      const { client, mock } = createMock();
      const reply = {
        success: true,
      };

      mock
        .onPost(`/54321/subscriptions?access_token=${ACCESS_TOKEN}`, {
          object: 'user',
          callback_url: 'https://mycallback.com',
          fields: 'messages,messaging_postbacks',
          verify_token: '1234567890',
          include_values: true,
        })
        .reply(200, reply);

      const res = await client.createSubscription({
        app_id: '54321',
        callback_url: 'https://mycallback.com',
        verify_token: '1234567890',
        object: 'user',
        fields: ['messages', 'messaging_postbacks'],
        include_values: true,
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('user profile', () => {
  describe('#getUserProfile', () => {
    it('should response user profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        first_name: 'Kevin',
        last_name: 'Durant',
        profile_pic: 'https://example.com/pic.png',
        locale: 'en_US',
        timezone: 8,
        gender: 'male',
      };

      mock.onGet(`/1?access_token=${ACCESS_TOKEN}`).reply(200, reply);

      const res = await client.getUserProfile('1');

      expect(res).toEqual(reply);
    });
  });
});

describe('messenger profile', () => {
  describe('#getMessengerProfile', () => {
    it('should response data of get messenger profile', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            get_started: {
              payload: 'GET_STARTED',
            },
          },
          {
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
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=get_started,persistent_menu&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(res).toEqual([
        {
          get_started: {
            payload: 'GET_STARTED',
          },
        },
        {
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
        },
      ]);
    });
  });

  describe('#setMessengerProfile', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
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
        })
        .reply(200, reply);

      const res = await client.setMessengerProfile({
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

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteMessengerProfile', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['get_started', 'persistent_menu'],
        })
        .reply(200, reply);

      const res = await client.deleteMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(res).toEqual(reply);
    });
  });
});

describe('get started button', () => {
  describe('#getGetStarted', () => {
    it('should response data of get started button', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            get_started: {
              payload: 'GET_STARTED',
            },
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getGetStarted();

      expect(res).toEqual({
        payload: 'GET_STARTED',
      });
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getGetStarted();

      expect(res).toEqual(null);
    });
  });

  describe('#setGetStarted', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          get_started: {
            payload: 'GET_STARTED',
          },
        })
        .reply(200, reply);

      const res = await client.setGetStarted('GET_STARTED');

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGetStarted', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['get_started'],
        })
        .reply(200, reply);

      const res = await client.deleteGetStarted();

      expect(res).toEqual(reply);
    });
  });
});

describe('persistent menu', () => {
  describe('#getPersistentMenu', () => {
    it('should response data of persistent menu', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
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
                  {
                    type: 'web_url',
                    title: 'Powered by ALOHA.AI, Yoctol',
                    url: 'https://www.yoctol.com/',
                  },
                ],
              },
            ],
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=persistent_menu&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getPersistentMenu();

      expect(res).toEqual([
        {
          locale: 'default',
          composer_input_disabled: true,
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
      ]);
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=persistent_menu&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getPersistentMenu();

      expect(res).toEqual(null);
    });
  });

  describe('#setPersistentMenu', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
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
        })
        .reply(200, reply);

      const items = [
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
      ];

      const res = await client.setPersistentMenu(items);

      expect(res).toEqual(reply);
    });

    it('should response success result if input is a full PersistentMenu, not Array<MenuItem>', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          persistent_menu: [
            {
              locale: 'default',
              call_to_actions: [
                {
                  title: 'Play Again',
                  type: 'postback',
                  payload: 'RESTART',
                },
                {
                  title: 'Language Setting',
                  type: 'nested',
                  call_to_actions: [
                    {
                      title: '中文',
                      type: 'postback',
                      payload: 'CHINESE',
                    },
                    {
                      title: 'English',
                      type: 'postback',
                      payload: 'ENGLISH',
                    },
                  ],
                },
                {
                  title: 'Explore D',
                  type: 'nested',
                  call_to_actions: [
                    {
                      title: 'Explore',
                      type: 'web_url',
                      url: 'https://www.youtube.com/watch?v=v',
                      webview_height_ratio: 'tall',
                    },
                    {
                      title: 'W',
                      type: 'web_url',
                      url: 'https://www.facebook.com/w',
                      webview_height_ratio: 'tall',
                    },
                    {
                      title: 'Powered by YOCTOL',
                      type: 'web_url',
                      url: 'https://www.yoctol.com/',
                      webview_height_ratio: 'tall',
                    },
                  ],
                },
              ],
            },
            {
              locale: 'zh_TW',
              call_to_actions: [
                {
                  title: '重新開始',
                  type: 'postback',
                  payload: 'RESTART',
                },
                {
                  title: '語言設定',
                  type: 'nested',
                  call_to_actions: [
                    {
                      title: '中文',
                      type: 'postback',
                      payload: 'CHINESE',
                    },
                    {
                      title: 'English',
                      type: 'postback',
                      payload: 'ENGLISH',
                    },
                  ],
                },
                {
                  title: '探索敦化南路',
                  type: 'nested',
                  call_to_actions: [
                    {
                      title: '《敦化南路》預告片',
                      type: 'web_url',
                      url: 'https://www.youtube.com/watch?v=v',
                      webview_height_ratio: 'tall',
                    },
                    {
                      title: '華',
                      type: 'web_url',
                      url: 'https://www.facebook.com/w',
                      webview_height_ratio: 'tall',
                    },
                    {
                      title: 'Powered by YOCTOL',
                      type: 'web_url',
                      url: 'https://www.yoctol.com/',
                      webview_height_ratio: 'tall',
                    },
                  ],
                },
              ],
            },
          ],
        })
        .reply(200, reply);

      const items = [
        {
          locale: 'default',
          call_to_actions: [
            {
              title: 'Play Again',
              type: 'postback',
              payload: 'RESTART',
            },
            {
              title: 'Language Setting',
              type: 'nested',
              call_to_actions: [
                {
                  title: '中文',
                  type: 'postback',
                  payload: 'CHINESE',
                },
                {
                  title: 'English',
                  type: 'postback',
                  payload: 'ENGLISH',
                },
              ],
            },
            {
              title: 'Explore D',
              type: 'nested',
              call_to_actions: [
                {
                  title: 'Explore',
                  type: 'web_url',
                  url: 'https://www.youtube.com/watch?v=v',
                  webview_height_ratio: 'tall',
                },
                {
                  title: 'W',
                  type: 'web_url',
                  url: 'https://www.facebook.com/w',
                  webview_height_ratio: 'tall',
                },
                {
                  title: 'Powered by YOCTOL',
                  type: 'web_url',
                  url: 'https://www.yoctol.com/',
                  webview_height_ratio: 'tall',
                },
              ],
            },
          ],
        },
        {
          locale: 'zh_TW',
          call_to_actions: [
            {
              title: '重新開始',
              type: 'postback',
              payload: 'RESTART',
            },
            {
              title: '語言設定',
              type: 'nested',
              call_to_actions: [
                {
                  title: '中文',
                  type: 'postback',
                  payload: 'CHINESE',
                },
                {
                  title: 'English',
                  type: 'postback',
                  payload: 'ENGLISH',
                },
              ],
            },
            {
              title: '探索敦化南路',
              type: 'nested',
              call_to_actions: [
                {
                  title: '《敦化南路》預告片',
                  type: 'web_url',
                  url: 'https://www.youtube.com/watch?v=v',
                  webview_height_ratio: 'tall',
                },
                {
                  title: '華',
                  type: 'web_url',
                  url: 'https://www.facebook.com/w',
                  webview_height_ratio: 'tall',
                },
                {
                  title: 'Powered by YOCTOL',
                  type: 'web_url',
                  url: 'https://www.yoctol.com/',
                  webview_height_ratio: 'tall',
                },
              ],
            },
          ],
        },
      ];

      const res = await client.setPersistentMenu(items);

      expect(res).toEqual(reply);
    });

    it('should support disabled input', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
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
        })
        .reply(200, reply);

      const items = [
        {
          type: 'postback',
          title: 'Restart Conversation',
          payload: 'RESTART',
        },
      ];

      const res = await client.setPersistentMenu(items, {
        composer_input_disabled: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deletePersistentMenu', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['persistent_menu'],
        })
        .reply(200, reply);

      const res = await client.deletePersistentMenu();

      expect(res).toEqual(reply);
    });
  });
});

describe('greeting text', () => {
  describe('#getGreeting', () => {
    it('should response data of greeting text', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            greeting: [
              {
                locale: 'default',
                text: 'Hello!',
              },
            ],
          },
        ],
      };

      mock.onGet().reply(200, reply);

      const res = await client.getGreeting();

      expect(res).toEqual([
        {
          locale: 'default',
          text: 'Hello!',
        },
      ]);
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock.onGet().reply(200, reply);

      const res = await client.getGreeting();

      expect(res).toEqual(null);
    });
  });

  describe('#setGreeting', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          greeting: [
            {
              locale: 'default',
              text: 'Hello!',
            },
          ],
        })
        .reply(200, reply);

      const res = await client.setGreeting('Hello!');

      expect(res).toEqual(reply);
    });

    it('should response success result if input is multi-locale greeting texts', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
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
        })
        .reply(200, reply);

      const res = await client.setGreeting([
        {
          locale: 'default',
          text: 'Hello!',
        },
        {
          locale: 'zh_TW',
          text: '哈囉！',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGreeting', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['greeting'],
        })
        .reply(200, reply);

      const res = await client.deleteGreeting();

      expect(res).toEqual(reply);
    });
  });
});

describe('whitelisted domains', () => {
  describe('#getWhitelistedDomains', () => {
    it('should response data of whitelisted domains', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            whitelisted_domains: ['http://www.yoctol.com/'],
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=whitelisted_domains&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getWhitelistedDomains();

      expect(res).toEqual(['http://www.yoctol.com/']);
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=whitelisted_domains&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getWhitelistedDomains();

      expect(res).toEqual(null);
    });
  });

  describe('#setWhitelistedDomains', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          whitelisted_domains: ['www.yoctol.com'],
        })
        .reply(200, reply);

      const res = await client.setWhitelistedDomains(['www.yoctol.com']);

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteWhitelistedDomains', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['whitelisted_domains'],
        })
        .reply(200, reply);

      const res = await client.deleteWhitelistedDomains();

      expect(res).toEqual(reply);
    });
  });
});

describe('account linking url', () => {
  describe('#getAccountLinkingURL', () => {
    it('should response data of account linking url', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            account_linking_url:
              'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=account_linking_url&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getAccountLinkingURL();

      expect(res).toEqual({
        account_linking_url:
          'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
      });
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=account_linking_url&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getAccountLinkingURL();

      expect(res).toEqual(null);
    });
  });

  describe('#setAccountLinkingURL', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          account_linking_url:
            'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
        })
        .reply(200, reply);

      const res = await client.setAccountLinkingURL(
        'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteAccountLinkingURL', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['account_linking_url'],
        })
        .reply(200, reply);

      const res = await client.deleteAccountLinkingURL();

      expect(res).toEqual(reply);
    });
  });
});

describe('payment settings', () => {
  describe('#getPaymentSettings', () => {
    it('should response data of payment settings', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            privacy_url: 'www.facebook.com',
            public_key: 'YOUR_PUBLIC_KEY',
            test_users: ['12345678'],
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=payment_settings&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getPaymentSettings();

      expect(res).toEqual({
        privacy_url: 'www.facebook.com',
        public_key: 'YOUR_PUBLIC_KEY',
        test_users: ['12345678'],
      });
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=payment_settings&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getPaymentSettings();

      expect(res).toEqual(null);
    });
  });

  describe('#setPaymentPrivacyPolicyURL', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          payment_settings: {
            privacy_url: 'https://www.example.com',
          },
        })
        .reply(200, reply);

      const res = await client.setPaymentPrivacyPolicyURL(
        'https://www.example.com'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#setPaymentPublicKey', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          payment_settings: {
            public_key: 'YOUR_PUBLIC_KEY',
          },
        })
        .reply(200, reply);

      const res = await client.setPaymentPublicKey('YOUR_PUBLIC_KEY');

      expect(res).toEqual(reply);
    });
  });

  describe('#setPaymentTestUsers', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          payment_settings: {
            test_users: ['12345678'],
          },
        })
        .reply(200, reply);

      const res = await client.setPaymentTestUsers(['12345678']);

      expect(res).toEqual(reply);
    });
  });

  describe('#deletePaymentSettings', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['payment_settings'],
        })
        .reply(200, reply);

      const res = await client.deletePaymentSettings();

      expect(res).toEqual(reply);
    });
  });
});

describe('target audience', () => {
  describe('#getTargetAudience', () => {
    it('should response data of target audience', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            audience_type: 'custom',
            countries: {
              whitelist: ['US', 'CA'],
            },
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=target_audience&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getTargetAudience();

      expect(res).toEqual({
        audience_type: 'custom',
        countries: {
          whitelist: ['US', 'CA'],
        },
      });
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=target_audience&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getTargetAudience();

      expect(res).toEqual(null);
    });
  });

  describe('#setTargetAudience', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          target_audience: {
            audience_type: 'custom',
            countries: {
              whitelist: ['US', 'CA'],
              blacklist: ['UK'],
            },
          },
        })
        .reply(200, reply);

      const res = await client.setTargetAudience(
        'custom',
        ['US', 'CA'],
        ['UK']
      );

      expect(res).toEqual(reply);
    });

    it('should use default value', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          target_audience: {
            audience_type: 'custom',
            countries: {
              whitelist: [],
              blacklist: [],
            },
          },
        })
        .reply(200, reply);

      const res = await client.setTargetAudience('custom');

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteTargetAudience', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['target_audience'],
        })
        .reply(200, reply);

      const res = await client.deleteTargetAudience();

      expect(res).toEqual(reply);
    });
  });
});

describe('chat extension home URL', () => {
  describe('#getHomeURL', () => {
    it('should response data of target audience', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            url: 'http://petershats.com/send-a-hat',
            webview_height_ratio: 'tall',
            in_test: true,
          },
        ],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=home_url&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getHomeURL();

      expect(res).toEqual({
        url: 'http://petershats.com/send-a-hat',
        webview_height_ratio: 'tall',
        in_test: true,
      });
    });

    it('should response null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      mock
        .onGet(
          `/me/messenger_profile?fields=home_url&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getHomeURL();

      expect(res).toEqual(null);
    });
  });

  describe('#setHomeURL', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onPost(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          home_url: {
            url: 'http://petershats.com/send-a-hat',
            webview_height_ratio: 'tall',
            in_test: true,
          },
        })
        .reply(200, reply);

      const res = await client.setHomeURL('http://petershats.com/send-a-hat', {
        webview_height_ratio: 'tall',
        in_test: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteHomeURL', () => {
    it('should response success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      mock
        .onDelete(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`, {
          fields: ['home_url'],
        })
        .reply(200, reply);

      const res = await client.deleteHomeURL();

      expect(res).toEqual(reply);
    });
  });
});

describe('message tags', () => {
  describe('#getMessageTags', () => {
    it('should response data of message tags', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            tag: 'SHIPPING_UPDATE',
            description:
              'The shipping_update tag may only be used to provide a shipping status notification for a product that has already been purchased. For example, when the product is shipped, in-transit, delivered, or delayed. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'RESERVATION_UPDATE',
            description:
              'The reservation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in itinerary, location, or a cancellation (such as when a hotel booking is canceled, a car rental pick-up time changes, or a room upgrade is confirmed). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'ISSUE_RESOLUTION',
            description:
              'The issue_resolution tag may only be used to respond to a customer service issue surfaced in a Messenger conversation after a transaction has taken place. This tag is intended for use cases where the business requires more than 24 hours to resolve an issue and needs to give someone a status update and/or gather additional information. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements, nor can businesses use the tag to proactively message people to solicit feedback).',
          },
          {
            tag: 'APPOINTMENT_UPDATE',
            description:
              'The appointment_update tag may only be used to provide updates about an existing appointment. For example, when there is a change in time, a location update or a cancellation (such as when a spa treatment is canceled, a real estate agent needs to meet you at a new location or a dental office proposes a new appointment time). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'GAME_EVENT',
            description:
              'The game_event tag may only be used to provide an update on user progression, a global event in a game or a live sporting event. For example, when a person’s crops are ready to be collected, their building is finished, their daily tournament is about to start or their favorite soccer team is about to play. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'TRANSPORTATION_UPDATE',
            description:
              'The transportation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in status of any flight, train or ferry reservation (such as “ride canceled”, “trip started” or “ferry arrived”). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'FEATURE_FUNCTIONALITY_UPDATE',
            description:
              'The feature_functionality_update tag may only be used to provide an update on new features or functionality that become available in a bot. For example, announcing the ability to talk to a live agent in a bot, or that the bot has a new skill. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
          {
            tag: 'TICKET_UPDATE',
            description:
              'The ticket_update tag may only be used to provide updates pertaining to an event for which a person already has a ticket. For example, when there is a change in time, a location update or a cancellation (such as when a concert is canceled, the venue has changed or a refund opportunity is available). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
          },
        ],
      };

      mock
        .onGet(`/page_message_tags?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getMessageTags();

      expect(res).toEqual([
        {
          tag: 'SHIPPING_UPDATE',
          description:
            'The shipping_update tag may only be used to provide a shipping status notification for a product that has already been purchased. For example, when the product is shipped, in-transit, delivered, or delayed. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'RESERVATION_UPDATE',
          description:
            'The reservation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in itinerary, location, or a cancellation (such as when a hotel booking is canceled, a car rental pick-up time changes, or a room upgrade is confirmed). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'ISSUE_RESOLUTION',
          description:
            'The issue_resolution tag may only be used to respond to a customer service issue surfaced in a Messenger conversation after a transaction has taken place. This tag is intended for use cases where the business requires more than 24 hours to resolve an issue and needs to give someone a status update and/or gather additional information. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements, nor can businesses use the tag to proactively message people to solicit feedback).',
        },
        {
          tag: 'APPOINTMENT_UPDATE',
          description:
            'The appointment_update tag may only be used to provide updates about an existing appointment. For example, when there is a change in time, a location update or a cancellation (such as when a spa treatment is canceled, a real estate agent needs to meet you at a new location or a dental office proposes a new appointment time). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'GAME_EVENT',
          description:
            'The game_event tag may only be used to provide an update on user progression, a global event in a game or a live sporting event. For example, when a person’s crops are ready to be collected, their building is finished, their daily tournament is about to start or their favorite soccer team is about to play. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'TRANSPORTATION_UPDATE',
          description:
            'The transportation_update tag may only be used to confirm updates to an existing reservation. For example, when there is a change in status of any flight, train or ferry reservation (such as “ride canceled”, “trip started” or “ferry arrived”). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'FEATURE_FUNCTIONALITY_UPDATE',
          description:
            'The feature_functionality_update tag may only be used to provide an update on new features or functionality that become available in a bot. For example, announcing the ability to talk to a live agent in a bot, or that the bot has a new skill. This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
        {
          tag: 'TICKET_UPDATE',
          description:
            'The ticket_update tag may only be used to provide updates pertaining to an event for which a person already has a ticket. For example, when there is a change in time, a location update or a cancellation (such as when a concert is canceled, the venue has changed or a refund opportunity is available). This tag cannot be used for use cases beyond those listed above or for promotional content (ex: daily deals, coupons and discounts, or sale announcements).',
        },
      ]);
    });
  });
});

describe('send api', () => {
  describe('#sendRawBody', () => {
    it('should call messages api', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      const customAccessToken = '0987654321';

      mock
        .onPost(`/me/messages?access_token=${customAccessToken}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          access_token: customAccessToken,
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          text: 'Hello!',
        },
        access_token: customAccessToken,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMessage', () => {
    it('should call messages api with default UPDATE type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(USER_ID, {
        text: 'Hello!',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api with MESSAGE_TAG type when tag exists', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'MESSAGE_TAG',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          tag: 'ISSUE_RESOLUTION',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api with RESPONSE type when it provided as messaging_type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'RESPONSE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          messaging_type: 'RESPONSE',
        }
      );

      expect(res).toEqual(reply);
    });

    it('can call messages api using recipient with phone_number', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            phone_number: '+1(212)555-2368',
            name: { first_name: 'John', last_name: 'Doe' },
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
        {
          text: 'Hello!',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should attatch quick_replies to message', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Search',
                payload: '<POSTBACK_PAYLOAD>',
                image_url: 'http://example.com/img/red.png',
              },
              {
                content_type: 'location',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendMessage(
        USER_ID,
        {
          text: 'Hello!',
        },
        {
          quick_replies: [
            {
              content_type: 'text',
              title: 'Search',
              payload: '<POSTBACK_PAYLOAD>',
              image_url: 'http://example.com/img/red.png',
            },
            {
              content_type: 'location',
            },
          ],
        }
      );

      expect(res).toEqual(reply);
    });

    it('should throw if quick_replies length > 11', async () => {
      const { client } = createMock();

      const lotsOfQuickReplies = new Array(12).fill({
        content_type: 'text',
        title: 'Red',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
      });

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          { quick_replies: lotsOfQuickReplies }
        );
      }).toThrow('quick_replies is an array and limited to 11');
    });

    it('should throw if title length > 20', async () => {
      const { client } = createMock();

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          {
            quick_replies: [
              {
                content_type: 'text',
                title: 'RedRedRedRedRedRedRedRed',
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
              },
            ],
          }
        );
      }).toThrow(
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );
    });

    it('should throw if payload length > 1000', async () => {
      const { client } = createMock();

      const longString = new Array(1001).fill('x').join('');

      expect(() => {
        client.sendMessage(
          USER_ID,
          { text: 'Pick a color:' },
          {
            quick_replies: [
              {
                content_type: 'text',
                title: 'Red',
                payload: longString,
              },
            ],
          }
        );
      }).toThrow('payload of quick reply has a 1000 character limit');
    });
  });

  describe('#sendAttachment', () => {
    it('should call messages api with attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAttachment(USER_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call messages api with text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendText(USER_ID, 'Hello!');

      expect(res).toEqual(reply);
    });

    it('should call messages api with issue resolution text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'MESSAGE_TAG',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Hello!',
          },
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendText(USER_ID, 'Hello!', {
        tag: 'ISSUE_RESOLUTION',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAudio', () => {
    it('can call api with audio url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                url: 'https://example.com/audio.mp3',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAudio(
        USER_ID,
        'https://example.com/audio.mp3'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with audio attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAudio(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendAudio(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendImage', () => {
    it('can call api with image url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'https://example.com/pic.png',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(
        USER_ID,
        'https://example.com/pic.png'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with image attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendImage(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('can call api with video url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: 'https://example.com/video.mp4',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(
        USER_ID,
        'https://example.com/video.mp4'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with video attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'video',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendVideo(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFile', () => {
    it('can call api with file url', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'file',
              payload: {
                url: 'https://example.com/word.docx',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendFile(
        USER_ID,
        'https://example.com/word.docx'
      );

      expect(res).toEqual(reply);
    });

    it('can call api with file attachment_id', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'file',
              payload: {
                attachment_id: '55688',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendFile(USER_ID, {
        attachment_id: '55688',
      });

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock.onPost(`/me/messages?access_token=${ACCESS_TOKEN}`).reply(config => {
        expect(config.data).toBeInstanceOf(FormData);

        return [200, reply];
      });

      const res = await client.sendFile(USER_ID, fs.createReadStream('./'));

      expect(res).toEqual(reply);
    });
  });

  describe('#sendTemplate', () => {
    it('should call messages api with template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendTemplate(USER_ID, {
        template_type: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendButtonTemplate', () => {
    it('should call messages api with button template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'title',
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendButtonTemplate(USER_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  const templateElements = [
    {
      title: "Welcome to Peter's Hats",
      image_url: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "We've got the right hat for everyone.",
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      ],
    },
  ];
  const templateMessage = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: templateElements,
        image_aspect_ratio: 'horizontal',
      },
    },
  };

  describe('#sendGenericTemplate', () => {
    it('should call messages api with generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: templateMessage,
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements);

      expect(res).toEqual(reply);
    });

    it('can use square generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: templateElements,
                image_aspect_ratio: 'square',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements, {
        image_aspect_ratio: 'square',
      });

      expect(res).toEqual(reply);
    });

    it('can use generic template with tag', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'MESSAGE_TAG',
          recipient: {
            id: USER_ID,
          },
          message: templateMessage,
          tag: 'SHIPPING_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(USER_ID, templateElements, {
        tag: 'SHIPPING_UPDATE',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendListTemplate', () => {
    it('should call messages api with list template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'list',
                elements: [
                  {
                    title: 'Classic T-Shirt Collection',
                    image_url:
                      'https://peterssendreceiveapp.ngrok.io/img/collection.png',
                    subtitle: 'See all our colors',
                    default_action: {
                      type: 'web_url',
                      url:
                        'https://peterssendreceiveapp.ngrok.io/shop_collection',
                      messenger_extensions: true,
                      webview_height_ratio: 'tall',
                      fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                    },
                    buttons: [
                      {
                        title: 'View',
                        type: 'web_url',
                        url: 'https://peterssendreceiveapp.ngrok.io/collection',
                        messenger_extensions: true,
                        webview_height_ratio: 'tall',
                        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                      },
                    ],
                  },
                ],
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
                top_element_style: 'compact',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendListTemplate(
        USER_ID,
        [
          {
            title: 'Classic T-Shirt Collection',
            image_url:
              'https://peterssendreceiveapp.ngrok.io/img/collection.png',
            subtitle: 'See all our colors',
            default_action: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
              messenger_extensions: true,
              webview_height_ratio: 'tall',
              fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                title: 'View',
                type: 'web_url',
                url: 'https://peterssendreceiveapp.ngrok.io/collection',
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
              },
            ],
          },
        ],
        [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
        { top_element_style: 'compact' }
      );

      expect(res).toEqual(reply);
    });

    it('should use top_element_style default value', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'list',
                elements: [
                  {
                    title: 'Classic T-Shirt Collection',
                    image_url:
                      'https://peterssendreceiveapp.ngrok.io/img/collection.png',
                    subtitle: 'See all our colors',
                    default_action: {
                      type: 'web_url',
                      url:
                        'https://peterssendreceiveapp.ngrok.io/shop_collection',
                      messenger_extensions: true,
                      webview_height_ratio: 'tall',
                      fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                    },
                    buttons: [
                      {
                        title: 'View',
                        type: 'web_url',
                        url: 'https://peterssendreceiveapp.ngrok.io/collection',
                        messenger_extensions: true,
                        webview_height_ratio: 'tall',
                        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
                      },
                    ],
                  },
                ],
                buttons: [
                  {
                    type: 'postback',
                    title: 'Start Chatting',
                    payload: 'USER_DEFINED_PAYLOAD',
                  },
                ],
                top_element_style: 'large',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendListTemplate(
        USER_ID,
        [
          {
            title: 'Classic T-Shirt Collection',
            image_url:
              'https://peterssendreceiveapp.ngrok.io/img/collection.png',
            subtitle: 'See all our colors',
            default_action: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
              messenger_extensions: true,
              webview_height_ratio: 'tall',
              fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                title: 'View',
                type: 'web_url',
                url: 'https://peterssendreceiveapp.ngrok.io/collection',
                messenger_extensions: true,
                webview_height_ratio: 'tall',
                fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
              },
            ],
          },
        ],
        [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ]
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendOpenGraphTemplate', () => {
    it('should call messages api with open graph template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'open_graph',
                elements: [
                  {
                    url:
                      'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
                    buttons: [
                      {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Rickrolling',
                        title: 'View More',
                      },
                    ],
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendOpenGraphTemplate(USER_ID, [
        {
          url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
          buttons: [
            {
              type: 'web_url',
              url: 'https://en.wikipedia.org/wiki/Rickrolling',
              title: 'View More',
            },
          ],
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMediaTemplate', () => {
    it('should call messages api with media template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.$cAAJsujCd2ORj_1qmrFdzhVa-4cvO',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'media',
                elements: [
                  {
                    media_type: 'image',
                    attachment_id: '1854626884821032',
                    buttons: [
                      {
                        type: 'web_url',
                        url: '<WEB_URL>',
                        title: 'View Website',
                      },
                    ],
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendMediaTemplate(USER_ID, [
        {
          media_type: 'image',
          attachment_id: '1854626884821032',
          buttons: [
            {
              type: 'web_url',
              url: '<WEB_URL>',
              title: 'View Website',
            },
          ],
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendReceiptTemplate', () => {
    it('should call messages api with receipt template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'receipt',
                recipient_name: 'Stephane Crozatier',
                order_number: '12345678902',
                currency: 'USD',
                payment_method: 'Visa 2345',
                order_url:
                  'http://petersapparel.parseapp.com/order?order_id=123456',
                timestamp: '1428444852',
                elements: [
                  {
                    title: 'Classic White T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 2,
                    price: 50,
                    currency: 'USD',
                    image_url:
                      'http://petersapparel.parseapp.com/img/whiteshirt.png',
                  },
                  {
                    title: 'Classic Gray T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 1,
                    price: 25,
                    currency: 'USD',
                    image_url:
                      'http://petersapparel.parseapp.com/img/grayshirt.png',
                  },
                ],
                address: {
                  street_1: '1 Hacker Way',
                  street_2: '',
                  city: 'Menlo Park',
                  postal_code: '94025',
                  state: 'CA',
                  country: 'US',
                },
                summary: {
                  subtotal: 75.0,
                  shipping_cost: 4.95,
                  total_tax: 6.19,
                  total_cost: 56.14,
                },
                adjustments: [
                  {
                    name: 'New Customer Discount',
                    amount: 20,
                  },
                  {
                    name: '$10 Off Coupon',
                    amount: 10,
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendReceiptTemplate(USER_ID, {
        recipient_name: 'Stephane Crozatier',
        order_number: '12345678902',
        currency: 'USD',
        payment_method: 'Visa 2345',
        order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
        timestamp: '1428444852',
        elements: [
          {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
          },
          {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png',
          },
        ],
        address: {
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'Menlo Park',
          postal_code: '94025',
          state: 'CA',
          country: 'US',
        },
        summary: {
          subtotal: 75.0,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14,
        },
        adjustments: [
          {
            name: 'New Customer Discount',
            amount: 20,
          },
          {
            name: '$10 Off Coupon',
            amount: 10,
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineBoardingPassTemplate', () => {
    it('should call messages api with airline boardingpass template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'airline_boardingpass',
                intro_message: 'You are checked in.',
                locale: 'en_US',
                boarding_pass: [
                  {
                    passenger_name: 'SMITH/NICOLAS',
                    pnr_number: 'CG4X7U',
                    travel_class: 'business',
                    seat: '74J',
                    auxiliary_fields: [
                      {
                        label: 'Terminal',
                        value: 'T1',
                      },
                      {
                        label: 'Departure',
                        value: '30OCT 19:05',
                      },
                    ],
                    secondary_fields: [
                      {
                        label: 'Boarding',
                        value: '18:30',
                      },
                      {
                        label: 'Gate',
                        value: 'D57',
                      },
                      {
                        label: 'Seat',
                        value: '74J',
                      },
                      {
                        label: 'Sec.Nr.',
                        value: '003',
                      },
                    ],
                    logo_image_url: 'https://www.example.com/en/logo.png',
                    header_image_url:
                      'https://www.example.com/en/fb/header.png',
                    qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
                    above_bar_code_image_url:
                      'https://www.example.com/en/PLAT.png',
                    flight_info: {
                      flight_number: 'KL0642',
                      departure_airport: {
                        airport_code: 'JFK',
                        city: 'New York',
                        terminal: 'T1',
                        gate: 'D57',
                      },
                      arrival_airport: {
                        airport_code: 'AMS',
                        city: 'Amsterdam',
                      },
                      flight_schedule: {
                        departure_time: '2016-01-02T19:05',
                        arrival_time: '2016-01-05T17:30',
                      },
                    },
                  },
                  {
                    passenger_name: 'JONES/FARBOUND',
                    pnr_number: 'CG4X7U',
                    travel_class: 'business',
                    seat: '74K',
                    auxiliary_fields: [
                      {
                        label: 'Terminal',
                        value: 'T1',
                      },
                      {
                        label: 'Departure',
                        value: '30OCT 19:05',
                      },
                    ],
                    secondary_fields: [
                      {
                        label: 'Boarding',
                        value: '18:30',
                      },
                      {
                        label: 'Gate',
                        value: 'D57',
                      },
                      {
                        label: 'Seat',
                        value: '74K',
                      },
                      {
                        label: 'Sec.Nr.',
                        value: '004',
                      },
                    ],
                    logo_image_url: 'https://www.example.com/en/logo.png',
                    header_image_url:
                      'https://www.example.com/en/fb/header.png',
                    qr_code:
                      'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
                    above_bar_code_image_url:
                      'https://www.example.com/en/PLAT.png',
                    flight_info: {
                      flight_number: 'KL0642',
                      departure_airport: {
                        airport_code: 'JFK',
                        city: 'New York',
                        terminal: 'T1',
                        gate: 'D57',
                      },
                      arrival_airport: {
                        airport_code: 'AMS',
                        city: 'Amsterdam',
                      },
                      flight_schedule: {
                        departure_time: '2016-01-02T19:05',
                        arrival_time: '2016-01-05T17:30',
                      },
                    },
                  },
                ],
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineBoardingPassTemplate(USER_ID, {
        intro_message: 'You are checked in.',
        locale: 'en_US',
        boarding_pass: [
          {
            passenger_name: 'SMITH/NICOLAS',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74J',
            auxiliary_fields: [
              {
                label: 'Terminal',
                value: 'T1',
              },
              {
                label: 'Departure',
                value: '30OCT 19:05',
              },
            ],
            secondary_fields: [
              {
                label: 'Boarding',
                value: '18:30',
              },
              {
                label: 'Gate',
                value: 'D57',
              },
              {
                label: 'Seat',
                value: '74J',
              },
              {
                label: 'Sec.Nr.',
                value: '003',
              },
            ],
            logo_image_url: 'https://www.example.com/en/logo.png',
            header_image_url: 'https://www.example.com/en/fb/header.png',
            qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
            flight_info: {
              flight_number: 'KL0642',
              departure_airport: {
                airport_code: 'JFK',
                city: 'New York',
                terminal: 'T1',
                gate: 'D57',
              },
              arrival_airport: {
                airport_code: 'AMS',
                city: 'Amsterdam',
              },
              flight_schedule: {
                departure_time: '2016-01-02T19:05',
                arrival_time: '2016-01-05T17:30',
              },
            },
          },
          {
            passenger_name: 'JONES/FARBOUND',
            pnr_number: 'CG4X7U',
            travel_class: 'business',
            seat: '74K',
            auxiliary_fields: [
              {
                label: 'Terminal',
                value: 'T1',
              },
              {
                label: 'Departure',
                value: '30OCT 19:05',
              },
            ],
            secondary_fields: [
              {
                label: 'Boarding',
                value: '18:30',
              },
              {
                label: 'Gate',
                value: 'D57',
              },
              {
                label: 'Seat',
                value: '74K',
              },
              {
                label: 'Sec.Nr.',
                value: '004',
              },
            ],
            logo_image_url: 'https://www.example.com/en/logo.png',
            header_image_url: 'https://www.example.com/en/fb/header.png',
            qr_code: 'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
            above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
            flight_info: {
              flight_number: 'KL0642',
              departure_airport: {
                airport_code: 'JFK',
                city: 'New York',
                terminal: 'T1',
                gate: 'D57',
              },
              arrival_airport: {
                airport_code: 'AMS',
                city: 'Amsterdam',
              },
              flight_schedule: {
                departure_time: '2016-01-02T19:05',
                arrival_time: '2016-01-05T17:30',
              },
            },
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineCheckinTemplate', () => {
    it('should call messages api with airline checkin template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'airline_checkin',
                intro_message: 'Check-in is available now.',
                locale: 'en_US',
                pnr_number: 'ABCDEF',
                flight_info: [
                  {
                    flight_number: 'f001',
                    departure_airport: {
                      airport_code: 'SFO',
                      city: 'San Francisco',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    arrival_airport: {
                      airport_code: 'SEA',
                      city: 'Seattle',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    flight_schedule: {
                      boarding_time: '2016-01-05T15:05',
                      departure_time: '2016-01-05T15:45',
                      arrival_time: '2016-01-05T17:30',
                    },
                  },
                ],
                checkin_url: 'https://www.airline.com/check-in',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineCheckinTemplate(USER_ID, {
        intro_message: 'Check-in is available now.',
        locale: 'en_US',
        pnr_number: 'ABCDEF',
        flight_info: [
          {
            flight_number: 'f001',
            departure_airport: {
              airport_code: 'SFO',
              city: 'San Francisco',
              terminal: 'T4',
              gate: 'G8',
            },
            arrival_airport: {
              airport_code: 'SEA',
              city: 'Seattle',
              terminal: 'T4',
              gate: 'G8',
            },
            flight_schedule: {
              boarding_time: '2016-01-05T15:05',
              departure_time: '2016-01-05T15:45',
              arrival_time: '2016-01-05T17:30',
            },
          },
        ],
        checkin_url: 'https://www.airline.com/check-in',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineItineraryTemplate', () => {
    it('should call messages api with airline itinerary template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'airline_itinerary',
                intro_message: "Here's your flight itinerary.",
                locale: 'en_US',
                pnr_number: 'ABCDEF',
                passenger_info: [
                  {
                    name: 'Farbound Smith Jr',
                    ticket_number: '0741234567890',
                    passenger_id: 'p001',
                  },
                  {
                    name: 'Nick Jones',
                    ticket_number: '0741234567891',
                    passenger_id: 'p002',
                  },
                ],
                flight_info: [
                  {
                    connection_id: 'c001',
                    segment_id: 's001',
                    flight_number: 'KL9123',
                    aircraft_type: 'Boeing 737',
                    departure_airport: {
                      airport_code: 'SFO',
                      city: 'San Francisco',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    arrival_airport: {
                      airport_code: 'SLC',
                      city: 'Salt Lake City',
                      terminal: 'T4',
                      gate: 'G8',
                    },
                    flight_schedule: {
                      departure_time: '2016-01-02T19:45',
                      arrival_time: '2016-01-02T21:20',
                    },
                    travel_class: 'business',
                  },
                  {
                    connection_id: 'c002',
                    segment_id: 's002',
                    flight_number: 'KL321',
                    aircraft_type: 'Boeing 747-200',
                    travel_class: 'business',
                    departure_airport: {
                      airport_code: 'SLC',
                      city: 'Salt Lake City',
                      terminal: 'T1',
                      gate: 'G33',
                    },
                    arrival_airport: {
                      airport_code: 'AMS',
                      city: 'Amsterdam',
                      terminal: 'T1',
                      gate: 'G33',
                    },
                    flight_schedule: {
                      departure_time: '2016-01-02T22:45',
                      arrival_time: '2016-01-03T17:20',
                    },
                  },
                ],
                passenger_segment_info: [
                  {
                    segment_id: 's001',
                    passenger_id: 'p001',
                    seat: '12A',
                    seat_type: 'Business',
                  },
                  {
                    segment_id: 's001',
                    passenger_id: 'p002',
                    seat: '12B',
                    seat_type: 'Business',
                  },
                  {
                    segment_id: 's002',
                    passenger_id: 'p001',
                    seat: '73A',
                    seat_type: 'World Business',
                    product_info: [
                      {
                        title: 'Lounge',
                        value: 'Complimentary lounge access',
                      },
                      {
                        title: 'Baggage',
                        value: '1 extra bag 50lbs',
                      },
                    ],
                  },
                  {
                    segment_id: 's002',
                    passenger_id: 'p002',
                    seat: '73B',
                    seat_type: 'World Business',
                    product_info: [
                      {
                        title: 'Lounge',
                        value: 'Complimentary lounge access',
                      },
                      {
                        title: 'Baggage',
                        value: '1 extra bag 50lbs',
                      },
                    ],
                  },
                ],
                price_info: [
                  {
                    title: 'Fuel surcharge',
                    amount: '1597',
                    currency: 'USD',
                  },
                ],
                base_price: '12206',
                tax: '200',
                total_price: '14003',
                currency: 'USD',
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineItineraryTemplate(USER_ID, {
        intro_message: "Here's your flight itinerary.",
        locale: 'en_US',
        pnr_number: 'ABCDEF',
        passenger_info: [
          {
            name: 'Farbound Smith Jr',
            ticket_number: '0741234567890',
            passenger_id: 'p001',
          },
          {
            name: 'Nick Jones',
            ticket_number: '0741234567891',
            passenger_id: 'p002',
          },
        ],
        flight_info: [
          {
            connection_id: 'c001',
            segment_id: 's001',
            flight_number: 'KL9123',
            aircraft_type: 'Boeing 737',
            departure_airport: {
              airport_code: 'SFO',
              city: 'San Francisco',
              terminal: 'T4',
              gate: 'G8',
            },
            arrival_airport: {
              airport_code: 'SLC',
              city: 'Salt Lake City',
              terminal: 'T4',
              gate: 'G8',
            },
            flight_schedule: {
              departure_time: '2016-01-02T19:45',
              arrival_time: '2016-01-02T21:20',
            },
            travel_class: 'business',
          },
          {
            connection_id: 'c002',
            segment_id: 's002',
            flight_number: 'KL321',
            aircraft_type: 'Boeing 747-200',
            travel_class: 'business',
            departure_airport: {
              airport_code: 'SLC',
              city: 'Salt Lake City',
              terminal: 'T1',
              gate: 'G33',
            },
            arrival_airport: {
              airport_code: 'AMS',
              city: 'Amsterdam',
              terminal: 'T1',
              gate: 'G33',
            },
            flight_schedule: {
              departure_time: '2016-01-02T22:45',
              arrival_time: '2016-01-03T17:20',
            },
          },
        ],
        passenger_segment_info: [
          {
            segment_id: 's001',
            passenger_id: 'p001',
            seat: '12A',
            seat_type: 'Business',
          },
          {
            segment_id: 's001',
            passenger_id: 'p002',
            seat: '12B',
            seat_type: 'Business',
          },
          {
            segment_id: 's002',
            passenger_id: 'p001',
            seat: '73A',
            seat_type: 'World Business',
            product_info: [
              {
                title: 'Lounge',
                value: 'Complimentary lounge access',
              },
              {
                title: 'Baggage',
                value: '1 extra bag 50lbs',
              },
            ],
          },
          {
            segment_id: 's002',
            passenger_id: 'p002',
            seat: '73B',
            seat_type: 'World Business',
            product_info: [
              {
                title: 'Lounge',
                value: 'Complimentary lounge access',
              },
              {
                title: 'Baggage',
                value: '1 extra bag 50lbs',
              },
            ],
          },
        ],
        price_info: [
          {
            title: 'Fuel surcharge',
            amount: '1597',
            currency: 'USD',
          },
        ],
        base_price: '12206',
        tax: '200',
        total_price: '14003',
        currency: 'USD',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAirlineFlightUpdateTemplate', () => {
    it('should call messages api with airline flight update template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'airline_update',
                intro_message: 'Your flight is delayed',
                update_type: 'delay',
                locale: 'en_US',
                pnr_number: 'CF23G2',
                update_flight_info: {
                  flight_number: 'KL123',
                  departure_airport: {
                    airport_code: 'SFO',
                    city: 'San Francisco',
                    terminal: 'T4',
                    gate: 'G8',
                  },
                  arrival_airport: {
                    airport_code: 'AMS',
                    city: 'Amsterdam',
                    terminal: 'T4',
                    gate: 'G8',
                  },
                  flight_schedule: {
                    boarding_time: '2015-12-26T10:30',
                    departure_time: '2015-12-26T11:30',
                    arrival_time: '2015-12-27T07:30',
                  },
                },
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendAirlineFlightUpdateTemplate(USER_ID, {
        intro_message: 'Your flight is delayed',
        update_type: 'delay',
        locale: 'en_US',
        pnr_number: 'CF23G2',
        update_flight_info: {
          flight_number: 'KL123',
          departure_airport: {
            airport_code: 'SFO',
            city: 'San Francisco',
            terminal: 'T4',
            gate: 'G8',
          },
          arrival_airport: {
            airport_code: 'AMS',
            city: 'Amsterdam',
            terminal: 'T4',
            gate: 'G8',
          },
          flight_schedule: {
            boarding_time: '2015-12-26T10:30',
            departure_time: '2015-12-26T11:30',
            arrival_time: '2015-12-27T07:30',
          },
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendQuickReplies', () => {
    it('should call messages api with quick replies', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Pick a color:',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Red',
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendQuickReplies(
        USER_ID,
        { text: 'Pick a color:' },
        [
          {
            content_type: 'text',
            title: 'Red',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ]
      );

      expect(res).toEqual(reply);
    });

    it('should accept location type', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          messaging_type: 'UPDATE',
          recipient: {
            id: USER_ID,
          },
          message: {
            text: 'Pick a color:',
            quick_replies: [
              {
                content_type: 'location',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendQuickReplies(
        USER_ID,
        { text: 'Pick a color:' },
        [
          {
            content_type: 'location',
          },
        ]
      );

      expect(res).toEqual(reply);
    });

    it('should throw if quick_replies length > 11', async () => {
      const { client } = createMock();

      const lotsOfQuickReplies = new Array(12).fill({
        content_type: 'text',
        title: 'Red',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
      });

      expect(() => {
        client.sendQuickReplies(
          USER_ID,
          { text: 'Pick a color:' },
          lotsOfQuickReplies
        );
      }).toThrow('quick_replies is an array and limited to 11');
    });

    it('should throw if title length > 20', async () => {
      const { client } = createMock();

      expect(() => {
        client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'RedRedRedRedRedRedRedRed',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ]);
      }).toThrow(
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );
    });

    it('should throw if payload length > 1000', async () => {
      const { client } = createMock();

      const longString = new Array(1001).fill('x').join('');

      expect(() => {
        client.sendQuickReplies(USER_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'Red',
            payload: longString,
          },
        ]);
      }).toThrow('payload of quick reply has a 1000 character limit');
    });
  });

  describe('#sendBatch', () => {
    it('call messages api with batch requests', async () => {
      const { client } = createMock();

      const mock = new MockAdapter(axios);

      const reply = [
        {
          recipient_id: USER_ID,
          message_id: 'mid.1489394984387:3dd22de509',
        },
      ];

      const batch = [Messenger.createText(USER_ID, 'Hello')];

      mock
        .onPost(`https://graph.facebook.com/`, {
          access_token: ACCESS_TOKEN,
          batch: [
            {
              method: 'POST',
              relative_url: 'me/messages',
              body: `messaging_type=UPDATE&recipient=%7B%22id%22%3A%22${USER_ID}%22%7D&message=%7B%22text%22%3A%22Hello%22%7D`,
            },
          ],
        })
        .reply(200, reply);

      const res = await client.sendBatch(batch);

      expect(res).toEqual(reply);
    });

    it('should throw if item length > 50', async () => {
      const { client } = createMock();

      const bigBatch = new Array(51).fill(
        Messenger.createText(USER_ID, 'Hello')
      );

      expect(() => {
        client.sendBatch(bigBatch);
      }).toThrow();
    });
  });

  describe('#sendSenderAction', () => {
    it('should call messages api with sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.sendSenderAction(USER_ID, 'typing_on');

      expect(res).toEqual(reply);
    });

    it('should call messages api with sender action and custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const customAccessToken = '097654321';

      mock
        .onPost(`/me/messages?access_token=${customAccessToken}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
          access_token: customAccessToken,
        })
        .reply(200, reply);

      const res = await client.sendSenderAction(USER_ID, 'typing_on', {
        access_token: customAccessToken,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#markSeen', () => {
    it('should call messages api with mark_seen sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'mark_seen',
        })
        .reply(200, reply);

      const res = await client.markSeen(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with mark_seen sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'mark_seen',
          ...options,
        })
        .reply(200, reply);

      const res = await client.markSeen(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#typingOn', () => {
    it('should call messages api with typing_on sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.typingOn(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with typing_on sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_on',
          ...options,
        })
        .reply(200, reply);

      const res = await client.typingOn(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#typingOff', () => {
    it('should call messages api with typing_off sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_off',
        })
        .reply(200, reply);

      const res = await client.typingOff(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api with typing_off sender action and options', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: USER_ID,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(`/me/messages?access_token=${options.access_token}`, {
          recipient: {
            id: USER_ID,
          },
          sender_action: 'typing_off',
          ...options,
        })
        .reply(200, reply);

      const res = await client.typingOff(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });
});

describe('broadcast api', () => {
  describe('#createMessageCreative', () => {
    it('should call messages api to create message creative', async () => {
      const { client, mock } = createMock();

      const reply = {
        message_creative_id: 938461089,
      };

      mock
        .onPost(`/me/message_creatives?access_token=${ACCESS_TOKEN}`, {
          messages: [
            {
              dynamic_text: {
                text: 'Hi, {first_name}! Here is a generic template:',
                fallback_text: 'Hi! Here is a generic template:',
              },
            },
            {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: [
                    {
                      title: 'Welcome to Our Marketplace!',
                      image_url: 'https://www.facebook.com/jaspers.png',
                      subtitle: 'Fresh fruits and vegetables. Yum.',
                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://www.jaspersmarket.com',
                          title: 'View Website',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        })
        .reply(200, reply);

      const res = await client.createMessageCreative([
        {
          dynamic_text: {
            text: 'Hi, {first_name}! Here is a generic template:',
            fallback_text: 'Hi! Here is a generic template:',
          },
        },
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'Welcome to Our Marketplace!',
                  image_url: 'https://www.facebook.com/jaspers.png',
                  subtitle: 'Fresh fruits and vegetables. Yum.',
                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://www.jaspersmarket.com',
                      title: 'View Website',
                    },
                  ],
                },
              ],
            },
          },
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendBroadcastMessage', () => {
    it('should call messages api to send broadcast message', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089);

      expect(res).toEqual(reply);
    });

    it('can send with custom label', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
          custom_label_id: 5678,
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089, {
        custom_label_id: 5678,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendSponsoredMessage', () => {
    it('should call marketing api to send sponsored message', async () => {
      const { client, mock } = createMock();

      const AD_ACCOUNT_ID = '18910417349234';

      const reply = {
        ad_group_id: '6088387928148',
        broadcast_id: '754911018029273',
        success: true,
      };

      mock
        .onPost(
          `/act_${AD_ACCOUNT_ID}/sponsored_message_ads?access_token=${ACCESS_TOKEN}`,
          {
            message_creative_id: 938461089,
            daily_budget: 100,
            bid_amount: 400,
            targeting: "{'geo_locations': {'countries':['US']}}",
          }
        )
        .reply(200, reply);

      const res = await client.sendSponsoredMessage(AD_ACCOUNT_ID, {
        message_creative_id: 938461089,
        daily_budget: 100,
        bid_amount: 400,
        targeting: "{'geo_locations': {'countries':['US']}}",
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#startReachEstimation', () => {
    it('should call messages api to start a reach estimation', async () => {
      const { client, mock } = createMock();

      const reply = {
        reach_estimation_id: '6088387928148',
      };

      mock
        .onPost(`/broadcast_reach_estimations?access_token=${ACCESS_TOKEN}`, {
          custom_label_id: 938461089,
        })
        .reply(200, reply);

      const res = await client.startReachEstimation(938461089);

      expect(res).toEqual(reply);
    });
  });

  describe('#getReachEstimate', () => {
    it('should call messages api to retrieve the reach estimate', async () => {
      const { client, mock } = createMock();

      const reply = {
        reach_estimation: '<REACH_ESTIMATE>',
        id: '<REACH_ESTIMATION_ID>',
      };

      mock
        .onPost(`/73450120243?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getReachEstimate(73450120243);

      expect(res).toEqual(reply);
    });
  });

  describe('#getBroadcastMessagesSent', () => {
    it('should call insights api to retrieve the message sent insight', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'messages_sent',
            period: 'lifetime',
            values: [
              {
                value: 1000,
                end_time: '1970-01-02T00:00:00+0000',
              },
            ],
            title: 'Lifetime number of messages sent from the page broadcast',
            description:
              'Lifetime: The total number of messages sent from a Page to people.',
            id: '1301333349933076/insights/messages_sent',
          },
        ],
      };

      mock
        .onPost(
          `/73450120243/insights/messages_sent?access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getBroadcastMessagesSent(73450120243);

      expect(res).toEqual(reply.data);
    });
  });
});

describe('label api', () => {
  describe('#createLabel', () => {
    it('should call messages api to create label', async () => {
      const { client, mock } = createMock();

      const reply = {
        id: 1712444532121303,
      };

      mock
        .onPost(`/me/custom_labels?access_token=${ACCESS_TOKEN}`, {
          name: 'awesome',
        })
        .reply(200, reply);

      const res = await client.createLabel('awesome');

      expect(res).toEqual(reply);
    });
  });

  describe('#associateLabel', () => {
    it('should call messages api to associate label', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/1712444532121303/label?access_token=${ACCESS_TOKEN}`, {
          user: USER_ID,
        })
        .reply(200, reply);

      const res = await client.associateLabel(USER_ID, 1712444532121303);

      expect(res).toEqual(reply);
    });

    it('should call messages api to associate label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/1712444532121303/label?access_token=${options.access_token}`,
          {
            user: USER_ID,
          }
        )
        .reply(200, reply);

      const res = await client.associateLabel(
        USER_ID,
        1712444532121303,
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#dissociateLabel', () => {
    it('should call messages api to dissociate label', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onDelete(`/1712444532121303/label?access_token=${ACCESS_TOKEN}`, {
          user: USER_ID,
        })
        .reply(200, reply);

      const res = await client.dissociateLabel(USER_ID, 1712444532121303);

      expect(res).toEqual(reply);
    });

    it('should call messages api to dissociate label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onDelete(
          `/1712444532121303/label?access_token=${options.access_token}`,
          {
            user: USER_ID,
          }
        )
        .reply(200, reply);

      const res = await client.dissociateLabel(
        USER_ID,
        1712444532121303,
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#getAssociatedLabels', () => {
    it('should call messages api to get associated label', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };

      mock
        .onGet(`/${USER_ID}/custom_labels?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getAssociatedLabels(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api to get associated label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onGet(`/${USER_ID}/custom_labels?access_token=${options.access_token}`)
        .reply(200, reply);

      const res = await client.getAssociatedLabels(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#getLabelDetails', () => {
    it('should call messages api to get label details', async () => {
      const { client, mock } = createMock();

      const reply = {
        name: 'myLabel',
        id: '1001200005002',
      };

      mock
        .onGet(`/1712444532121303?fields=name&access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getLabelDetails(1712444532121303);

      expect(res).toEqual(reply);
    });
  });

  describe('#getLabelList', () => {
    it('should call messages api to get label list', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };

      mock
        .onGet(`/me/custom_labels?fields=name&access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getLabelList();

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteLabel', () => {
    it('should call messages api to get label list', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onDelete(`/${1712444532121303}?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.deleteLabel(1712444532121303);

      expect(res).toEqual(reply);
    });
  });
});

describe('upload api', () => {
  describe('#uploadAttachment', () => {
    it('should call messages api to upload attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'http://www.yoctol-rocks.com/image.jpg',
                is_reusable: false,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadAttachment(
        'image',
        'http://www.yoctol-rocks.com/image.jpg'
      );

      expect(res).toEqual(reply);
    });

    it('can upload reusable attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'http://www.yoctol-rocks.com/image.jpg',
                is_reusable: true,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadAttachment(
        'image',
        'http://www.yoctol-rocks.com/image.jpg',
        { is_reusable: true }
      );

      expect(res).toEqual(reply);
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1857777774821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`)
        .reply(config => {
          expect(config.data).toBeInstanceOf(FormData);

          return [200, reply];
        });

      const res = await client.uploadAttachment(
        'file',
        fs.createReadStream('./')
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#uploadAudio', () => {
    it('should call messages api to upload audio', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'audio',
              payload: {
                url: 'http://www.yoctol-rocks.com/audio.mp3',
                is_reusable: false,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadAudio(
        'http://www.yoctol-rocks.com/audio.mp3'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#uploadImage', () => {
    it('should call messages api to upload image', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: 'http://www.yoctol-rocks.com/image.jpg',
                is_reusable: false,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadImage(
        'http://www.yoctol-rocks.com/image.jpg'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#uploadVideo', () => {
    it('should call messages api to upload video', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: 'http://www.yoctol-rocks.com/video.mp4',
                is_reusable: false,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadVideo(
        'http://www.yoctol-rocks.com/video.mp4'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#uploadFile', () => {
    it('should call messages api to upload file', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      mock
        .onPost(`/me/message_attachments?access_token=${ACCESS_TOKEN}`, {
          message: {
            attachment: {
              type: 'file',
              payload: {
                url: 'http://www.yoctol-rocks.com/file.pdf',
                is_reusable: false,
              },
            },
          },
        })
        .reply(200, reply);

      const res = await client.uploadFile(
        'http://www.yoctol-rocks.com/file.pdf'
      );

      expect(res).toEqual(reply);
    });
  });
});

describe('Messenger Code API', () => {
  describe('#generateMessengerCode', () => {
    it('should call messages api to generate code', async () => {
      const { client, mock } = createMock();

      const reply = {
        uri: 'YOUR_CODE_URL_HERE',
      };

      mock
        .onPost(`/me/messenger_codes?access_token=${ACCESS_TOKEN}`, {
          type: 'standard',
        })
        .reply(200, reply);

      const res = await client.generateMessengerCode();

      expect(res).toEqual(reply);
    });

    it('should call messages api to generate code using custom image_size', async () => {
      const { client, mock } = createMock();

      const reply = {
        uri: 'YOUR_CODE_URL_HERE',
      };

      mock
        .onPost(`/me/messenger_codes?access_token=${ACCESS_TOKEN}`, {
          type: 'standard',
          image_size: 1500,
        })
        .reply(200, reply);

      const res = await client.generateMessengerCode({
        image_size: 1500,
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api to generate parametric code', async () => {
      const { client, mock } = createMock();

      const reply = {
        uri: 'YOUR_CODE_URL_HERE',
      };

      mock
        .onPost(`/me/messenger_codes?access_token=${ACCESS_TOKEN}`, {
          type: 'standard',
          data: {
            ref: 'billboard-ad',
          },
        })
        .reply(200, reply);

      const res = await client.generateMessengerCode({
        data: {
          ref: 'billboard-ad',
        },
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('Handover Protocol API', () => {
  describe('#passThreadControl', () => {
    it('should call messages api to pass thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/pass_thread_control?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          target_app_id: 123456789,
          metadata: 'free formed text for another app',
        })
        .reply(200, reply);

      const res = await client.passThreadControl(
        USER_ID,
        123456789,
        'free formed text for another app'
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api to pass thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/me/pass_thread_control?access_token=${options.access_token}`,
          {
            recipient: {
              id: USER_ID,
            },
            target_app_id: 123456789,
            metadata: 'free formed text for another app',
          }
        )
        .reply(200, reply);

      const res = await client.passThreadControl(
        USER_ID,
        123456789,
        'free formed text for another app',
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#passThreadControlToPageInbox', () => {
    it('should call messages api to pass thread control to page inbox', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/pass_thread_control?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          target_app_id: 263902037430900,
          metadata: 'free formed text for another app',
        })
        .reply(200, reply);

      const res = await client.passThreadControlToPageInbox(
        USER_ID,
        'free formed text for another app'
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api to pass thread control to page inbox with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/me/pass_thread_control?access_token=${options.access_token}`,
          {
            recipient: {
              id: USER_ID,
            },
            target_app_id: 263902037430900,
            metadata: 'free formed text for another app',
          }
        )
        .reply(200, reply);

      const res = await client.passThreadControlToPageInbox(
        USER_ID,
        'free formed text for another app',
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#takeThreadControl', () => {
    it('should call messages api to take thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/take_thread_control?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          metadata: 'free formed text for another app',
        })
        .reply(200, reply);

      const res = await client.takeThreadControl(
        USER_ID,
        'free formed text for another app'
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api to take thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/me/take_thread_control?access_token=${options.access_token}`,
          {
            recipient: {
              id: USER_ID,
            },
            metadata: 'free formed text for another app',
          }
        )
        .reply(200, reply);

      const res = await client.takeThreadControl(
        USER_ID,
        'free formed text for another app',
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#getSecondaryReceivers', () => {
    it('should call messages api to get Secondary receivers', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          { id: '12345678910', name: "David's Composer" },
          { id: '23456789101', name: 'Messenger Rocks' },
        ],
      };

      mock
        .onGet(
          `/me/secondary_receivers?fields=id,name&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getSecondaryReceivers();

      expect(res).toEqual([
        { id: '12345678910', name: "David's Composer" },
        { id: '23456789101', name: 'Messenger Rocks' },
      ]);
    });
  });
});

describe('Page Messaging Insights API', () => {
  describe('#getInsights', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_active_threads_unique',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_active_threads_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getInsights([
        'page_messages_active_threads_unique',
      ]);

      expect(res).toEqual([
        {
          name: 'page_messages_active_threads_unique',
        },
      ]);
    });

    it('support multiple metrics', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_active_threads_unique',
          },
          {
            name: 'page_messages_blocked_conversations_unique',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_active_threads_unique%2Cpage_messages_blocked_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getInsights([
        'page_messages_active_threads_unique',
        'page_messages_blocked_conversations_unique',
      ]);

      expect(res).toEqual([
        {
          name: 'page_messages_active_threads_unique',
        },
        {
          name: 'page_messages_blocked_conversations_unique',
        },
      ]);
    });
  });

  describe('#getDailyUniqueActiveThreadCounts', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_active_threads_unique',
            period: 'day',
            values: [
              {
                value: 83111,
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: 85215,
                end_time: '2017-02-03T08:00:00+0000',
              },
              {
                value: 87175,
                end_time: '2017-02-04T08:00:00+0000',
              },
            ],
            title: 'Daily unique active threads count by thread fbid',
            description:
              'Daily: total unique active threads created between users and page.',
            id:
              '1234567/insights/?metric=page_messages_active_threads_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_active_threads_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getDailyUniqueActiveThreadCounts();

      expect(res).toEqual([
        {
          name: 'page_messages_active_threads_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique active threads count by thread fbid',
          description:
            'Daily: total unique active threads created between users and page.',
          id:
            '1234567/insights/?metric=page_messages_active_threads_unique/day',
        },
      ]);
    });
  });

  describe('#getBlockedConversations', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_blocked_conversations_unique',
            period: 'day',
            values: [
              {
                value: 83111,
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: 85215,
                end_time: '2017-02-03T08:00:00+0000',
              },
              {
                value: 87175,
                end_time: '2017-02-04T08:00:00+0000',
              },
            ],
            title: 'Daily unique active threads count by thread fbid',
            description:
              'Daily: total unique active threads created between users and page.',
            id:
              '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_blocked_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getBlockedConversations();

      expect(res).toEqual([
        {
          name: 'page_messages_blocked_conversations_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique active threads count by thread fbid',
          description:
            'Daily: total unique active threads created between users and page.',
          id:
            '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
        },
      ]);
    });
  });

  describe('#getReportedConversations', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_reported_conversations_unique',
            period: 'day',
            values: [
              {
                value: 83111,
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: 85215,
                end_time: '2017-02-03T08:00:00+0000',
              },
              {
                value: 87175,
                end_time: '2017-02-04T08:00:00+0000',
              },
            ],
            title: 'Daily unique active threads count by thread fbid',
            description:
              'Daily: total unique active threads created between users and page.',
            id:
              '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_reported_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getReportedConversations();

      expect(res).toEqual([
        {
          name: 'page_messages_reported_conversations_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique active threads count by thread fbid',
          description:
            'Daily: total unique active threads created between users and page.',
          id:
            '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
        },
      ]);
    });
  });

  describe('#getReportedConversationsByReportType', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_blocked_conversations_unique',
            period: 'day',
            values: [
              {
                value: 83111,
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: 85215,
                end_time: '2017-02-03T08:00:00+0000',
              },
              {
                value: 87175,
                end_time: '2017-02-04T08:00:00+0000',
              },
            ],
            title: 'Daily unique active threads count by thread fbid',
            description:
              'Daily: total unique active threads created between users and page.',
            id:
              '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_blocked_conversations_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getReportedConversationsByReportType();

      expect(res).toEqual([
        {
          name: 'page_messages_blocked_conversations_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique active threads count by thread fbid',
          description:
            'Daily: total unique active threads created between users and page.',
          id:
            '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
        },
      ]);
    });
  });

  describe('#getDailyUniqueConversationCounts', () => {
    it('should call api get Insight data', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'page_messages_feedback_by_action_unique',
            period: 'day',
            values: [
              {
                value: {
                  TURN_ON: 40,
                  TURN_OFF: 167,
                  DELETE: 720,
                  OTHER: 0,
                  REPORT_SPAM: 0,
                },
                end_time: '2017-02-02T08:00:00+0000',
              },
              {
                value: {
                  TURN_ON: 38,
                  DELETE: 654,
                  TURN_OFF: 155,
                  REPORT_SPAM: 1,
                  OTHER: 0,
                },
                end_time: '2017-02-03T08:00:00+0000',
              },
            ],
            title:
              'Daily unique conversation count broken down by user feedback actions',
            description:
              'Daily: total unique active threads created between users and page.',
            id:
              '1234567/insights/?metric=page_messages_active_threads_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/?metric=page_messages_feedback_by_action_unique&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getDailyUniqueConversationCounts();

      expect(res).toEqual([
        {
          name: 'page_messages_feedback_by_action_unique',
          period: 'day',
          values: [
            {
              value: {
                TURN_ON: 40,
                TURN_OFF: 167,
                DELETE: 720,
                OTHER: 0,
                REPORT_SPAM: 0,
              },
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: {
                TURN_ON: 38,
                DELETE: 654,
                TURN_OFF: 155,
                REPORT_SPAM: 1,
                OTHER: 0,
              },
              end_time: '2017-02-03T08:00:00+0000',
            },
          ],
          title:
            'Daily unique conversation count broken down by user feedback actions',
          description:
            'Daily: total unique active threads created between users and page.',
          id:
            '1234567/insights/?metric=page_messages_active_threads_unique/day',
        },
      ]);
    });
  });
});

describe('Built-in NLP API', () => {
  describe('#setNLPConfigs', () => {
    it('should call api to set NLP configs', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/nlp_configs?nlp_enabled=true&custom_token=1234567890`, {
          access_token: ACCESS_TOKEN,
        })
        .reply(200, reply);

      const res = await client.setNLPConfigs({
        nlp_enabled: true,
        custom_token: '1234567890',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#enableNLP', () => {
    it('should call api to enable NLP', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/nlp_configs?nlp_enabled=true`, {
          access_token: ACCESS_TOKEN,
        })
        .reply(200, reply);

      const res = await client.enableNLP();

      expect(res).toEqual(reply);
    });
  });

  describe('#disableNLP', () => {
    it('should call api to disable NLP', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/nlp_configs?nlp_enabled=false`, {
          access_token: ACCESS_TOKEN,
        })
        .reply(200, reply);

      const res = await client.disableNLP();

      expect(res).toEqual(reply);
    });
  });
});

describe('Event Logging API', () => {
  describe('#logCustomEvents', () => {
    it('should call api to log events', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/12345/activities?access_token=${ACCESS_TOKEN}`, {
          event: 'CUSTOM_APP_EVENTS',
          custom_events:
            '[{"_eventName":"fb_mobile_purchase","_valueToSum":55.22,"_fb_currency":"USD"}]',
          advertiser_tracking_enabled: 0,
          application_tracking_enabled: 0,
          extinfo: '["mb1"]',
          page_id: 67890,
          page_scoped_user_id: USER_ID,
        })
        .reply(200, reply);

      const res = await client.logCustomEvents({
        app_id: 12345,
        page_id: 67890,
        page_scoped_user_id: USER_ID,
        events: [
          {
            _eventName: 'fb_mobile_purchase',
            _valueToSum: 55.22,
            _fb_currency: 'USD',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('ID Matching', () => {
  describe('getIdsForApps', () => {
    it('should call api with appsecret_proof', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            id: '10152368852405295',
            app: {
              category: 'Business',
              link: 'https://www.facebook.com/games/?app_id=1419232575008550',
              name: "John's Game App",
              id: '1419232575008550',
            },
          },
          {
            id: '645195294',
            app: {
              link: 'https://apps.facebook.com/johnsmovieappns/',
              name: 'JohnsMovieApp',
              namespace: 'johnsmovieappns',
              id: '259773517400382',
            },
          },
        ],
        paging: {
          cursors: {
            before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
            after: 'NDAwMDExOTA3MDM1ODMwA',
          },
        },
      };

      mock
        .onGet(
          `/12345123/ids_for_apps?access_token=${ACCESS_TOKEN}&appsecret_proof=4894f81b47c53ccf240a1130d119db2c69833eac9be09adeebc8e7226fb73e73&page=5678`
        )
        .reply(200, reply);

      const res = await client.getIdsForApps({
        user_id: '12345123',
        app_secret: APP_SECRET,
        page: '5678',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('getIdsForPages', () => {
    it('should call api with appsecret_proof', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            id: '12345123', // The psid for the user for that page
            page: {
              category: 'Musician',
              link:
                'https://www.facebook.com/Johns-Next-Great-Thing-380374449010653/',
              name: "John's Next Great Thing",
              id: '380374449010653',
            },
          },
        ],
        paging: {
          cursors: {
            before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
            after: 'NDAwMDExOTA3MDM1ODMwA',
          },
        },
      };

      mock
        .onGet(
          `/12345123/ids_for_pages?access_token=${ACCESS_TOKEN}&appsecret_proof=4894f81b47c53ccf240a1130d119db2c69833eac9be09adeebc8e7226fb73e73&app=5678`
        )
        .reply(200, reply);

      const res = await client.getIdsForPages({
        user_id: '12345123',
        app_secret: APP_SECRET,
        app: '5678',
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('Error', () => {
  it('should format correctly', async () => {
    const { client, mock } = createMock();

    const reply = {
      error: {
        message: 'Invalid OAuth access token.',
        type: 'OAuthException',
        code: 190,
        error_subcode: 1234567,
        fbtrace_id: 'BLBz/WZt8dN',
      },
    };

    mock.onAny().reply(400, reply);

    let error;
    try {
      await client.sendText(USER_ID, 'Hello!');
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual(
      'Messenger API - 190 OAuthException Invalid OAuth access token.'
    );
  });
});
