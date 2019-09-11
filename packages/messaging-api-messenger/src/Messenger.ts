import FormData from 'form-data';
import invariant from 'invariant';
import omit from 'lodash.omit';
import warning from 'warning';

import {
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineUpdateAttributes,
  Attachment,
  FileData,
  FileDataMediaAttachment,
  FileDataMediaAttachmentMessage,
  MediaAttachmentPayload,
  MediaElement,
  Message,
  OpenGraphElement,
  QuickReply,
  ReceiptAttributes,
  TemplateAttachmentPayload,
  TemplateButton,
  TemplateElement,
} from './MessengerTypes';

function validateQuickReplies(quickReplies: QuickReply[]): void {
  // quick_replies is limited to 11
  invariant(
    Array.isArray(quickReplies) && quickReplies.length <= 11,
    'quick_replies is an array and limited to 11'
  );

  quickReplies.forEach(quickReply => {
    if (quickReply.content_type === 'text') {
      // title has a 20 character limit, after that it gets truncated
      invariant(
        quickReply.title && quickReply.title.trim().length <= 20,
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );

      // payload has a 1000 character limit
      invariant(
        quickReply.payload && quickReply.payload.length <= 1000,
        'payload of quick reply has a 1000 character limit'
      );
    }
  });
}

function createMessage(
  msg: Message,
  options: { quick_replies?: QuickReply[] } = {}
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
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  return createMessage({ text }, options);
}

function createMessageFormData(
  payload: FileDataMediaAttachmentMessage,
  filedata: FileData,
  options: { quick_replies?: QuickReply[] } = {}
): FormData {
  const message: FileDataMediaAttachmentMessage = {
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
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  return createMessage(
    {
      attachment,
    },
    options
  );
}

function createAttachmentFormData(
  attachment: FileDataMediaAttachment,
  filedata: FileData,
  options = {}
): FormData {
  return createMessageFormData(
    {
      attachment,
    },
    filedata,
    options
  );
}

function createAudio(
  audio: string | MediaAttachmentPayload,
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  if (typeof audio === 'string') {
    const attachment: Attachment = {
      type: 'audio',
      payload: {
        url: audio,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Attachment = {
    type: 'audio',
    payload: audio as MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createAudioFormData(
  audio: FileData,
  options: { quick_replies?: Array<QuickReply> } = {}
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'audio',
    payload: {},
  };

  return createAttachmentFormData(attachment, audio, options);
}

function createImage(
  image: string | MediaAttachmentPayload,
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  if (typeof image === 'string') {
    const attachment: Attachment = {
      type: 'image',
      payload: {
        url: image,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Attachment = {
    type: 'image',
    payload: image as MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createImageFormData(
  image: FileData,
  options: { quick_replies?: Array<QuickReply> } = {}
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'image',
    payload: {},
  };

  return createAttachmentFormData(attachment, image, options);
}

function createVideo(
  video: string | MediaAttachmentPayload,
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  if (typeof video === 'string') {
    const attachment: Attachment = {
      type: 'video',
      payload: {
        url: video,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Attachment = {
    type: 'video',
    payload: video as MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createVideoFormData(
  video: FileData,
  options: { quick_replies?: Array<QuickReply> } = {}
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'video',
    payload: {},
  };

  return createAttachmentFormData(attachment, video, options);
}

function createFile(
  file: string | MediaAttachmentPayload,
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  if (typeof file === 'string') {
    const attachment: Attachment = {
      type: 'file',
      payload: {
        url: file,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Attachment = {
    type: 'file',
    payload: file as MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createFileFormData(
  file: FileData,
  options: { quick_replies?: Array<QuickReply> } = {}
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'file',
    payload: {},
  };

  return createAttachmentFormData(attachment, file, options);
}

function createTemplate(
  payload: TemplateAttachmentPayload,
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
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
  buttons: TemplateButton[],
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
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
  elements: TemplateElement[],
  options: {
    image_aspect_ratio?: 'horizontal' | 'square';
    quick_replies?: QuickReply[];
  } = {}
): Message {
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
  elements: TemplateElement[],
  buttons: TemplateButton[],
  options: {
    top_element_style?: 'large' | 'compact';
    quick_replies?: Array<QuickReply>;
  } = {}
): Message {
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
  elements: OpenGraphElement[],
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
  return createTemplate(
    {
      template_type: 'open_graph',
      elements,
    },
    options
  );
}

function createMediaTemplate(
  elements: MediaElement[],
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
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
  options: { quick_replies?: Array<QuickReply> } = {}
): Message {
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
  options: { quick_replies?: QuickReply[] } = {}
): Message {
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
  options: { quick_replies?: QuickReply[] } = {}
): Message {
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
  options: { quick_replies?: QuickReply[] } = {}
): Message {
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
  options: { quick_replies?: QuickReply[] } = {}
): Message {
  return createTemplate(
    {
      template_type: 'airline_update',
      ...attrs,
    },
    options
  );
}

function deprecated(name: string, fn: Function): (...args: any[]) => any {
  return (...args): any => {
    warning(
      false,
      `\`Messenger.${name}\` is deprecated. Use \`Messenger.${fn.name}\` instead.`
    );

    return fn(...args);
  };
}

const Messenger = {
  createMessage,
  createText,
  createAttachment,
  createAudio,
  createAudioFormData,
  createImage,
  createImageFormData,
  createVideo,
  createVideoFormData,
  createFile,
  createFileFormData,
  createTemplate,
  createButtonTemplate,
  createGenericTemplate,
  createListTemplate: deprecated('createListTemplate', createListTemplate),
  createOpenGraphTemplate: deprecated(
    'createOpenGraphTemplate',
    createOpenGraphTemplate
  ),

  createMediaTemplate,
  createReceiptTemplate,
  createAirlineBoardingPassTemplate,
  createAirlineCheckinTemplate,
  createAirlineItineraryTemplate,
  createAirlineUpdateTemplate,
};

export default Messenger;
