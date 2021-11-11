import { rest } from 'msw';

import { constants } from './shared';
import { res } from './res';

export const requestHandlers = [
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/summary',
    (req, _, ctx) => {
      return res(
        ctx.json({
          groupId: req.params.groupId,
          groupName: 'LINE Group',
          pictureUrl: 'http:/obs.line-apps.com/...',
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/member/:userId',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          displayName: 'LINE taro',
          userId: constants.USER_ID,
          pictureUrl: 'http://obs.line-apps.com/...',
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/members/count',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          count: 3,
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/members/ids',
    (req, _, ctx) => {
      if (req.url.searchParams.get('start') === constants.CONTINUATION_TOKEN) {
        return res(
          ctx.json({
            memberIds: [
              'U00000000000000000000000000000004',
              'U00000000000000000000000000000005',
              'U00000000000000000000000000000006',
            ],
          })
        );
      }
      return res(
        ctx.json({
          memberIds: [
            'U00000000000000000000000000000001',
            'U00000000000000000000000000000002',
            'U00000000000000000000000000000003',
          ],
          next: constants.CONTINUATION_TOKEN,
        })
      );
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/group/:groupId/leave',
    (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
