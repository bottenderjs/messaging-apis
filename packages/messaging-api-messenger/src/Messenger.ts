import FormData from 'form-data';
import omit from 'lodash/omit';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

import * as Types from './MessengerTypes';

function createMessage(
  payload: Types.Message,
  options: { quickReplies?: Types.QuickReply[] } = {}
): Types.Message {
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
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createMessage({ text }, options);
}

function createMessageFormData(
  payload: Types.FileDataMediaAttachmentMessage,
  filedata: Types.FileData,
  options: { quickReplies?: Types.QuickReply[] } = {}
): FormData {
  const message: Types.FileDataMediaAttachmentMessage = {
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
  attachment: Types.Attachment,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createMessage(
    {
      attachment,
    },
    options
  );
}

function createAttachmentFormData(
  attachment: Types.FileDataMediaAttachment,
  filedata: Types.FileData,
  options?: { quickReplies?: Types.QuickReply[] }
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
  audio: string | Types.MediaAttachmentPayload,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  if (typeof audio === 'string') {
    const attachment: Types.Attachment = {
      type: 'audio',
      payload: {
        url: audio,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Types.Attachment = {
    type: 'audio',
    payload: audio as Types.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createAudioFormData(
  audio: Types.FileData,
  options?: { quickReplies?: Types.QuickReply[] }
): FormData {
  const attachment: Types.FileDataMediaAttachment = {
    type: 'audio',
    payload: {},
  };

  return createAttachmentFormData(attachment, audio, options);
}

function createImage(
  image: string | Types.MediaAttachmentPayload,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  if (typeof image === 'string') {
    const attachment: Types.Attachment = {
      type: 'image',
      payload: {
        url: image,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Types.Attachment = {
    type: 'image',
    payload: image as Types.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createImageFormData(
  image: Types.FileData,
  options?: { quickReplies?: Types.QuickReply[] }
): FormData {
  const attachment: Types.FileDataMediaAttachment = {
    type: 'image',
    payload: {},
  };

  return createAttachmentFormData(attachment, image, options);
}

function createVideo(
  video: string | Types.MediaAttachmentPayload,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  if (typeof video === 'string') {
    const attachment: Types.Attachment = {
      type: 'video',
      payload: {
        url: video,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Types.Attachment = {
    type: 'video',
    payload: video as Types.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createVideoFormData(
  video: Types.FileData,
  options?: { quickReplies?: Types.QuickReply[] }
): FormData {
  const attachment: Types.FileDataMediaAttachment = {
    type: 'video',
    payload: {},
  };

  return createAttachmentFormData(attachment, video, options);
}

function createFile(
  file: string | Types.MediaAttachmentPayload,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  if (typeof file === 'string') {
    const attachment: Types.Attachment = {
      type: 'file',
      payload: {
        url: file,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: Types.Attachment = {
    type: 'file',
    payload: file as Types.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createFileFormData(
  file: Types.FileData,
  options?: { quickReplies?: Types.QuickReply[] }
): FormData {
  const attachment: Types.FileDataMediaAttachment = {
    type: 'file',
    payload: {},
  };

  return createAttachmentFormData(attachment, file, options);
}

function createTemplate(
  payload: Types.TemplateAttachmentPayload,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
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
  buttons: Types.TemplateButton[],
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
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
  elements: Types.TemplateElement[],
  options: {
    imageAspectRatio?: 'horizontal' | 'square';
    quickReplies?: Types.QuickReply[];
  } = {}
): Types.Message {
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
  elements: Types.MediaElement[],
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'media',
      elements,
    },
    options
  );
}

function createReceiptTemplate(
  attrs: Types.ReceiptAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'receipt',
      ...attrs,
    },
    options
  );
}

function createAirlineBoardingPassTemplate(
  attrs: Types.AirlineBoardingPassAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'airline_boardingpass',
      ...attrs,
    },
    options
  );
}

function createAirlineCheckinTemplate(
  attrs: Types.AirlineCheckinAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'airline_checkin',
      ...attrs,
    },
    options
  );
}

function createAirlineItineraryTemplate(
  attrs: Types.AirlineItineraryAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'airline_itinerary',
      ...attrs,
    },
    options
  );
}

function createAirlineUpdateTemplate(
  attrs: Types.AirlineUpdateAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'airline_update',
      ...attrs,
    },
    options
  );
}

function createOneTimeNotifReqTemplate(
  attrs: Types.OneTimeNotifReqAttributes,
  options?: { quickReplies?: Types.QuickReply[] }
): Types.Message {
  return createTemplate(
    {
      templateType: 'one_time_notif_req',
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
  createOneTimeNotifReqTemplate,
};

export default Messenger;
