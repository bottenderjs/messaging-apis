import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

import { getCurrentContext } from './shared';
import { res } from './res';

export const requestHandlers = [
  rest.get<undefined>(
    'https://api.line.me/v2/bot/user/:userId/linkToken',
    (req, _, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          linkToken: 'NMZTNuVrPTqlr2IF8Bnymkb7rXfYv5EY',
        }),
        ctx.set('X-Line-Request-Id', uuidv4())
      );
    }
  ),
];
