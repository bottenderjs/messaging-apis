import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

import { res } from './res';

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
  rest.post('https://api.line.me/v2/bot/message/reply', (_req, _res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post('https://api.line.me/v2/bot/message/push', (_req, _res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post(
    'https://api.line.me/v2/bot/message/multicast',
    (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/message/broadcast',
    (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/message/narrowcast',
    (_req, _res, ctx) => {
      const requestId = uuidv4();

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
    (req, _, ctx) => {
      const requestId = req.url.searchParams.get('requestId');
      if (requestId in narrowcastProgressMap) {
        return res(ctx.json(narrowcastProgressMap[requestId]));
      }

      return res(ctx.status(400));
    }
  ),
  rest.get(
    `https://api-data.line.me/v2/bot/message/:messageId/content`,
    (_req, _res, ctx) => {
      const buffer = Buffer.from('a content buffer');
      return res(
        ctx.set('Content-Length', buffer.byteLength.toString()),
        ctx.set('Content-Type', 'image/jpeg'),
        ctx.body(Buffer.from('a content buffer'))
      );
    }
  ),
  rest.get('https://api.line.me/v2/bot/message/quota', (_req, _res, ctx) => {
    return res(
      ctx.json({
        type: 'limited',
        value: 1000,
      })
    );
  }),
  rest.get(
    'https://api.line.me/v2/bot/message/quota/consumption',
    (_req, _res, ctx) => {
      return res(ctx.json({ totalUsage: '500' }));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/reply',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/push',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/multicast',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/broadcast',
    (_req, _res, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
];
