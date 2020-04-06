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
    it('should respond data of messenger profile', async () => {
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started,persistent_menu&access_token=${ACCESS_TOKEN}`
      );

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
    });
  });

  describe('#setMessengerProfile', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setMessengerProfile({
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

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteMessengerProfile([
        'get_started',
        'persistent_menu',
      ]);

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['get_started', 'persistent_menu'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('get started button', () => {
  describe('#getGetStarted', () => {
    it('should respond data of get started', async () => {
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGetStarted();

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        payload: 'GET_STARTED',
      });
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGetStarted();

      expect(url).toEqual(
        `/me/messenger_profile?fields=get_started&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setGetStarted', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setGetStarted('GET_STARTED');

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        get_started: {
          payload: 'GET_STARTED',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGetStarted', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteGetStarted();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['get_started'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('persistent menu', () => {
  describe('#getPersistentMenu', () => {
    it('should respond data of persistent menu', async () => {
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getPersistentMenu();

      expect(url).toEqual(
        `/me/messenger_profile?fields=persistent_menu&access_token=${ACCESS_TOKEN}`
      );

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
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getPersistentMenu();

      expect(url).toEqual(
        `/me/messenger_profile?fields=persistent_menu&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setPersistentMenu', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setPersistentMenu([
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

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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

      expect(res).toEqual(reply);
    });

    it('should respond success result if input is a full PersistentMenu, not MenuItem[]', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setPersistentMenu([
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

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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

      expect(res).toEqual(reply);
    });

    it('should support disabled input', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

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

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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

  describe('#deletePersistentMenu', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deletePersistentMenu();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['persistent_menu'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('greeting', () => {
  describe('#getGreeting', () => {
    it('should respond data of greeting text', async () => {
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGreeting();

      expect(url).toEqual(
        `/me/messenger_profile?fields=greeting&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual([
        {
          locale: 'default',
          text: 'Hello!',
        },
      ]);
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getGreeting();

      expect(url).toEqual(
        `/me/messenger_profile?fields=greeting&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setGreeting', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setGreeting('Hello!');

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        greeting: [
          {
            locale: 'default',
            text: 'Hello!',
          },
        ],
      });

      expect(res).toEqual(reply);
    });

    it('should respond success result if input is multi-locale greetings', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

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

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteGreeting', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteGreeting();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['greeting'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('ice breakers', () => {
  describe('#getIceBreakers', () => {
    it('should respond data of ice breakers', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
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
          },
        ],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getIceBreakers();

      expect(url).toEqual(
        `/me/messenger_profile?fields=ice_breakers&access_token=${ACCESS_TOKEN}`
      );

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
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getIceBreakers();

      expect(url).toEqual(
        `/me/messenger_profile?fields=ice_breakers&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setIceBreakers', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setIceBreakers([
        {
          question: 'Where are you located?',
          payload: 'LOCATION_POSTBACK_PAYLOAD',
        },
        {
          question: 'What are your hours?',
          payload: 'HOURS_POSTBACK_PAYLOAD',
        },
      ]);

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
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

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteIceBreakers', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteIceBreakers();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['ice_breakers'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('whitelisted domains', () => {
  describe('#getWhitelistedDomains', () => {
    it('should respond data of whitelisted domains', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            whitelisted_domains: ['http://www.yoctol.com/'],
          },
        ],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getWhitelistedDomains();

      expect(url).toEqual(
        `/me/messenger_profile?fields=whitelisted_domains&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(['http://www.yoctol.com/']);
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getWhitelistedDomains();

      expect(url).toEqual(
        `/me/messenger_profile?fields=whitelisted_domains&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setWhitelistedDomains', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setWhitelistedDomains(['www.yoctol.com']);

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        whitelisted_domains: ['www.yoctol.com'],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteWhitelistedDomains', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteWhitelistedDomains();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['whitelisted_domains'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('account linking url', () => {
  describe('#getAccountLinkingURL', () => {
    it('should respond data of account linking url', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            account_linking_url:
              'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
          },
        ],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getAccountLinkingURL();

      expect(url).toEqual(
        `/me/messenger_profile?fields=account_linking_url&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        accountLinkingUrl:
          'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
      });
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getAccountLinkingURL();

      expect(url).toEqual(
        `/me/messenger_profile?fields=account_linking_url&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setAccountLinkingURL', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setAccountLinkingURL(
        'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic'
      );

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        account_linking_url:
          'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteAccountLinkingURL', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteAccountLinkingURL();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['account_linking_url'],
      });

      expect(res).toEqual(reply);
    });
  });
});

describe('chat extension home URL', () => {
  describe('#getHomeURL', () => {
    it('should respond data of home url', async () => {
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getHomeURL();

      expect(url).toEqual(
        `/me/messenger_profile?fields=home_url&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        url: 'http://petershats.com/send-a-hat',
        webviewHeightRatio: 'tall',
        inTest: true,
      });
    });

    it('should respond null when data is an empty array', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getHomeURL();

      expect(url).toEqual(
        `/me/messenger_profile?fields=home_url&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(null);
    });
  });

  describe('#setHomeURL', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setHomeURL('http://petershats.com/send-a-hat', {
        webviewHeightRatio: 'tall',
        inTest: true,
      });

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        home_url: {
          url: 'http://petershats.com/send-a-hat',
          webview_height_ratio: 'tall',
          in_test: true,
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteHomeURL', () => {
    it('should respond success result', async () => {
      const { client, mock } = createMock();

      const reply = {
        result: 'success',
      };

      let url;
      let data;
      mock.onDelete().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.deleteHomeURL();

      expect(url).toEqual(`/me/messenger_profile?access_token=${ACCESS_TOKEN}`);
      expect(JSON.parse(data)).toEqual({
        fields: ['home_url'],
      });

      expect(res).toEqual(reply);
    });
  });
});
