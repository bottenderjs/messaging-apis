import MockAdapter from 'axios-mock-adapter';

import ViberClient from '../ViberClient';

const AUTH_TOKEN = '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9';

const RECEIVER = '1234567890';

const SENDER = {
  name: 'John McClane',
  avatar: 'http://avatar.example.com',
};

const createMock = () => {
  const client = new ViberClient(AUTH_TOKEN, SENDER);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('webhooks', () => {
  describe('#setWebhook', () => {
    it('should response event_types was set', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
        event_types: [
          'delivered',
          'seen',
          'failed',
          'subscribed',
          'unsubscribed',
          'conversation_started',
        ],
      };

      mock
        .onPost('/set_webhook', { url: 'https://4a16faff.ngrok.io/' })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/');

      expect(res).toEqual(reply);
    });

    it('should work with custom event types', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
        event_types: ['delivered', 'seen', 'conversation_started'],
      };

      mock
        .onPost('/set_webhook', {
          url: 'https://4a16faff.ngrok.io/',
          event_types: ['delivered', 'seen', 'conversation_started'],
        })
        .reply(200, reply);

      const res = await client.setWebhook('https://4a16faff.ngrok.io/', [
        'delivered',
        'seen',
        'conversation_started',
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#removeWebhook', () => {
    it('should remove subscribed webhook', async () => {
      const { client, mock } = createMock();
      const reply = {
        status: 0,
        status_message: 'ok',
      };

      mock.onPost('/set_webhook', { url: '' }).reply(200, reply);

      const res = await client.removeWebhook();

      expect(res).toEqual(reply);
    });
  });
});

describe('send message', () => {
  describe('#sendMessage', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'text',
          text: 'Hello',
        })
        .reply(200, reply);

      const res = await client.sendMessage(RECEIVER, {
        type: 'text',
        text: 'Hello',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'text',
          text: 'Hello',
        })
        .reply(200, reply);

      const res = await client.sendText(RECEIVER, 'Hello');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendPicture', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'picture',
          text: 'Photo description',
          media: 'http://www.images.com/img.jpg',
          thumbnail: 'http://www.images.com/thumb.jpg',
        })
        .reply(200, reply);

      const res = await client.sendPicture(RECEIVER, {
        text: 'Photo description',
        media: 'http://www.images.com/img.jpg',
        thumbnail: 'http://www.images.com/thumb.jpg',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'video',
          media: 'http://www.images.com/video.mp4',
          size: 10000,
          thumbnail: 'http://www.images.com/thumb.jpg',
          duration: 10,
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECEIVER, {
        media: 'http://www.images.com/video.mp4',
        size: 10000,
        thumbnail: 'http://www.images.com/thumb.jpg',
        duration: 10,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendFile', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'file',
          media: 'http://www.images.com/file.doc',
          size: 10000,
          file_name: 'name_of_file.doc',
        })
        .reply(200, reply);

      const res = await client.sendFile(RECEIVER, {
        media: 'http://www.images.com/file.doc',
        size: 10000,
        file_name: 'name_of_file.doc',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendContact', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'contact',
          contact: {
            name: 'Itamar',
            phone_number: '+972511123123',
          },
        })
        .reply(200, reply);

      const res = await client.sendContact(RECEIVER, {
        name: 'Itamar',
        phone_number: '+972511123123',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendLocation', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'location',
          location: {
            lat: '37.7898',
            lon: '-122.3942',
          },
        })
        .reply(200, reply);

      const res = await client.sendLocation(RECEIVER, {
        lat: '37.7898',
        lon: '-122.3942',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendURL', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'url',
          media: 'http://developers.viber.com',
        })
        .reply(200, reply);

      const res = await client.sendURL(RECEIVER, 'http://developers.viber.com');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendSticker', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'sticker',
          sticker_id: 46105,
        })
        .reply(200, reply);

      const res = await client.sendSticker(RECEIVER, 46105);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendCarouselContent', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 5098034272017990000,
      };

      const richMedia = {
        Type: 'rich_media',
        ButtonsGroupColumns: 6,
        ButtonsGroupRows: 7,
        BgColor: '#FFFFFF',
        Buttons: [
          {
            Columns: 6,
            Rows: 3,
            ActionType: 'open-url',
            ActionBody: 'https://www.google.com',
            Image: 'http://html-test:8080/myweb/guy/assets/imageRMsmall2.png',
          },
          {
            Columns: 6,
            Rows: 2,
            Text:
              '<font color=#323232><b>Headphones with Microphone, On-ear Wired earphones</b></font><font color=#777777><br>Sound Intone </font><font color=#6fc133>$17.99</font>',
            ActionType: 'open-url',
            ActionBody: 'https://www.google.com',
            TextSize: 'medium',
            TextVAlign: 'middle',
            TextHAlign: 'left',
          },
          {
            Columns: 6,
            Rows: 1,
            ActionType: 'reply',
            ActionBody: 'https://www.google.com',
            Text: '<font color=#ffffff>Buy</font>',
            TextSize: 'large',
            TextVAlign: 'middle',
            TextHAlign: 'middle',
            Image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
          },
          {
            Columns: 6,
            Rows: 1,
            ActionType: 'reply',
            ActionBody: 'https://www.google.com',
            Text: '<font color=#8367db>MORE DETAILS</font>',
            TextSize: 'small',
            TextVAlign: 'middle',
            TextHAlign: 'middle',
          },
          {
            Columns: 6,
            Rows: 3,
            ActionType: 'open-url',
            ActionBody: 'https://www.google.com',
            Image: 'https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png',
          },
          {
            Columns: 6,
            Rows: 2,
            Text:
              "<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
            ActionType: 'open-url',
            ActionBody: 'https://www.google.com',
            TextSize: 'medium',
            TextVAlign: 'middle',
            TextHAlign: 'left',
          },
          {
            Columns: 6,
            Rows: 1,
            ActionType: 'reply',
            ActionBody: 'https://www.google.com',
            Text: '<font color=#ffffff>Buy</font>',
            TextSize: 'large',
            TextVAlign: 'middle',
            TextHAlign: 'middle',
            Image: 'https://s14.postimg.org/4mmt4rw1t/Button.png',
          },
          {
            Columns: 6,
            Rows: 1,
            ActionType: 'reply',
            ActionBody: 'https://www.google.com',
            Text: '<font color=#8367db>MORE DETAILS</font>',
            TextSize: 'small',
            TextVAlign: 'middle',
            TextHAlign: 'middle',
          },
        ],
      };

      mock
        .onPost(`/send_message`, {
          receiver: RECEIVER,
          sender: {
            name: 'John McClane',
            avatar: 'http://avatar.example.com',
          },
          type: 'rich_media',
          min_api_version: 2,
          rich_media: richMedia,
        })
        .reply(200, reply);

      const res = await client.sendCarouselContent(RECEIVER, richMedia);

      expect(res).toEqual(reply);
    });
  });
});

