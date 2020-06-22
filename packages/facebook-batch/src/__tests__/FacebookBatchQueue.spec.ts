import { MessengerClient } from 'messaging-api-messenger';
import { mocked } from 'ts-jest/utils';

import BatchRequestError from '../BatchRequestError';
import FacebookBatchQueue from '../FacebookBatchQueue';
import { isError613 } from '..';

jest.mock('messaging-api-messenger');

const { MessengerBatch } = jest.requireActual('messaging-api-messenger');

const image = {
  attachment: {
    type: 'image',
    payload: {
      url:
        'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
    },
  },
};

let queue: FacebookBatchQueue;

function setup(
  options = {}
): {
  client: MessengerClient;
  timeout: NodeJS.Timeout;
} {
  // https://github.com/nodejs/node/blob/e1ad548cd4bfb996ea925584542f30c85aa3dfa1/lib/internal/timers.js#L202-L231
  const timeout: NodeJS.Timeout = {
    hasRef: () => true,
    refresh: () => timeout,
    ref: () => timeout,
    unref: () => timeout,
  };
  mocked(setTimeout).mockReturnValue(timeout);

  const client = new MessengerClient({
    accessToken: 'ACCESS_TOKEN',
    appSecret: 'APP_SECRET',
  });
  queue = new FacebookBatchQueue(client, options);

  return {
    client,
    timeout,
  };
}

afterEach(() => {
  queue.stop();
});

it('should push psid and messages to queue', () => {
  setup();

  queue.push(MessengerBatch.sendMessage('1412611362105802', image));

  expect(queue.queue).toHaveLength(1);
});

it('should flush when length >= 50', async () => {
  const { client } = setup();

  const responses = Array(50)
    .fill(0)
    .map(() => ({
      code: 200,
      body: { data: [] },
    }));

  mocked(client.sendBatch).mockResolvedValue(responses);

  for (let i = 0; i < 49; i++) {
    queue.push(MessengerBatch.sendText('1412611362105802', 'hello'));
  }

  queue.push(MessengerBatch.sendMessage('1412611362105802', image));

  expect(client.sendBatch).toHaveBeenCalledTimes(1);
  expect(mocked(client.sendBatch).mock.calls[0][0]).toHaveLength(50);

  expect(mocked(client.sendBatch).mock.calls[0][0][49]).toEqual({
    body: {
      message: {
        attachment: {
          payload: {
            url:
              'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
          },
          type: 'image',
        },
      },
      messagingType: 'UPDATE',
      recipient: { id: '1412611362105802' },
    },
    method: 'POST',
    relativeUrl: 'me/messages',
  });

  expect(queue.queue).toHaveLength(0);
});

