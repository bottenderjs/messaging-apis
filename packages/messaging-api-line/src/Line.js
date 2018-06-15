/* @flow */

import type {
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  Location,
  LocationMessage,
  StickerMessage,
  Template,
  TemplateAction,
  TemplateMessage,
  ButtonsTemplate,
  ConfirmTemplate,
  ColumnObject,
  CarouselTemplate,
  ImageCarouselColumnObject,
  ImageCarouselTemplate,
  ImageMapAction,
  ImageMapMessage,
  FlexContainer,
  FlexMessage,
} from './LineTypes';

function createText(text: string): TextMessage {
  return {
    type: 'text',
    text,
  };
}

function createImage(
  contentUrlOrImage: string | Object,
  previewUrl: ?string
): ImageMessage {
  if (typeof contentUrlOrImage === 'object') {
    const image = contentUrlOrImage;
    return {
      type: 'image',
      originalContentUrl: image.originalContentUrl,
      previewImageUrl: image.previewImageUrl || image.originalContentUrl,
    };
  }
  return {
    type: 'image',
    originalContentUrl: contentUrlOrImage,
    previewImageUrl: previewUrl || contentUrlOrImage,
  };
}

function createVideo(
  contentUrlOrVideo: string | Object,
  previewImageUrl: ?string
): VideoMessage {
  if (typeof contentUrlOrVideo === 'object') {
    const video = contentUrlOrVideo;
    return {
      type: 'video',
      originalContentUrl: video.originalContentUrl,
      previewImageUrl: video.previewImageUrl,
    };
  }
  return {
    type: 'video',
    originalContentUrl: contentUrlOrVideo,
    previewImageUrl: ((previewImageUrl: any): string),
  };
}

function createAudio(
  contentUrlOrAudio: string | Object,
  duration: ?number
): AudioMessage {
  if (typeof contentUrlOrAudio === 'object') {
    const audio = contentUrlOrAudio;
    return {
      type: 'audio',
      originalContentUrl: audio.originalContentUrl,
      duration: audio.duration,
    };
  }
  return {
    type: 'audio',
    originalContentUrl: contentUrlOrAudio,
    duration: ((duration: any): number),
  };
}

function createLocation({
  title,
  address,
  latitude,
  longitude,
}: Location): LocationMessage {
  return {
    type: 'location',
    title,
    address,
    latitude,
    longitude,
  };
}

function createSticker(
  packageIdOrSticker: string | Object,
  stickerId: ?string
): StickerMessage {
  if (typeof packageIdOrSticker === 'object') {
    const sticker = packageIdOrSticker;
    return {
      type: 'sticker',
      packageId: sticker.packageId,
      stickerId: sticker.stickerId,
    };
  }
  return {
    type: 'sticker',
    packageId: packageIdOrSticker,
    stickerId: ((stickerId: any): string),
  };
}

function createImagemap(
  altText: string,
  {
    baseUrl,
    baseSize,
    baseHeight,
    baseWidth,
    actions,
  }: {
    baseUrl: string,
    baseSize: {
      height: number,
      width: number,
    },
    baseHeight: number,
    baseWidth: number,
    actions: Array<ImageMapAction>,
  }
): ImageMapMessage {
  return {
    type: 'imagemap',
    baseUrl,
    altText,
    baseSize: baseSize || {
      height: baseHeight,
      width: baseWidth,
    },
    actions,
  };
}

function createTemplate(
  altText: string,
  template: Template
): TemplateMessage<any> {
  return {
    type: 'template',
    altText,
    template,
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
    actions,
  }: {
    thumbnailImageUrl?: string,
    imageAspectRatio?: 'rectangle' | 'square',
    imageSize?: 'cover' | 'contain',
    imageBackgroundColor?: string,
    title?: string,
    text: string,
    actions: Array<TemplateAction>,
  }
): TemplateMessage<ButtonsTemplate> {
  return createTemplate(altText, {
    type: 'buttons',
    thumbnailImageUrl,
    imageAspectRatio,
    imageSize,
    imageBackgroundColor,
    title,
    text,
    actions,
  });
}

function createConfirmTemplate(
  altText: string,
  {
    text,
    actions,
  }: {
    text: string,
    actions: Array<TemplateAction>,
  }
): TemplateMessage<ConfirmTemplate> {
  return createTemplate(altText, {
    type: 'confirm',
    text,
    actions,
  });
}

function createCarouselTemplate(
  altText: string,
  columns: Array<ColumnObject>,
  {
    imageAspectRatio,
    imageSize,
  }: {
    imageAspectRatio?: 'rectangle' | 'square',
    imageSize?: 'cover' | 'contain',
  } = {}
): TemplateMessage<CarouselTemplate> {
  return createTemplate(altText, {
    type: 'carousel',
    columns,
    imageAspectRatio,
    imageSize,
  });
}

function createImageCarouselTemplate(
  altText: string,
  columns: Array<ImageCarouselColumnObject>
): TemplateMessage<ImageCarouselTemplate> {
  return createTemplate(altText, {
    type: 'image_carousel',
    columns,
  });
}

function createFlex(altText: string, contents: FlexContainer): FlexMessage {
  return {
    type: 'flex',
    altText,
    contents,
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
