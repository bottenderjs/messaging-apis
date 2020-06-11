import * as Types from './LineTypes';

function createText(
  text: string,
  options: Types.MessageOptions & { emojis?: Types.Emoji[] } = {}
): Types.TextMessage {
  return {
    type: 'text',
    text,
    ...options,
  };
}

function createImage(
  image: {
    originalContentUrl: string;
    previewImageUrl?: string;
  },
  options: Types.MessageOptions = {}
): Types.ImageMessage {
  return {
    type: 'image',
    originalContentUrl: image.originalContentUrl,
    previewImageUrl: image.previewImageUrl || image.originalContentUrl,
    ...options,
  };
}

function createVideo(
  video: {
    originalContentUrl: string;
    previewImageUrl: string;
  },
  options: Types.MessageOptions = {}
): Types.VideoMessage {
  return {
    type: 'video',
    originalContentUrl: video.originalContentUrl,
    previewImageUrl: video.previewImageUrl,
    ...options,
  };
}

function createAudio(
  audio: {
    originalContentUrl: string;
    duration: number;
  },
  options: Types.MessageOptions = {}
): Types.AudioMessage {
  return {
    type: 'audio',
    originalContentUrl: audio.originalContentUrl,
    duration: audio.duration,
    ...options,
  };
}

function createLocation(
  { title, address, latitude, longitude }: Types.Location,
  options: Types.MessageOptions = {}
): Types.LocationMessage {
  return {
    type: 'location',
    title,
    address,
    latitude,
    longitude,
    ...options,
  };
}

function createSticker(
  sticker: Omit<Types.StickerMessage, 'type'>,
  options: Types.MessageOptions = {}
): Types.StickerMessage {
  return {
    type: 'sticker',
    packageId: sticker.packageId,
    stickerId: sticker.stickerId,
    ...options,
  };
}

function createImagemap(
  altText: string,
  {
    baseUrl,
    baseSize,
    video,
    actions,
  }: Omit<Types.ImagemapMessage, 'type' | 'altText'>,
  options: Types.MessageOptions = {}
): Types.ImagemapMessage {
  return {
    type: 'imagemap',
    baseUrl,
    altText,
    baseSize,
    video,
    actions,
    ...options,
  };
}

function createTemplate<T extends Types.Template>(
  altText: string,
  template: T,
  options: Types.MessageOptions = {}
): Types.TemplateMessage<T> {
  return {
    type: 'template',
    altText,
    template,
    ...options,
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
    defaultAction?: Types.Action;
    actions: Types.Action[];
  },
  options: Types.MessageOptions = {}
): Types.TemplateMessage<Types.ButtonsTemplate> {
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
    options
  );
}

function createConfirmTemplate(
  altText: string,
  {
    text,
    actions,
  }: {
    text: string;
    actions: Types.Action[];
  },
  options: Types.MessageOptions = {}
): Types.TemplateMessage<Types.ConfirmTemplate> {
  return createTemplate(
    altText,
    {
      type: 'confirm',
      text,
      actions,
    },
    options
  );
}

function createCarouselTemplate(
  altText: string,
  columns: Types.ColumnObject[],
  {
    imageAspectRatio,
    imageSize,
    quickReply,
  }: {
    imageAspectRatio?: 'rectangle' | 'square';
    imageSize?: 'cover' | 'contain';
    quickReply?: Types.QuickReply;
  } = {}
): Types.TemplateMessage<Types.CarouselTemplate> {
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
  columns: Types.ImageCarouselColumnObject[],
  options: Types.MessageOptions = {}
): Types.TemplateMessage<Types.ImageCarouselTemplate> {
  return createTemplate(
    altText,
    {
      type: 'image_carousel',
      columns,
    },
    options
  );
}

function createFlex(
  altText: string,
  contents: Types.FlexContainer,
  options: Types.MessageOptions = {}
): Types.FlexMessage {
  return {
    type: 'flex',
    altText,
    contents,
    ...options,
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
