import FormData from 'form-data';
import omit from 'lodash/omit';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

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
  QuickReply,
  ReceiptAttributes,
  TemplateAttachmentPayload,
  TemplateButton,
  TemplateElement,
} from './MessengerTypes';

function createMessage(
  payload: Message,
  options: { quickReplies?: QuickReply[] } = {}
): Message {
  const message = {
    ...payload,
  };

  // snakecase support for backward compatibility
  const quickReplies = options.quickReplies || (options as any).quick_replies;

  if (quickReplies && Array.isArray(quickReplies) && quickReplies.length >= 1) {
    message.quickReplies = quickReplies;
  }

  return camelcaseKeysDeep(message);
}

function createText(
  text: string,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createMessage({ text }, options);
}

function createMessageFormData(
  payload: FileDataMediaAttachmentMessage,
  filedata: FileData,
  options: { quickReplies?: QuickReply[] } = {}
): FormData {
  const message: FileDataMediaAttachmentMessage = {
    ...payload,
  };

  // snakecase support for backward compatibility
  const quickReplies = options.quickReplies || (options as any).quick_replies;

  if (quickReplies && Array.isArray(quickReplies) && quickReplies.length >= 1) {
    message.quickReplies = quickReplies;
  }

  const formdata = new FormData();

  formdata.append('message', JSON.stringify(snakecaseKeysDeep(message)));
  formdata.append(
    'filedata',
    filedata,
    // FIXME: use pick for formdata options
    omit(options, ['quickReplies'])
  );

  return formdata;
}

function createAttachment(
  attachment: Attachment,
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'audio',
    payload: {},
  };

  return createAttachmentFormData(attachment, audio, options);
}

function createImage(
  image: string | MediaAttachmentPayload,
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'image',
    payload: {},
  };

  return createAttachmentFormData(attachment, image, options);
}

function createVideo(
  video: string | MediaAttachmentPayload,
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'video',
    payload: {},
  };

  return createAttachmentFormData(attachment, video, options);
}

function createFile(
  file: string | MediaAttachmentPayload,
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
): FormData {
  const attachment: FileDataMediaAttachment = {
    type: 'file',
    payload: {},
  };

  return createAttachmentFormData(attachment, file, options);
}

function createTemplate(
  payload: TemplateAttachmentPayload,
  options?: { quickReplies?: QuickReply[] }
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
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'button',
      text,
      buttons,
    },
    options
  );
}

function createGenericTemplate(
  elements: TemplateElement[],
  options: {
    imageAspectRatio?: 'horizontal' | 'square';
    quickReplies?: QuickReply[];
  } = {}
): Message {
  return createTemplate(
    {
      templateType: 'generic',
      elements,
      ...(options.imageAspectRatio
        ? { imageAspectRatio: options.imageAspectRatio }
        : {}),
    },
    options
  );
}

function createMediaTemplate(
  elements: MediaElement[],
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'media',
      elements,
    },
    options
  );
}

function createReceiptTemplate(
  attrs: ReceiptAttributes,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'receipt',
      ...attrs,
    },
    options
  );
}

function createAirlineBoardingPassTemplate(
  attrs: AirlineBoardingPassAttributes,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'airline_boardingpass',
      ...attrs,
    },
    options
  );
}

function createAirlineCheckinTemplate(
  attrs: AirlineCheckinAttributes,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'airline_checkin',
      ...attrs,
    },
    options
  );
}

function createAirlineItineraryTemplate(
  attrs: AirlineItineraryAttributes,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'airline_itinerary',
      ...attrs,
    },
    options
  );
}

function createAirlineUpdateTemplate(
  attrs: AirlineUpdateAttributes,
  options?: { quickReplies?: QuickReply[] }
): Message {
  return createTemplate(
    {
      templateType: 'airline_update',
      ...attrs,
    },
    options
  );
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
  createMediaTemplate,
  createReceiptTemplate,
  createAirlineBoardingPassTemplate,
  createAirlineCheckinTemplate,
  createAirlineItineraryTemplate,
  createAirlineUpdateTemplate,
};

export default Messenger;
