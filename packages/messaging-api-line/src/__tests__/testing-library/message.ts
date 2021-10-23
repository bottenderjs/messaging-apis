import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

import { constants, getCurrentContext } from './shared';

const narrowcastProgressMap: Record<
  string,
  LineTypes.NarrowcastProgressResponse
> = {};

/**
 * Set progress of the narrowcast request.
 *
 * @param requestId - Request ID.
 * @param progress - progress of the narrowcast request.
 */
export function setNarrowcastProgress(
  requestId: string,
  progress: LineTypes.NarrowcastProgressResponse
): void {
  narrowcastProgressMap[requestId] = progress;
}

export const requestHandlers = [
  rest.post('https://api.line.me/v2/bot/message/reply', (req, res, ctx) => {
    getCurrentContext().request = req;
    return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
  }),
  rest.post('https://api.line.me/v2/bot/message/push', (req, res, ctx) => {
    getCurrentContext().request = req;
    return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
  }),
  rest.post('https://api.line.me/v2/bot/message/multicast', (req, res, ctx) => {
    getCurrentContext().request = req;
    return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
  }),
  rest.post('https://api.line.me/v2/bot/message/broadcast', (req, res, ctx) => {
    getCurrentContext().request = req;
    return res(ctx.json({}), ctx.set('X-Line-Request-Id', uuidv4()));
  }),
  rest.post(
    'https://api.line.me/v2/bot/message/narrowcast',
    (req, res, ctx) => {
      const requestId = uuidv4();
      getCurrentContext().request = req;
      narrowcastProgressMap[requestId] = { phase: 'waiting' };
      return res(
        ctx.status(202),
        ctx.json({}),
        ctx.set('X-Line-Request-Id', requestId)
      );
    }
  ),
  rest.get<undefined>(
    'https://api.line.me/v2/bot/message/progress/narrowcast',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      const requestId = req.url.searchParams.get('requestId');
      if (requestId in narrowcastProgressMap) {
        return res(
          ctx.json(narrowcastProgressMap[requestId]),
          ctx.set('X-Line-Request-Id', uuidv4())
        );
      }

      return res(ctx.status(400), ctx.set('X-Line-Request-Id', uuidv4()));
    }
  ),
  rest.get(
    `https://api-data.line.me/v2/bot/message/${constants.MESSAGE_ID}/content`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.body(Buffer.from('a content buffer')),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get('https://api.line.me/v2/bot/message/quota', (req, res, ctx) => {
    getCurrentContext().request = req;
    return res(
      ctx.json({
        type: 'limited',
        value: 1000,
      }),
      ctx.set('X-Line-Request-Id', uuidv4())
    );
  }),
  rest.get(
    'https://api.line.me/v2/bot/message/quota/consumption',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({ totalUsage: '500' }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/reply',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/push',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/multicast',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/broadcast',
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
];
