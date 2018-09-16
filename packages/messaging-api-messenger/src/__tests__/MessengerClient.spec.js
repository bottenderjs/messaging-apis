import fs from 'fs';

import FormData from 'form-data';
import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';
const APP_SECRET = '1WDVGY78';

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
  const APP_ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

  describe('#createSubscription', () => {
    it('should set default fields', async () => {
      const { client, mock } = createMock();
      const reply = {
        success: true,
      };

      mock
        .onPost(`/54321/subscriptions?access_token=${APP_ACCESS_TOKEN}`, {
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
        access_token: APP_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });

    it('should set other optional parameters', async () => {
      const { client, mock } = createMock();
      const reply = {
        success: true,
      };

      mock
        .onPost(`/54321/subscriptions?access_token=${APP_ACCESS_TOKEN}`, {
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
        access_token: APP_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
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

    mock
      .onGet(`/me/messaging_feature_review?access_token=${ACCESS_TOKEN}`)
      .reply(200, reply);

    const res = await client.getMessagingFeatureReview();

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

  describe('#requestThreadControl', () => {
    it('should call messages api to request thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/me/request_thread_control?access_token=${ACCESS_TOKEN}`, {
          recipient: {
            id: USER_ID,
          },
          metadata: 'free formed text for primary app',
        })
        .reply(200, reply);

      const res = await client.requestThreadControl(
        USER_ID,
        'free formed text for primary app'
      );

      expect(res).toEqual(reply);
    });

    it('should call messages api to request thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/me/request_thread_control?access_token=${options.access_token}`,
          {
            recipient: {
              id: USER_ID,
            },
            metadata: 'free formed text for primary app',
          }
        )
        .reply(200, reply);

      const res = await client.requestThreadControl(
        USER_ID,
        'free formed text for primary app',
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

describe('#getThreadOwner', () => {
  it('should call messages api to get thread owner', async () => {
    const { client, mock } = createMock();

    const reply = {
      data: [
        {
          thread_owner: {
            app_id: '12345678910',
          },
        },
      ],
    };

    mock
      .onGet(
        `/me/thread_owner?recipient=${USER_ID}&access_token=${ACCESS_TOKEN}`
      )
      .reply(200, reply);

    const res = await client.getThreadOwner(USER_ID, ACCESS_TOKEN);

    expect(res).toEqual({ app_id: '12345678910' });
  });

  it('should call messages api to get thread owner with custom access token', async () => {
    const { client, mock } = createMock();

    const reply = {
      data: [
        {
          thread_owner: {
            app_id: '12345678910',
          },
        },
      ],
    };

    const options = {
      access_token: '0987654321',
    };

    mock
      .onGet(
        `/me/thread_owner?recipient=${USER_ID}&access_token=${
          options.access_token
        }`
      )
      .reply(200, reply);

    const res = await client.getThreadOwner(USER_ID, options);

    expect(res).toEqual({ app_id: '12345678910' });
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
