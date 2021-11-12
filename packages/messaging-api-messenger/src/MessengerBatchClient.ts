// import MessengerClient from './MessengerClient';
// import * as MessengerTypes from './MessengerTypes';

// export default class MessengerBatchClient implements MessengerClient {

export default class MessengerBatchClient {
  // /**
  //  * Sends messages to the specified user using the Send API.
  //  *
  //  * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
  //  * @param message - A [message](https://developers.facebook.com/docs/messenger-platform/reference/send-api#message) object.
  //  * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
  //  * @returns An object includes recipientId and messageId.
  //  * @example
  //  * ```js
  //  * await messenger.sendMessage(USER_ID, {
  //  *   text: 'Hello!',
  //  * });
  //  * ```
  //  *
  //  * You can specify [messaging type](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) using options. If `messagingType` and `tag` is not provided, `UPDATE` will be used as default messaging type.
  //  *
  //  * ```js
  //  * await messenger.sendMessage(
  //  *   USER_ID,
  //  *   { text: 'Hello!' },
  //  *   { messagingType: 'RESPONSE' }
  //  * );
  //  * ```
  //  *
  //  * Available messaging types:
  //  * - `UPDATE` as default
  //  * - `RESPONSE` using `{ messagingType: 'RESPONSE' }` options
  //  * - `MESSAGE_TAG` using `{ tag: 'ANY_TAG' }` options
  //  */
  // sendMessage(
  //   psidOrRecipient: MessengerTypes.PsidOrRecipient,
  //   message: MessengerTypes.Message,
  //   options: MessengerTypes.SendOption = {}
  // ): Promise<MessengerTypes.SendMessageSuccessResponse> {
  //   const recipient =
  //     typeof psidOrRecipient === 'string'
  //       ? {
  //           id: psidOrRecipient,
  //         }
  //       : psidOrRecipient;
  //   let messagingType = 'UPDATE';
  //   if (options.messagingType) {
  //     messagingType = options.messagingType;
  //   } else if (options.tag) {
  //     messagingType = 'MESSAGE_TAG';
  //   }
  //   return this.sendRequest({
  //     messagingType,
  //     recipient,
  //     message: Messenger.message(message),
  //     ...options,
  //   });
  // }
  // /**
  //  * Sends plain text messages to the specified user using the Send API.
  //  *
  //  * @param psidOrRecipient - A facebook page-scoped ID of the recipient or a recipient object
  //  * @param text - The text to be sent.
  //  * @param options - Other optional parameters. For example, [messaging types](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types) or [tags](https://developers.facebook.com/docs/messenger-platform/message-tags).
  //  * @returns An object includes recipientId and messageId.
  //  * @see https://developers.facebook.com/docs/messenger-platform/send-messages#sending_text
  //  * @example
  //  * ```js
  //  * await messenger.sendText(USER_ID, 'Hello!');
  //  * ```
  //  */
  // sendText(
  //   psidOrRecipient: MessengerTypes.PsidOrRecipient,
  //   text: string,
  //   options?: MessengerTypes.SendOption
  // ): Promise<MessengerTypes.SendMessageSuccessResponse> {
  //   return this.sendMessage(
  //     psidOrRecipient,
  //     Messenger.text(text, pick(options, messageOptionKeys)),
  //     omit(options, messageOptionKeys)
  //   );
  // }
}
