import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios'); // eslint-disable-line global-require
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = () => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

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

    it('should response success result if input is a full PersistentMenu, not MenuItem[]', async () => {
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
