/* @flow */

import type {
  Location,
  Template,
  ImageMapAction,
  TemplateAction,
  ColumnObject,
  ImageCarouselColumnObject,
} from './LineTypes';

function createText(text: string) {
  return {
    type: 'text',
    text,
  };
}

function createImage(contentUrl: string, previewUrl: ?string) {
  return {
    type: 'image',
    originalContentUrl: contentUrl,
    previewImageUrl: previewUrl || contentUrl,
  };
}

function createVideo(contentUrl: string, previewUrl: string) {
  return {
    type: 'video',
    originalContentUrl: contentUrl,
    previewImageUrl: previewUrl,
  };
}

function createAudio(contentUrl: string, duration: number) {
  return {
    type: 'audio',
    originalContentUrl: contentUrl,
    duration,
  };
}

function createLocation({ title, address, latitude, longitude }: Location) {
  return {
    type: 'location',
    title,
    address,
    latitude,
    longitude,
  };
}

function createSticker(packageId: string, stickerId: string) {
  return {
    type: 'sticker',
    packageId,
    stickerId,
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
) {
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

function createTemplate(altText: string, template: Template) {
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
) {
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
) {
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
  }
) {
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
) {
  return createTemplate(altText, {
    type: 'image_carousel',
    columns,
  });
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
  createButtonTemplate,
  createConfirmTemplate,
  createCarouselTemplate,
  createImageCarouselTemplate,
};

export default Line;
