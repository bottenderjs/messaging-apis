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
  psidOrRecipient: Types.PsidOrRecipient,
  msg: Types.Message,
  options: Types.SendOption & Types.BatchRequestOptions = {}
): Types.BatchItem {
  const recipient =
    typeof psidOrRecipient === 'string'
      ? {
          id: psidOrRecipient,
        }
      : psidOrRecipient;
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
  psidOrRecipient: Types.PsidOrRecipient,
  text: string,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createText(text, options),
    options
  );
}

function sendAttachment(
  psidOrRecipient: Types.PsidOrRecipient,
  attachment: Types.Attachment,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}

function sendAudio(
  psidOrRecipient: Types.PsidOrRecipient,
  audio: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAudio(audio, options),
    options
  );
}

function sendImage(
  psidOrRecipient: Types.PsidOrRecipient,
  image: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createImage(image, options),
    options
  );
}

function sendVideo(
  psidOrRecipient: Types.PsidOrRecipient,
  video: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createVideo(video, options),
    options
  );
}

function sendFile(
  psidOrRecipient: Types.PsidOrRecipient,
  file: string | Types.MediaAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createFile(file, options),
    options
  );
}

function sendTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  payload: Types.TemplateAttachmentPayload,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

function sendButtonTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  text: string,
  buttons: Types.TemplateButton[],
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function sendGenericTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  elements: Types.TemplateElement[],
  {
    imageAspectRatio = 'horizontal',
    ...options
  }: {
    imageAspectRatio?: 'horizontal' | 'square';
  } & Types.SendOption = {}
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createGenericTemplate(elements, {
      ...options,
      imageAspectRatio,
    }),

    options
  );
}

function sendReceiptTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.ReceiptAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createReceiptTemplate(attrs, options),
    options
  );
}

function sendMediaTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  elements: Types.MediaElement[],
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

function sendAirlineBoardingPassTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.AirlineBoardingPassAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

function sendAirlineCheckinTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.AirlineCheckinAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

function sendAirlineItineraryTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.AirlineItineraryAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineItineraryTemplate(attrs, options),
    options
  );
}

function sendAirlineUpdateTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.AirlineUpdateAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function sendOneTimeNotifReqTemplate(
  psidOrRecipient: Types.PsidOrRecipient,
  attrs: Types.OneTimeNotifReqAttributes,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createOneTimeNotifReqTemplate(attrs, options),
    options
  );
}

function getUserProfile(
  userId: string,
  options: {
    fields?: Types.UserProfileField[];
    accessToken?: string;
  } & Types.BatchRequestOptions = {}
): Types.BatchItem {
  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  const fields = options.fields || [
    'id',
    'name',
    'first_name',
    'last_name',
    'profile_pic',
  ];

  return {
    method: 'GET',
    relativeUrl: `${userId}?fields=${fields.join(',')}`.concat(
      options.accessToken ? `&access_token=${options.accessToken}` : ''
    ),
    ...batchRequestOptions,
  };
}

function sendSenderAction(
  psidOrRecipient: Types.PsidOrRecipient,
  senderAction: Types.SenderAction,
  options: Types.SendOption & Types.BatchRequestOptions = {}
): Types.BatchItem {
  const recipient =
    typeof psidOrRecipient === 'string'
      ? {
          id: psidOrRecipient,
        }
      : psidOrRecipient;

  const batchRequestOptions = pick(options, ['name', 'dependsOn']);

  return sendRequest(
    {
      recipient,
      senderAction,
      ...omitUndefinedFields(omit(options, ['name', 'dependsOn'])),
    },
    batchRequestOptions
  );
}

function typingOn(
  idOrRecipient: Types.PsidOrRecipient,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

function typingOff(
  idOrRecipient: Types.PsidOrRecipient,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

function markSeen(
  idOrRecipient: Types.PsidOrRecipient,
  options?: Types.SendOption & Types.BatchRequestOptions
): Types.BatchItem {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata?: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  metadata?: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
  return passThreadControl(recipientId, 263902037430900, metadata, options);
}

function takeThreadControl(
  recipientId: string,
  metadata?: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  metadata?: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
): Types.BatchItem {
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
  userId: string,
  labelId: number,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  userId: string,
  labelId: number,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  userId: string,
  options: { accessToken?: string } & Types.BatchRequestOptions = {}
): Types.BatchItem {
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
  sendOneTimeNotifReqTemplate,

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
