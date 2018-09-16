/* @flow */
/* eslint-disable camelcase */
import warning from 'warning';

import Messenger from './Messenger';
import type {
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  AttachmentPayload,
  BatchItem,
  FileData,
  MediaElement,
  Message,
  OpenGraphElement,
  ReceiptAttributes,
  Recipient,
  SendOption,
  SenderAction,
  TemplateButton,
  TemplateElement,
  UserID,
} from './MessengerTypes';

function omitUndefinedFields(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function sendRequest(body: Object): BatchItem {
  return {
    method: 'POST',
    relative_url: 'me/messages',
    body,
  };
}

function sendMessage(
  idOrRecipient: UserID | Recipient,
  msg: Message,
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
  options?: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createText(text, options), options);
}

function sendAttachment(
  recipient: UserID | Recipient,
  attachment: Attachment,
  options?: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}
function sendAudio(
  recipient: UserID | Recipient,
  audio: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createAudio(audio, options), options);
}

function sendImage(
  recipient: UserID | Recipient,
  image: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createImage(image, options), options);
}

function sendVideo(
  recipient: UserID | Recipient,
  video: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createVideo(video, options), options);
}

function sendFile(
  recipient: UserID | Recipient,
  file: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return sendMessage(recipient, Messenger.createFile(file, options), options);
}

function sendTemplate(
  recipient: UserID | Recipient,
  payload: AttachmentPayload,
  options?: SendOption
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
  buttons: Array<TemplateButton>,
  options?: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function sendGenericTemplate(
  recipient: UserID | Recipient,
  elements: Array<TemplateElement>,
  {
    // $FlowFixMe
    image_aspect_ratio = 'horizontal',
    ...options
  }: {
    image_aspect_ratio: 'horizontal' | 'square',
    ...SendOption,
  } = {}
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
  elements: Array<TemplateElement>,
  buttons: Array<TemplateButton>,
  {
    // $FlowFixMe
    top_element_style = 'large',
    ...options
  }: {
    top_element_style: 'large' | 'compact',
    ...SendOption,
  } = {}
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
  elements: Array<OpenGraphElement>,
  options?: SendOption
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
  options?: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createReceiptTemplate(attrs, options),
    options
  );
}

function sendMediaTemplate(
  recipient: UserID | Recipient,
  elements: Array<MediaElement>,
  options?: SendOption
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
  options?: SendOption
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
  options?: SendOption
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
  options?: SendOption
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
  options?: SendOption
): BatchItem {
  return sendMessage(
    recipient,
    Messenger.createAirlineUpdateTemplate(attrs, options),
    options
  );
}

function getUserProfile(userId: string) {
  return {
    method: 'GET',
    relative_url: `${userId}`,
  };
}

function sendSenderAction(
  idOrRecipient: UserID | Recipient,
  action: SenderAction
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
  });
}

function typingOn(idOrRecipient: UserID | Recipient) {
  return sendSenderAction(idOrRecipient, 'typing_on');
}

function typingOff(idOrRecipient: UserID | Recipient) {
  return sendSenderAction(idOrRecipient, 'typing_off');
}

function markSeen(idOrRecipient: UserID | Recipient) {
  return sendSenderAction(idOrRecipient, 'mark_seen');
}

function passThreadControl(
  recipientId: string,
  targetAppId: number,
  metadata?: string
) {
  return {
    method: 'POST',
    relative_url: 'me/pass_thread_control',
    body: {
      recipient: { id: recipientId },
      target_app_id: targetAppId,
      metadata,
    },
  };
}

function passThreadControlToPageInbox(recipientId: string, metadata?: string) {
  return passThreadControl(recipientId, 263902037430900, metadata);
}

function takeThreadControl(recipientId: string, metadata?: string) {
  return {
    method: 'POST',
    relative_url: 'me/take_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
    },
  };
}

function requestThreadControl(recipientId: string, metadata?: string) {
  return {
    method: 'POST',
    relative_url: 'me/request_thread_control',
    body: {
      recipient: { id: recipientId },
      metadata,
    },
  };
}

function associateLabel(userId: UserID, labelId: number) {
  return {
    method: 'POST',
    relative_url: `${labelId}/label`,
    body: {
      user: userId,
    },
  };
}

function dissociateLabel(userId: UserID, labelId: number) {
  return {
    method: 'DELETE',
    relative_url: `${labelId}/label`,
    body: {
      user: userId,
    },
  };
}

function getAssociatedLabels(userId: UserID) {
  return {
    method: 'GET',
    relative_url: `${userId}/custom_labels`,
  };
}

function deprecated(name, fn) {
  return (...args: any) => {
    warning(
      false,
      `\`MessengerBatch.${name}\` is deprecated. Use \`MessengerBatch.${
        fn.name
      }\` instead.`
    );
    return fn(...args);
  };
}

const MessengerBatch = {
  // TODO: Remove in v0.8
  createRequest: deprecated('createRequest', sendRequest),
  createMessage: deprecated('createMessage', sendMessage),
  createText: deprecated('createText', sendText),
  createAttachment: deprecated('createAttachment', sendAttachment),
  createAudio: deprecated('createAudio', sendAudio),
  createImage: deprecated('createImage', sendImage),
  createVideo: deprecated('createVideo', sendVideo),
  createFile: deprecated('createFile', sendFile),
  createTemplate: deprecated('createTemplate', sendTemplate),
  createButtonTemplate: deprecated('createButtonTemplate', sendButtonTemplate),
  createGenericTemplate: deprecated(
    'createGenericTemplate',
    sendGenericTemplate
  ),
  createListTemplate: deprecated('createListTemplate', sendListTemplate),
  createOpenGraphTemplate: deprecated(
    'createOpenGraphTemplate',
    sendOpenGraphTemplate
  ),
  createReceiptTemplate: deprecated(
    'createReceiptTemplate',
    sendReceiptTemplate
  ),
  createMediaTemplate: deprecated('createMediaTemplate', sendMediaTemplate),
  createAirlineBoardingPassTemplate: deprecated(
    'createAirlineBoardingPassTemplate',
    sendAirlineBoardingPassTemplate
  ),
  createAirlineCheckinTemplate: deprecated(
    'createAirlineCheckinTemplate',
    sendAirlineCheckinTemplate
  ),
  createAirlineItineraryTemplate: deprecated(
    'createAirlineItineraryTemplate',
    sendAirlineItineraryTemplate
  ),
  createAirlineFlightUpdateTemplate: deprecated(
    'createAirlineFlightUpdateTemplate',
    sendAirlineUpdateTemplate
  ),

  sendAirlineFlightUpdateTemplate: deprecated(
    'sendAirlineFlightUpdateTemplate',
    sendAirlineUpdateTemplate
  ),

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
  sendListTemplate,
  sendOpenGraphTemplate,
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

  associateLabel,
  dissociateLabel,
  getAssociatedLabels,
};

export default MessengerBatch;
