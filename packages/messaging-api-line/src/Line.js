/* @flow */

import type {
  Location,
  Template,
  ImageMapAction,
  TemplateAction,
  ColumnObject,
  ImageCarouselColumnObject,
} from './LineTypes';

function createText(text: string): Object {
  return {
    type: 'text',
    text,
  };
}

function createImage(
  contentUrlOrImage: string | Object,
  previewUrl: ?string
): Object {
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
  previewUrl: ?string
): Object {
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
    previewImageUrl: previewUrl,
  };
}

function createAudio(
  contentUrlOrAudio: string | Object,
  duration: ?number
): Object {
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
    duration,
  };
}

function createLocation({
  title,
  address,
  latitude,
  longitude,
}: Location): Object {
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
): Object {
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
): Object {
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

function createTemplate(altText: string, template: Template): Object {
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
): Object {
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
): Object {
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
): Object {
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
): Object {
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
  createButtonsTemplate: createButtonTemplate,
  createButtonTemplate,
  createConfirmTemplate,
  createCarouselTemplate,
  createImageCarouselTemplate,
};

export default Line;
