import fs from 'fs';
import path from 'path';

import { rest } from 'msw';

import LineClient from '../LineClient';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

const lineServer = setupLineServer();

it('should support #createRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createRichMenu({
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
  });

  expect(res).toEqual({
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/richmenu');
  expect(request?.body).toEqual({
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
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #uploadRichMenuImage', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const buffer = await fs.promises.readFile(
    path.join(__dirname, 'fixtures', 'cat.png')
  );
  const res = await line.uploadRichMenuImage('1', buffer);

  expect(res).toEqual({});

  const { request } = getCurrentContext<Buffer>();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api-data.line.me/v2/bot/richmenu/1/content'
  );
  expect(buffer.equals(request?.body as Buffer)).toBe(true);
  expect(request?.headers.get('Content-Type')).toBe('image/png');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #downloadRichMenuImage', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const buffer = await fs.promises.readFile(
    path.join(__dirname, 'fixtures', 'cat.png')
  );

  const res = await line.downloadRichMenuImage('1');

  expect(buffer.equals(res as Buffer)).toBe(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api-data.line.me/v2/bot/richmenu/1/content'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should handle #downloadRichMenuImage "Not found" error', async () => {
  lineServer.use(
    rest.get(
      'https://api-data.line.me/v2/bot/richmenu/:richMenuId/content',
      async (_req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: 'Not found' }));
      }
    )
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.downloadRichMenuImage(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual(undefined);
});

it('should support #getRichMenuList', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRichMenuList();

  expect(res).toEqual([
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
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/richmenu/list');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRichMenu(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual({
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
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should handle #getRichMenu "richmenu not found" error', async () => {
  lineServer.use(
    rest.get(
      'https://api.line.me/v2/bot/richmenu/:richMenuId',
      async (_req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'richmenu not found',
            details: [],
          })
        );
      }
    )
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRichMenu(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual(undefined);
});

it('should support #deleteRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.deleteRichMenu(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #setDefaultRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.setDefaultRichMenu(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/all/richmenu/richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getDefaultRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getDefaultRichMenu();

  expect(res).toEqual({
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/all/richmenu'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should handle #getDefaultRichMenu "no default richmenu" error', async () => {
  lineServer.use(
    rest.get(
      'https://api.line.me/v2/bot/user/all/richmenu',
      async (_req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'no default richmenu',
            details: [],
          })
        );
      }
    )
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getDefaultRichMenu();

  expect(res).toEqual(undefined);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/all/richmenu'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #deleteDefaultRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.deleteDefaultRichMenu();

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/all/richmenu'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #linkRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.linkRichMenu(
    constants.USER_ID,
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/U00000000000000000000000000000000/richmenu/richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #linkRichMenuToMultipleUsers', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.linkRichMenuToMultipleUsers(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
    [constants.USER_ID]
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/bulk/link'
  );
  expect(request?.body).toEqual({
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
    userIds: ['U00000000000000000000000000000000'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createRichMenuAlias', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createRichMenuAlias(
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
    'richmenu-alias-a'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://api.line.me/v2/bot/richmenu/alias');
  expect(request?.body).toEqual({
    richMenuAliasId: 'richmenu-alias-a',
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #deleteRichMenuAlias', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.deleteRichMenuAlias('richmenu-alias-a');

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/alias/richmenu-alias-a'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #updateRichMenuAlias', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.updateRichMenuAlias(
    'richmenu-alias-a',
    'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5'
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/alias/richmenu-alias-a'
  );
  expect(request?.body).toEqual({
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getRichMenuAlias', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRichMenuAlias('richmenu-alias-a');

  expect(res).toEqual({
    richMenuAliasId: 'richmenu-alias-a',
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/alias/richmenu-alias-a'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getRichMenuAliasList', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getRichMenuAliasList();

  expect(res).toEqual({
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
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/alias/list'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getLinkedRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getLinkedRichMenu(constants.USER_ID);

  expect(res).toEqual({
    richMenuId: 'richmenu-8dfdfc571eca39c0ffcd1f799519c5b5',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/U00000000000000000000000000000000/richmenu'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should handle #getLinkedRichMenu "the user has no richmenu" error', async () => {
  lineServer.use(
    rest.get(
      'https://api.line.me/v2/bot/user/:userId/richmenu',
      async (_req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'the user has no richmenu',
            details: [],
          })
        );
      }
    )
  );

  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getLinkedRichMenu(constants.USER_ID);

  expect(res).toEqual(undefined);
});

it('should support #unlinkRichMenu', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.unlinkRichMenu(constants.USER_ID);

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/user/U00000000000000000000000000000000/richmenu'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #unlinkRichMenusFromMultipleUsers', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.unlinkRichMenusFromMultipleUsers([constants.USER_ID]);

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/richmenu/bulk/unlink'
  );
  expect(request?.body).toEqual({
    userIds: ['U00000000000000000000000000000000'],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
