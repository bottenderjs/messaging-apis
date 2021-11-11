import { rest } from 'msw';
import { snakecaseKeysDeep } from 'messaging-api-common';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    `https://api.telegram.org/bot${constants.ACCESS_TOKEN}/banChatMember`,
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
    (_req, res, ctx) => {
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
