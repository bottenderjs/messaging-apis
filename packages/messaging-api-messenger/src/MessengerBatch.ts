import omit from 'lodash/omit';
import pick from 'lodash/pick';

import Messenger from './Messenger';
import {
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  BatchItem,
  BatchRequestOptions,
  MediaAttachmentPayload,
  MediaElement,
  Message,
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

function sendRequest(body: object, options?: BatchRequestOptions): BatchItem {
  return {
    method: 'POST',
    relativeUrl: 'me/messages',
    body,
    ...options,
  };
}

function sendMessage(
  idOrRecipient: UserID | Recipient,
  msg: Message,
  options: SendOption & BatchRequestOptions = {}
): BatchItem {
  const recipient =
    typeof idOrRecipient === 'string'
      ? {
          id: idOrRecipient,
        }
      : idOrRecipient;
  let messagingType = 'UPDATE';
  if (options.messagingType) {
    messagingType = options.messagingType;
  } else if (options.tag) {
    messagingType = 'MESSAGE_TAG';
  }

  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return sendRequest(
    {
      messagingType,
      recipient,
      message: Messenger.createMessage(msg, options),
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    batchRequestOptions
  );
}

function sendText(
  recipient: UserID | Recipient,
  text: string,
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(recipient, Messenger.createText(text, options), options);
}

function sendAttachment(
  recipient: UserID | Recipient,
  attachment: Attachment,
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(recipient, Messenger.createAudio(audio, options), options);
}

function sendImage(
  recipient: UserID | Recipient,
  image: string | MediaAttachmentPayload,
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(recipient, Messenger.createImage(image, options), options);
}

function sendVideo(
  recipient: UserID | Recipient,
  video: string | MediaAttachmentPayload,
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(recipient, Messenger.createVideo(video, options), options);
}

function sendFile(
  recipient: UserID | Recipient,
  file: string | MediaAttachmentPayload,
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(recipient, Messenger.createFile(file, options), options);
}

function sendTemplate(
  recipient: UserID | Recipient,
  payload: TemplateAttachmentPayload,
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
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
    imageAspectRatio = 'horizontal',
    ...options
  }: {
    imageAspectRatio?: 'horizontal' | 'square';
  } & SendOption = {}
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createGenericTemplate(elements, {
      ...options,
      imageAspectRatio,
    }),

    options
  );
}

function sendReceiptTemplate(
  recipient: UserID | Recipient,
  attrs: ReceiptAttributes,
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
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
  options?: SendOption & BatchRequestOptions
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function getUserProfile(
  userId: string,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'GET',
    relativeUrl: `${userId}`.concat(
      options.accessToken ? `?access_token=${options.accessToken}` : ''
    ),
    ...batchRequestOptions,
  };
}

function sendSenderAction(
  idOrRecipient: UserID | Recipient,
  action: SenderAction,
  options: SendOption & BatchRequestOptions = {}
) {
  const recipient =
    typeof idOrRecipient === 'string'
      ? {
          id: idOrRecipient,
        }
      : idOrRecipient;

  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return sendRequest(
    {
      recipient,
      senderAction: action,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    batchRequestOptions
  );
}

function typingOn(
  idOrRecipient: UserID | Recipient,
  options?: SendOption & BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

function typingOff(
  idOrRecipient: UserID | Recipient,
  options?: SendOption & BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

function markSeen(
  idOrRecipient: UserID | Recipient,
  options?: SendOption & BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata: string,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'POST',
    relativeUrl: 'me/pass_thread_control',
    body: {
      recipient: { id: recipientId },
      targetAppId,
      metadata,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    ...batchRequestOptions,
  };
}

function passThreadControlToPageInbox(
  recipientId: string,
  metadata: string,
  options: { accessToken?: string } = {}
) {
  return passThreadControl(recipientId, 263902037430900, metadata, options);
}

function takeThreadControl(
  recipientId: string,
  metadata: string,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'POST',
    relativeUrl: 'me/take_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    ...batchRequestOptions,
  };
}

function requestThreadControl(
  recipientId: string,
  metadata: string,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'POST',
    relativeUrl: 'me/request_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    ...batchRequestOptions,
  };
}

function getThreadOwner(
  recipientId: string,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'GET',
    relativeUrl: `me/thread_owner?recipient=${recipientId}`.concat(
      options.accessToken ? `&access_token=${options.accessToken}` : ''
    ),
    responseAccessPath: 'data[0].threadOwner',
    ...batchRequestOptions,
  };
}

function associateLabel(
  userId: UserID,
  labelId: number,
  options: { accessToken?: string } & BatchRequestOptions = {}
) {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'POST',
    relativeUrl: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    ...batchRequestOptions,
  };
}

function dissociateLabel(
  userId: UserID,
  labelId: number,
  options: { accessToken?: string } & BatchRequestOptions = {}
): object {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'DELETE',
    relativeUrl: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    ...batchRequestOptions,
  };
}

function getAssociatedLabels(
  userId: UserID,
  options: { accessToken?: string } & BatchRequestOptions = {}
): object {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return {
    method: 'GET',
    relativeUrl: `${userId}/custom_labels`.concat(
      options.accessToken ? `?access_token=${options.accessToken}` : ''
    ),
    ...batchRequestOptions,
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
