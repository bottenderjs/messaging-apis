import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { constants, getCurrentContext } from './shared';
import { res } from './res';

export const requestHandlers = [
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/summary',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          groupId: req.params.groupId,
          groupName: 'LINE Group',
          pictureUrl: 'http:/obs.line-apps.com/...',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/member/:userId',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          displayName: 'LINE taro',
          userId: constants.USER_ID,
          pictureUrl: 'http://obs.line-apps.com/...',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/members/count',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          count: 3,
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/group/:groupId/members/ids',
    (req, _, ctx) => {
      getCurrentContext().request = req;

      if (req.url.searchParams.get('start') === constants.CONTINUATION_TOKEN) {
        return res(
          ctx.json({
            memberIds: [
              'U00000000000000000000000000000004',
              'U00000000000000000000000000000005',
              'U00000000000000000000000000000006',
            ],
          }),
          ctx.set('X-Line-Request-Id', uuidv4())
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
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/group/:groupId/leave',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
    }
  ),
];