describe('keyboards', () => {
  it('should work with message api', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 0,
      status_message: 'ok',
      message_token: 5098034272017990000,
    };

    const keyboard = {
      Type: 'keyboard',
      DefaultHeight: true,
      Buttons: [
        {
          ActionType: 'reply',
          ActionBody: 'reply to me',
          Text: 'Key text',
          TextSize: 'regular',
        },
      ],
    };

    mock
      .onPost(`/send_message`, {
        receiver: RECEIVER,
        sender: {
          name: 'John McClane',
          avatar: 'http://avatar.example.com',
        },
        type: 'text',
        text: 'Hello',
        keyboard,
      })
      .reply(200, reply);

    const res = await client.sendText(RECEIVER, 'Hello', {
      keyboard,
    });

    expect(res).toEqual(reply);
  });
});

describe('get account info', () => {
  describe('#getAccountInfo', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const reply = {
        status: 0,
        status_message: 'ok',
        id: 'pa:75346594275468546724',
        name: 'account name',
        uri: 'accountUri',
        icon: 'http://example.com',
        background: 'http://example.com',
        category: 'category',
        subcategory: 'sub category',
        location: {
          lon: 0.1,
          lat: 0.2,
        },
        country: 'UK',
        webhook: 'https://my.site.com',
        event_types: ['delivered', 'seen'],
        subscribers_count: 35,
        members: [
          {
            id: '01234567890A=',
            name: 'my name',
            avatar: 'http://example.com',
            role: 'admin',
          },
        ],
      };

      mock.onPost(`/get_account_info`, {}).reply(200, reply);

      const res = await client.getAccountInfo();

      expect(res).toEqual(reply);
    });
  });
});

describe('get user details', () => {
  describe('#getUserDetails', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const user = {
        id: '01234567890A=',
        name: 'John McClane',
        avatar: 'http://avatar.example.com',
        country: 'UK',
        language: 'en',
        primary_device_os: 'android 7.1',
        api_version: 1,
        viber_version: '6.5.0',
        mcc: 1,
        mnc: 1,
        device_type: 'iPhone9,4',
      };

      const reply = {
        status: 0,
        status_message: 'ok',
        message_token: 4912661846655238145,
        user,
      };

      mock
        .onPost(`/get_user_details`, {
          id: '01234567890A=',
        })
        .reply(200, reply);

      const res = await client.getUserDetails('01234567890A=');

      expect(res).toEqual(user);
    });
  });
});

describe('get online', () => {
  describe('#getOnlineStatus', () => {
    it('should call viber api', async () => {
      const { client, mock } = createMock();

      const users = [
        {
          id: '01234567890=',
          online_status: 0,
          online_status_message: 'online',
        },
        {
          id: '01234567891=',
          online_status: 1,
          online_status_message: 'offline',
          last_online: 1457764197627,
        },
        {
          id: '01234567893=',
          online_status: 3,
          online_status_message: 'tryLater',
        },
      ];

      const reply = {
        status: 0,
        status_message: 'ok',
        users,
      };

      mock
        .onPost(`/get_online`, {
          ids: ['01234567890=', '01234567891=', '01234567893='],
        })
        .reply(200, reply);

      const res = await client.getOnlineStatus([
        '01234567890=',
        '01234567891=',
        '01234567893=',
      ]);

      expect(res).toEqual(users);
    });
  });
});
