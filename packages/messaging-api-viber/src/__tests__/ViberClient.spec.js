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

  it('create axios with Viber API', () => {
    axios.create = jest.fn();
    ViberClient.connect(AUTH_TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://chatapi.viber.com/pa/',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': AUTH_TOKEN,
      },
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

  it('create axios with Viber API', () => {
    axios.create = jest.fn();
    new ViberClient(AUTH_TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://chatapi.viber.com/pa/',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': AUTH_TOKEN,
      },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new ViberClient(AUTH_TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

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
