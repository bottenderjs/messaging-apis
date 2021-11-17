import { rest } from 'msw';

export const requestHandlers = [
  rest.post(
    'https://graph.facebook.com/:version/me/pass_thread_control',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.post(
    'https://graph.facebook.com/:version/me/pass_thread_control',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.post(
    'https://graph.facebook.com/:version/me/take_thread_control',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.post(
    'https://graph.facebook.com/:version/me/request_thread_control',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.get(
    'https://graph.facebook.com/:version/me/secondary_receivers',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            { id: '12345678910', name: "David's Composer" },
            { id: '23456789101', name: 'Messenger Rocks' },
          ],
        })
      );
    }
  ),
  rest.get(
    'https://graph.facebook.com/:version/me/thread_owner',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              thread_owner: {
                app_id: '12345678910',
              },
            },
          ],
        })
      );
    }
  ),
];
