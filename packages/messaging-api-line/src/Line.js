/* @flow */
import invariant from 'invariant';
import omit from 'lodash.omit';

import {
  type AudioMessage,
  type ButtonsTemplate,
  type CarouselTemplate,
  type ColumnObject,
  type ConfirmTemplate,
  type FlexContainer,
  type FlexMessage,
  type ImageCarouselColumnObject,
  type ImageCarouselTemplate,
  type ImageMapAction,
  type ImageMapMessage,
  type ImageMapVideo,
  type ImageMessage,
  type Location,
  type LocationMessage,
  type MessageOptions,
  type QuickReply,
  type StickerMessage,
  type Template,
  type TemplateAction,
  type TemplateMessage,
  type TextMessage,
  type VideoMessage,
} from './LineTypes';

function createText(text: string, options: MessageOptions = {}): TextMessage {
  return {
    type: 'text',
    text,
    ...omit(options, 'accessToken'),
  };
}

function createImage(
  contentUrlOrImage: string | Object,
  previewUrlOrOptions?: string | MessageOptions
): ImageMessage {
  if (previewUrlOrOptions) {
    if (
      typeof contentUrlOrImage === 'object' &&
      typeof previewUrlOrOptions === 'object'
    ) {
      const image = contentUrlOrImage;
      const options = previewUrlOrOptions;
      return {
        type: 'image',
        originalContentUrl: image.originalContentUrl,
        previewImageUrl: image.previewImageUrl || image.originalContentUrl,
        ...omit(options, 'accessToken'),
      };
    }

    if (
      typeof contentUrlOrImage === 'string' &&
      typeof previewUrlOrOptions === 'string'
    ) {
      return {
        type: 'image',
        originalContentUrl: contentUrlOrImage,
        previewImageUrl: previewUrlOrOptions,
      };
    }
  } else {
    if (typeof contentUrlOrImage === 'object') {
      const image = contentUrlOrImage;
      return {
        type: 'image',
        originalContentUrl: image.originalContentUrl,
        previewImageUrl: image.previewImageUrl || image.originalContentUrl,
      };
    }

    if (typeof contentUrlOrImage === 'string') {
      return {
        type: 'image',
        originalContentUrl: contentUrlOrImage,
        previewImageUrl: contentUrlOrImage,
      };
    }
  }

  invariant(false, 'Line#createImage: Wrong type of arguments.');
}

function createVideo(
  contentUrlOrVideo: string | Object,
  previewImageUrlOrOptions?: string | MessageOptions
): VideoMessage {
  if (
    typeof contentUrlOrVideo === 'string' &&
    typeof previewImageUrlOrOptions === 'string'
  ) {
    return {
      type: 'video',
      originalContentUrl: contentUrlOrVideo,
      previewImageUrl: previewImageUrlOrOptions,
    };
  }

  if (
    typeof contentUrlOrVideo === 'object' &&
    (!previewImageUrlOrOptions || typeof previewImageUrlOrOptions === 'object')
  ) {
    const video = contentUrlOrVideo;
    const options = previewImageUrlOrOptions || {};
    return {
      type: 'video',
      originalContentUrl: video.originalContentUrl,
      previewImageUrl: video.previewImageUrl,
      ...omit(options, 'accessToken'),
    };
  }

  invariant(false, 'Line#createVideo: Wrong type of arguments.');
}

function createAudio(
  contentUrlOrAudio: string | Object,
  durationOrOptions: number | MessageOptions
): AudioMessage {
  if (
    typeof contentUrlOrAudio === 'string' &&
    typeof durationOrOptions === 'number'
  ) {
    return {
      type: 'audio',
      originalContentUrl: contentUrlOrAudio,
      duration: durationOrOptions,
    };
  }

  if (
    typeof contentUrlOrAudio === 'object' &&
    (!durationOrOptions || typeof durationOrOptions === 'object')
  ) {
    const audio = contentUrlOrAudio;
    const options = durationOrOptions || {};
    return {
      type: 'audio',
      originalContentUrl: audio.originalContentUrl,
      duration: audio.duration,
      ...omit(options, 'accessToken'),
    };
  }

  invariant(false, 'Line#createAudio: Wrong type of arguments.');
}

function createLocation(
  { title, address, latitude, longitude }: Location,
  options?: MessageOptions = {}
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
  packageIdOrSticker: string | Object,
  stickerIdOrOptions: string | MessageOptions
): StickerMessage {
  if (
    typeof packageIdOrSticker === 'string' &&
    typeof stickerIdOrOptions === 'string'
  ) {
    return {
      type: 'sticker',
      packageId: packageIdOrSticker,
      stickerId: stickerIdOrOptions,
    };
  }

  if (
    typeof packageIdOrSticker === 'object' &&
    (!stickerIdOrOptions || typeof stickerIdOrOptions === 'object')
  ) {
    const sticker = packageIdOrSticker;
    const options = stickerIdOrOptions || {};
    return {
      type: 'sticker',
      packageId: sticker.packageId,
      stickerId: sticker.stickerId,
      ...omit(options, 'accessToken'),
    };
  }

  invariant(false, 'Line#createSticker: Wrong type of arguments.');
}

function createImagemap(
  altText: string,
  {
    baseUrl,
    baseSize,
    baseHeight,
    baseWidth,
    video,
    actions,
  }: {
    baseUrl: string,
    baseSize: {
      height: number,
      width: number,
    },
    baseHeight: number,
    baseWidth: number,
    video?: ImageMapVideo,
    actions: Array<ImageMapAction>,
  },
  options?: MessageOptions = {}
): ImageMapMessage {
  return {
    type: 'imagemap',
    baseUrl,
    altText,
    baseSize: baseSize || {
      height: baseHeight,
      width: baseWidth,
    },
    video,
    actions,
    ...omit(options, 'accessToken'),
  };
}

function createTemplate(
  altText: string,
  template: Template,
  options?: MessageOptions = {}
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
    thumbnailImageUrl?: string,
    imageAspectRatio?: 'rectangle' | 'square',
    imageSize?: 'cover' | 'contain',
    imageBackgroundColor?: string,
    title?: string,
    text: string,
    defaultAction?: TemplateAction,
    actions: Array<TemplateAction>,
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
    text: string,
    actions: Array<TemplateAction>,
  },
  options?: MessageOptions = {}
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
  columns: Array<ColumnObject>,
  {
    imageAspectRatio,
    imageSize,
    quickReply,
  }: {
    imageAspectRatio?: 'rectangle' | 'square',
    imageSize?: 'cover' | 'contain',
    quickReply?: QuickReply,
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
  columns: Array<ImageCarouselColumnObject>,
  options?: MessageOptions = {}
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
  options?: MessageOptions = {}
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
