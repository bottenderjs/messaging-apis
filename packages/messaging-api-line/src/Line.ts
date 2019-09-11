import omit from 'lodash.omit';

import {
  AudioMessage,
  ButtonsTemplate,
  CarouselTemplate,
  ColumnObject,
  ConfirmTemplate,
  FlexContainer,
  FlexMessage,
  ImageCarouselColumnObject,
  ImageCarouselTemplate,
  ImageMessage,
  ImagemapMessage,
  Location,
  LocationMessage,
  MessageOptions,
  QuickReply,
  StickerMessage,
  Template,
  TemplateAction,
  TemplateMessage,
  TextMessage,
  VideoMessage,
} from './LineTypes';

function createText(text: string, options: MessageOptions = {}): TextMessage {
  return {
    type: 'text',
    text,
    ...omit(options, 'accessToken'),
  };
}

function createImage(
  image: {
    originalContentUrl: string;
    previewImageUrl?: string;
  },
  options: MessageOptions = {}
): ImageMessage {
  return {
    type: 'image',
    originalContentUrl: image.originalContentUrl,
    previewImageUrl: image.previewImageUrl || image.originalContentUrl,
    ...omit(options, 'accessToken'),
  };
}

function createVideo(
  video: {
    originalContentUrl: string;
    previewImageUrl: string;
  },
  options: MessageOptions = {}
): VideoMessage {
  return {
    type: 'video',
    originalContentUrl: video.originalContentUrl,
    previewImageUrl: video.previewImageUrl,
    ...omit(options, 'accessToken'),
  };
}

function createAudio(
  audio: {
    originalContentUrl: string;
    duration: number;
  },
  options: MessageOptions = {}
): AudioMessage {
  return {
    type: 'audio',
    originalContentUrl: audio.originalContentUrl,
    duration: audio.duration,
    ...omit(options, 'accessToken'),
  };
}

function createLocation(
  { title, address, latitude, longitude }: Location,
  options: MessageOptions = {}
): LocationMessage {
  return {
    type: 'location',
    title,
    address,
    latitude,
    longitude,
    ...omit(options, 'accessToken'),
  };
}

function createSticker(
  sticker: Record<string, any>,
  options: MessageOptions = {}
): StickerMessage {
  return {
    type: 'sticker',
    packageId: sticker.packageId,
    stickerId: sticker.stickerId,
    ...omit(options, 'accessToken'),
  };
}

function createImagemap(
  altText: string,
  {
    baseUrl,
    baseSize,
    video,
    actions,
  }: Omit<ImagemapMessage, 'type' | 'altText'>,
  options: MessageOptions = {}
): ImagemapMessage {
  return {
    type: 'imagemap',
    baseUrl,
    altText,
    baseSize,
    video,
    actions,
    ...omit(options, 'accessToken'),
  };
}

function createTemplate(
  altText: string,
  template: Template,
  options: MessageOptions = {}
): TemplateMessage<any> {
  return {
    type: 'template',
    altText,
    template,
    ...omit(options, 'accessToken'),
  };
}

function createButtonTemplate(
  altText: string,
  {
    thumbnailImageUrl,
    imageAspectRatio,
    imageSize,
    imageBackgroundColor,
    title,
    text,
    defaultAction,
    actions,
  }: {
    thumbnailImageUrl?: string;
    imageAspectRatio?: 'rectangle' | 'square';
    imageSize?: 'cover' | 'contain';
    imageBackgroundColor?: string;
    title?: string;
    text: string;
    defaultAction?: TemplateAction;
    actions: TemplateAction[];
  },
  options: MessageOptions = {}
): TemplateMessage<ButtonsTemplate> {
  return createTemplate(
    altText,
    {
      type: 'buttons',
      thumbnailImageUrl,
      imageAspectRatio,
      imageSize,
      imageBackgroundColor,
      title,
      text,
      defaultAction,
      actions,
    },
    omit(options, 'accessToken')
  );
}

function createConfirmTemplate(
  altText: string,
  {
    text,
    actions,
  }: {
    text: string;
    actions: TemplateAction[];
  },
  options: MessageOptions = {}
): TemplateMessage<ConfirmTemplate> {
  return createTemplate(
    altText,
    {
      type: 'confirm',
      text,
      actions,
    },
    omit(options, 'accessToken')
  );
}

function createCarouselTemplate(
  altText: string,
  columns: ColumnObject[],
  {
    imageAspectRatio,
    imageSize,
    quickReply,
  }: {
    imageAspectRatio?: 'rectangle' | 'square';
    imageSize?: 'cover' | 'contain';
    quickReply?: QuickReply;
  } = {}
): TemplateMessage<CarouselTemplate> {
  return createTemplate(
    altText,
    {
      type: 'carousel',
      columns,
      imageAspectRatio,
      imageSize,
    },
    { quickReply }
  );
}

function createImageCarouselTemplate(
  altText: string,
  columns: ImageCarouselColumnObject[],
  options: MessageOptions = {}
): TemplateMessage<ImageCarouselTemplate> {
  return createTemplate(
    altText,
    {
      type: 'image_carousel',
      columns,
    },
    omit(options, 'accessToken')
  );
}

function createFlex(
  altText: string,
  contents: FlexContainer,
  options: MessageOptions = {}
): FlexMessage {
  return {
    type: 'flex',
    altText,
    contents,
    ...omit(options, 'accessToken'),
  };
}

const Line = {
  createText,
  createImage,
  createVideo,
  createAudio,
  createLocation,
  createSticker,
  createImagemap,
  createTemplate,
  createButtonsTemplate: createButtonTemplate,
  createButtonTemplate,
  createConfirmTemplate,
  createCarouselTemplate,
  createImageCarouselTemplate,
  createFlex,
};

export default Line;
