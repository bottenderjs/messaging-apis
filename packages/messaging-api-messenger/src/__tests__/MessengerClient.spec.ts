import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const APP_ID = '987654321';
const APP_SECRET = '1WDVGY78';
const APP_ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

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
  const client = new MessengerClient({
    appId: APP_ID,
    appSecret: APP_SECRET,
    accessToken: ACCESS_TOKEN,
    skipAppSecretProof: true,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('page info', () => {
  describe('#getPageInfo', () => {
    it('should response page info', async () => {
      const { client, mock } = createMock();
      const reply = {
        name: 'Bot Demo',
        id: '1895382890692546',
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getPageInfo();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me?access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual(reply);
    });
  });
});

describe('token', () => {
  describe('#debugToken', () => {
    it('should response token info', async () => {
      expect.assertions(3);

      const { client, mock } = createMock();

      const reply = {
        data: {
          app_id: '000000000000000',
          application: 'Social Cafe',
          expires_at: 1352419328,
          is_valid: true,
          issued_at: 1347235328,
          scopes: ['email', 'user_location'],
          user_id: 1207059,
        },
      };

      let url;
      let params;
      mock.onGet().reply(config => {
        url = config.url;
        params = config.params;
        return [200, reply];
      });

      const res = await client.debugToken();

      expect(url).toEqual('https://graph.facebook.com/v4.0/debug_token');
      expect(params).toEqual({
        input_token: ACCESS_TOKEN,
        access_token: `${APP_ID}|${APP_SECRET}`,
      });

      expect(res).toEqual({
        appId: '000000000000000',
        application: 'Social Cafe',
        expiresAt: 1352419328,
        isValid: true,
        issuedAt: 1347235328,
        scopes: ['email', 'user_location'],
        userId: 1207059,
      });
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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.createSubscription({
        appId: '54321',
        callbackUrl: 'https://mycallback.com',
        verifyToken: '1234567890',
        accessToken: APP_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/${APP_ID}/subscriptions?access_token=${APP_ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        object: 'page',
        callback_url: 'https://mycallback.com',
        fields:
          'messages,messaging_postbacks,messaging_optins,messaging_referrals,messaging_handovers,messaging_policy_enforcement',
        verify_token: '1234567890',
      });

      expect(res).toEqual(reply);
    });

    it('should set other optional parameters', async () => {
      const { client, mock } = createMock();
      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.createSubscription({
        appId: '54321',
        callbackUrl: 'https://mycallback.com',
        verifyToken: '1234567890',
        object: 'user',
        fields: ['messages', 'messaging_postbacks'],
        includeValues: true,
        accessToken: APP_ACCESS_TOKEN,
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/${APP_ID}/subscriptions?access_token=${APP_ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        object: 'user',
        callback_url: 'https://mycallback.com',
        fields: 'messages,messaging_postbacks',
        verify_token: '1234567890',
        include_values: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getSubscriptions', () => {
    it('should get current subscriptions', async () => {
      const { client, mock } = createMock();
      const reply = {
        data: [
          {
            object: 'page',
            callback_url: 'https://mycallback.com',
            active: true,
            fields: [
              {
                name: 'messages',
                version: 'v2.12',
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

      const res = await client.getSubscriptions();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/${APP_ID}/subscriptions?access_token=${APP_ID}|${APP_SECRET}`
      );

      expect(res).toEqual([
        {
          object: 'page',
          callbackUrl: 'https://mycallback.com',
          active: true,
          fields: [
            {
              name: 'messages',
              version: 'v2.12',
            },
          ],
        },
      ]);
    });
  });

  describe('#getPageSubscription', () => {
    it('should get current page subscription', async () => {
      const { client, mock } = createMock();
      const reply = {
        data: [
          {
            object: 'page',
            callback_url: 'https://mycallback.com',
            active: true,
            fields: [
              {
                name: 'messages',
                version: 'v2.12',
              },
            ],
          },
          {
            object: 'user',
            callback_url: 'https://mycallback.com',
            active: true,
            fields: [
              {
                name: 'feed',
                version: 'v2.12',
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

      const res = await client.getPageSubscription();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/${APP_ID}/subscriptions?access_token=${APP_ID}|${APP_SECRET}`
      );

      expect(res).toEqual({
        object: 'page',
        callbackUrl: 'https://mycallback.com',
        active: true,
        fields: [
          {
            name: 'messages',
            version: 'v2.12',
          },
        ],
      });
    });
  });
});

describe('#getMessagingFeatureReview', () => {
  it('should response feature array', async () => {
    const { client, mock } = createMock();
    const reply = {
      data: [
        {
          feature: 'subscription_messaging',
          status: 'approved',
        },
      ],
    };

    let url;
    mock.onGet().reply(config => {
      url = config.url;
      return [200, reply];
    });

    const res = await client.getMessagingFeatureReview();

    expect(url).toEqual(
      `https://graph.facebook.com/v4.0/me/messaging_feature_review?access_token=${ACCESS_TOKEN}`
    );

    expect(res).toEqual([
      {
        feature: 'subscription_messaging',
        status: 'approved',
      },
    ]);
  });
});

describe('user profile', () => {
  describe('#getUserProfile', () => {
    it('should get user profile with default fields', async () => {
      const { client, mock } = createMock();
      const reply = {
        id: '1',
        first_name: 'Kevin',
        last_name: 'Durant',
        profile_pic: 'https://example.com/pic.png',
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getUserProfile('1');

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/1?fields=id,name,first_name,last_name,profile_pic&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        id: '1',
        firstName: 'Kevin',
        lastName: 'Durant',
        profilePic: 'https://example.com/pic.png',
      });
    });

    it('should get user profile with given fields', async () => {
      const { client, mock } = createMock();
      const reply = {
        id: '1',
        first_name: 'Kevin',
        last_name: 'Durant',
        profile_pic: 'https://example.com/pic.png',
        locale: 'en_US',
        timezone: 8,
        gender: 'male',
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getUserProfile('1', {
        fields: [
          'id',
          'name',
          'first_name',
          'last_name',
          'profile_pic',
          'locale',
          'timezone',
          'gender',
        ],
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/1?fields=id,name,first_name,last_name,profile_pic,locale,timezone,gender&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual({
        id: '1',
        firstName: 'Kevin',
        lastName: 'Durant',
        profilePic: 'https://example.com/pic.png',
        locale: 'en_US',
        timezone: 8,
        gender: 'male',
      });
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
            tag: 'POST_PURCHASE_UPDATE',
            description:
              'Notify the message recipient of an update on an existing transaction.',
          },
          {
            tag: 'ACCOUNT_UPDATE',
            description:
              'Notify the message recipient of a change to their account settings.',
          },
        ],
      };

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getMessageTags();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/page_message_tags?access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual([
        {
          tag: 'POST_PURCHASE_UPDATE',
          description:
            'Notify the message recipient of an update on an existing transaction.',
        },
        {
          tag: 'ACCOUNT_UPDATE',
          description:
            'Notify the message recipient of a change to their account settings.',
        },
      ]);
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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadAttachment(
        'image',
        'http://www.yoctol-rocks.com/image.jpg'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: 'http://www.yoctol-rocks.com/image.jpg',
              is_reusable: false,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });

    it('can upload reusable attachment', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadAttachment(
        'image',
        'http://www.yoctol-rocks.com/image.jpg',
        { isReusable: true }
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: 'http://www.yoctol-rocks.com/image.jpg',
              is_reusable: true,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });

    it('can call api with file stream', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadAttachment(
        'file',
        fs.createReadStream('./')
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toBeInstanceOf(FormData);

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });
  });

  describe('#uploadAudio', () => {
    it('should call messages api to upload audio', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadAudio(
        'http://www.yoctol-rocks.com/audio.mp3'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'audio',
            payload: {
              url: 'http://www.yoctol-rocks.com/audio.mp3',
              is_reusable: false,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });
  });

  describe('#uploadImage', () => {
    it('should call messages api to upload image', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadImage(
        'http://www.yoctol-rocks.com/image.jpg'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: 'http://www.yoctol-rocks.com/image.jpg',
              is_reusable: false,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });
  });

  describe('#uploadVideo', () => {
    it('should call messages api to upload video', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadVideo(
        'http://www.yoctol-rocks.com/video.mp4'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'video',
            payload: {
              url: 'http://www.yoctol-rocks.com/video.mp4',
              is_reusable: false,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
    });
  });

  describe('#uploadFile', () => {
    it('should call messages api to upload file', async () => {
      const { client, mock } = createMock();

      const reply = {
        attachment_id: '1854626884821032',
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.uploadFile(
        'http://www.yoctol-rocks.com/file.pdf'
      );

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/message_attachments?access_token=${ACCESS_TOKEN}`
      );
      expect(data).toEqual({
        message: {
          attachment: {
            type: 'file',
            payload: {
              url: 'http://www.yoctol-rocks.com/file.pdf',
              is_reusable: false,
            },
          },
        },
      });

      expect(res).toEqual({
        attachmentId: '1854626884821032',
      });
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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.setNLPConfigs({
        nlpEnabled: true,
        customToken: '1234567890',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/nlp_configs?nlp_enabled=true&custom_token=1234567890`
      );
      expect(data).toEqual({
        access_token: ACCESS_TOKEN,
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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.enableNLP();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/nlp_configs?nlp_enabled=true`
      );
      expect(data).toEqual({
        access_token: ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#disableNLP', () => {
    it('should call api to disable NLP', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.disableNLP();

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/me/nlp_configs?nlp_enabled=false`
      );
      expect(data).toEqual({
        access_token: ACCESS_TOKEN,
      });

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

      let url;
      let data;
      mock.onPost().reply(config => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.logCustomEvents({
        appId: 12345,
        pageId: 67890,
        pageScopedUserId: USER_ID,
        events: [
          {
            _eventName: 'fb_mobile_purchase',
            _valueToSum: 55.22,
            _fb_currency: 'USD',
          },
        ],
      });

      expect(url).toEqual(`https://graph.facebook.com/v4.0/12345/activities`);
      expect(data).toEqual({
        event: 'CUSTOM_APP_EVENTS',
        custom_events:
          '[{"_eventName":"fb_mobile_purchase","_valueToSum":55.22,"_fb_currency":"USD"}]',
        advertiser_tracking_enabled: 0,
        application_tracking_enabled: 0,
        extinfo: '["mb1"]',
        page_id: 67890,
        page_scoped_user_id: USER_ID,
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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getIdsForApps({
        userId: '12345123',
        appSecret: APP_SECRET,
        page: '5678',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/12345123/ids_for_apps?access_token=${ACCESS_TOKEN}&appsecret_proof=4894f81b47c53ccf240a1130d119db2c69833eac9be09adeebc8e7226fb73e73&page=5678`
      );

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

      let url;
      mock.onGet().reply(config => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getIdsForPages({
        userId: '12345123',
        appSecret: APP_SECRET,
        app: '5678',
      });

      expect(url).toEqual(
        `https://graph.facebook.com/v4.0/12345123/ids_for_pages?access_token=${ACCESS_TOKEN}&appsecret_proof=4894f81b47c53ccf240a1130d119db2c69833eac9be09adeebc8e7226fb73e73&app=5678`
      );

      expect(res).toEqual(reply);
    });
  });
});

describe('Error', () => {
  it('should be formatted correctly', async () => {
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
