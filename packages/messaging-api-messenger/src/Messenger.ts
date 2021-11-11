import FormData from 'form-data';
import pick from 'lodash/pick';
import { camelcaseKeysDeep, snakecaseKeysDeep } from 'messaging-api-common';

import * as MessengerTypes from './MessengerTypes';

/**
 * Factory function of messages.
 *
 * @param payload - message payload.
 * @returns - a message object.
 * @example
 * ```js
 * Messenger.message({
 *   text: 'Hello',
 *   quickReplies: [
 *     {
 *       contentType: 'text',
 *       title: 'Red',
 *       payload: '<POSTBACK_PAYLOAD>',
 *       imageUrl: 'http://example.com/img/red.png',
 *     },
 *   ],
 * });
 * ```
 */
export function message(
  payload: MessengerTypes.Message
): MessengerTypes.Message {
  return camelcaseKeysDeep(payload);
}

/**
 * Factory function of text messages.
 *
 * @param txt - message text.
 * @param options - message options.
 * @returns - a text message object.
 * @example
 * ```js
 * Messenger.text('Hello')
 * ```
 */
export function text(
  txt: string,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return message({ text: txt, ...options });
}

/**
 * Factory function of attachment messages.
 *
 * @param payload - attachment payload.
 * @param options - message options.
 * @returns - a attachment message object.
 * @example
 * ```js
 * Messenger.attachment({
 *   attachment: {
 *      type: 'image',
 *      payload: {
 *        url: 'https://example.com/pic.png',
 *      },
 *    },
 * })
 * ```
 */
export function attachment(
  payload: MessengerTypes.Attachment,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return message({
    attachment: payload,
    ...options,
  });
}

/**
 * Factory function of audio messages.
 *
 * @param urlOrPayload - audio URL or audio payload.
 * @param options - message options.
 * @returns - a audio message object.
 * @example
 * ```js
 * Messenger.audio('http://www.messenger-rocks.com/audio.mp3')
 * Messenger.audio({
 *   url: 'http://www.messenger-rocks.com/audio.mp3',
 *   isReusable: true,
 * })
 * Messenger.audio({
 *   attachmentId: '5566',
 * })
 * ```
 */
export function audio(
  urlOrPayload: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return attachment(
    {
      type: 'audio',
      payload:
        typeof urlOrPayload === 'string' ? { url: urlOrPayload } : urlOrPayload,
    },
    options
  );
}

/**
 * Factory function of image messages.
 *
 * @param urlOrPayload - image URL or image payload.
 * @param options - message options.
 * @returns - an image message object.
 * @example
 * ```js
 * Messenger.image('http://www.messenger-rocks.com/image.jpg')
 * Messenger.image({
 *   url: 'http://www.messenger-rocks.com/image.jpg',
 *   isReusable: true,
 * })
 * Messenger.image({
 *   attachmentId: '5566',
 * })
 * ```
 */
export function image(
  urlOrPayload: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return attachment(
    {
      type: 'image',
      payload:
        typeof urlOrPayload === 'string' ? { url: urlOrPayload } : urlOrPayload,
    },
    options
  );
}

/**
 * Factory function of video messages.
 *
 * @param urlOrPayload - video URL or video payload.
 * @param options - message options.
 * @returns - a video message object.
 * @example
 * ```js
 * Messenger.video('http://www.messenger-rocks.com/video.mp4')
 * Messenger.video({
 *   url: 'http://www.messenger-rocks.com/video.mp4',
 *   isReusable: true,
 * })
 * Messenger.video({
 *   attachmentId: '5566',
 * })
 * ```
 */
export function video(
  urlOrPayload: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return attachment(
    {
      type: 'video',
      payload:
        typeof urlOrPayload === 'string' ? { url: urlOrPayload } : urlOrPayload,
    },
    options
  );
}

/**
 * Factory function of file messages.
 *
 * @param urlOrPayload - file URL or file payload.
 * @param options - message options.
 * @returns - a file message object.
 * @example
 * ```js
 * Messenger.file('http://www.messenger-rocks.com/file.pdf')
 * Messenger.file({
 *   url: 'http://www.messenger-rocks.com/file.pdf',
 *   isReusable: true,
 * })
 * Messenger.file({
 *   attachmentId: '5566',
 * })
 * ```
 */
export function file(
  urlOrPayload: string | MessengerTypes.MediaAttachmentPayload,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return attachment(
    {
      type: 'file',
      payload:
        typeof urlOrPayload === 'string' ? { url: urlOrPayload } : urlOrPayload,
    },
    options
  );
}

/**
 * Factory function of template messages.
 *
 * @param payload - template payload.
 * @param options - message options.
 * @returns - a template message object.
 * @example
 * ```js
 * Messenger.template({
 *   templateType: 'button',
 *   text: 'title',
 *   buttons: [
 *     {
 *       type: 'postback',
 *       title: 'Start Chatting',
 *       payload: 'USER_DEFINED_PAYLOAD',
 *     },
 *   ],
 * })
 * ```
 */
