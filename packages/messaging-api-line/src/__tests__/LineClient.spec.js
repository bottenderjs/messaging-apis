import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const RECIPIENT_ID = '1QAZ2WSX';
const REPLY_TOKEN = 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

const createMock = () => {
  const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('Content', () => {
  describe('#retrieveMessageContent', () => {
    it('should call retrieveMessageContent api', async () => {
      const { client, mock } = createMock();

      const reply = Buffer.from('a content buffer');

      const MESSAGE_ID = '1234567890';

      mock
        .onGet(`/v2/bot/message/${MESSAGE_ID}/content`, undefined, headers)
        .reply(200, reply);

      const res = await client.retrieveMessageContent(MESSAGE_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Profile', () => {
  describe('#getUserProfile', () => {
    it('should response user profile', async () => {
      const { client, mock } = createMock();
      const reply = {
        displayName: 'LINE taro',
        userId: RECIPIENT_ID,
        pictureUrl: 'http://obs.line-apps.com/...',
        statusMessage: 'Hello, LINE!',
      };

      mock
        .onGet(`/v2/bot/profile/${RECIPIENT_ID}`, undefined, headers)
        .reply(200, reply);

      const res = await client.getUserProfile(RECIPIENT_ID);

      expect(res).toEqual(reply);
    });
  });
});

describe('Account link', () => {
  describe('#issueLinkToken', () => {
    it('should response data with link token', async () => {
      const { client, mock } = createMock();
      const reply = {
        linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
      };

      mock
        .onPost(`/v2/bot/user/${RECIPIENT_ID}/linkToken`, undefined, headers)
        .reply(200, reply);

      const res = await client.issueLinkToken(RECIPIENT_ID);

      expect(res).toEqual(reply);
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
      await client.replyText(REPLY_TOKEN, 'Hello!');
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
      await client.replyText(REPLY_TOKEN, 'Hello!');
    } catch (err) {
      error = err;
    }

    expect(error.message).toEqual(`LINE API - The request body has 2 error(s)
- messages[0].text: May not be empty
- messages[1].type: Must be one of the following values: [text, image, video, audio, location, sticker, template, imagemap]`);
  });
});
