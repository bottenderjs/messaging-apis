/* @flow */

export type SendType = 'reply' | 'push' | 'multicast';

export type ReplyToken = string;
export type UserId = string;

export type SendTarget = ReplyToken | UserId | Array<UserId>;

export type User = {
  displayName: string,
  userId: string,
  pictureUrl: string,
  statusMessage: string,
};

export type TextMessage = {
  type: 'text',
  text: string,
};

export type ImageMessage = {
  type: 'image',
  originalContentUrl: string,
  previewImageUrl: string,
};

export type ImageMapAction = {
  type: string,
  linkUri: string,
  area: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
};

export type ImageMapMessage = {
  type: 'imagemap',
  baseUrl: string,
  altText: string,
  baseSize: {
    height: number,
    width: number,
  },
  actions: Array<ImageMapAction>,
};

export type VideoMessage = {
  type: 'video',
  originalContentUrl: string,
  previewImageUrl: string,
};

export type AudioMessage = {
  type: 'audio',
  originalContentUrl: string,
  duration: number,
};

export type Location = {
  title: string,
  address: string,
  latitude: number,
  longitude: number,
};

export type LocationMessage = {
  type: 'location',
  title: string,
  address: string,
  latitude: number,
  longitude: number,
};

export type StickerMessage = {
  type: 'sticker',
  packageId: string,
  stickerId: string,
};

export type PostbackAction = {
  type: 'postback',
  label?: string,
  data: string,
  text?: string,
};

export type MessageAction = {
  type: 'message',
  label?: string,
  text: string,
};

export type URIAction = {
  type: 'uri',
  label?: string,
  uri: string,
};

export type DatetimePickerAction = {
  type: 'datetimepicker',
  label?: string,
  data: string,
  mode: string,
  initial?: string,
  max?: string,
  min?: string,
};

export type TemplateAction =
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction;

export type ButtonsTemplate = {
  type: 'buttons',
  thumbnailImageUrl?: string,
  title?: string,
  text: string,
  actions: Array<TemplateAction>,
};

export type ConfirmTemplate = {
  type: 'confirm',
  text: string,
  actions: Array<TemplateAction>,
};

export type ColumnObject = {
  thumbnailImageUrl?: string,
  title?: string,
  text: string,
  actions: Array<TemplateAction>,
};

export type CarouselTemplate = {
  type: 'carousel',
  columns: Array<ColumnObject>,
};

export type ImageCarouselColumnObject = {
  imageUrl: string,
  action: TemplateAction,
};

export type ImageCarouselTemplate = {
  type: 'image_carousel',
  columns: Array<ImageCarouselColumnObject>,
};

export type Template =
  | ButtonsTemplate
  | ConfirmTemplate
  | CarouselTemplate
  | ImageCarouselTemplate;

export type TemplateMessage = {
  type: 'template',
  altText: string,
  template: Template,
};

export type Message =
  | TextMessage
  | ImageMessage
  | ImageMapMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | TemplateMessage;

type Area = {
  bounds: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  action: {
    type: string,
    data: string,
  },
};

export type RichMenu = {
  size: {
    width: 2500,
    height: 1686 | 843,
  },
  selected: boolean,
  name: string,
  chatBarText: string,
  areas: Array<Area>,
};

export type MutationSuccessResponse = {};
