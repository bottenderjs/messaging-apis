/* @flow */

import type {
  Location,
  Template,
  ImageMapAction,
  TemplateAction,
  ColumnObject,
  ImageCarouselColumnObject,
} from './LINETypes';

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
    baseHeight,
    baseWidth,
    actions,
  }: {
    baseUrl: string,
    baseHeight: number,
    baseWidth: number,
    actions: Array<ImageMapAction>,
  }
) {
  return {
    type: 'imagemap',
    baseUrl,
    altText,
    baseSize: {
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
    title,
    text,
    actions,
  }: {
    thumbnailImageUrl?: string,
    title?: string,
    text: string,
    actions: Array<TemplateAction>,
  }
) {
  return createTemplate(altText, {
    type: 'buttons',
    thumbnailImageUrl,
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

function createCarouselTemplate(altText: string, columns: Array<ColumnObject>) {
  return createTemplate(altText, {
    type: 'carousel',
    columns,
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

const LINE = {
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

export default LINE;
