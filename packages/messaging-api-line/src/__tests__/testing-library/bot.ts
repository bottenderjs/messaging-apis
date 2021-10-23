import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { LineTypes } from '../..';

import { getCurrentContext } from './shared';
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
  rest.get<undefined>('https://api.line.me/v2/bot/info', (req, _, ctx) => {
    getCurrentContext().request = req;
    return res(ctx.json(botInfo), ctx.set('X-Line-Request-Id', uuidv4()));
  }),
];
