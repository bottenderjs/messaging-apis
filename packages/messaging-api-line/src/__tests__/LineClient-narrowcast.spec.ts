import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';
import * as Types from '../LineTypes';

const RECIPIENT_ID = '1QAZ2WSX';
const CUSTOM_ACCESS_TOKEN = '555555555';
const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = ({
  customAccessToken,
}: { customAccessToken?: string } = {}): {
  client: LineClient;
  mock: MockAdapter;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
} => {
  const client = new LineClient(ACCESS_TOKEN, CHANNEL_SECRET);
  const mock = new MockAdapter(client.axios);
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${customAccessToken || ACCESS_TOKEN}`,
  };
  return { client, mock, headers };
};

describe('Narrowcast', () => {
  const messages: Types.Message[] = [
    {
      type: 'text',
      text: 'test message',
    },
  ];

  const recipient: Types.RecipientObject = {
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
  };

  const demographic: Types.DemographicFilterObject = {
    type: 'operator' as 'operator',
    or: [
      {
        type: 'operator' as 'operator',
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
        type: 'operator' as 'operator',
        and: [
          {
            type: 'age',
            gte: 'age_35',
            lt: 'age_40',
          },
          {
            type: 'operator' as 'operator',
            not: {
              type: 'gender',
              oneOf: ['male'],
            },
          },
        ],
      },
    ],
  };

  const rawBody = {
    messages,
    recipient,
    filter: {
      demographic,
    },
    limit: {
      max: 100,
    },
  };

  describe('#narrowcastRawBody', () => {
    it('should call narrowcast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcastRawBody(rawBody);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcastRawBody(rawBody, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#narrowcast', () => {
    it('should call narrowcast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcast(messages, {
        recipient,
        demographic,
        max: 100,
      });

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcast(messages, {
        recipient,
        demographic,
        max: 100,
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#narrowcastMessages', () => {
    it('should call narrowcast api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcastMessages(messages, {
        recipient,
        demographic,
        max: 100,
      });

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      const reply = {};

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/message/narrowcast'
        );
        expect(JSON.parse(config.data)).toEqual(rawBody);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.narrowcastMessages(messages, {
        recipient,
        demographic,
        max: 100,
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getNarrowcastProgress', () => {
    const requestId = '123';
    const reply = {
      phase: 'succeeded',
      successCount: 1,
      failureCount: 1,
      targetCount: 2,
    };

    it('should call getNarrowcastProgress api', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock();

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/message/progress/narrowcast?requestId=${requestId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getNarrowcastProgress(requestId);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/message/progress/narrowcast?requestId=${requestId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getNarrowcastProgress(requestId, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });
});
