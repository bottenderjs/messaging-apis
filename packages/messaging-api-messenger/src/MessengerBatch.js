/* @flow */

import type {
  UserID,
  Recipient,
  SendOption,
  Message,
  BatchItem,
} from './MessengerTypes';

function createRequest(body: Object): BatchItem {
  return {
    method: 'POST',
    relative_url: 'me/messages',
    body,
  };
}

function createMessage(
  idOrRecipient: UserID | Recipient,
  message: Message,
  options?: SendOption = {}
): BatchItem {
  const recipient =
    typeof idOrRecipient === 'string'
      ? {
          id: idOrRecipient,
        }
      : idOrRecipient;
  let messageType = 'UPDATE';
  if (options.messaging_type) {
    messageType = options.messaging_type;
  } else if (options.tag) {
    messageType = 'MESSAGE_TAG';
  }
  return createRequest({
    messaging_type: messageType,
    recipient,
    message,
    ...options,
  });
}

function createText(
  recipient: UserID | Recipient,
  text: string,
  options?: SendOption
): BatchItem {
  return createMessage(recipient, { text }, options);
}

const MessengerBatch = {
  createRequest,
  createMessage,
  createText,
};

export default MessengerBatch;
