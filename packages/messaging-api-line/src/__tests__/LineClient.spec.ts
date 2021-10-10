import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';
import * as Line from '../Line';

const RECIPIENT_ID = '1QAZ2WSX';
const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
  dataMock: MockAdapter;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
} => {
  const client = new LineClient({
    accessToken: ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
  });
  const mock = new MockAdapter(client.axios);
  const dataMock = new MockAdapter(client.dataAxios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, dataMock, headers };
};

describe('Content', () => {
  describe('#getMessageContent', () => {
    it('should call getMessageContent api', async () => {
      const { client, dataMock } = createMock();

      const reply = Buffer.from('a content buffer');

      const MESSAGE_ID = '1234567890';

      dataMock.onGet(`/v2/bot/message/${MESSAGE_ID}/content`).reply(200, reply);

      const res = await client.getMessageContent(MESSAGE_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Profile', () => {
  describe('#getUserProfile', () => {
    it('should respond user profile', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
        statusMessage: 'Hello, LINE!',
      };

      mock.onGet().reply((config) => {
        expect(config.url).toEqual(`/v2/bot/profile/${RECIPIENT_ID}`);
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });

    it('should return null when no user found', async () => {
      const { client, mock } = createMock();

      mock.onGet().reply(404, {
        message: 'Not found',
      });

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(null);
    });
  });
});

describe('Account link', () => {
  describe('#getLinkToken', () => {
    it('should respond data with link token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();
      const reply = {
        linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
      };

      mock.onPost().reply((config) => {
        expect(config.url).toEqual(`/v2/bot/user/${RECIPIENT_ID}/linkToken`);
        expect(config.data).toEqual(undefined);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getLinkToken(RECIPIENT_ID);

      expect(res).toEqual('NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY');
    });
  });
});

describe('Error', () => {
  it('should format correctly when no details', async () => {
    const { client, mock } = createMock();

    const reply = {
      message: 'The request body has 2 error(s)',
    };

    mock.onAny().reply(400, reply);

    let error;
    try {
      await client.reply(REPLY_TOKEN, [Line.text('Hello!')]);
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual('LINE API - The request body has 2 error(s)');
  });

  it('should format correctly when details exist', async () => {
    const { client, mock } = createMock();

    const reply = {
      message: 'The request body has 2 error(s)',
      details: [
        { message: 'May not be empty', property: 'messages[0].text' },
        {
          message:
            'Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]',
          property: 'messages[1].type',
        },
      ],
    };

    mock.onAny().reply(400, reply);

    let error;
    try {
      await client.reply(REPLY_TOKEN, [Line.text('Hello!')]);
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual(`LINE API - The request body has 2 error(s)
- messages[0].text: May not be empty
- messages[1].type: Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]`);
  });
});
