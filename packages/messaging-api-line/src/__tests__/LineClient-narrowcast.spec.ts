import { LineClient } from '..';

import {
  getCurrentContext,
  setNarrowcastProgress,
  setupLineServer,
} from './testing-library';

setupLineServer();

function setup() {
  const context = getCurrentContext();
  const client = new LineClient({
    accessToken: 'ACCESS_TOKEN',
    channelSecret: 'CHANNEL_SECRET',
  });

  return { context, client };
}

describe('#narrowcast', () => {
  it('should support sending request body', async () => {
    const { context, client } = setup();

    await client.narrowcast({
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

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('POST');
    expect(request?.url.toString()).toBe(
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

  it('should support sending a message array', async () => {
    const { context, client } = setup();

    await client.narrowcast(
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

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('POST');
    expect(request?.url.toString()).toBe(
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

  it('should support sending a message', async () => {
    const { context, client } = setup();

    await client.narrowcast(
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

    const { request } = context;

    expect(request).toBeDefined();
    expect(request?.method).toBe('POST');
    expect(request?.url.toString()).toBe(
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
});

it('#getNarrowcastProgress should get the status of a narrowcast message', async () => {
  const { context, client } = setup();

  const { requestId } = await client.narrowcast({
    type: 'text',
    text: 'Hello, world',
  });

  let res = await client.getNarrowcastProgress(requestId);

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

  res = await client.getNarrowcastProgress(requestId);

  expect(res).toEqual({
    phase: 'succeeded',
    successCount: 1,
    failureCount: 1,
    targetCount: 2,
    acceptedTime: '2020-12-03T10:15:30.121Z',
    completedTime: '2020-12-03T10:15:30.121Z',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    `https://api.line.me/v2/bot/message/progress/narrowcast?requestId=${requestId}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
