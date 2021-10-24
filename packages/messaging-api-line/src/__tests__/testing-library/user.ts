import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.get<undefined>(
    'https://api.line.me/v2/bot/profile/:userId',
    (req, _, ctx) => {
      return res(
        ctx.json({
          displayName: 'LINE taro',
          userId: req.params.userId,
          language: 'en',
          pictureUrl: 'https://obs.line-apps.com/...',
          statusMessage: 'Hello, LINE!',
        })
      );
    }
  ),
  rest.get<undefined>(
    'https://api.line.me/v2/bot/followers/ids',
    (req, _, ctx) => {
      if (req.url.searchParams.get('start') === 'yANU9IA...') {
        return res(
          ctx.json({
            userIds: ['U4a59a00629...', 'Uc7849f96c4...', 'U95afbabcdf...'],
          })
        );
      }

      return res(
        ctx.json({
          userIds: ['U4af4980629...', 'U0c229f96c4...', 'U95afb1d4df...'],
          next: 'yANU9IA...',
        })
      );
    }
  ),
];
