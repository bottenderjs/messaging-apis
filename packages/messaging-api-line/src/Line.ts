import * as LineTypes from './LineTypes';

export function createText(
  text: string,
  options: LineTypes.MessageOptions & { emojis?: LineTypes.Emoji[] } = {}
): LineTypes.TextMessage {
  return {
    type: 'text',
    text,
    ...options,
  };
}

export function createImage(
  image: {
    originalContentUrl: string;
    previewImageUrl?: string;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.ImageMessage {
  return {
    type: 'image',
    originalContentUrl: image.originalContentUrl,
    previewImageUrl: image.previewImageUrl || image.originalContentUrl,
    ...options,
  };
}

export function createVideo(
  video: {
    originalContentUrl: string;
    previewImageUrl: string;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.VideoMessage {
  return {
    type: 'video',
    originalContentUrl: video.originalContentUrl,
    previewImageUrl: video.previewImageUrl,
    ...options,
  };
}

export function createAudio(
  audio: {
    originalContentUrl: string;
    duration: number;
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.AudioMessage {
  return {
    type: 'audio',
    originalContentUrl: audio.originalContentUrl,
    duration: audio.duration,
    ...options,
  };
}

export function createLocation(
  { title, address, latitude, longitude }: LineTypes.Location,
  options: LineTypes.MessageOptions = {}
): LineTypes.LocationMessage {
  return {
    type: 'location',
    title,
    address,
    latitude,
    longitude,
    ...options,
  };
}

export function createSticker(
  sticker: Omit<LineTypes.StickerMessage, 'type'>,
  options: LineTypes.MessageOptions = {}
): LineTypes.StickerMessage {
  return {
    type: 'sticker',
    packageId: sticker.packageId,
    stickerId: sticker.stickerId,
    ...options,
  };
}

export function createImagemap(
  altText: string,
  {
    baseUrl,
    baseSize,
    video,
    actions,
  }: Omit<LineTypes.ImagemapMessage, 'type' | 'altText'>,
  options: LineTypes.MessageOptions = {}
): LineTypes.ImagemapMessage {
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

export function createTemplate<T extends LineTypes.Template>(
  altText: string,
  template: T,
  options: LineTypes.MessageOptions = {}
): LineTypes.TemplateMessage<T> {
  return {
    type: 'template',
    altText,
    template,
    ...options,
  };
}

export function createButtonTemplate(
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
    defaultAction?: LineTypes.Action;
    actions: LineTypes.Action[];
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
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

export function createButtonsTemplate(
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
    defaultAction?: LineTypes.Action;
    actions: LineTypes.Action[];
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
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

export function createConfirmTemplate(
  altText: string,
  {
    text,
    actions,
  }: {
    text: string;
    actions: LineTypes.Action[];
  },
  options: LineTypes.MessageOptions = {}
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate> {
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

export function createCarouselTemplate(
  altText: string,
  columns: LineTypes.ColumnObject[],
  {
    imageAspectRatio,
    imageSize,
    quickReply,
  }: {
    imageAspectRatio?: 'rectangle' | 'square';
    imageSize?: 'cover' | 'contain';
    quickReply?: LineTypes.QuickReply;
  } = {}
): LineTypes.TemplateMessage<LineTypes.CarouselTemplate> {
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

export function createImageCarouselTemplate(
  altText: string,
  columns: LineTypes.ImageCarouselColumnObject[],
  options: LineTypes.MessageOptions = {}
): LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate> {
  return createTemplate(
    altText,
    {
      type: 'image_carousel',
      columns,
    },
    options
  );
}

export function createFlex(
  altText: string,
  contents: LineTypes.FlexContainer,
  options: LineTypes.MessageOptions = {}
): LineTypes.FlexMessage {
  return {
    type: 'flex',
    altText,
    contents,
    ...options,
  };
}
