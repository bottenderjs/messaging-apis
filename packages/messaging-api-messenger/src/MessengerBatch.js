/* @flow */
/* eslint-disable camelcase */

import Messenger from './Messenger';
import type {
  UserID,
  Recipient,
  SendOption,
  Message,
  Attachment,
  FileData,
  AttachmentPayload,
  BatchItem,
  TemplateButton,
  TemplateElement,
  OpenGraphElement,
  ReceiptAttributes,
  MediaElement,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineFlightUpdateAttributes,
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

  return createRequest({
    messaging_type: messageType,
    recipient,
    message: Messenger.createMessage(msg, options),
    ...options,
  });
}

function createText(
  recipient: UserID | Recipient,
  text: string,
  options?: SendOption
): BatchItem {
  return createMessage(recipient, Messenger.createText(text, options), options);
}

function createAttachment(
  recipient: UserID | Recipient,
  attachment: Attachment,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAttachment(attachment, options),
    options
  );
}
function createAudio(
  recipient: UserID | Recipient,
  audio: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAudio(audio, options),
    options
  );
}

function createImage(
  recipient: UserID | Recipient,
  image: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createImage(image, options),
    options
  );
}

function createVideo(
  recipient: UserID | Recipient,
  video: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createVideo(video, options),
    options
  );
}

function createFile(
  recipient: UserID | Recipient,
  file: string | FileData | AttachmentPayload,
  options?: SendOption
): BatchItem {
  return createMessage(recipient, Messenger.createFile(file, options), options);
}

function createTemplate(
  recipient: UserID | Recipient,
  payload: AttachmentPayload,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createTemplate(payload, options),
    options
  );
}

function createButtonTemplate(
  recipient: UserID | Recipient,
  text: string,
  buttons: Array<TemplateButton>,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createButtonTemplate(text, buttons, options),
    options
  );
}

function createGenericTemplate(
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
  return createMessage(
    recipient,
    Messenger.createGenericTemplate(elements, {
      ...options,
      image_aspect_ratio,
    }),
    options
  );
}

function createListTemplate(
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
  return createMessage(
    recipient,
    Messenger.createListTemplate(elements, buttons, {
      ...options,
      top_element_style,
    }),
    options
  );
}

function createOpenGraphTemplate(
  recipient: UserID | Recipient,
  elements: Array<OpenGraphElement>,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createOpenGraphTemplate(elements, options),
    options
  );
}

function createReceiptTemplate(
  recipient: UserID | Recipient,
  attrs: ReceiptAttributes,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createReceiptTemplate(attrs, options),
    options
  );
}

function createMediaTemplate(
  recipient: UserID | Recipient,
  elements: Array<MediaElement>,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createMediaTemplate(elements, options),
    options
  );
}

function createAirlineBoardingPassTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineBoardingPassAttributes,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAirlineBoardingPassTemplate(attrs, options),
    options
  );
}

function createAirlineCheckinTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineCheckinAttributes,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAirlineCheckinTemplate(attrs, options),
    options
  );
}

function createAirlineItineraryTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineItineraryAttributes,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAirlineItineraryTemplate(attrs, options),
    options
  );
}

function createAirlineFlightUpdateTemplate(
  recipient: UserID | Recipient,
  attrs: AirlineFlightUpdateAttributes,
  options?: SendOption
): BatchItem {
  return createMessage(
    recipient,
    Messenger.createAirlineFlightUpdateTemplate(attrs, options),
    options
  );
}

const MessengerBatch = {
  createRequest,
  createMessage,
  createText,
  createAttachment,
  createAudio,
  createImage,
  createVideo,
  createFile,
  createTemplate,
  createButtonTemplate,
  createGenericTemplate,
  createListTemplate,
  createOpenGraphTemplate,
  createReceiptTemplate,
  createMediaTemplate,
  createAirlineBoardingPassTemplate,
  createAirlineCheckinTemplate,
  createAirlineItineraryTemplate,
  createAirlineFlightUpdateTemplate,
};

export default MessengerBatch;
