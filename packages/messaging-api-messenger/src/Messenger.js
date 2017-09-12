import type {
  UserID,
  Recipient,
  SendOption,
  Message,
  SendMessageSucessResponse,
} from './MessengerTypes';

export default class Messenger {
  static createRequest = (
    body: Object
  ): Promise<SendMessageSucessResponse> => ({
    method: 'POST',
    relative_url: 'me/messages',
    body,
  });

  static createMessage = (
    idOrRecipient: UserID | Recipient,
    message: Message,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;
    return Messenger.createRequest({
      recipient,
      message,
      ...options,
    });
  };

  static createText = (
    recipient: UserID | Recipient,
    text: string,
    options?: SendOption
  ) => Messenger.createMessage(recipient, { text }, options);
}
