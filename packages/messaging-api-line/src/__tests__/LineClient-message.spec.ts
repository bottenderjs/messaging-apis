import getStream from 'get-stream';

import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setNarrowcastProgress,
  setupLineServer,
} from './testing-library';

setupLineServer();

it('should support #reply with sending request body', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.reply({
    replyToken: constants.REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: constants.REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #reply with sending a message array', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.reply(
    constants.REPLY_TOKEN,
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: constants.REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #reply with sending a message', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.reply(
    constants.REPLY_TOKEN,
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/reply');
  expect(request?.body).toEqual({
    replyToken: constants.REPLY_TOKEN,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

const RECIPIENT_ID = 'U00000000000000000000000000000000';

it('should support #push with sending request body', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.push({
    to: RECIPIENT_ID,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/push');
  expect(request?.body).toEqual({
    to: RECIPIENT_ID,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #push with sending a message array', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.push(
    RECIPIENT_ID,
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/push');
  expect(request?.body).toEqual({
    to: RECIPIENT_ID,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #push with sending a message', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.push(
    RECIPIENT_ID,
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/message/push');
  expect(request?.body).toEqual({
    to: RECIPIENT_ID,
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #multicast with sending request body', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.multicast({
    to: [RECIPIENT_ID],
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #multicast with sending a message array', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.multicast(
    [RECIPIENT_ID],
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #multicast with sending a message', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.multicast(
    [RECIPIENT_ID],
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/multicast'
  );
  expect(request?.body).toEqual({
    to: [RECIPIENT_ID],
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #narrowcast with sending request body', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await line.narrowcast({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
    recipient: {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    filter: {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    limit: {
      max: 100,
      upToRemainingQuota: false,
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/narrowcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
    recipient: {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    filter: {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    limit: {
      max: 100,
      upToRemainingQuota: false,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #narrowcast with sending a message array', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await line.narrowcast(
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    {
      max: 100,
      upToRemainingQuota: false,
    },
    true
  );

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/narrowcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
    recipient: {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    filter: {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    limit: {
      max: 100,
      upToRemainingQuota: false,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #narrowcast with sending a message', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  await line.narrowcast(
    {
      type: 'text',
      text: 'Hello, world',
    },
    {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    {
      max: 100,
      upToRemainingQuota: false,
    },
    true
  );

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/narrowcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
    recipient: {
      type: 'operator',
      and: [
        {
          type: 'audience',
          audienceGroupId: 5614991017776,
        },
        {
          type: 'operator',
          not: {
            type: 'audience',
            audienceGroupId: 4389303728991,
          },
        },
      ],
    },
    filter: {
      demographic: {
        type: 'operator',
        or: [
          {
            type: 'operator',
            and: [
              {
                type: 'gender',
                oneOf: ['male', 'female'],
              },
              {
                type: 'age',
                gte: 'age_20',
                lt: 'age_25',
              },
              {
                type: 'appType',
                oneOf: ['android', 'ios'],
              },
              {
                type: 'area',
                oneOf: ['jp_23', 'jp_05'],
              },
              {
                type: 'subscriptionPeriod',
                gte: 'day_7',
                lt: 'day_30',
              },
            ],
          },
          {
            type: 'operator',
            and: [
              {
                type: 'age',
                gte: 'age_35',
                lt: 'age_40',
              },
              {
                type: 'operator',
                not: {
                  type: 'gender',
                  oneOf: ['male'],
                },
              },
            ],
          },
        ],
      },
    },
    limit: {
      max: 100,
      upToRemainingQuota: false,
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getNarrowcastProgress', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const { requestId } = await line.narrowcast({
    type: 'text',
    text: 'Hello, world',
  });

  let res = await line.getNarrowcastProgress(requestId);

  expect(res).toEqual({
    phase: 'waiting',
  });

  setNarrowcastProgress(requestId, {
    phase: 'succeeded',
    successCount: 1,
    failureCount: 1,
    targetCount: 2,
    acceptedTime: '2020-12-03T10:15:30.121Z',
    completedTime: '2020-12-03T10:15:30.121Z',
  });

  res = await line.getNarrowcastProgress(requestId);

  expect(res).toEqual({
    phase: 'succeeded',
    successCount: 1,
    failureCount: 1,
    targetCount: 2,
    acceptedTime: '2020-12-03T10:15:30.121Z',
    completedTime: '2020-12-03T10:15:30.121Z',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/message/progress/narrowcast?requestId=${requestId}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #broadcast with sending request body', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.broadcast({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #broadcast with sending a message array', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.broadcast(
    [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #broadcast with sending a message', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.broadcast(
    {
      type: 'text',
      text: 'Hello, world',
    },
    true
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/message/broadcast'
  );
  expect(request?.body).toEqual({
    messages: [
      {
        type: 'text',
        text: 'Hello, world',
      },
    ],
    notificationDisabled: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getMessageContent', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getMessageContent(constants.MESSAGE_ID);

  expect(res).toEqual(Buffer.from('a content buffer'));
});

it('should support getMessageContentStream', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getMessageContentStream(constants.MESSAGE_ID);

  expect(await getStream(res)).toEqual('a content buffer');
});
