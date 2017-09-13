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
  options?: SendOption
): BatchItem {
  const recipient =
    typeof idOrRecipient === 'string'
      ? {
          id: idOrRecipient,
        }
      : idOrRecipient;
  return createRequest({
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

const Messenger = {
  createRequest,
  createMessage,
  createText,
};

export default Messenger;
