import { RestRequest, rest } from 'msw';

import { LineClient } from '..';

import { setupLineServer } from './testing-library';

const lineServer = setupLineServer();

const AUDIENCE_GROUP_ID = 4389303728991;

function setup() {
  const context: { request: RestRequest | undefined } = {
    request: undefined,
  };
  lineServer.use(
    rest.post(
      'https://api.line.me/v2/bot/audienceGroup/upload',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            audienceGroupId: 4389303728991,
            type: 'UPLOAD',
            description: 'test',
            created: 1500351844,
          })
        );
      }
    ),
    rest.put(
      'https://api.line.me/v2/bot/audienceGroup/upload',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    ),
    rest.post(
      'https://api.line.me/v2/bot/audienceGroup/click',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            audienceGroupId: 4389303728991,
            type: 'CLICK',
            description: 'test',
            created: 1500351844,
            requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
            clickUrl: null,
          })
        );
      }
    ),
    rest.post(
      'https://api.line.me/v2/bot/audienceGroup/imp',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            audienceGroupId: 4389303728991,
            type: 'IMP',
            description: 'test',
            created: 1500351844,
            requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
          })
        );
      }
    ),
    rest.put(
      'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId/updateDescription',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/audienceGroup/authorityLevel',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            authorityLevel: 'PUBLIC',
          })
        );
      }
    ),
    rest.put(
      'https://api.line.me/v2/bot/audienceGroup/authorityLevel',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/audienceGroup/list',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
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
          })
        );
      }
    ),
    rest.delete(
      'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId',
      (req, res, ctx) => {
        context.request = req;
        return res(ctx.json({}));
      }
    ),
    rest.get(
      'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId',
      (req, res, ctx) => {
        context.request = req;
        return res(
          ctx.json({
            audienceGroupId: 4389303728991,
            type: 'CLICK',
            description: 'audienceGroupName',
            status: 'READY',
            audienceCount: 2,
            created: 1500351844,
            requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
            clickUrl: 'https://line.me/en',
            jobs: null,
          })
        );
      }
    )
  );

  const client = new LineClient({
    accessToken: 'ACCESS_TOKEN',
    channelSecret: 'CHANNEL_SECRET',
  });

  return { context, client };
}

it('#createUploadAudienceGroup should call createUploadAudienceGroup api', async () => {
  const { context, client } = setup();

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

  expect(res).toEqual({
    audienceGroupId: 4389303728991,
    type: 'UPLOAD',
    description: 'test',
    created: 1500351844,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName',
    isIfaAudience: false,
    audiences: [
      {
        id: '1',
      },
    ],
    uploadDescription: 'audience1',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#updateUploadAudienceGroup should call updateUploadAudienceGroup api', async () => {
  const { context, client } = setup();

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

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    audienceGroupId: 1,
    audiences: [
      {
        id: '1',
      },
    ],
    description: 'audienceGroupName',
    uploadDescription: 'audience1',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#createClickAudienceGroup should call createClickAudienceGroup api', async () => {
  const { context, client } = setup();

  const res = await client.createClickAudienceGroup(
    'audienceGroupName',
    '12222',
    {
      clickUrl: 'https://line.me/en',
    }
  );

  expect(res).toEqual({
    audienceGroupId: 4389303728991,
    type: 'CLICK',
    description: 'test',
    created: 1500351844,
    requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
    clickUrl: null,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/click'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName',
    requestId: '12222',
    clickUrl: 'https://line.me/en',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#createImpAudienceGroup should call createImpAudienceGroup api', async () => {
  const { context, client } = setup();

  const res = await client.createImpAudienceGroup('audienceGroupName', '12222');

  expect(res).toEqual({
    audienceGroupId: 4389303728991,
    type: 'IMP',
    description: 'test',
    created: 1500351844,
    requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/imp'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName',
    requestId: '12222',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#setDescriptionAudienceGroup should call setDescriptionAudienceGroup api', async () => {
  const { context, client } = setup();

  const res = await client.setDescriptionAudienceGroup(
    'audienceGroupName',
    AUDIENCE_GROUP_ID
  );

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.toString()).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${AUDIENCE_GROUP_ID}/updateDescription`
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#deleteAudienceGroup should call deleteAudienceGroup api', async () => {
  const { context, client } = setup();

  const res = await client.deleteAudienceGroup(AUDIENCE_GROUP_ID);

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.toString()).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${AUDIENCE_GROUP_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getAudienceGroup should call getAudienceGroup api', async () => {
  const { context, client } = setup();

  const res = await client.getAudienceGroup(AUDIENCE_GROUP_ID);

  expect(res).toEqual({
    audienceGroupId: 4389303728991,
    type: 'CLICK',
    description: 'audienceGroupName',
    status: 'READY',
    audienceCount: 2,
    created: 1500351844,
    requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
    clickUrl: 'https://line.me/en',
    jobs: null,
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${AUDIENCE_GROUP_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getAudienceGroups should call getAudienceGroups api', async () => {
  const { context, client } = setup();

  const res = await client.getAudienceGroups({
    page: 1,
    description: 'audienceGroupName',
    status: 'READY',
    size: 40,
  });

  expect(res).toEqual({
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
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    `https://api.line.me/v2/bot/audienceGroup/list?page=1&description=audienceGroupName&status=READY&size=40`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#getAudienceGroupAuthorityLevel should call getAudienceGroupAuthorityLevel api', async () => {
  const { context, client } = setup();

  const res = await client.getAudienceGroupAuthorityLevel();

  expect(res).toEqual({
    authorityLevel: 'PUBLIC',
  });

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('#changeAudienceGroupAuthorityLevel should call changeAudienceGroupAuthorityLevel api', async () => {
  const { context, client } = setup();

  const res = await client.changeAudienceGroupAuthorityLevel('PUBLIC');

  expect(res).toEqual({});

  const { request } = context;

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.toString()).toBe(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
  );
  expect(request?.body).toEqual({
    authorityLevel: 'PUBLIC',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
