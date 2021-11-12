import omit from 'lodash/omit';
import pick from 'lodash/pick';

import * as Messenger from './Messenger';
import * as MessengerTypes from './MessengerTypes';

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

export function sendRequest(
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

export function sendMessage(
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
      message: Messenger.message(msg),
      ...omitUndefinedFields(omitBatchOptions(options)),
    },
    batchRequestOptions
  );
}

export function sendText(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(psidOrRecipient, Messenger.text(text, options), options);
}

export function sendAttachment(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attachment: MessengerTypes.Attachment,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.attachment(attachment, options),
    options
  );
}

export function sendAudio(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  audio: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(psidOrRecipient, Messenger.audio(audio, options), options);
}

export function sendImage(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  image: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(psidOrRecipient, Messenger.image(image, options), options);
}

export function sendVideo(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  video: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(psidOrRecipient, Messenger.video(video, options), options);
}

export function sendFile(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  file: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(psidOrRecipient, Messenger.file(file, options), options);
}

export function sendTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  payload: MessengerTypes.TemplateAttachmentPayload,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.template(payload, options),
    options
  );
}

export function sendButtonTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  text: string,
  buttons: MessengerTypes.TemplateButton[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.buttonTemplate(text, buttons, options),
    options
  );
}

export function sendGenericTemplate(
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
    Messenger.genericTemplate({
      elements,
      imageAspectRatio,
    }),
    options
  );
}

export function sendReceiptTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  receipt: Omit<MessengerTypes.ReceiptTemplatePayload, 'templateType'>,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.receiptTemplate(receipt, options),
    options
  );
}

export function sendMediaTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  elements: MessengerTypes.MediaElement[],
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.mediaTemplate(elements, options),
    options
  );
}

export function sendOneTimeNotifReqTemplate(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  attrs: Omit<MessengerTypes.OneTimeNotifReqTemplatePayload, 'templateType'>,
  options?: MessengerTypes.SendOption & MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendMessage(
    psidOrRecipient,
    Messenger.oneTimeNotifReqTemplate(attrs, options),
    options
  );
}

export function getUserProfile(
  userId: string,
  options: {
    fields?: MessengerTypes.UserProfileField[];
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  const fields = options.fields ?? [
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

export function getUserPersistentMenu(
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

export function setUserPersistentMenu(
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

export function deleteUserPersistentMenu(
  userId: string,
  options: {
    accessToken?: string;
  } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  const batchRequestOptions = pickBatchOptions(options);

  return {
    method: 'DELETE',
    relativeUrl:
      `/me/custom_user_settings?psid=${userId}&params=[%22persistent_menu%22]`.concat(
        options.accessToken ? `&access_token=${options.accessToken}` : ''
      ),
    ...batchRequestOptions,
  };
}

export function sendSenderAction(
  psidOrRecipient: MessengerTypes.PsidOrRecipient,
  senderAction: MessengerTypes.SenderAction,
  options: MessengerTypes.SenderActionOption &
    MessengerTypes.BatchRequestOptions = {}
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

export function typingOn(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.SenderActionOption &
    MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_on', options);
}

export function typingOff(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.SenderActionOption &
    MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'typing_off', options);
}

export function markSeen(
  idOrRecipient: MessengerTypes.PsidOrRecipient,
  options?: MessengerTypes.BatchRequestOptions
): MessengerTypes.BatchItem {
  return sendSenderAction(idOrRecipient, 'mark_seen', options);
}

export function passThreadControl(
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

export function passThreadControlToPageInbox(
  recipientId: string,
  metadata?: string,
  options: { accessToken?: string } & MessengerTypes.BatchRequestOptions = {}
): MessengerTypes.BatchItem {
  return passThreadControl(recipientId, 263902037430900, metadata, options);
}

export function takeThreadControl(
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

export function requestThreadControl(
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

export function getThreadOwner(
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

export function associateLabel(
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

export function dissociateLabel(
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

export function getAssociatedLabels(
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
