import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants, getCurrentContext } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/banChatMember`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/unbanChatMember`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/restrictChatMember`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/promoteChatMember`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatAdministratorCustomTitle`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatPermissions`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/exportChatInviteLink`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post<{
    expire_date?: number;
    member_limit?: number;
  }>(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/createChatInviteLink`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              inviteLink: 'https://www.example.com/link',
              creator: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              isPrimary: true,
              isRevoked: false,
              expireDate: req.body.expire_date,
              memberLimit: req.body.member_limit,
            },
          })
        )
      );
    }
  ),
  rest.post<{
    invite_link: string;
    expire_date?: number;
    member_limit?: number;
  }>(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/editChatInviteLink`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              inviteLink: req.body.invite_link,
              creator: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              isPrimary: true,
              isRevoked: false,
              expireDate: req.body.expire_date,
              memberLimit: req.body.member_limit,
            },
          })
        )
      );
    }
  ),
  rest.post<{ invite_link: string }>(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/revokeChatInviteLink`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              inviteLink: req.body.invite_link,
              creator: {
                id: 313534466,
                firstName: 'first',
                username: 'a_bot',
              },
              isPrimary: true,
              isRevoked: true,
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatPhoto`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/deleteChatPhoto`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatTitle`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatDescription`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/pinChatMessage`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/unpinChatMessage`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/unpinAllChatMessages`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/leaveChat`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getChat`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              id: 313534466,
              firstName: 'first',
              lastName: 'last',
              username: 'username',
              type: 'private',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getChatAdministrators`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: [
              {
                user: {
                  id: 313534466,
                  firstName: 'first',
                  lastName: 'last',
                  username: 'username',
                  languangeCode: 'zh-TW',
                },
                status: 'creator',
              },
            ],
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getChatMemberCount`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: '6',
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/getChatMember`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: {
              user: {
                id: 313534466,
                firstName: 'first',
                lastName: 'last',
                username: 'username',
                languangeCode: 'zh-TW',
              },
              status: 'creator',
            },
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/setChatStickerSet`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/deleteChatStickerSet`,
    (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json(
          snakecaseKeysDeep({
            ok: true,
            result: true,
          })
        )
      );
    }
  ),
];
