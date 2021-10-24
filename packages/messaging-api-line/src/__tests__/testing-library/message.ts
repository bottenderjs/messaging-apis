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
  rest.post('https://api.line.me/v2/bot/message/reply', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post('https://api.line.me/v2/bot/message/push', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post('https://api.line.me/v2/bot/message/multicast', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post('https://api.line.me/v2/bot/message/broadcast', (_, __, ctx) => {
    return res(ctx.json({}));
  }),
  rest.post('https://api.line.me/v2/bot/message/narrowcast', (_, __, ctx) => {
    const requestId = uuidv4();

    narrowcastProgressMap[requestId] = { phase: 'waiting' };
    return res(
      ctx.status(202),
      ctx.json({}),
      ctx.set('X-Line-Request-Id', requestId)
    );
  }),
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
    (_, __, ctx) => {
      const buffer = Buffer.from('a content buffer');
      return res(
        ctx.set('Content-Length', buffer.byteLength.toString()),
        ctx.set('Content-Type', 'image/jpeg'),
        ctx.body(Buffer.from('a content buffer'))
      );
    }
  ),
  rest.get('https://api.line.me/v2/bot/message/quota', (_, __, ctx) => {
    return res(
      ctx.json({
        type: 'limited',
        value: 1000,
      })
    );
  }),
  rest.get(
    'https://api.line.me/v2/bot/message/quota/consumption',
    (_, __, ctx) => {
      return res(ctx.json({ totalUsage: '500' }));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/reply',
    (_, __, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
  rest.get('https://api.line.me/v2/bot/message/delivery/push', (_, __, ctx) => {
    return res(
      ctx.json({
        status: 'ready',
        success: 10000,
      })
    );
  }),
  rest.get(
    'https://api.line.me/v2/bot/message/delivery/multicast',
    (_, __, ctx) => {
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
    (_, __, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          success: 10000,
        })
      );
    }
  ),
];
