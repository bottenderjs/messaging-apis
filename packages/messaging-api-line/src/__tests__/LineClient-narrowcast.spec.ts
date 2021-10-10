import { RestRequest, rest } from 'msw';

import { LineClient } from '..';

import { setupLineServer } from './testing-library';

const lineServer = setupLineServer();

function setup() {
  const context: { request: RestRequest | undefined } = {
    request: undefined,
  };
  lineServer.use(
    rest.post(
      'https://api.line.me/v2/bot/message/narrowcast',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.status(202),
          ctx.json({}),
          ctx.set('X-Line-Request-Id', '5b59509c-c57b-11e9-aa8c-2a2ae2dbcce4')
        );
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/message/progress/narrowcast',
      (req, res, ctx) => {
        context.request = req;

        if (
          req.url.searchParams.get('requestId') ===
          '5b59509c-c57b-11e9-aa8c-2a2ae2dbcce4'
        ) {
          return res(
            ctx.json({
              phase: 'succeeded',
              successCount: 1,
              failureCount: 1,
              targetCount: 2,
            })
          );
        }

        return res(ctx.status(400));
      }
    )
  );

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
  const res = await client.getNarrowcastProgress(requestId);

  expect(res).toEqual({
    phase: 'succeeded',
    successCount: 1,
    failureCount: 1,
    targetCount: 2,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/message/progress/narrowcast?requestId=5b59509c-c57b-11e9-aa8c-2a2ae2dbcce4'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
