/* @flow */

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
  label: string,
  data: string,
  text?: string,
};

export type MessageAction = {
  type: 'message',
  label: string,
  text: string,
};

export type URIAction = {
  type: 'uri',
  label: string,
  uri: string,
};

export type TemplateAction = PostbackAction | MessageAction | URIAction;

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

export type Template = ButtonsTemplate | ConfirmTemplate | CarouselTemplate;

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

export type MutationSuccessResponse = {};
