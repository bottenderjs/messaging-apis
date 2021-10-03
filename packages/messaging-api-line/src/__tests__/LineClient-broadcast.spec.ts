import { RestRequest, rest } from 'msw';
import { setupServer } from 'msw/node';

import LineClient from '../LineClient';

const lineServer = setupServer();
beforeAll(() => {
  // Establish requests interception layer before all tests.
  lineServer.listen();
});
afterEach(() => {
  // Reset any runtime handlers tests may use.
  lineServer.resetHandlers();
});
afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  lineServer.close();
});

describe('#broadcastRaw', () => {
  it('should call broadcast api', async () => {
    let request: RestRequest | undefined;
    lineServer.use(
      rest.post(
        'https://api.line.me/v2/bot/message/broadcast',
        (req, res, ctx) => {
          request = req;
          return res(ctx.json({}));
        }
      )
    );

    const client = new LineClient({
      accessToken: 'ACCESS_TOKEN',
      channelSecret: 'CHANNEL_SECRET',
    });

    await client.broadcastRawBody({
      messages: [
        {
          type: 'text',
          text: 'Hello, world1',
        },
      ],
    });

    request = request as RestRequest;

    expect(request).toBeDefined();
    expect(request.method).toBe('POST');
    expect(request.url.toString()).toBe(
      'https://api.line.me/v2/bot/message/broadcast'
    );
    expect(request.body).toEqual({
      messages: [
        {
          type: 'text',
          text: 'Hello, world1',
        },
      ],
    });
    expect(request.headers.get('Content-Type')).toBe('application/json');
    expect(request.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});

describe('#broadcast', () => {
  it('should call broadcast api', async () => {
    let request: RestRequest | undefined;
    lineServer.use(
      rest.post(
        'https://api.line.me/v2/bot/message/broadcast',
        (req, res, ctx) => {
          request = req;
          return res(ctx.json({}));
        }
      )
    );

    const client = new LineClient({
      accessToken: 'ACCESS_TOKEN',
      channelSecret: 'CHANNEL_SECRET',
    });

    await client.broadcast([
      {
        type: 'text',
        text: 'Hello, world1',
      },
    ]);

    request = request as RestRequest;

    expect(request).toBeDefined();
    expect(request.method).toBe('POST');
    expect(request.url.toString()).toBe(
      'https://api.line.me/v2/bot/message/broadcast'
    );
    expect(request.body).toEqual({
      messages: [
        {
          type: 'text',
          text: 'Hello, world1',
        },
      ],
    });
    expect(request.headers.get('Content-Type')).toBe('application/json');
    expect(request.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
  });
});
