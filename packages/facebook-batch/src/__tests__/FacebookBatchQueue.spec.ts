import { RestRequest, rest } from 'msw';
import { setupServer } from 'msw/node';

import BatchRequestError from '../BatchRequestError';
import FacebookBatchQueue from '../FacebookBatchQueue';
import { isError613 } from '..';

const USER_ID = 'USER_ID';

const requestItem = {
  method: 'POST',
  relativeUrl: 'me/messages',
  body: {
    messagingType: 'UPDATE',
    message: {
      text: 'Hello',
    },
    recipient: {
      id: USER_ID,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentReq: RestRequest<any> | undefined;

const server = setupServer(
  rest.post<{ batch: any[] }>(
    'https://graph.facebook.com/:version/',
    (req, res, ctx) => {
      currentReq = req;
      return res(
        ctx.json(
          Array(req.body.batch.length)
            .fill(0)
            .map(() => ({
              code: 200,
              body: JSON.stringify({
                recipient_id: USER_ID,
                message_id: 'mid.1489394984387:3dd22de509',
              }),
            }))
        )
      );
    }
  )
);

if (typeof beforeAll === 'function') {
  beforeAll(() => {
    // Establish requests interception layer before all tests.
    server.listen();
  });
}

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
  currentReq = undefined;
});

afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  server.close();
});

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

let bq: FacebookBatchQueue;

function setup(options = {}) {
  bq = new FacebookBatchQueue({
    accessToken: 'ACCESS_TOKEN',
    appSecret: 'APP_SECRET',
    ...options,
  });

  return {};
}

afterEach(() => {
  bq.stop();
});

it('should push requests to queue', () => {
  setup();

  bq.push(requestItem);

  expect(bq.queue).toHaveLength(1);
});

it('should flush when length >= 50', async () => {
  setup();

  for (let i = 0; i < 49; i++) {
    bq.push({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: USER_ID,
        },
      },
    });
  }

  await bq.push(requestItem);

  expect(currentReq).toBeDefined();
  expect(currentReq!.body.batch).toHaveLength(50);
  expect(currentReq!.body.batch[49]).toEqual({
    method: 'POST',
    relative_url: 'me/messages',
    body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
  });

  expect(bq.queue).toHaveLength(0);
});

it('should flush with 1 second timeout by default', async () => {
  setup();

  bq.push(requestItem);

  expect(bq.queue).toHaveLength(1);

  jest.advanceTimersByTime(1000);
  await flushPromises();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body).toEqual({
    access_token: 'ACCESS_TOKEN',
    app_secret_proof:
      'a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c',
    batch: [
      {
        method: 'POST',
        relative_url: 'me/messages',
        body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
      },
    ],
    include_headers: true,
  });
});

it('should not send batch when no items in queue', async () => {
  setup();

  expect(bq.queue).toHaveLength(0);

  jest.advanceTimersByTime(1000);
  await flushPromises();

  expect(currentReq).not.toBeDefined();
});

it('should reset timer after flushing', async () => {
  setup();

  bq.push(requestItem);

  await bq.flush();

  bq.push(requestItem);

  expect(bq.queue).toHaveLength(1);

  jest.advanceTimersByTime(1000);
  await flushPromises();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body.batch).toEqual([
    {
      method: 'POST',
      relative_url: 'me/messages',
      body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
    },
  ]);
});

it('should throw error includes request and response', async () => {
  setup();

  server.use(
    rest.post<{ batch: any[] }>(
      'https://graph.facebook.com/:version/',
      (req, res, ctx) => {
        currentReq = req;
        return res(
          ctx.json([
            {
              code: 400,
              body: JSON.stringify({
                error: {
                  message:
                    '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
                },
              }),
            },
          ])
        );
      }
    )
  );

  const promise = bq.push(requestItem);

  jest.advanceTimersByTime(1000);

  let error: BatchRequestError | undefined;
  try {
    await promise;
  } catch (err) {
    error = err as BatchRequestError;
  }

  expect(error).toBeDefined();
  expect(error!.request).toEqual({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });
  expect(error!.response).toEqual({
    code: 400,
    body: {
      error: {
        message:
          '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
      },
    },
  });
});

