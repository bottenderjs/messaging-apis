import FormData from 'form-data';
import omit from 'lodash/omit';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

import * as MessengerTypes from './MessengerTypes';

export function createMessage(
  payload: MessengerTypes.Message,
  options: { quickReplies?: MessengerTypes.QuickReply[] } = {}
): MessengerTypes.Message {
  const message = {
    ...payload,
  };

  const { quickReplies } = options;

  if (quickReplies && Array.isArray(quickReplies) && quickReplies.length >= 1) {
    message.quickReplies = quickReplies;
  }

  return camelcaseKeysDeep(message);
}

export function createText(
  text: string,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): MessengerTypes.Message {
  return createMessage({ text }, options);
}

export function createMessageFormData(
  payload: MessengerTypes.FileDataMediaAttachmentMessage,
  filedata: MessengerTypes.FileData,
  options: { quickReplies?: MessengerTypes.QuickReply[] } = {}
): FormData {
  const message: MessengerTypes.FileDataMediaAttachmentMessage = {
    ...payload,
  };

  const { quickReplies } = options;

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

export function createAttachment(
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

export function createAttachmentFormData(
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

export function createAudio(
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

export function createAudioFormData(
  audio: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'audio',
    payload: {},
  };

  return createAttachmentFormData(attachment, audio, options);
}

export function createImage(
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

export function createImageFormData(
  image: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'image',
    payload: {},
  };

  return createAttachmentFormData(attachment, image, options);
}

export function createVideo(
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

export function createVideoFormData(
  video: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'video',
    payload: {},
  };

  return createAttachmentFormData(attachment, video, options);
}

export function createFile(
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

export function createFileFormData(
  file: MessengerTypes.FileData,
  options?: { quickReplies?: MessengerTypes.QuickReply[] }
): FormData {
  const attachment: MessengerTypes.FileDataMediaAttachment = {
    type: 'file',
    payload: {},
  };

  return createAttachmentFormData(attachment, file, options);
}

export function createTemplate(
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

export function createButtonTemplate(
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

export function createGenericTemplate(
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

export function createMediaTemplate(
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

export function createReceiptTemplate(
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

export function createAirlineBoardingPassTemplate(
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

export function createAirlineCheckinTemplate(
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

export function createAirlineItineraryTemplate(
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

export function createAirlineUpdateTemplate(
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

export function createOneTimeNotifReqTemplate(
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
