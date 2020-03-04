import MockAdapter from 'axios-mock-adapter';

import LineClient from '../LineClient';

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

describe('Audience', () => {
  describe('#createUploadAudienceGroup', () => {
    const reply = {
      audienceGroupId: 4389303728991,
      type: 'UPLOAD',
      description: 'test',
      created: 1500351844,
    };

    const body = {
      description: 'audienceGroupName',
      isIfaAudience: false,
      audiences: [
        {
          id: '1',
        },
      ],
      uploadDescription: 'audience1',
    };

    it('should call createUploadAudienceGroup api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/upload'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createUploadAudienceGroup(
        'audienceGroupName',
        false,
        [
          {
            id: '1',
          },
        ],
        {
          uploadDescription: 'audience1',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/upload'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createUploadAudienceGroup(
        'audienceGroupName',
        false,
        [
          {
            id: '1',
          },
        ],
        {
          uploadDescription: 'audience1',
          accessToken: CUSTOM_ACCESS_TOKEN,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#updateUploadAudienceGroup', () => {
    const reply = {};

    const body = {
      audienceGroupId: 1,
      audiences: [
        {
          id: '1',
        },
      ],
      description: 'audienceGroupName',
      uploadDescription: 'audience1',
    };

    it('should call updateUploadAudienceGroup api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/upload'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.updateUploadAudienceGroup(
        1,
        [
          {
            id: '1',
          },
        ],
        {
          description: 'audienceGroupName',
          uploadDescription: 'audience1',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/upload'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.updateUploadAudienceGroup(
        1,
        [
          {
            id: '1',
          },
        ],
        {
          description: 'audienceGroupName',
          uploadDescription: 'audience1',
          accessToken: CUSTOM_ACCESS_TOKEN,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#createClickAudienceGroup', () => {
    const reply = {
      audienceGroupId: 4389303728991,
      type: 'CLICK',
      description: 'test',
      created: 1500351844,
      requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
      clickUrl: null,
    };

    const body = {
      description: 'audienceGroupName',
      requestId: '12222',
      clickUrl: 'https://line.me/en',
    };

    it('should call createClickAudienceGroup api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/click'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createClickAudienceGroup(
        'audienceGroupName',
        '12222',
        {
          clickUrl: 'https://line.me/en',
        }
      );

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/click'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createClickAudienceGroup(
        'audienceGroupName',
        '12222',
        {
          clickUrl: 'https://line.me/en',
          accessToken: CUSTOM_ACCESS_TOKEN,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#createImpAudienceGroup', () => {
    const reply = {
      audienceGroupId: 4389303728991,
      type: 'IMP',
      description: 'test',
      created: 1500351844,
      requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
    };

    const body = {
      description: 'audienceGroupName',
      requestId: '12222',
    };

    it('should call createImpAudienceGroup api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/imp'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createImpAudienceGroup(
        'audienceGroupName',
        '12222'
      );

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPost().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/imp'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.createImpAudienceGroup(
        'audienceGroupName',
        '12222',
        {
          accessToken: CUSTOM_ACCESS_TOKEN,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#setDescriptionAudienceGroup', () => {
    const reply = {};

    const body = {
      description: 'audienceGroupName',
    };

    const audienceGroupId = 4389303728991;

    it('should call setDescriptionAudienceGroup api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}/updateDescription`
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.setDescriptionAudienceGroup(
        'audienceGroupName',
        audienceGroupId
      );

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}/updateDescription`
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.setDescriptionAudienceGroup(
        'audienceGroupName',
        audienceGroupId,
        {
          accessToken: CUSTOM_ACCESS_TOKEN,
        }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteAudienceGroup', () => {
    const reply = {};

    const audienceGroupId = 4389303728991;

    it('should call deleteAudienceGroup api', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock();

      mock.onDelete().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.deleteAudienceGroup(audienceGroupId);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onDelete().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.deleteAudienceGroup(4389303728991, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getAudienceGroup', () => {
    const reply = {
      audienceGroupId: 4389303728991,
      type: 'CLICK',
      description: 'audienceGroupName',
      status: 'READY',
      audienceCount: 2,
      created: 1500351844,
      requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
      clickUrl: 'https://line.me/en',
      jobs: null,
    };

    const audienceGroupId = 4389303728991;

    it('should call getAudienceGroup api', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock();

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroup(audienceGroupId);

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/${audienceGroupId}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroup(4389303728991, {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getAudienceGroups', () => {
    const reply = {
      audienceGroups: [
        {
          audienceGroupId: 4389303728991,
          type: 'CLICK',
          description: 'audienceGroupName',
          status: 'READY',
          audienceCount: 2,
          created: 1500351844,
          requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
          clickUrl: 'https://line.me/en',
        },
      ],
      hasNextPage: false,
      totalCount: 1,
      page: 1,
      size: 40,
    };

    const page = 1;
    const description = 'audienceGroupName';
    const status = 'READY';
    const size = 40;

    it('should call getAudienceGroups api', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock();

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/list?page=${page}&description=${description}&status=${status}&size=${size}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroups({
        page,
        description,
        status,
        size,
      });

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          `https://api.line.me/v2/bot/audienceGroup/list?page=${page}&description=${description}&status=${status}&size=${size}`
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroups({
        page,
        description,
        status,
        size,
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getAudienceGroupAuthorityLevel', () => {
    const reply = {
      authorityLevel: 'PUBLIC',
    };

    it('should call getAudienceGroupAuthorityLevel api', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock();

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroupAuthorityLevel();

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(3);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onGet().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
        );
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.getAudienceGroupAuthorityLevel({
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#changeAudienceGroupAuthorityLevel', () => {
    const reply = {};

    const body = {
      authorityLevel: 'PUBLIC',
    };

    it('should call changeAudienceGroupAuthorityLevel api', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock();

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.changeAudienceGroupAuthorityLevel('PUBLIC');

      expect(res).toEqual(reply);
    });

    it('should work with custom access token', async () => {
      expect.assertions(4);

      const { client, mock, headers } = createMock({
        customAccessToken: CUSTOM_ACCESS_TOKEN,
      });

      mock.onPut().reply(config => {
        expect(config.url).toEqual(
          'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
        );
        expect(JSON.parse(config.data)).toEqual(body);
        expect(config.headers).toEqual(headers);
        return [200, reply];
      });

      const res = await client.changeAudienceGroupAuthorityLevel('PUBLIC', {
        accessToken: CUSTOM_ACCESS_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });
});
