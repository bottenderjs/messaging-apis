import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = () => {
  const client = new TelegramClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('payment api', () => {
  describe('#sendInvoice', () => {
    it('should send invoice message to user', async () => {
      const { client, mock } = createMock();
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
        result,
      };

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
  });

  describe('#answerShippingQuery', () => {
    it('should export chat invite link', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/answerShippingQuery', {
          shipping_query_id: 'UNIQUE_ID',
          ok: true,
        })
        .reply(200, reply);

      const res = await client.answerShippingQuery('UNIQUE_ID', true);
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