it('should flush with 1000 timeout', async () => {
  const { client } = setup();

  const responses = [
    {
      code: 200,
      body: { data: [] },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  queue.push(MessengerBatch.sendMessage('1412611362105802', image));

  expect(queue.queue).toHaveLength(1);

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();

  expect(client.sendBatch).toHaveBeenCalledTimes(1);
  expect(mocked(client.sendBatch).mock.calls[0][0]).toEqual([
    {
      body: {
        message: {
          attachment: {
            payload: {
              url:
                'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
            },
            type: 'image',
          },
        },
        messagingType: 'UPDATE',
        recipient: { id: '1412611362105802' },
      },
      method: 'POST',
      relativeUrl: 'me/messages',
    },
  ]);
});

it('should not send batch when with empty array', async () => {
  const { client } = setup();

  const responses = [
    {
      code: 200,
      body: { data: [] },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();

  expect(client.sendBatch).not.toBeCalled();
});

it('should reset timeout when flush', async () => {
  const { client, timeout } = setup();

  const responses = Array(50)
    .fill(0)
    .map(() => ({
      code: 200,
      body: { data: [] },
    }));

  mocked(client.sendBatch).mockResolvedValue(responses);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  for (let i = 0; i < 49; i++) {
    // eslint-disable-next-line no-await-in-loop
    queue.push(MessengerBatch.sendText('1412611362105802', 'hello'));
  }

  queue.push(MessengerBatch.sendMessage('1412611362105802', image));

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(timeout);
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});

it('should throw request and response', async () => {
  const { client } = setup();

  const responses = [
    {
      code: 400,
      body: {
        error: {
          message:
            '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
        },
      },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  let error: BatchRequestError | undefined;

  queue
    .push(MessengerBatch.sendMessage('1412611362105802', image))
    .catch((err) => {
      error = err;
    });

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();

  expect(error).toBeDefined();
  expect(error!.request).toEqual({
    body: {
      message: {
        attachment: {
          payload: {
            url:
              'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
          },
          type: 'image',
        },
      },
      messagingType: 'UPDATE',
      recipient: { id: '1412611362105802' },
    },
    method: 'POST',
    relativeUrl: 'me/messages',
  });
  expect(error!.response).toEqual({
    body: {
      error: {
        message:
          '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
      },
    },
    code: 400,
  });
});

it('should support delay option', async () => {
  const { client } = setup({ delay: 500 });

  const responses = [
    {
      code: 200,
      body: { data: [] },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
});

it('should support retryTimes option', async () => {
  const { client } = setup({ retryTimes: 3 });

  const responses = [
    {
      code: 400,
      body: {
        error: {
          message:
            '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
        },
      },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  let error: BatchRequestError | undefined;
  queue
    .push(MessengerBatch.sendMessage('1412611362105802', image))
    .catch((err) => {
      error = err;
    });

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();
  expect(error).not.toBeDefined();

  await fn();
  expect(error).not.toBeDefined();

  await fn();
  expect(error).not.toBeDefined();

  await fn();
  expect(error).toBeDefined();
});

it('should support shouldRetry option', async () => {
  const { client } = setup({
    retryTimes: 1,
    shouldRetry: isError613,
  });

  const responses = [
    {
      code: 400,
      body: {
        error: {
          message:
            '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
        },
      },
    },
    {
      code: 400,
      body: {
        error: {
          message: '(#613) Calls to this api have exceeded the rate limit.',
        },
      },
    },
  ];

  mocked(client.sendBatch).mockResolvedValue(responses);

  let error1: BatchRequestError | undefined;
  const request1 = MessengerBatch.sendMessage('1412611362105802', image);

  queue.push(request1).catch((err: BatchRequestError) => {
    error1 = err;
  });

  let error2: BatchRequestError | undefined;
  const request2 = MessengerBatch.sendMessage('1412611362105802', image);

  queue.push(request2).catch((err: BatchRequestError) => {
    error2 = err;
  });

  expect(queue.queue).toHaveLength(2);

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();

  expect(queue.queue).toHaveLength(1);
  expect(client.sendBatch).toHaveBeenCalledTimes(1);
  expect(mocked(client.sendBatch).mock.calls[0][0]).toHaveLength(2);
  expect(mocked(client.sendBatch).mock.calls[0][0][0]).toBe(request1);
  expect(mocked(client.sendBatch).mock.calls[0][0][1]).toBe(request2);
  expect(error1).toBeDefined();
  expect(error2).not.toBeDefined();

  await fn();
  expect(queue.queue).toHaveLength(0);
  expect(client.sendBatch).toHaveBeenCalledTimes(2);
  expect(mocked(client.sendBatch).mock.calls[1][0]).toHaveLength(1);
  expect(mocked(client.sendBatch).mock.calls[1][0][0]).toBe(request2);

  expect(error2).toBeDefined();
});

it('should reject every promise when call batch failed', async () => {
  const { client } = setup();

  mocked(client.sendBatch).mockImplementation(() => {
    throw new Error('boom');
  });

  let error1: BatchRequestError | undefined;
  const request1 = MessengerBatch.sendMessage('1412611362105802', image);

  queue.push(request1).catch((err: BatchRequestError) => {
    error1 = err;
  });

  let error2: BatchRequestError | undefined;
  const request2 = MessengerBatch.sendMessage('1412611362105802', image);

  queue.push(request2).catch((err: BatchRequestError) => {
    error2 = err;
  });

  const fn = mocked(setTimeout).mock.calls[0][0];

  await fn();

  expect(error1).toBeDefined();
  expect(error2).toBeDefined();
});
