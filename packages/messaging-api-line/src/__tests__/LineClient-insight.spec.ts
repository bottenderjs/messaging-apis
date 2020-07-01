import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

const ACCESS_TOKEN = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = (): {
  client: LineClient;
  mock: MockAdapter;
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
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  return { client, mock, headers };
};

describe('#getTargetLimitForAdditionalMessages', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      type: 'limited',
      value: 1000,
    };

    let url;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getTargetLimitForAdditionalMessages();

    expect(url).toEqual('/v2/bot/message/quota');
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      type: 'limited',
      value: 1000,
    });
  });
});

describe('#getNumberOfMessagesSentThisMonth', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      totalUsage: '500',
    };

    let url;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfMessagesSentThisMonth();

    expect(url).toEqual('/v2/bot/message/quota/consumption');
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      totalUsage: '500',
    });
  });
});

describe('#getNumberOfSentReplyMessages', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      success: 10000,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfSentReplyMessages('20191116');

    expect(url).toEqual('/v2/bot/message/delivery/reply');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      success: 10000,
    });
  });
});

describe('#getNumberOfSentPushMessages', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      success: 10000,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfSentPushMessages('20191116');

    expect(url).toEqual('/v2/bot/message/delivery/push');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      success: 10000,
    });
  });
});

describe('#getNumberOfSentMulticastMessages', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      success: 10000,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfSentMulticastMessages('20191116');

    expect(url).toEqual('/v2/bot/message/delivery/multicast');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      success: 10000,
    });
  });
});

describe('#getNumberOfSentBroadcastMessages', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      success: 10000,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfSentBroadcastMessages('20191116');

    expect(url).toEqual('/v2/bot/message/delivery/broadcast');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      success: 10000,
    });
  });
});

describe('#getNumberOfMessageDeliveries', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      broadcast: 5385,
      targeting: 522,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfMessageDeliveries('20191116');

    expect(url).toEqual('/v2/bot/insight/message/delivery');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      broadcast: 5385,
      targeting: 522,
    });
  });
});

describe('#getNumberOfFollowers', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      status: 'ready',
      followers: 7620,
      targetedReaches: 5848,
      blocks: 237,
    };

    let url;
    let params;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      params = config.params;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getNumberOfFollowers('20191116');

    expect(url).toEqual('/v2/bot/insight/followers');
    expect(params).toEqual({
      date: '20191116',
    });
    expect(headers).toEqual(headers);

    expect(res).toEqual({
      status: 'ready',
      followers: 7620,
      targetedReaches: 5848,
      blocks: 237,
    });
  });
});

describe('#getFriendDemographics', () => {
  it('should call api and resolve the data', async () => {
    const { client, mock } = createMock();

    const reply = {
      available: true,
      genders: [
        {
          gender: 'unknown',
          percentage: 37.6,
        },
        {
          gender: 'male',
          percentage: 31.8,
        },
        {
          gender: 'female',
          percentage: 30.6,
        },
      ],
      ages: [
        {
          age: 'unknown',
          percentage: 37.6,
        },
        {
          age: 'from50',
          percentage: 17.3,
        },
      ],
      areas: [
        {
          area: 'unknown',
          percentage: 42.9,
        },
        {
          area: '徳島',
          percentage: 2.9,
        },
      ],
      appTypes: [
        {
          appType: 'ios',
          percentage: 62.4,
        },
        {
          appType: 'android',
          percentage: 27.7,
        },
        {
          appType: 'others',
          percentage: 9.9,
        },
      ],
      subscriptionPeriods: [
        {
          subscriptionPeriod: 'over365days',
          percentage: 96.4,
        },
        {
          subscriptionPeriod: 'within365days',
          percentage: 1.9,
        },
        {
          subscriptionPeriod: 'within180days',
          percentage: 1.2,
        },
        {
          subscriptionPeriod: 'within90days',
          percentage: 0.5,
        },
        {
          subscriptionPeriod: 'within30days',
          percentage: 0.1,
        },
        {
          subscriptionPeriod: 'within7days',
          percentage: 0,
        },
      ],
    };

    let url;
    let headers;
    mock.onGet().reply((config) => {
      url = config.url;
      headers = config.headers;
      return [200, reply];
    });

    const res = await client.getFriendDemographics();

    expect(url).toEqual('/v2/bot/insight/demographic');
    expect(headers).toEqual(headers);

    expect(res).toEqual(reply);
  });
});
