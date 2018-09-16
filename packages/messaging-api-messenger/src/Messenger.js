/* @flow */

import FormData from 'form-data';
import invariant from 'invariant';
import isPlainObject from 'is-plain-object';
import omit from 'lodash.omit';
import warning from 'warning';

import type {
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  AttachmentPayload,
  FileData,
  MediaElement,
  Message,
  OpenGraphElement,
  QuickReply,
  ReceiptAttributes,
  TemplateButton,
  TemplateElement,
} from './MessengerTypes';

function validateQuickReplies(quickReplies: Array<QuickReply>): void {
  // quick_replies is limited to 11
  invariant(
    Array.isArray(quickReplies) && quickReplies.length <= 11,
    'quick_replies is an array and limited to 11'
  );

  quickReplies.forEach(quickReply => {
    if (quickReply.content_type === 'text') {
      // title has a 20 character limit, after that it gets truncated
      invariant(
        (quickReply.title: any).trim().length <= 20,
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );

      // payload has a 1000 character limit
      invariant(
        (quickReply.payload: any).length <= 1000,
        'payload of quick reply has a 1000 character limit'
      );
    }
  });
}

function createMessage(
  msg: Message,
  options?: { quick_replies?: Array<QuickReply> } = {}
): Message {
  const message = {
    ...msg,
  };

  if (
    options.quick_replies &&
    Array.isArray(options.quick_replies) &&
    options.quick_replies.length >= 1
  ) {
    validateQuickReplies(options.quick_replies);
    message.quick_replies = options.quick_replies;
  }

  return message;
}

function createText(
  text: string,
  options?: { quick_replies?: Array<QuickReply> } = {}
): Message {
  return createMessage({ text }, options);
}

function createMessageFormData(
  payload: AttachmentPayload,
  filedata: FileData,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  const message: { ...AttachmentPayload, quick_replies?: Array<QuickReply> } = {
    ...payload,
  };

  if (options.quick_replies) {
    validateQuickReplies(options.quick_replies);
    message.quick_replies = options.quick_replies;
  }

  const formdata = new FormData();

  formdata.append('message', JSON.stringify(message));
  formdata.append('filedata', filedata, omit(options, ['quick_replies']));

  return formdata;
}

function createAttachment(
  attachment: Attachment,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createMessage(
    {
      attachment,
    },
    options
  );
}

function createAttachmentFormData(attachment, filedata, options) {
  return createMessageFormData(
    {
      attachment,
    },
    // $FlowFixMe
    filedata,
    options
  );
}

function createAudio(
  audio: string | FileData | AttachmentPayload,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  const attachment = {
    type: 'audio',
    payload: {},
  };
  if (typeof audio === 'string') {
    attachment.payload.url = audio;
    return createAttachment(attachment, options);
  }
  if (audio && isPlainObject(audio)) {
    attachment.payload = audio;
    return createAttachment(attachment, options);
  }

  return createAttachmentFormData(attachment, audio, options);
}

function createImage(
  image: string | FileData | AttachmentPayload,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  const attachment = {
    type: 'image',
    payload: {},
  };
  if (typeof image === 'string') {
    attachment.payload.url = image;
    return createAttachment(attachment, options);
  }
  if (image && isPlainObject(image)) {
    attachment.payload = image;
    return createAttachment(attachment, options);
  }

  return createAttachmentFormData(attachment, image, options);
}

function createVideo(
  video: string | FileData | AttachmentPayload,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  const attachment = {
    type: 'video',
    payload: {},
  };
  if (typeof video === 'string') {
    attachment.payload.url = video;
    return createAttachment(attachment, options);
  }
  if (video && isPlainObject(video)) {
    attachment.payload = video;
    return createAttachment(attachment, options);
  }

  return createAttachmentFormData(attachment, video, options);
}

function createFile(
  file: string | FileData | AttachmentPayload,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  const attachment = {
    type: 'file',
    payload: {},
  };
  if (typeof file === 'string') {
    attachment.payload.url = file;
    return createAttachment(attachment, options);
  }
  if (file && isPlainObject(file)) {
    attachment.payload = file;
    return createAttachment(attachment, options);
  }

  return createAttachmentFormData(attachment, file, options);
}

function createTemplate(
  payload: AttachmentPayload,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createAttachment(
    {
      type: 'template',
      payload,
    },
    options
  );
}

function createButtonTemplate(
  text: string,
  buttons: Array<TemplateButton>,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'button',
      text,
      buttons,
    },
    options
  );
}

function createGenericTemplate(
  elements: Array<TemplateElement>,
  options?: {
    image_aspect_ratio?: 'horizontal' | 'square',
    quick_replies?: Array<QuickReply>,
  } = {}
) {
  return createTemplate(
    {
      template_type: 'generic',
      elements,
      image_aspect_ratio: options.image_aspect_ratio || 'horizontal',
    },
    options
  );
}

function createListTemplate(
  elements: Array<TemplateElement>,
  buttons: Array<TemplateButton>,
  options?: {
    top_element_style?: 'large' | 'compact',
    quick_replies?: Array<QuickReply>,
  } = {}
) {
  return createTemplate(
    {
      template_type: 'list',
      elements,
      buttons,
      top_element_style: options.top_element_style || 'large',
    },
    options
  );
}

function createOpenGraphTemplate(
  elements: Array<OpenGraphElement>,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'open_graph',
      elements,
    },
    options
  );
}

function createMediaTemplate(
  elements: Array<MediaElement>,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'media',
      elements,
    },
    options
  );
}

function createReceiptTemplate(
  attrs: ReceiptAttributes,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'receipt',
      ...attrs,
    },
    options
  );
}

function createAirlineBoardingPassTemplate(
  attrs: AirlineBoardingPassAttributes,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'airline_boardingpass',
      ...attrs,
    },
    options
  );
}

function createAirlineCheckinTemplate(
  attrs: AirlineCheckinAttributes,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'airline_checkin',
      ...attrs,
    },
    options
  );
}

function createAirlineItineraryTemplate(
  attrs: AirlineItineraryAttributes,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'airline_itinerary',
      ...attrs,
    },
    options
  );
}

function createAirlineUpdateTemplate(
  attrs: AirlineUpdateAttributes,
  options?: { quick_replies?: Array<QuickReply> } = {}
) {
  return createTemplate(
    {
      template_type: 'airline_update',
      ...attrs,
    },
    options
  );
}

function deprecated(name, fn) {
  return (...args: any) => {
    warning(
      false,
      `\`Messenger.${name}\` is deprecated. Use \`Messenger.${
        fn.name
      }\` instead.`
    );
    return fn(...args);
  };
}

const Messenger = {
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
  createMediaTemplate,
  createReceiptTemplate,
  createAirlineBoardingPassTemplate,
  createAirlineCheckinTemplate,
  createAirlineItineraryTemplate,
  createAirlineUpdateTemplate,
  createAirlineFlightUpdateTemplate: deprecated(
    'createAirlineFlightUpdateTemplate',
    createAirlineUpdateTemplate
  ),
};

export default Messenger;
