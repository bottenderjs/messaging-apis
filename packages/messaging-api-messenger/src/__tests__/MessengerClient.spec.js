import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const RECIPIENT_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

const createMock = () => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.getHTTPClient());
  return { client, mock };
};

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.10/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    MessengerClient.connect(ACCESS_TOKEN, 'v2.6');

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with default graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.10/',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('create axios with custom graphAPI version', () => {
    axios.create = jest.fn();
    new MessengerClient(ACCESS_TOKEN, 'v2.6'); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://graph.facebook.com/v2.6/',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new MessengerClient(ACCESS_TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
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
  describe('#getGetStartedButton', () => {
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

      const res = await client.getGetStartedButton();

      expect(res).toEqual({
        payload: 'GET_STARTED',
      });
    });
  });

  describe('#setGetStartedButton', () => {
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

      const res = await client.setGetStartedButton('GET_STARTED');

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGetStartedButton', () => {
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

      const res = await client.deleteGetStartedButton();

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
        composerInputDisabled: true,
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
  describe('#getGreetingText', () => {
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

      const res = await client.getGreetingText();

      expect(res).toEqual([
        {
          locale: 'default',
          text: 'Hello!',
        },
      ]);
    });
  });

  describe('#setGreetingText', () => {
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

      const res = await client.setGreetingText('Hello!');

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

      const res = await client.setGreetingText([
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

  describe('#deleteGreetingText', () => {
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

      const res = await client.deleteGreetingText();

      expect(res).toEqual(reply);
    });
  });
});

