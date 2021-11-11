import { SnakeCasedPropertiesDeep } from 'type-fest';
import { rest } from 'msw';

import * as MessengerTypes from '../../MessengerTypes';

import { constants } from './shared';

export const requestHandlers = [
  rest.post<SnakeCasedPropertiesDeep<{ recipient: MessengerTypes.Recipient }>>(
    'https://graph.facebook.com/:version/me/messages',
    (req, res, ctx) => {
      if (
        'phone_number' in req.body.recipient ||
        'user_ref' in req.body.recipient
      ) {
        return res(
          ctx.json({
            message_id: 'mid.1489394984387:3dd22de509',
          })
        );
      }
      if ('sender_action' in req.body) {
        return res(
          ctx.json({
            recipient_id: constants.USER_ID,
          })
        );
      }

      return res(
        ctx.json({
          recipient_id: constants.USER_ID,
          message_id: 'mid.1489394984387:3dd22de509',
        })
      );
    }
  ),
];
