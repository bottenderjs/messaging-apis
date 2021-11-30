import { rest } from 'msw';

export const requestHandlers = [
  rest.post(
    'https://graph.facebook.com/:version/me/nlp_configs',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
];
