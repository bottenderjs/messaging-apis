import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('payment api', () => {
  describe('#sendInvoice', () => {
    const result = {
      messageId: 1,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499403678,
      invoice: {
        title: 'product name',
        description: 'product description',
        startParameter: 'pay',
        currency: 'USD',
        totalCount: 22000,
      },
    };
    const reply = {
      ok: true,
      result: {
        message_id: 1,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499403678,
        invoice: {
          title: 'product name',
          description: 'product description',
          start_parameter: 'pay',
          currency: 'USD',
          total_count: 22000,
        },
      },
    };

    it('should send invoice message to user with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/sendInvoice', {
          chat_id: 427770117,
          title: 'product name',
          description: 'product description',
          payload: 'bot-defined invoice payload',
          provider_token: 'PROVIDER_TOKEN',
          start_parameter: 'pay',
          currency: 'USD',
          prices: [
            { label: 'product', amount: 11000 },
            { label: 'tax', amount: 11000 },
          ],
        })
        .reply(200, reply);

      const res = await client.sendInvoice(427770117, {
        title: 'product name',
        description: 'product description',
        payload: 'bot-defined invoice payload',
        provider_token: 'PROVIDER_TOKEN',
        start_parameter: 'pay',
        currency: 'USD',
        prices: [
          { label: 'product', amount: 11000 },
          { label: 'tax', amount: 11000 },
        ],
      });

      expect(res).toEqual(result);
    });

    it('should send invoice message to user with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/sendInvoice', {
          chat_id: 427770117,
          title: 'product name',
          description: 'product description',
          payload: 'bot-defined invoice payload',
          provider_token: 'PROVIDER_TOKEN',
          start_parameter: 'pay',
          currency: 'USD',
          prices: [
            { label: 'product', amount: 11000 },
            { label: 'tax', amount: 11000 },
          ],
        })
        .reply(200, reply);

      const res = await client.sendInvoice(427770117, {
        title: 'product name',
        description: 'product description',
        payload: 'bot-defined invoice payload',
        providerToken: 'PROVIDER_TOKEN',
        startParameter: 'pay',
        currency: 'USD',
        prices: [
          { label: 'product', amount: 11000 },
          { label: 'tax', amount: 11000 },
        ],
      });

      expect(res).toEqual(result);
    });
  });

  describe('#answerShippingQuery', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should export chat invite link', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/answerShippingQuery', {
          shipping_query_id: 'UNIQUE_ID',
          ok: true,
          shipping_options: [
            {
              id: 'id',
              title: 'title',
              prices: [
                {
                  label: 'label',
                  amount: '100',
                },
              ],
            },
          ],
        })
        .reply(200, reply);

      const res = await client.answerShippingQuery('UNIQUE_ID', true, {
        shippingOptions: [
          {
            id: 'id',
            title: 'title',
            prices: [
              {
                label: 'label',
                amount: '100',
              },
            ],
          },
        ],
      });
      expect(res).toEqual(result);
    });
  });

  describe('#answerPreCheckoutQuery', () => {
    it('should respond to such pre-checkout queries', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/answerPreCheckoutQuery', {
          pre_checkout_query_id: 'UNIQUE_ID',
          ok: true,
        })
        .reply(200, reply);

      const res = await client.answerPreCheckoutQuery('UNIQUE_ID', true);
      expect(res).toEqual(result);
    });
  });
});