describe('domain whitelist', () => {
  describe('#getDomainWhitelist', () => {
    it('should response data of domain whitelist', async () => {
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

      const res = await client.getDomainWhitelist();

      expect(res).toEqual(['http://www.yoctol.com/']);
    });
  });

  describe('#setDomainWhitelist', () => {
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

      const res = await client.setDomainWhitelist(['www.yoctol.com']);

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteDomainWhitelist', () => {
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

      const res = await client.deleteDomainWhitelist();

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
  describe('#getChatExtensionHomeURL', () => {
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

      const res = await client.getChatExtensionHomeURL();

      expect(res).toEqual({
        url: 'http://petershats.com/send-a-hat',
        webview_height_ratio: 'tall',
        in_test: true,
      });
    });
  });

  describe('#setChatExtensionHomeURL', () => {
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

      const res = await client.setChatExtensionHomeURL(
        'http://petershats.com/send-a-hat',
        {
          webview_height_ratio: 'tall',
          in_test: true,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteChatExtensionHomeURL', () => {
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

      const res = await client.deleteChatExtensionHomeURL();

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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        recipient: {
          id: RECIPIENT_ID,
        },
        message: {
          text: 'Hello!',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#send', () => {
    it('should call messages api', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.send(RECIPIENT_ID, {
        text: 'Hello!',
      });

      expect(res).toEqual(reply);
    });

    it('can call messages api using recipient with phone_number', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            phone_number: '+1(212)555-2368',
            name: { first_name: 'John', last_name: 'Doe' },
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.send(
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
  });

  describe('#sendAttachment', () => {
    it('should call messages api with attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendAttachment(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendIssueResolutionText', () => {
    it('should call messages api with issue resolution text', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: {
            text: 'Hello!',
          },
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendIssueResolutionText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAudio', () => {
    it('should call messages api with audio', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
        'https://example.com/audio.mp3'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendImage', () => {
    it('should call messages api with audio', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
        'https://example.com/pic.png'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should call messages api with video', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
        'https://example.com/video.mp4'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFile', () => {
    it('should call messages api with file', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
        'https://example.com/word.docx'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendTemplate', () => {
    it('should call messages api with template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendButtonTemplate(RECIPIENT_ID, 'title', [
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
        })
        .reply(200, reply);

      const res = await client.sendGenericTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendTaggedTemplate', () => {
    it('should call messages api with tagged generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'SHIPPING_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendTaggedTemplate(
        RECIPIENT_ID,
        templateElements,
        'SHIPPING_UPDATE'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendShippingUpdateTemplate', () => {
    it('should call messages api with shipping update generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'SHIPPING_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendShippingUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendReservationUpdateTemplate', () => {
    it('should call messages api with reservation update generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'RESERVATION_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendReservationUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendIssueResolutionTemplate', () => {
    it('should call messages api with issue resolution generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'ISSUE_RESOLUTION',
        })
        .reply(200, reply);

      const res = await client.sendIssueResolutionTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendAppointmentUpdateTemplate', () => {
    it('should call messages api with appointment update template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'APPOINTMENT_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendAppointmentUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendGameEventTemplate', () => {
    it('should call messages api with game event generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'GAME_EVENT',
        })
        .reply(200, reply);

      const res = await client.sendGameEventTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendTransportationUpdateTemplate', () => {
    it('should call messages api with transportation update generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'TRANSPORTATION_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendTransportationUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFeatureFunctionalityUpdateTemplate', () => {
    it('should call messages api with feature functionality update generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'FEATURE_FUNCTIONALITY_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendFeatureFunctionalityUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendTicketUpdateTemplate', () => {
    it('should call messages api with ticket update generic template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          message: templateMessage,
          tag: 'TICKET_UPDATE',
        })
        .reply(200, reply);

      const res = await client.sendTicketUpdateTemplate(
        RECIPIENT_ID,
        templateElements
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendListTemplate', () => {
    it('should call messages api with list template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
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
        'compact'
      );

      expect(res).toEqual(reply);
    });

    it('should use topElementStyle default value', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendOpenGraphTemplate(RECIPIENT_ID, [
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

  describe('#sendReceiptTemplate', () => {
    it('should call messages api with receipt template', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendReceiptTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendAirlineBoardingPassTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendAirlineCheckinTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendAirlineItineraryTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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

      const res = await client.sendAirlineFlightUpdateTemplate(RECIPIENT_ID, {
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
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
        recipient_id: RECIPIENT_ID,
        message_id: 'mid.1489394984387:3dd22de509',
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
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
        RECIPIENT_ID,
        { text: 'Pick a color:' },
        [
          {
            content_type: 'location',
          },
        ]
      );

      expect(res).toEqual(reply);
    });

    it('should throw if quickReplies length > 11', async () => {
      const { client } = createMock();

      const bigQuickReplies = new Array(12).fill({
        content_type: 'text',
        title: 'Red',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
      });

      expect(() => {
        client.sendQuickReplies(
          RECIPIENT_ID,
          { text: 'Pick a color:' },
          bigQuickReplies
        );
      }).toThrow('quickReplies is an array and limited to 11');
    });

    it('should throw if title length > 20', async () => {
      const { client } = createMock();

      expect(() => {
        client.sendQuickReplies(RECIPIENT_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'RedRedRedRedRedRedRedRed',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED',
          },
        ]);
      }).toThrow(
        'title of quickReply has a 20 character limit, after that it gets truncated'
      );
    });

    it('should throw if payload length > 1000', async () => {
      const { client } = createMock();

      const longString = new Array(1001).fill('x').join('');

      expect(() => {
        client.sendQuickReplies(RECIPIENT_ID, { text: 'Pick a color:' }, [
          {
            content_type: 'text',
            title: 'Red',
            payload: longString,
          },
        ]);
      }).toThrow('payload of quickReply has a 1000 character limit');
    });
  });

  describe('#sendSenderAction', () => {
    it('should call messages api with sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.sendSenderAction(RECIPIENT_ID, 'typing_on');

      expect(res).toEqual(reply);
    });
  });

  describe('#turnTypingIndicatorsOn', () => {
    it('should call messages api with typing_on sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_on',
        })
        .reply(200, reply);

      const res = await client.turnTypingIndicatorsOn(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });

  describe('#turnTypingIndicatorsOff', () => {
    it('should call messages api with typing_off sender action', async () => {
      const { client, mock } = createMock();

      const reply = {
        recipient_id: RECIPIENT_ID,
      };

      mock
        .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: RECIPIENT_ID,
          },
          sender_action: 'typing_off',
        })
        .reply(200, reply);

      const res = await client.turnTypingIndicatorsOff(RECIPIENT_ID);

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
                is_reusable: true,
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
                is_reusable: true,
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
                is_reusable: true,
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
                is_reusable: true,
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
                is_reusable: true,
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
            id: RECIPIENT_ID,
          },
          target_app_id: 123456789,
          metadata: 'free formed text for another app',
        })
        .reply(200, reply);

      const res = await client.passThreadControl(
        RECIPIENT_ID,
        123456789,
        'free formed text for another app'
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
            id: RECIPIENT_ID,
          },
          metadata: 'free formed text for another app',
        })
        .reply(200, reply);

      const res = await client.takeThreadControl(
        RECIPIENT_ID,
        'free formed text for another app'
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
            id: '1234567/insights/page_messages_active_threads_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/page_messages_active_threads_unique&access_token=${ACCESS_TOKEN}`
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
          id: '1234567/insights/page_messages_active_threads_unique/day',
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
            id: '1234567/insights/page_messages_active_threads_unique/day',
          },
        ],
      };

      mock
        .onGet(
          `/me/insights/page_messages_feedback_by_action_unique&access_token=${ACCESS_TOKEN}`
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
          id: '1234567/insights/page_messages_active_threads_unique/day',
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