it('should support custom delay', async () => {
  setup({
    delay: 3000,
  });

  bq.push(requestItem);

  expect(bq.queue).toHaveLength(1);

  jest.advanceTimersByTime(1000);
  await flushPromises();

  expect(currentReq).not.toBeDefined();

  jest.advanceTimersByTime(2000);
  await flushPromises();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body.batch).toEqual([
    {
      method: 'POST',
      relative_url: 'me/messages',
      body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
    },
  ]);
});

it('should support retryTimes', async () => {
  setup({ retryTimes: 2 });

  let count = 0;
  server.use(
    rest.post<{ batch: any[] }>(
      'https://graph.facebook.com/:version/',
      (req, res, ctx) => {
        currentReq = req;
        count += 1;
        return res(
          ctx.json([
            {
              code: 400,
              body: JSON.stringify({
                error: {
                  message:
                    '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
                },
              }),
            },
          ])
        );
      }
    )
  );

  const promise = bq.push(requestItem);

  expect(bq.queue).toHaveLength(1);

  await bq.flush();
  await bq.flush();
  await bq.flush();

  let error: BatchRequestError | undefined;
  try {
    await promise;
  } catch (err) {
    error = err as BatchRequestError;
  }

  expect(error).toBeDefined();
  expect(error!.request).toEqual({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });
  expect(error!.response).toEqual({
    code: 400,
    body: {
      error: {
        message:
          '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
      },
    },
  });

  expect(count).toBe(3);
  expect(bq.queue).toHaveLength(0);
});

it('should support shouldRetry', async () => {
  setup({
    retryTimes: 1,
    shouldRetry: isError613,
  });

  server.use(
    rest.post<{ batch: any[] }>(
      'https://graph.facebook.com/:version/',
      (req, res, ctx) => {
        currentReq = req;
        return res(
          ctx.json([
            {
              code: 400,
              body: JSON.stringify({
                error: {
                  message:
                    '(#100) Param recipient[id] must be a valid ID string (e.g., "123")',
                },
              }),
            },
            {
              code: 400,
              body: JSON.stringify({
                error: {
                  message:
                    '(#613) Calls to this api have exceeded the rate limit.',
                },
              }),
            },
          ])
        );
      }
    )
  );

  const promise1 = bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello 1',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  const promise2 = bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello 2',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  expect(bq.queue).toHaveLength(2);

  await bq.flush();

  let error1: BatchRequestError | undefined;
  try {
    await promise1;
  } catch (err) {
    error1 = err as BatchRequestError;
  }

  expect(bq.queue).toHaveLength(1);
  expect(currentReq).toBeDefined();
  expect(currentReq!.body.batch).toEqual([
    {
      method: 'POST',
      relative_url: 'me/messages',
      body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%201%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
    },
    {
      method: 'POST',
      relative_url: 'me/messages',
      body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%202%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
    },
  ]);
  expect(error1).toBeDefined();

  await bq.flush();

  let error2: BatchRequestError | undefined;
  try {
    await promise2;
  } catch (err) {
    error2 = err as BatchRequestError;
  }

  expect(bq.queue).toHaveLength(0);
  expect(currentReq).toBeDefined();
  expect(currentReq!.body.batch).toEqual([
    {
      method: 'POST',
      relative_url: 'me/messages',
      body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%202%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
    },
  ]);
  expect(error2).toBeDefined();
});

it('should reject every promises when call batch failed', async () => {
  setup();

  server.use(
    rest.post('https://graph.facebook.com/:version/', (req, res, ctx) => {
      currentReq = req;
      return res(ctx.status(500));
    })
  );

  const promise1 = bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello 1',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  const promise2 = bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello 2',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  expect(bq.queue).toHaveLength(2);

  await bq.flush();

  let error1: BatchRequestError | undefined;
  try {
    await promise1;
  } catch (err) {
    error1 = err as BatchRequestError;
  }

  let error2: BatchRequestError | undefined;
  try {
    await promise2;
  } catch (err) {
    error2 = err as BatchRequestError;
  }

  expect(error1).toBeDefined();
  expect(error2).toBeDefined();
});

