import omit from 'lodash/omit';
import pick from 'lodash/pick';

import Messenger from './Messenger';
import * as Types from './MessengerTypes';

function omitUndefinedFields(obj = {}): object {
  return JSON.parse(JSON.stringify(obj));
}

function sendRequest(
  body: object,
  options?: Types.BatchRequestOptions
): Types.BatchItem {
  return {
    method: 'POST',
    relativeUrl: 'me/messages',
    body,
    ...options,
  };
}

function sendMessage(
  idOrRecipient: Types.UserID | Types.Recipient,
  msg: Types.Message,
  options: Types.SendOption & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  recipient: Types.UserID | Types.Recipient,
  text: string,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(recipient, Messenger.createText(text, options), options);
}

function sendAttachment(
  recipient: Types.UserID | Types.Recipient,
  attachment: Types.Attachment,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}

function sendAudio(
  recipient: Types.UserID | Types.Recipient,
  audio: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(recipient, Messenger.createAudio(audio, options), options);
}

function sendImage(
  recipient: Types.UserID | Types.Recipient,
  image: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(recipient, Messenger.createImage(image, options), options);
}

function sendVideo(
  recipient: Types.UserID | Types.Recipient,
  video: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(recipient, Messenger.createVideo(video, options), options);
}

function sendFile(
  recipient: Types.UserID | Types.Recipient,
  file: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(recipient, Messenger.createFile(file, options), options);
}

function sendTemplate(
  recipient: Types.UserID | Types.Recipient,
  payload: Types.TemplateAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

function sendButtonTemplate(
  recipient: Types.UserID | Types.Recipient,
  text: string,
  buttons: Types.TemplateButton[],
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function sendGenericTemplate(
  recipient: Types.UserID | Types.Recipient,
  elements: Types.TemplateElement[],
  {
    imageAspectRatio = 'horizontal',
    ...options
  }: {
    imageAspectRatio?: 'horizontal' | 'square';
  } & Types.SendOption = {}
): Types.BatchItem {
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
  recipient: Types.UserID | Types.Recipient,
  attrs: Types.ReceiptAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createReceiptTemplate(attrs, options),
    options
  );
}

function sendMediaTemplate(
  recipient: Types.UserID | Types.Recipient,
  elements: Types.MediaElement[],
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

function sendAirlineBoardingPassTemplate(
  recipient: Types.UserID | Types.Recipient,
  attrs: Types.AirlineBoardingPassAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

function sendAirlineCheckinTemplate(
  recipient: Types.UserID | Types.Recipient,
  attrs: Types.AirlineCheckinAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

function sendAirlineItineraryTemplate(
  recipient: Types.UserID | Types.Recipient,
  attrs: Types.AirlineItineraryAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineItineraryTemplate(attrs, options),
    options
  );
}

function sendAirlineUpdateTemplate(
  recipient: Types.UserID | Types.Recipient,
  attrs: Types.AirlineUpdateAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function getUserProfile(
  userId: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  idOrRecipient: Types.UserID | Types.Recipient,
  action: Types.SenderAction,
  options: Types.SendOption & Types.BatchRequestOptions = {}
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
  idOrRecipient: Types.UserID | Types.Recipient,
  options?: Types.SendOption & Types.BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

function typingOff(
  idOrRecipient: Types.UserID | Types.Recipient,
  options?: Types.SendOption & Types.BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

function markSeen(
  idOrRecipient: Types.UserID | Types.Recipient,
  options?: Types.SendOption & Types.BatchRequestOptions
) {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  userId: Types.UserID,
  labelId: number,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  userId: Types.UserID,
  labelId: number,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
  userId: Types.UserID,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
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
