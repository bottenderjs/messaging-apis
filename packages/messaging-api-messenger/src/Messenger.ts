import FormData from 'form-data';
import omit from 'lodash/omit';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

import * as MessengerTypes from './MessengerTypes';

function createMessage(
  payload: MessengerTypes.Message,
  options: { quickReplies?: MessengerTypes.QuickReply[] } = {}
): MessengerTypes.Message {
  const message = {
    ...payload,
  };

  // snakecase support for backward compatibility
  const quickReplies =
    options.quickReplies ||
    // @ts-expect-error
    options.quick_replies;

  if (quickReplies && Array.isArray(quickReplies) && quickReplies.length >= 1) {
    message.quickReplies = quickReplies;
  }

  return camelcaseKeysDeep(message);
}

function createText(
  text: string,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createMessage({ text }, options);
}

function createMessageFormData(
  payload: MessengerTypes.FileDataMediaAttachmentMessage,
  filedata: MessengerTypes.FileData,
  options: { quickReplies?: MessengerTypes.QuickReply[] } = {}
): FormData {
  const message: MessengerTypes.FileDataMediaAttachmentMessage = {
    ...payload,
  };

  // snakecase support for backward compatibility
  const quickReplies =
    options.quickReplies ||
    // @ts-expect-error
    options.quick_replies;

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
  attachment: MessengerTypes.Attachment,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createMessage(
    {
      attachment,
    },
    options
  );
}

function createAttachmentFormData(
  attachment: MessengerTypes.FileDataMediaAttachment,
  filedata: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
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
  audio: string | MessengerTypes.MediaAttachmentPayload,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  if (typeof audio === 'string') {
    const attachment: MessengerTypes.Attachment = {
      type: 'audio',
      payload: {
        url: audio,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: MessengerTypes.Attachment = {
    type: 'audio',
    payload: audio as MessengerTypes.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createAudioFormData(
  audio: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'audio',
    payload: {},
  };

  return createAttachmentFormData(attachment, audio, options);
}

function createImage(
  image: string | MessengerTypes.MediaAttachmentPayload,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  if (typeof image === 'string') {
    const attachment: MessengerTypes.Attachment = {
      type: 'image',
      payload: {
        url: image,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: MessengerTypes.Attachment = {
    type: 'image',
    payload: image as MessengerTypes.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createImageFormData(
  image: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'image',
    payload: {},
  };

  return createAttachmentFormData(attachment, image, options);
}

function createVideo(
  video: string | MessengerTypes.MediaAttachmentPayload,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  if (typeof video === 'string') {
    const attachment: MessengerTypes.Attachment = {
      type: 'video',
      payload: {
        url: video,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: MessengerTypes.Attachment = {
    type: 'video',
    payload: video as MessengerTypes.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createVideoFormData(
  video: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'video',
    payload: {},
  };

  return createAttachmentFormData(attachment, video, options);
}

function createFile(
  file: string | MessengerTypes.MediaAttachmentPayload,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  if (typeof file === 'string') {
    const attachment: MessengerTypes.Attachment = {
      type: 'file',
      payload: {
        url: file,
      },
    };
    return createAttachment(attachment, options);
  }

  const attachment: MessengerTypes.Attachment = {
    type: 'file',
    payload: file as MessengerTypes.MediaAttachmentPayload,
  };
  return createAttachment(attachment, options);
}

function createFileFormData(
  file: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'file',
    payload: {},
  };

  return createAttachmentFormData(attachment, file, options);
}

function createTemplate(
  payload: MessengerTypes.TemplateAttachmentPayload,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
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
  buttons: MessengerTypes.TemplateButton[],
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
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
  elements: MessengerTypes.TemplateElement[],
  options: {
    imageAspectRatio?: 'horizontal' | 'square';
    quickReplies?: MessengerTypes.QuickReply[];
  } = {}
): MessengerTypes.Message {
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
  elements: MessengerTypes.MediaElement[],
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'media',
      elements,
    },
    options
  );
}

function createReceiptTemplate(
  receipt: MessengerTypes.ReceiptAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'receipt',
      ...receipt,
    },
    options
  );
}

function createAirlineBoardingPassTemplate(
  attrs: MessengerTypes.AirlineBoardingPassAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'airline_boardingpass',
      ...attrs,
    },
    options
  );
}

function createAirlineCheckinTemplate(
  attrs: MessengerTypes.AirlineCheckinAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'airline_checkin',
      ...attrs,
    },
    options
  );
}

function createAirlineItineraryTemplate(
  attrs: MessengerTypes.AirlineItineraryAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'airline_itinerary',
      ...attrs,
    },
    options
  );
}

function createAirlineUpdateTemplate(
  attrs: MessengerTypes.AirlineUpdateAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createTemplate(
    {
      templateType: 'airline_update',
      ...attrs,
    },
    options
  );
}

function createOneTimeNotifReqTemplate(
  attrs: MessengerTypes.OneTimeNotifReqAttributes,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
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