it('should support version', async () => {
  setup({ version: '10.0' });

  bq.push(requestItem);

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.params.version).toEqual('v10.0');
});

it('should support origin', async () => {
  setup({ origin: 'https://mydummytestserver.com' });

  server.use(
    rest.post('*', (req, res, ctx) => {
      currentReq = req;
      return res(
        ctx.json([
          {
            code: 200,
            body: JSON.stringify({
              recipient_id: USER_ID,
              message_id: 'mid.1489394984387:3dd22de509',
            }),
          },
        ])
      );
    })
  );

  bq.push(requestItem);

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.url.href).toBe('https://mydummytestserver.com/v12.0/');
});

it('should support includeHeaders', async () => {
  setup({ includeHeaders: true });

  bq.push(requestItem);

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body.include_headers).toBe(true);
});

it('should support batch-level appsecret_proof when access_token exists in query', async () => {
  setup({ includeHeaders: true });

  bq.push({
    method: 'POST',
    relativeUrl: 'me/messages?access_token=BATCH_LEVEL_TOKEN',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body).toEqual({
    access_token: 'ACCESS_TOKEN',
    app_secret_proof:
      'a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c',
    batch: [
      {
        body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
        method: 'POST',
        relative_url:
          'me/messages?access_token=BATCH_LEVEL_TOKEN&appsecret_proof=60c91e2c579aee9fa535ff377fb4c4fc060badd16d0e74bfb2e5e5e317dfe052',
      },
    ],
    include_headers: true,
  });
});

it('should support batch-level appsecret_proof when access_token exists in body', async () => {
  setup({ includeHeaders: false });

  bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      accessToken: 'BATCH_LEVEL_TOKEN',
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body).toEqual({
    access_token: 'ACCESS_TOKEN',
    app_secret_proof:
      'a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c',
    batch: [
      {
        body: 'access_token=BATCH_LEVEL_TOKEN&messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
        method: 'POST',
        relative_url:
          'me/messages?appsecret_proof=60c91e2c579aee9fa535ff377fb4c4fc060badd16d0e74bfb2e5e5e317dfe052',
      },
    ],
    include_headers: false,
  });
});

it('should support skipAppSecretProof', async () => {
  setup({ skipAppSecretProof: true });

  bq.push(requestItem);
  bq.push({
    method: 'POST',
    relativeUrl: 'me/messages?access_token=BATCH_LEVEL_TOKEN',
    body: {
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });
  bq.push({
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      accessToken: 'BATCH_LEVEL_TOKEN',
      messagingType: 'UPDATE',
      message: {
        text: 'Hello',
      },
      recipient: {
        id: USER_ID,
      },
    },
  });

  await bq.flush();

  expect(currentReq).toBeDefined();
  expect(currentReq!.body).toEqual({
    access_token: 'ACCESS_TOKEN',
    batch: [
      {
        body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
        method: 'POST',
        relative_url: 'me/messages',
      },
      {
        body: 'messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
        method: 'POST',
        relative_url: 'me/messages?access_token=BATCH_LEVEL_TOKEN',
      },
      {
        body: 'access_token=BATCH_LEVEL_TOKEN&messaging_type=UPDATE&message=%7B%22text%22%3A%22Hello%22%7D&recipient=%7B%22id%22%3A%22USER_ID%22%7D',
        method: 'POST',
        relative_url: 'me/messages',
      },
    ],
    include_headers: true,
  });
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  setup({ onRequest });

  bq.push(requestItem);

  await bq.flush();

  expect(onRequest).toBeCalledWith({
    method: 'post',
    url: 'https://graph.facebook.com/v12.0/me/messages',
    body: {
      message: {
        text: 'Hello',
      },
      messaging_type: 'UPDATE',
      recipient: {
        id: 'USER_ID',
      },
    },
    headers: {},
  });
});
