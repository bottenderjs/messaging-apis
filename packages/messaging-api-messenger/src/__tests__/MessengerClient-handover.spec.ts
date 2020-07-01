import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const ACCESS_TOKEN = '1234567890';
const USER_ID = '1QAZ2WSX';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = (): { client: MessengerClient; mock: MockAdapter } => {
  const client = new MessengerClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('Handover Protocol API', () => {
  describe('#passThreadControl', () => {
    it('should call messages api to pass thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControl(
        USER_ID,
        123456789,
        'free formed text for another app'
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        target_app_id: 123456789,
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api to pass thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        accessToken: '0987654321',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControl(
        USER_ID,
        123456789,
        'free formed text for another app',
        options
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${options.accessToken}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        target_app_id: 123456789,
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#passThreadControlToPageInbox', () => {
    it('should call messages api to pass thread control to page inbox', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControlToPageInbox(
        USER_ID,
        'free formed text for another app'
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        target_app_id: 263902037430900,
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api to pass thread control to page inbox with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        accessToken: '0987654321',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.passThreadControlToPageInbox(
        USER_ID,
        'free formed text for another app',
        options
      );

      expect(url).toEqual(
        `/me/pass_thread_control?access_token=${options.accessToken}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        target_app_id: 263902037430900,
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#takeThreadControl', () => {
    it('should call messages api to take thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.takeThreadControl(
        USER_ID,
        'free formed text for another app'
      );

      expect(url).toEqual(
        `/me/take_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api to take thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        accessToken: '0987654321',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.takeThreadControl(
        USER_ID,
        'free formed text for another app',
        options
      );

      expect(url).toEqual(
        `/me/take_thread_control?access_token=${options.accessToken}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        metadata: 'free formed text for another app',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#requestThreadControl', () => {
    it('should call messages api to request thread control', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.requestThreadControl(
        USER_ID,
        'free formed text for primary app'
      );

      expect(url).toEqual(
        `/me/request_thread_control?access_token=${ACCESS_TOKEN}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        metadata: 'free formed text for primary app',
      });

      expect(res).toEqual(reply);
    });

    it('should call messages api to request thread control with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        accessToken: '0987654321',
      };

      let url;
      let data;
      mock.onPost().reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

      const res = await client.requestThreadControl(
        USER_ID,
        'free formed text for primary app',
        options
      );

      expect(url).toEqual(
        `/me/request_thread_control?access_token=${options.accessToken}`
      );
      expect(JSON.parse(data)).toEqual({
        recipient: {
          id: USER_ID,
        },
        metadata: 'free formed text for primary app',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getSecondaryReceivers', () => {
    it('should call messages api to get Secondary receivers', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          { id: '12345678910', name: "David's Composer" },
          { id: '23456789101', name: 'Messenger Rocks' },
        ],
      };

      let url;
      mock.onGet().reply((config) => {
        url = config.url;
        return [200, reply];
      });

      const res = await client.getSecondaryReceivers();

      expect(url).toEqual(
        `/me/secondary_receivers?fields=id,name&access_token=${ACCESS_TOKEN}`
      );

      expect(res).toEqual([
        { id: '12345678910', name: "David's Composer" },
        { id: '23456789101', name: 'Messenger Rocks' },
      ]);
    });
  });
});

describe('#getThreadOwner', () => {
  it('should call messages api to get thread owner', async () => {
    const { client, mock } = createMock();

    const reply = {
      data: [
        {
          thread_owner: {
            app_id: '12345678910',
          },
        },
      ],
    };

    let url;
    mock.onGet().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    const res = await client.getThreadOwner(USER_ID);

    expect(url).toEqual(
      `/me/thread_owner?recipient=${USER_ID}&access_token=${ACCESS_TOKEN}`
    );

    expect(res).toEqual({ appId: '12345678910' });
  });

  it('should call messages api to get thread owner with custom access token', async () => {
    const { client, mock } = createMock();

    const reply = {
      data: [
        {
          thread_owner: {
            app_id: '12345678910',
          },
        },
      ],
    };

    const options = {
      accessToken: '0987654321',
    };

    let url;
    mock.onGet().reply((config) => {
      url = config.url;
      return [200, reply];
    });

    const res = await client.getThreadOwner(USER_ID, options);

    expect(url).toEqual(
      `/me/thread_owner?recipient=${USER_ID}&access_token=${options.accessToken}`
    );

    expect(res).toEqual({ appId: '12345678910' });
  });
});
