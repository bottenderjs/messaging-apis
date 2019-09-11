/* eslint-disable camelcase */
import warning from 'warning';

import Messenger from './Messenger';
import {
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  BatchItem,
  MediaAttachmentPayload,
  MediaElement,
  Message,
  OpenGraphElement,
  ReceiptAttributes,
  Recipient,
  SendOption,
  SenderAction,
  TemplateAttachmentPayload,
  TemplateButton,
  TemplateElement,
  UserID,
} from './MessengerTypes';

function omitUndefinedFields(obj = {}): object {
  return JSON.parse(JSON.stringify(obj));
}

function sendRequest(body: object): BatchItem {
  return {
    method: 'POST',
    relative_url: 'me/messages',
    body,
  };
}

function sendMessage(
  idOrRecipient: UserID | Recipient,
  msg: Message,
  options: SendOption = {}
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

  return sendRequest({
    messaging_type: messageType,
    recipient,
    message: Messenger.createMessage(msg, options),
    ...omitUndefinedFields(options),
  });
}

function sendText(
  recipient: UserID | Recipient,
  text: string,
  options: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createText(text, options), options);
}

function sendAttachment(
  recipient: UserID | Recipient,
  attachment: Attachment,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}

function sendAudio(
  recipient: UserID | Recipient,
  audio: string | MediaAttachmentPayload,
  options: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createAudio(audio, options), options);
}

function sendImage(
  recipient: UserID | Recipient,
  image: string | MediaAttachmentPayload,
  options: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createImage(image, options), options);
}

function sendVideo(
  recipient: UserID | Recipient,
  video: string | MediaAttachmentPayload,
  options: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createVideo(video, options), options);
}

function sendFile(
  recipient: UserID | Recipient,
  file: string | MediaAttachmentPayload,
  options: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createFile(file, options), options);
}

function sendTemplate(
  recipient: UserID | Recipient,
  payload: TemplateAttachmentPayload,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

function sendButtonTemplate(
  recipient: UserID | Recipient,
  text: string,
  buttons: TemplateButton[],
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function sendGenericTemplate(
  recipient: UserID | Recipient,
  elements: TemplateElement[],
  {
    image_aspect_ratio = 'horizontal',
    ...options
  }: {
    image_aspect_ratio?: 'horizontal' | 'square';
  } & SendOption = {}
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createGenericTemplate(elements, {
      ...options,
      image_aspect_ratio,
    }),

    options
  );
}

function sendListTemplate(
  recipient: UserID | Recipient,
  elements: TemplateElement[],
  buttons: TemplateButton[],
  {
    top_element_style = 'large',
    ...options
  }: {
    top_element_style?: 'large' | 'compact';
  } & SendOption = {}
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createListTemplate(elements, buttons, {
      ...options,
      top_element_style,
    }),

    options
  );
}

function sendOpenGraphTemplate(
  recipient: UserID | Recipient,
  elements: OpenGraphElement[],
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createOpenGraphTemplate(elements, options),
    options
  );
}

function sendReceiptTemplate(
  recipient: UserID | Recipient,
  attrs: ReceiptAttributes,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createReceiptTemplate(attrs, options),
    options
  );
}

function sendMediaTemplate(
  recipient: UserID | Recipient,
  elements: MediaElement[],
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

function sendAirlineBoardingPassTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineBoardingPassAttributes,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

function sendAirlineCheckinTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineCheckinAttributes,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

function sendAirlineItineraryTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineItineraryAttributes,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineItineraryTemplate(attrs, options),
    options
  );
}

function sendAirlineUpdateTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineUpdateAttributes,
  options: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function getUserProfile(
  userId: string,
  options: { access_token?: string } = {}
) {
  return {
    method: 'GET',
    relative_url: `${userId}`.concat(
      options.access_token ? `?access_token=${options.access_token}` : ''
    ),
  };
}

