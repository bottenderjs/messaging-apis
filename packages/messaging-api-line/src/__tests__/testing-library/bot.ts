import { rest } from 'msw';

import { LineTypes } from '../..';

import { res } from './res';

let botInfo = {
  userId: 'Ub9952f8...',
  basicId: '@216ru...',
  displayName: 'Example name',
  pictureUrl: 'https://obs.line-apps.com/...',
  chatMode: 'chat',
  markAsReadMode: 'manual',
};

/**
 * Set info of the bot.
 *
 * @param info - Info of the bot.
 */
export function setBotInfo(info: LineTypes.BotInfoResponse): void {
  botInfo = info;
}

export const requestHandlers = [
  rest.get<undefined>('https://api.line.me/v2/bot/info', (_req, _res, ctx) => {
    return res(ctx.json(botInfo));
  }),
];
