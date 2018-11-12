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

export type ImageMapVideo = {
  originalContentUrl: string,
  previewImageUrl: string,
  area: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  externalLink: {
    linkUri: string,
    label: string,
  },
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
  displayText?: string,
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

export type CameraAction = {
  type: 'camera',
  label: string,
};

export type CameraRollAction = {
  type: 'cameraRoll',
  label: string,
};

export type LocationAction = {
  type: 'location',
  label: string,
};

export type TemplateAction =
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction;

export type QuickReplyAction =
  | PostbackAction
  | MessageAction
  | DatetimePickerAction
  | CameraAction
  | CameraRollAction
  | LocationAction;

export type QuickReply = {
  items: Array<{
    type: 'action',
    imageUrl?: string,
    action: QuickReplyAction,
  }>,
};

export type MessageOptions = {
  quickReply?: QuickReply,
};

export type TemplateMessage<Template> = {
  type: 'template',
  altText: string,
  template: Template,
};

export type ButtonsTemplate = {
  type: 'buttons',
  thumbnailImageUrl?: string,
  title?: string,
  text: string,
  defaultAction?: TemplateAction,
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
  defaultAction?: TemplateAction,
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

type Size = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type FlexBlockStyle = {
  backgroundColor?: string,
  separator?: boolean,
  separatorColor?: string,
};

type FlexBubbleStyle = {
  header?: FlexBlockStyle,
  hero?: FlexBlockStyle,
  body?: FlexBlockStyle,
  footer?: FlexBlockStyle,
};

type FlexButton = {
  type: 'button',
  action: TemplateAction,
  flex?: number,
  margin?: Size,
  height?: 'sm' | 'md',
  style?: 'link' | 'primary' | 'secondary',
  color?: string,
  gravity?: string,
};

type FlexFiller = {
  type: 'filler',
};

type FlexIcon = {
  type: 'icon',
  url: string,
  margin?: Size,
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl',
  asprctRatio?: '1:1' | '2:1' | '3:1',
};

type FlexImage = {
  type: 'image',
  url: string,
  flex?: number,
  margin?: Size,
  align?: 'start' | 'end' | 'center',
  gravity?: 'top' | 'bottom' | 'center',
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full',
  aspectRatio?:
    | '1:1'
    | '1.51:1'
    | '1.91:1'
    | '4:3'
    | '16:9'
    | '20:13'
    | '2:1'
    | '3:1'
    | '3:4'
    | '9:16'
    | '1:2'
    | '1:3',
  aspectMode?: 'cover' | 'fit',
  backgroundColor?: string,
  action?: TemplateAction,
};

type FlexSeparator = {
  type: 'separator',
  margin?: Size,
  color?: string,
};

type FlexSpacer = {
  type: 'spacer',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
};

type FlexText = {
  type: 'text',
  text: string,
  flex?: number,
  margin?: Size,
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl',
  align?: 'start' | 'end' | 'center',
  gravity?: 'top' | 'bottom' | 'center',
  wrap?: boolean,
  maxLines?: number,
  weight?: 'regular' | 'bold',
  color?: string,
  action?: TemplateAction,
};

type FlexBoxContent =
  // content
  | FlexButton
  | FlexIcon
  | FlexImage
  | FlexText
  // layout
  | FlexFiller
  | FlexSeparator
  | FlexSpacer;

type FlexBox = {
  type: 'box',
  layout: 'horizontal' | 'vertical' | 'baseline',
  contents: Array<FlexBox | FlexBoxContent>,
  flex?: number,
  spacing?: Size,
  margin?: Size,
  action?: TemplateAction,
};

type FlexBubbleContainer = {
  type: 'bubble',
  direction?: 'ltr' | 'rtl',
  header?: FlexBox,
  hero?: FlexImage,
  body?: FlexBox,
  footer?: FlexBox,
  styles?: FlexBubbleStyle,
};

type FlexCarouselContainer = {
  type: 'carousel',
  contents: Array<FlexBubbleContainer>,
};

export type FlexContainer = FlexBubbleContainer | FlexCarouselContainer;

export type FlexMessage = {
  type: 'flex',
  altText: string,
  contents: FlexContainer,
};

export type Message =
  | TextMessage
  | ImageMessage
  | ImageMapMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | TemplateMessage<Template>
  | FlexMessage;

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

export type LiffView = {
  type: 'compact' | 'tall' | 'full',
  url: string,
};

export type MutationSuccessResponse = {};
