import omit from 'lodash/omit';
import pick from 'lodash/pick';

import Messenger from './Messenger';
import type { MessengerTypes } from './MessengerTypes';

function omitUndefinedFields(obj = {}): object {
  return JSON.parse(JSON.stringify(obj));
}

function pickBatchOptions<T extends MessengerTypes.BatchRequestOptions>(
  options: T
): Pick<T, 'name' | 'dependsOn' | 'omitResponseOnSuccess'> {
  return pick(options, ['name', 'dependsOn', 'omitResponseOnSuccess']);
}

function omitBatchOptions<T extends MessengerTypes.BatchRequestOptions>(
  options: T
): Omit<T, 'name' | 'dependsOn' | 'omitResponseOnSuccess'> {
  return omit(options, ['name', 'dependsOn', 'omitResponseOnSuccess']);
}

function sendRequest(
  body: object,
  options?: MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return {
    method: 'POST',
    relativeUrl: 'me/messages',
    body,
    ...options,
  };
}

function sendMessage(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  msg: MessengerTypes.Message,
  options: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
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

  const batchRequestOptions = pickBatchOptions(options);

  return sendRequest(
    {
      messagingType,
      recipient,
      message: Messenger.createMessage(msg, options),
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    batchRequestOptions
  );
}

function sendText(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createText(text, options),
    options
  );
}

function sendAttachment(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attachment: MessengerTypes.Attachment,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}

function sendAudio(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  audio: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAudio(audio, options),
    options
  );
}

function sendImage(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  image: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createImage(image, options),
    options
  );
}

function sendVideo(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  video: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createVideo(video, options),
    options
  );
}

function sendFile(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  file: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createFile(file, options),
    options
  );
}

function sendTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  payload: MessengerTypes.TemplateAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

function sendButtonTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  buttons: MessengerTypes.TemplateButton[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function sendGenericTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  elements: MessengerTypes.TemplateElement[],
  {
    imageAspectRatio = 'horizontal',
    ...options
  }: {
    imageAspectRatio?: 'horizontal' | 'square';
  } & MessengerTypes.SendOption = {}
): MessengerTypes.BatchItem {
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
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  receipt: MessengerTypes.ReceiptAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createReceiptTemplate(receipt, options),
    options
  );
}

function sendMediaTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  elements: MessengerTypes.MediaElement[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

function sendAirlineBoardingPassTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineBoardingPassAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

function sendAirlineCheckinTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineCheckinAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

function sendAirlineItineraryTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineItineraryAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineItineraryTemplate(attrs, options),
    options
  );
}

function sendAirlineUpdateTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.AirlineUpdateAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function sendOneTimeNotifReqTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: MessengerTypes.OneTimeNotifReqAttributes,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.createOneTimeNotifReqTemplate(attrs, options),
    options
  );
}

function getUserProfile(
  userId: string,
  options: {
    fields?: MessengerTypes.UserProfileField[];
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

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

function getUserPersistentMenu(
  userId: string,
  options: {
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'GET',
    relativeUrl: `/me/custom_user_settings?psid=${userId}`.concat(
      options.accessToken ? `&access_token=${options.accessToken}` : ''
    ),
    ...batchRequestOptions,
  };
}

function setUserPersistentMenu(
  userId: string,
  menuItems: MessengerTypes.MenuItem[] | MessengerTypes.PersistentMenuItem[],
  options: {
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  if (
    menuItems.some(
      (item: MessengerTypes.MenuItem | MessengerTypes.PersistentMenuItem) =>
        'locale' in item && item.locale === 'default'
    )
  ) {
    return {
      method: 'POST',
      relativeUrl: `/me/custom_user_settings`.concat(
        options.accessToken ? `?access_token=${options.accessToken}` : ''
      ),
      body: {
        psid: userId,
        persistentMenu: menuItems,
      },
      ...batchRequestOptions,
    };
  }

  return {
    method: 'POST',
    relativeUrl: `/me/custom_user_settings`.concat(
      options.accessToken ? `?access_token=${options.accessToken}` : ''
    ),
    body: {
      psid: userId,
      persistentMenu: [
        {
          locale: 'default',
          composerInputDisabled: false,
          callToActions: menuItems as MessengerTypes.MenuItem[],
        },
      ],
    },
    ...batchRequestOptions,
  };
}

function deleteUserPersistentMenu(
  userId: string,
  options: {
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'DELETE',
    relativeUrl: `/me/custom_user_settings?psid=${userId}&params=[%22persistent_menu%22]`.concat(
      options.accessToken ? `&access_token=${options.accessToken}` : ''
    ),
    ...batchRequestOptions,
  };
}

function sendSenderAction(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  senderAction: MessengerTypes.SenderAction,
  options: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const recipient =
    typeof psidOrRecipient === 'string'
      ? {
          id: psidOrRecipient,
        }
      : psidOrRecipient;

  const batchRequestOptions = pickBatchOptions(options);

  return sendRequest(
    {
      recipient,
      senderAction,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    batchRequestOptions
  );
}

function typingOn(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

function typingOff(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

function markSeen(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata?: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'POST',
    relativeUrl: 'me/pass_thread_control',
    body: {
      recipient: { id: recipientId },
      targetAppId,
      metadata,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    ...batchRequestOptions,
  };
}

function passThreadControlToPageInbox(
  recipientId: string,
  metadata?: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  return passThreadControl(recipientId, 263902037430900, metadata, options);
}

function takeThreadControl(
  recipientId: string,
  metadata?: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'POST',
    relativeUrl: 'me/take_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    ...batchRequestOptions,
  };
}

function requestThreadControl(
  recipientId: string,
  metadata?: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'POST',
    relativeUrl: 'me/request_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    ...batchRequestOptions,
  };
}

function getThreadOwner(
  recipientId: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

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
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'POST',
    relativeUrl: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    ...batchRequestOptions,
  };
}

function dissociateLabel(
  userId: string,
  labelId: number,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'DELETE',
    relativeUrl: `${labelId}/label`,
    body: {
      user: userId,
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    ...batchRequestOptions,
  };
}

function getAssociatedLabels(
  userId: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

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
  getUserPersistentMenu,
  setUserPersistentMenu,
  deleteUserPersistentMenu,

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