export function template(
  payload: MessengerTypes.TemplateAttachmentPayload,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return attachment(
    {
      type: 'template',
      payload,
    },
    options
  );
}

/**
 * Factory function of button template messages.
 *
 * @param tmpl - button template payload.
 * @param options - message options.
 * @returns - a button template message object.
 * @example
 * ```js
 * Messenger.buttonTemplate({
 *   text: 'title',
 *   buttons: [
 *     {
 *       type: 'postback',
 *       title: 'Start Chatting',
 *       payload: 'USER_DEFINED_PAYLOAD',
 *     },
 *   ],
 * })
 * ```
 */
export function buttonTemplate(
  tmpl: Omit<MessengerTypes.ButtonTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

/**
 * Factory function of button template messages.
 *
 * @param txt - text of button template.
 * @param buttons - buttons of button template.
 * @param options - message options.
 * @returns - a button template message object.
 * @example
 * ```js
 * Messenger.buttonTemplate('title', [
 *   {
 *     type: 'postback',
 *     title: 'Start Chatting',
 *     payload: 'USER_DEFINED_PAYLOAD',
 *   },
 * ])
 * ```
 */
export function buttonTemplate(
  txt: string,
  buttons: MessengerTypes.TemplateButton[],
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

export function buttonTemplate(
  textOrTemplate:
    | string
    | Omit<MessengerTypes.ButtonTemplatePayload, 'templateType'>,
  buttonsOrOptions?:
    | MessengerTypes.TemplateButton[]
    | MessengerTypes.MessageOptions,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  if (typeof textOrTemplate === 'string') {
    return template(
      {
        templateType: 'button',
        text: textOrTemplate,
        buttons: buttonsOrOptions as MessengerTypes.TemplateButton[],
      },
      options
    );
  }
  return template(
    {
      templateType: 'button',
      ...textOrTemplate,
    },
    buttonsOrOptions as MessengerTypes.MessageOptions
  );
}

/**
 * Factory function of generic template messages.
 *
 * @param tmpl - generic template payload.
 * @param options - message options.
 * @returns - a generic template message object.
 * @example
 * ```js
 * Messenger.genericTemplate({
 *   elements: [{
 *     title: "Welcome to Peter's Hats",
 *     imageUrl: 'https://petersfancybrownhats.com/company_image.png',
 *     subtitle: "We've got the right hat for everyone.",
 *     buttons: [
 *       {
 *         type: 'postback',
 *         title: 'Start Chatting',
 *         payload: 'DEVELOPER_DEFINED_PAYLOAD',
 *       },
 *     ],
 *   }],
 *   imageAspectRatio: 'square',
 * })
 * ```
 */
export function genericTemplate(
  tmpl: Omit<MessengerTypes.GenericTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

/**
 * Factory function of generic template messages.
 *
 * @param elements - An array of element objects that describe instances of the generic template to be sent. Specifying multiple elements will send a horizontally scrollable carousel of templates. A maximum of 10 elements is supported.
 * @param options - message options.
 * @returns - a generic template message object.
 * @example
 * ```js
 * Messenger.genericTemplate([{
 *   title: "Welcome to Peter's Hats",
 *   imageUrl: 'https://petersfancybrownhats.com/company_image.png',
 *   subtitle: "We've got the right hat for everyone.",
 *   buttons: [
 *     {
 *       type: 'postback',
 *       title: 'Start Chatting',
 *       payload: 'DEVELOPER_DEFINED_PAYLOAD',
 *     },
 *   ],
 * }])
 * ```
 */
export function genericTemplate(
  elements: MessengerTypes.TemplateElement[],
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

export function genericTemplate(
  elementsOrTemplate:
    | MessengerTypes.TemplateElement[]
    | Omit<MessengerTypes.GenericTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return template(
    {
      templateType: 'generic',
      ...(Array.isArray(elementsOrTemplate)
        ? { elements: elementsOrTemplate }
        : elementsOrTemplate),
    },
    options
  );
}

/**
 * Factory function of media template messages.
 *
 * @param tmpl - media template payload.
 * @param options - message options.
 * @returns - a media template message object.
 * @example
 * ```js
 * Messenger.mediaTemplate({
 *   elements: [{
 *     mediaType: 'image',
 *     attachmentId: '1854626884821032',
 *     buttons: [
 *       {
 *         type: 'web_url',
 *         url: '<WEB_URL>',
 *         title: 'View Website',
 *       },
 *     ],
 *   }],
 *   sharable: true,
 * })
 * ```
 */
export function mediaTemplate(
  tmpl: Omit<MessengerTypes.MediaTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

/**
 * Factory function of media template messages.
 *
 * @param elements - An array containing 1 element object that describe the media in the message. A maximum of 1 element is supported.
 * @param options - message options.
 * @returns - a media template message object.
 * @example
 * ```js
 * Messenger.mediaTemplate([{
 *   mediaType: 'image',
 *   attachmentId: '1854626884821032',
 *   buttons: [
 *     {
 *       type: 'web_url',
 *       url: '<WEB_URL>',
 *       title: 'View Website',
 *     },
 *   ],
 * }])
 * ```
 */
export function mediaTemplate(
  elements: MessengerTypes.MediaElement[],
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message;

export function mediaTemplate(
  elementsOrTemplate:
    | MessengerTypes.MediaElement[]
    | Omit<MessengerTypes.MediaTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return template(
    {
      templateType: 'media',
      ...(Array.isArray(elementsOrTemplate)
        ? { elements: elementsOrTemplate }
        : elementsOrTemplate),
    },
    options
  );
}

/**
 * Factory function of receipt template messages.
 *
 * @param tmpl - receipt template payload.
 * @param options - message options.
 * @returns - a receipt template message object.
 * @example
 * ```js
 * Messenger.receiptTemplate({
 *   recipientName: 'Stephane Crozatier',
 *   orderNumber: '12345678902',
 *   currency: 'USD',
 *   paymentMethod: 'Visa 2345',
 *   orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
 *   timestamp: '1428444852',
 *   elements: [
 *     {
 *       title: 'Classic White T-Shirt',
 *       subtitle: '100% Soft and Luxurious Cotton',
 *       quantity: 2,
 *       price: 50,
 *       currency: 'USD',
 *       imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
 *     },
 *     {
 *       title: 'Classic Gray T-Shirt',
 *       subtitle: '100% Soft and Luxurious Cotton',
 *       quantity: 1,
 *       price: 25,
 *       currency: 'USD',
 *       imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
 *     },
 *   ],
 *   address: {
 *     street1: '1 Hacker Way',
 *     street2: '',
 *     city: 'Menlo Park',
 *     postalCode: '94025',
 *     state: 'CA',
 *     country: 'US',
 *   },
 *   summary: {
 *     subtotal: 75.0,
 *     shippingCost: 4.95,
 *     totalTax: 6.19,
 *     totalCost: 56.14,
 *   },
 *   adjustments: [
 *     {
 *       name: 'New Customer Discount',
 *       amount: 20,
 *     },
 *     {
 *       name: '$10 Off Coupon',
 *       amount: 10,
 *     },
 *   ],
 * })
 * ```
 */
export function receiptTemplate(
  tmpl: Omit<MessengerTypes.ReceiptTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return template(
    {
      templateType: 'receipt',
      ...tmpl,
    },
    options
  );
}

/**
 * Factory function of template messages.
 *
 * @param tmpl - one time notification template payload.
 * @param options - message options.
 * @returns - an one time notification template message object.
 * @example
 * ```js
 * Messenger.oneTimeNotifReqTemplate({
 *   title: '<TITLE_TEXT>',
 *   payload: 'USER_DEFINED_PAYLOAD',
 * })
 * ```
 */
export function oneTimeNotifReqTemplate(
  tmpl: Omit<MessengerTypes.OneTimeNotifReqTemplatePayload, 'templateType'>,
  options?: MessengerTypes.MessageOptions
): MessengerTypes.Message {
  return template(
    {
      templateType: 'one_time_notif_req',
      ...tmpl,
    },
    options
  );
}

export const appendOptionKeys = [
  'header',
  'knownLength',
  'filename',
  'filepath',
  'contentType',
];

export const messageOptionKeys = ['quickReplies'];

export function messageFormData(
  payload: MessengerTypes.FileDataMediaAttachmentMessage,
  filedata: MessengerTypes.FileData,
  options: FormData.AppendOptions
): FormData {
  const formdata = new FormData();

  formdata.append('message', JSON.stringify(snakecaseKeysDeep(payload)));
  formdata.append('filedata', filedata, pick(options, appendOptionKeys));

  return formdata;
}

export function attachmentFormData(
  attachmentPayload: MessengerTypes.FileDataMediaAttachment,
  filedata: MessengerTypes.FileData,
  options?: MessengerTypes.MessageOptions & FormData.AppendOptions
): FormData {
  return messageFormData(
    {
      attachment: attachmentPayload,
      ...pick(options, messageOptionKeys),
    },
    filedata,
    pick(options, appendOptionKeys)
  );
}

export function audioFormData(
  filedata: MessengerTypes.FileData,
  options?: MessengerTypes.MessageOptions & FormData.AppendOptions
): FormData {
  return attachmentFormData(
    {
      type: 'audio',
      payload: {},
    },
    filedata,
    options
  );
}

export function imageFormData(
  filedata: MessengerTypes.FileData,
  options?: MessengerTypes.MessageOptions & FormData.AppendOptions
): FormData {
  return attachmentFormData(
    {
      type: 'image',
      payload: {},
    },
    filedata,
    options
  );
}

export function videoFormData(
  filedata: MessengerTypes.FileData,
  options?: MessengerTypes.MessageOptions & FormData.AppendOptions
): FormData {
  return attachmentFormData(
    {
      type: 'video',
      payload: {},
    },
    filedata,
    options
  );
}

export function fileFormData(
  filedata: MessengerTypes.FileData,
  options?: MessengerTypes.MessageOptions & FormData.AppendOptions
): FormData {
  return attachmentFormData(
    {
      type: 'file',
      payload: {},
    },
    filedata,
    options
  );
}