function sendSenderAction(
  idOrRecipient: UserID | Recipient,
  action: SenderAction,
  options: SendOption
) {
  const recipient =
    typeof idOrRecipient === 'string'
      ? {
          id: idOrRecipient,
        }
      : idOrRecipient;

  return sendRequest({
    recipient,
    sender_action: action,
    ...omitUndefinedFields(options),
  });
}

function typingOn(idOrRecipient: UserID | Recipient, options: SendOption) {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

function typingOff(idOrRecipient: UserID | Recipient, options: SendOption) {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

function markSeen(idOrRecipient: UserID | Recipient, options: SendOption) {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata: string,
  options: { access_token?: string } = {}
) {
  return {
    method: 'POST',
    relative_url: 'me/pass_thread_control',
    body: {
      recipient: { id: recipientId },
      target_app_id: targetAppId,
      metadata,
      ...omitUndefinedFields(options),
    },
  };
}

function passThreadControlToPageInbox(
  recipientId: string,
  metadata: string,
  options: { access_token?: string } = {}
) {
  return passThreadControl(recipientId, 263902037430900, metadata, options);
}

function takeThreadControl(
  recipientId: string,
  metadata: string,
  options: { access_token?: string } = {}
) {
  return {
    method: 'POST',
    relative_url: 'me/take_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(options),
    },
  };
}

function requestThreadControl(
  recipientId: string,
  metadata: string,
  options: { access_token?: string } = {}
) {
  return {
    method: 'POST',
    relative_url: 'me/request_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(options),
    },
  };
}

function getThreadOwner(
  recipientId: string,
  options: { access_token?: string } = {}
) {
  return {
    method: 'GET',
    relative_url: `me/thread_owner?recipient=${recipientId}`.concat(
      options.access_token ? `&access_token=${options.access_token}` : ''
    ),

    responseAccessPath: 'data[0].thread_owner',
  };
}

function associateLabel(
  userId: UserID,
  labelId: number,
  options: { access_token?: string } = {}
) {
  return {
    method: 'POST',
    relative_url: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(options),
    },
  };
}

function dissociateLabel(
  userId: UserID,
  labelId: number,
  options: { access_token?: string } = {}
): object {
  return {
    method: 'DELETE',
    relative_url: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(options),
    },
  };
}

function getAssociatedLabels(
  userId: UserID,
  options: { access_token?: string } = {}
): object {
  return {
    method: 'GET',
    relative_url: `${userId}/custom_labels`.concat(
      options.access_token ? `?access_token=${options.access_token}` : ''
    ),
  };
}

function deprecated(name: string, fn: Function): (...args: any[]) => any {
  return (...args): any => {
    warning(
      false,
      `\`MessengerBatch.${name}\` is deprecated. Use \`MessengerBatch.${fn.name}\` instead.`
    );

    return fn(...args);
  };
}

const MessengerBatch = {
  sendRequest,
  sendMessage,
  sendText,
  sendAttachment,
  sendAudio,
  sendImage,
  sendVideo,
  sendFile,
  sendTemplate,
  sendButtonTemplate,
  sendGenericTemplate,
  sendListTemplate: deprecated('sendListTemplate', sendListTemplate),
  sendOpenGraphTemplate: deprecated(
    'sendOpenGraphTemplate',
    sendOpenGraphTemplate
  ),

  sendReceiptTemplate,
  sendMediaTemplate,
  sendAirlineBoardingPassTemplate,
  sendAirlineCheckinTemplate,
  sendAirlineItineraryTemplate,
  sendAirlineUpdateTemplate,

  getUserProfile,

  sendSenderAction,
  typingOn,
  typingOff,
  markSeen,

  passThreadControl,
  passThreadControlToPageInbox,
  takeThreadControl,
  requestThreadControl,
  getThreadOwner,

  associateLabel,
  dissociateLabel,
  getAssociatedLabels,
};

export default MessengerBatch;
