import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { getCurrentContext } from './shared';
import { res } from './res';

export const requestHandlers = [
  rest.get<undefined>(
    'https://api.line.me/v2/bot/profile/:userId',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          displayName: 'LINE taro',
          userId: req.params.userId,
          language: 'en',
          pictureUrl: 'https://obs.line-apps.com/...',
          statusMessage: 'Hello, LINE!',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
  rest.get<undefined>(
    'https://api.line.me/v2/bot/followers/ids',
    (req, _, ctx) => {
      getCurrentContext().request = req;

      if (req.url.searchParams.get('start') === 'yANU9IA...') {
        return res(
          ctx.json({
            userIds: ['U4a59a00629...', 'Uc7849f96c4...', 'U95afbabcdf...'],
          }),
          ctx.set('X-Line-Request-Id', uuidv4())
        );
      }

      return res(
        ctx.json({
          userIds: ['U4af4980629...', 'U0c229f96c4...', 'U95afb1d4df...'],
          next: 'yANU9IA...',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
];
