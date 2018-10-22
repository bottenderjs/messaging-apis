import MockAdapter from 'axios-mock-adapter';

import LinePay from '../LinePay';

const CHANNEL_ID = '1234567890';
const CHANNEL_SECRET = 'so-secret';

const createMock = () => {
  const client = new LinePay({
    channelId: CHANNEL_ID,
    channelSecret: CHANNEL_SECRET,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with LINE PAY API', () => {
    axios.create = jest.fn();
    LinePay.connect({
      channelId: CHANNEL_ID,
      channelSecret: CHANNEL_SECRET,
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api-pay.line.me/v2/',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': CHANNEL_ID,
        'X-LINE-ChannelSecret': CHANNEL_SECRET,
      },
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with LINE PAY API', () => {
    axios.create = jest.fn();
    // eslint-disable-next-line no-new
    new LinePay({
      channelId: CHANNEL_ID,
      channelSecret: CHANNEL_SECRET,
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://api-pay.line.me/v2/',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': CHANNEL_ID,
        'X-LINE-ChannelSecret': CHANNEL_SECRET,
      },
    });
  });

  it('support sandbox', () => {
    axios.create = jest.fn();
    // eslint-disable-next-line no-new
    new LinePay({
      channelId: CHANNEL_ID,
      channelSecret: CHANNEL_SECRET,
      sandbox: true,
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://sandbox-api-pay.line.me/v2/',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': CHANNEL_ID,
        'X-LINE-ChannelSecret': CHANNEL_SECRET,
      },
    });
  });

  it('support origin', () => {
    axios.create = jest.fn();
    // eslint-disable-next-line no-new
    new LinePay({
      channelId: CHANNEL_ID,
      channelSecret: CHANNEL_SECRET,
      origin: 'https://mydummytestserver.com',
    });

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://mydummytestserver.com/v2/',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': CHANNEL_ID,
        'X-LINE-ChannelSecret': CHANNEL_SECRET,
      },
    });
  });
});

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new LinePay({
      channelId: CHANNEL_ID,
      channelSecret: CHANNEL_SECRET,
    });
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('#getPayments', () => {
  const reply = {
    returnCode: '0000',
    returnMessage: 'success',
    info: [
      {
        transactionId: 1020140728100001997,
        transactionDate: '2014-07-28T09:48:43Z',
        transactionType: 'PARTIAL_REFUND',
        amount: -5,
        productName: '',
        currency: 'USD',
        orderId: '20140101123123123',
        originalTransactionId: 1020140728100001999,
      },
    ],
  };

  it('should work with transactionId and orderId', async () => {
    const { client, mock } = createMock();

    mock
      .onGet('/payments?transactionId=20140101123123123&orderId=1002045572')
      .reply(200, reply);

    const result = await client.getPayments({
      transactionId: '20140101123123123',
      orderId: '1002045572',
    });

    expect(result).toEqual(reply.info);
  });

  it('should work with only transactionId', async () => {
    const { client, mock } = createMock();

    mock.onGet('/payments?transactionId=20140101123123123').reply(200, reply);

    const result = await client.getPayments({
      transactionId: '20140101123123123',
    });

    expect(result).toEqual(reply.info);
  });

  it('should work with only orderId', async () => {
    const { client, mock } = createMock();

    mock.onGet('/payments?orderId=1002045572').reply(200, reply);

    const result = await client.getPayments({
      orderId: '1002045572',
    });

    expect(result).toEqual(reply.info);
  });

  it('should throw without any id', async () => {
    const { client } = createMock();

    await expect(() => client.getPayments()).toThrow(
      /One of `transactionId` or `orderId` must be provided/
    );
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    mock.onGet('/payments?orderId=1002045572').reply(200, {
      returnCode: '1104',
      returnMessage: 'merchant not found',
    });

    return expect(
      client.getPayments({
        orderId: '1002045572',
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});

describe('#getAuthorizations', () => {
  const reply = {
    returnCode: '0000',
    returnMessage: 'success',
    info: [
      {
        transactionId: 201612312312333401,
        transactionDate: '2014-07-28T09:48:43Z',
        transactionType: 'PAYMENT',
        payInfo: [
          {
            method: 'BALANCE',
            amount: 10,
          },
          {
            method: 'DISCOUNT',
            amount: 10,
          },
        ],

        productName: 'tes production',
        currency: 'USD',
        orderId: '20140101123123123',
        payStatus: 'AUTHORIZATION',
        authorizationExpireDate: '2014-07-28T09:48:43Z',
      },
    ],
  };

  it('should work with transactionId and orderId', async () => {
    const { client, mock } = createMock();

    mock
      .onGet(
        '/payments/authorizations?transactionId=20140101123123123&orderId=1002045572'
      )
      .reply(200, reply);

    const result = await client.getAuthorizations({
      transactionId: '20140101123123123',
      orderId: '1002045572',
    });

    expect(result).toEqual(reply.info);
  });

  it('should work with only transactionId', async () => {
    const { client, mock } = createMock();

    mock
      .onGet('/payments/authorizations?transactionId=20140101123123123')
      .reply(200, reply);

    const result = await client.getAuthorizations({
      transactionId: '20140101123123123',
    });

    expect(result).toEqual(reply.info);
  });

  it('should work with only orderId', async () => {
    const { client, mock } = createMock();

    mock.onGet('/payments/authorizations?orderId=1002045572').reply(200, reply);

    const result = await client.getAuthorizations({
      orderId: '1002045572',
    });

    expect(result).toEqual(reply.info);
  });

  it('should throw without any id', async () => {
    const { client } = createMock();

    await expect(() => client.getAuthorizations()).toThrow(
      /One of `transactionId` or `orderId` must be provided/
    );
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    mock.onGet('/payments/authorizations?orderId=1002045572').reply(200, {
      returnCode: '1104',
      returnMessage: 'merchant not found',
    });

    return expect(
      client.getAuthorizations({
        orderId: '1002045572',
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});

describe('#reserve', () => {
  it('should call reserve api', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '0000',
      returnMessage: 'OK',
      info: {
        transactionId: 123123123123,
        paymentUrl: {
          web: 'http://web-pay.line.me/web/wait?transactionReserveId=blahblah',
          app: 'line://pay/payment/blahblah',
        },
        paymentAccessToken: '187568751124',
      },
    };

    mock
      .onPost('/payments/request', {
        productName: 'test product',
        productImageUrl: 'http://testst.com',
        amount: 10,
        currency: 'USD',
        mid: 'os89dufgoiw8yer9021384rdfeq',
        orderId: '20140101123456789',
        confirmUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2FcheckResult.nhn%3ForderId%3D20140101123456789',
        cancelUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2ForderSheet.nhn%3ForderId%3D20140101123456789',
        capture: 'true',
        confirmUrlType: 'CLIENT',
        extras: {
          addFriends: [
            {
              type: 'LINE_AT',
              idList: ['@aaa', '@bbb'],
            },
          ],
          branchName: 'test_branch_1',
        },
      })
      .reply(200, reply);

    const result = await client.reserve({
      productName: 'test product',
      productImageUrl: 'http://testst.com',
      amount: 10,
      currency: 'USD',
      mid: 'os89dufgoiw8yer9021384rdfeq',
      orderId: '20140101123456789',
      confirmUrl:
        'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2FcheckResult.nhn%3ForderId%3D20140101123456789',
      cancelUrl:
        'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2ForderSheet.nhn%3ForderId%3D20140101123456789',
      capture: 'true',
      confirmUrlType: 'CLIENT',
      extras: {
        addFriends: [
          {
            type: 'LINE_AT',
            idList: ['@aaa', '@bbb'],
          },
        ],
        branchName: 'test_branch_1',
      },
    });

    expect(result).toEqual({
      transactionId: 123123123123,
      paymentUrl: {
        web: 'http://web-pay.line.me/web/wait?transactionReserveId=blahblah',
        app: 'line://pay/payment/blahblah',
      },
      paymentAccessToken: '187568751124',
    });
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '1104',
      returnMessage: 'merchant not found',
      info: {
        transactionId: 123123123123,
        paymentUrl: {
          web: 'http://web-pay.line.me/web/wait?transactionReserveId=blahblah',
          app: 'line://pay/payment/blahblah',
        },
        paymentAccessToken: '187568751124',
      },
    };

    mock
      .onPost('/payments/request', {
        productName: 'test product',
        productImageUrl: 'http://testst.com',
        amount: 10,
        currency: 'USD',
        mid: 'os89dufgoiw8yer9021384rdfeq',
        orderId: '20140101123456789',
        confirmUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2FcheckResult.nhn%3ForderId%3D20140101123456789',
        cancelUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2ForderSheet.nhn%3ForderId%3D20140101123456789',
        capture: 'true',
        confirmUrlType: 'CLIENT',
        extras: {
          addFriends: [
            {
              type: 'LINE_AT',
              idList: ['@aaa', '@bbb'],
            },
          ],
          branchName: 'test_branch_1',
        },
      })
      .reply(200, reply);

    return expect(
      client.reserve({
        productName: 'test product',
        productImageUrl: 'http://testst.com',
        amount: 10,
        currency: 'USD',
        mid: 'os89dufgoiw8yer9021384rdfeq',
        orderId: '20140101123456789',
        confirmUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2FcheckResult.nhn%3ForderId%3D20140101123456789',
        cancelUrl:
          'naversearchapp://inappbrowser?url=http%3A%2F%2FtestMall.com%2ForderSheet.nhn%3ForderId%3D20140101123456789',
        capture: 'true',
        confirmUrlType: 'CLIENT',
        extras: {
          addFriends: [
            {
              type: 'LINE_AT',
              idList: ['@aaa', '@bbb'],
            },
          ],
          branchName: 'test_branch_1',
        },
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});

describe('#confirm', () => {
  it('should call confirm api', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '0000',
      returnMessage: 'OK',
      info: {
        orderId: 'order_210124213',
        transactionId: 20140101123123123,
        payInfo: [
          {
            method: 'BALANCE',
            amount: 10,
          },
          {
            method: 'DISCOUNT',
            amount: 10,
          },
        ],
      },
    };

    mock
      .onPost('/payments/sdhqiwouehrafdasrqoi123as/confirm', {
        amount: 1000,
        currency: 'TWD',
      })
      .reply(200, reply);

    const result = await client.confirm('sdhqiwouehrafdasrqoi123as', {
      amount: 1000,
      currency: 'TWD',
    });

    expect(result).toEqual({
      orderId: 'order_210124213',
      transactionId: 20140101123123123,
      payInfo: [
        {
          method: 'BALANCE',
          amount: 10,
        },
        {
          method: 'DISCOUNT',
          amount: 10,
        },
      ],
    });
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '1104',
      returnMessage: 'merchant not found',
      info: {
        orderId: 'order_210124213',
        transactionId: 20140101123123123,
        payInfo: [
          {
            method: 'BALANCE',
            amount: 10,
          },
          {
            method: 'DISCOUNT',
            amount: 10,
          },
        ],
      },
    };

    mock
      .onPost('/payments/sdhqiwouehrafdasrqoi123as/confirm', {
        amount: 1000,
        currency: 'TWD',
      })
      .reply(200, reply);

    return expect(
      client.confirm('sdhqiwouehrafdasrqoi123as', {
        amount: 1000,
        currency: 'TWD',
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});

describe('#capture', () => {
  it('should call capture api', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '0000',
      returnMessage: 'OK',
      info: {
        transactionId: 20140101123123123,
        orderId: 'order_210124213',
        payInfo: [
          {
            method: 'BALANCE',
            amount: 10,
          },
          {
            method: 'DISCOUNT',
            amount: 10,
          },
        ],
      },
    };

    mock
      .onPost('/payments/authorizations/sdhqiwouehrafdasrqoi123as/capture', {
        amount: 1000,
        currency: 'TWD',
      })
      .reply(200, reply);

    const result = await client.capture('sdhqiwouehrafdasrqoi123as', {
      amount: 1000,
      currency: 'TWD',
    });

    expect(result).toEqual({
      transactionId: 20140101123123123,
      orderId: 'order_210124213',
      payInfo: [
        {
          method: 'BALANCE',
          amount: 10,
        },
        {
          method: 'DISCOUNT',
          amount: 10,
        },
      ],
    });
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '1104',
      returnMessage: 'merchant not found',
      info: {
        transactionId: 20140101123123123,
        orderId: 'order_210124213',
        payInfo: [
          {
            method: 'BALANCE',
            amount: 10,
          },
          {
            method: 'DISCOUNT',
            amount: 10,
          },
        ],
      },
    };

    mock
      .onPost('/payments/authorizations/sdhqiwouehrafdasrqoi123as/capture', {
        amount: 1000,
        currency: 'TWD',
      })
      .reply(200, reply);

    return expect(
      client.capture('sdhqiwouehrafdasrqoi123as', {
        amount: 1000,
        currency: 'TWD',
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});

describe('#void', () => {
  it('should call void api', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '0000',
      returnMessage: 'OK',
    };

    mock
      .onPost('/payments/authorizations/sdhqiwouehrafdasrqoi123as/void')
      .reply(200, reply);

    const result = await client.void('sdhqiwouehrafdasrqoi123as');

    expect(result).toBeUndefined();
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '1104',
      returnMessage: 'merchant not found',
    };

    mock
      .onPost('/payments/authorizations/sdhqiwouehrafdasrqoi123as/void')
      .reply(200, reply);

    return expect(client.void('sdhqiwouehrafdasrqoi123as')).rejects.toThrow(
      'LINE PAY API - 1104 merchant not found'
    );
  });
});

describe('#refund', () => {
  it('should call refund api', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '0000',
      returnMessage: 'success',
      info: {
        refundTransactionId: 123123123123,
        refundTransactionDate: '2014-01-01T06:17:41Z',
      },
    };

    mock.onPost('/payments/sdhqiwouehrafdasrqoi123as/refund').reply(200, reply);

    const result = await client.refund('sdhqiwouehrafdasrqoi123as', {
      refundAmount: 500,
    });

    expect(result).toEqual({
      refundTransactionId: 123123123123,
      refundTransactionDate: '2014-01-01T06:17:41Z',
    });
  });

  it('should throw when not success', async () => {
    const { client, mock } = createMock();

    const reply = {
      returnCode: '1104',
      returnMessage: 'merchant not found',
      info: {
        refundTransactionId: 123123123123,
        refundTransactionDate: '2014-01-01T06:17:41Z',
      },
    };

    mock.onPost('/payments/sdhqiwouehrafdasrqoi123as/refund').reply(200, reply);

    return expect(
      client.refund('sdhqiwouehrafdasrqoi123as', {
        refundAmount: 500,
      })
    ).rejects.toThrow('LINE PAY API - 1104 merchant not found');
  });
});
