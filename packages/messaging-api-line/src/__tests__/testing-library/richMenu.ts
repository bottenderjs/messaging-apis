import fs from 'fs';
import path from 'path';

import { rest } from 'msw';

import { getCurrentContext } from './shared';
import { res } from './res';

export const requestHandlers = [
  rest.post('https://api.line.me/v2/bot/richmenu', (_req, _res, ctx) => {
    return res(
      ctx.json({
        richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
      })
    );
  }),
  rest.post<string>(
    'https://api-data.line.me/v2/bot/richmenu/:richMenuId/content',
    (req, __, ctx) => {
      getCurrentContext().request = {
        ...req,
        body: Buffer.from(req.body, 'hex'),
      };
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api-data.line.me/v2/bot/richmenu/:richMenuId/content',
    async (_req, _res, ctx) => {
      const buffer = await fs.promises.readFile(
        path.join(__dirname, '..', 'fixtures', 'cat.png')
      );

      return res(
        ctx.set('Content-Length', buffer.byteLength.toString()),
        ctx.set('Content-Type', 'image/png'),
        ctx.body(buffer)
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/richmenu/list',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          richmenus: [
            {
              richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
              size: {
                width: 2500,
                height: 1686,
              },
              selected: false,
              name: 'Nice richmenu',
              chatBarText: 'Tap here',
              areas: [
                {
                  bounds: {
                    x: 0,
                    y: 0,
                    width: 2500,
                    height: 1686,
                  },
                  action: {
                    type: 'postback',
                    data: 'action=buy&itemid=123',
                  },
                },
              ],
            },
          ],
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/richmenu/:richMenuId',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
          size: {
            width: 2500,
            height: 1686,
          },
          selected: false,
          name: 'Nice richmenu',
          chatBarText: 'Tap here',
          areas: [
            {
              bounds: {
                x: 0,
                y: 0,
                width: 2500,
                height: 1686,
              },
              action: {
                type: 'postback',
                data: 'action=buy&itemid=123',
              },
            },
          ],
        })
      );
    }
  ),
  rest.delete(
    'https://api.line.me/v2/bot/richmenu/:richMenuId',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/user/all/richmenu/:richMenuId',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/user/all/richmenu',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
        })
      );
    }
  ),
  rest.delete(
    'https://api.line.me/v2/bot/user/all/richmenu',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/user/:userId/richmenu/:richMenuId',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/richmenu/bulk/link',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/richmenu/alias',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/richmenu/alias/list',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          aliases: [
            {
              richMenuAliasId: 'richmenu-alias-a',
              richMenuId: 'richmenu-862e6ad6c267d2ddf3f42bc78554f6a4',
            },
            {
              richMenuAliasId: 'richmenu-alias-b',
              richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
            },
          ],
        })
      );
    }
  ),
  rest.delete(
    'https://api.line.me/v2/bot/richmenu/alias/:richMenuAliasId',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/richmenu/alias/:richMenuAliasId',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/richmenu/alias/:richMenuAliasId',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          richMenuAliasId: 'richmenu-alias-a',
          richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
        })
      );
    }
  ),
  rest.get(
    'https://api.line.me/v2/bot/user/:userId/richmenu',
    async (_req, _res, ctx) => {
      return res(
        ctx.json({
          richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
        })
      );
    }
  ),
  rest.delete(
    'https://api.line.me/v2/bot/user/:userId/richmenu',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.post(
    'https://api.line.me/v2/bot/richmenu/bulk/unlink',
    async (_req, _res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
