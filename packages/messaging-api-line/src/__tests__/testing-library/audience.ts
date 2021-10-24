import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.post('https://api.line.me/v2/bot/audienceGroup/upload', (_, __, ctx) => {
    return res(
      ctx.json({
        audienceGroupId: 1234567890123,
        createRoute: 'MESSAGING_API',
        type: 'UPLOAD',
        description: 'audienceGroupName_01',
        created: 1613698278,
        permission: 'READ_WRITE',
        expireTimestamp: 1629250278,
        isIfaAudience: false,
      })
    );
  }),
  rest.post(
    'https://api-data.line.me/v2/bot/audienceGroup/upload/byFile',
    (_, __, ctx) => {
      return res(
        ctx.json({
          audienceGroupId: 1234567890123,
          createRoute: 'MESSAGING_API',
          type: 'UPLOAD',
          description: 'audienceGroupName_01',
          created: 1613698278,
          permission: 'READ_WRITE',
          expireTimestamp: 1629250278,
          isIfaAudience: false,
        })
      );
    }
  ),
  rest.put('https://api.line.me/v2/bot/audienceGroup/upload', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.put(
    'https://api-data.line.me/v2/bot/audienceGroup/upload/byFile',
    (_, __, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post('https://api.line.me/v2/bot/audienceGroup/click', (_, __, ctx) => {
    return res(
      ctx.json({
        audienceGroupId: 1234567890123,
        createRoute: 'MESSAGING_API',
        type: 'CLICK',
        description: 'audienceGroupName_01',
        created: 1613705240,
        permission: 'READ_WRITE',
        expireTimestamp: 1629257239,
        isIfaAudience: false,
        requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
        clickUrl: 'https://developers.line.biz/',
      })
    );
  }),
  rest.post('https://api.line.me/v2/bot/audienceGroup/imp', (_, __, ctx) => {
    return res(
      ctx.json({
        audienceGroupId: 1234567890123,
        createRoute: 'MESSAGING_API',
        type: 'IMP',
        description: 'audienceGroupName_01',
        created: 1613707097,
        permission: 'READ_WRITE',
        expireTimestamp: 1629259095,
        isIfaAudience: false,
        requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
      })
    );
  }),
  rest.put(
    'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId/updateDescription',
    (_, __, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel',
    (_, __, ctx) => {
      return res(
        ctx.json({
          authorityLevel: 'PUBLIC',
        })
      );
    }
  ),
  rest.put(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel',
    (_, __, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get('https://api.line.me/v2/bot/audienceGroup/list', (_, __, ctx) => {
    return res(
      ctx.json({
        audienceGroups: [
          {
            audienceGroupId: 1234567890123,
            type: 'CLICK',
            description: 'audienceGroupName_01',
            status: 'READY',
            audienceCount: 2,
            created: 1500351844,
            requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
            clickUrl: 'https://developers.line.biz/',
          },
        ],
        hasNextPage: false,
        totalCount: 1,
        page: 1,
        size: 40,
      })
    );
  }),
  rest.delete(
    'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId',
    (_, __, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/audienceGroup/:audienceGroupId',
    (_, __, ctx) => {
      return res(
        ctx.json({
          audienceGroup: {
            audienceGroupId: 1234567890123,
            createRoute: 'MESSAGING_API',
            type: 'UPLOAD',
            description: 'audienceGroupName_01',
            status: 'IN_PROGRESS',
            audienceCount: 0,
            created: 1634970179,
            permission: 'READ_WRITE',
            expireTimestamp: 1650522179,
            isIfaAudience: false,
          },
          jobs: [],
        })
      );
    }
  ),
];
