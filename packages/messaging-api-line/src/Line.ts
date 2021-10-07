import omit from 'lodash/omit';
import warning from 'warning';

import * as LineTypes from './LineTypes';

/**
 * Factory function of text messages.
 *
 * @param text - Message text.
 * @param options - Text message options.
 * @returns - Text message object.
 *
 * @example
 *
 * ```js
 * await client.reply(Line.createText('hi'));
 * ```
 */
export function createText(
  text: string,
  options?: Omit<LineTypes.TextMessage, 'type' | 'text'>
): LineTypes.TextMessage;
/**
 * Factory function of text messages.
 *
 * @param options - Text message options.
 * @returns - Text message object.
 * @example
 * ```js
 * await client.reply(Line.createText({
 *   text: '$ LINE emoji',
 *   emojis: [
 *     {
 *       index: 0,
 *       productId: '5ac1bfd5040ab15980c9b435',
 *       emojiId: '001',
 *     },
 *   ],
 * }));
 * ```
 */
export function createText(
  options: Omit<LineTypes.TextMessage, 'type'>
): LineTypes.TextMessage;
export function createText(
  textOrOptions: string | Omit<LineTypes.TextMessage, 'type'>,
  options?: Omit<LineTypes.TextMessage, 'type' | 'text'>
): LineTypes.TextMessage {
  if (typeof textOrOptions === 'string') {
    return {
      type: 'text',
      text: textOrOptions,
      ...options,
    };
  }

  return {
    type: 'text',
    ...textOrOptions,
  };
}

/**
 * Factory function of sticker messages.
 *
 * @param options - Sticker message options.
 * @returns Sticker message object.
 * @example
 * ```js
 * await client.reply(Line.createSticker({
 *   packageId: '446',
 *   stickerId: '1988',
 * }));
 * ```
 */
export function createSticker(
  options: Omit<LineTypes.StickerMessage, 'type'>
): LineTypes.StickerMessage;
/**
 * Factory function of sticker messages.
 *
 * @param sticker - Package ID and sticker ID of the sticker.
 * @param options - Sticker message options.
 * @returns Sticker message object.
 * @deprecated - This overload is no longer recommended.
 */
export function createSticker(
  sticker: Pick<LineTypes.StickerMessage, 'packageId' | 'stickerId'>,
  options?: Omit<LineTypes.StickerMessage, 'type' | 'packageId' | 'stickerId'>
): LineTypes.StickerMessage;
export function createSticker(
  stickerOrOptions:
    | Omit<LineTypes.StickerMessage, 'type'>
    | Pick<LineTypes.StickerMessage, 'packageId' | 'stickerId'>,
  options?: Omit<LineTypes.StickerMessage, 'type' | 'packageId' | 'stickerId'>
): LineTypes.StickerMessage {
  warning(
    !options,
    '`Line.createSticker(sticker, options)` is no longer recommended. Use `Line.createSticker(options)` instead.'
  );

  return {
    type: 'sticker',
    ...stickerOrOptions,
    ...options,
  };
}

/**
 * Factory function of image messages.
 *
 * @param originalContentUrl - Image URL.
 * @param options - Image message options.
 * @returns Image message object.
 * @example
 * ```js
 * await client.reply(Line.createImage('https://example.com/original.jpg'));
 * ```
 */
export function createImage(
  originalContentUrl: string,
  options?: Omit<LineTypes.ImageMessage, 'type' | 'originalContentUrl'>
): LineTypes.ImageMessage;
/**
 * Factory function of image messages.
 *
 * @param options - Image message options.
 * @returns Image message object.
 * @example
 * ```js
 * await client.reply(Line.createImage({
 *   originalContentUrl: 'https://example.com/original.jpg',
 *   previewImageUrl: 'https://example.com/preview.jpg',
 * }));
 * ```
 */
export function createImage(
  options: Omit<LineTypes.ImageMessage, 'type'>
): LineTypes.ImageMessage;
export function createImage(
  urlOrOptions: string | Omit<LineTypes.ImageMessage, 'type'>,
  options?: Omit<LineTypes.ImageMessage, 'type' | 'originalContentUrl'>
): LineTypes.ImageMessage {
  if (typeof urlOrOptions === 'string') {
    return {
      type: 'image',
      originalContentUrl: urlOrOptions,
      previewImageUrl: options?.previewImageUrl ?? urlOrOptions,
      ...options,
    };
  }

  return {
    type: 'image',
    ...urlOrOptions,
    previewImageUrl:
      urlOrOptions.previewImageUrl ?? urlOrOptions.originalContentUrl,
  };
}

/**
 * Factory function of video messages.
 *
 * @param options - Video message options.
 * @returns Video message object.
 * @example
 * ```js
 * await client.reply(Line.createVideo({
 *   originalContentUrl: 'https://example.com/original.mp4',
 *   previewImageUrl: 'https://example.com/preview.jpg',
 * }));
 * ```
 */
export function createVideo(
  options: Omit<LineTypes.VideoMessage, 'type'>
): LineTypes.VideoMessage;
/**
 * Factory function of video messages.
 *
 * @param video - Original content URL and preview image URL of the video.
 * @param options - Video message options.
 * @returns Video message object.
 * @deprecated This overload is no longer recommended.
 */
export function createVideo(
  video: Pick<
    LineTypes.VideoMessage,
    'originalContentUrl' | 'previewImageUrl' | 'trackingId'
  >,
  options: Omit<
    LineTypes.VideoMessage,
    'type' | 'originalContentUrl' | 'previewImageUrl' | 'trackingId'
  >
): LineTypes.VideoMessage;
export function createVideo(
  videoOrOptions:
    | Omit<LineTypes.VideoMessage, 'type'>
    | Pick<
        LineTypes.VideoMessage,
        'originalContentUrl' | 'previewImageUrl' | 'trackingId'
      >,
  options?: Omit<
    LineTypes.VideoMessage,
    'type' | 'originalContentUrl' | 'previewImageUrl' | 'trackingId'
  >
): LineTypes.VideoMessage {
  warning(
    !options,
    '`Line.createVideo(video, options)` is no longer recommended. Use `Line.createVideo(options)` instead.'
  );

  return {
    type: 'video',
    ...videoOrOptions,
    ...options,
  };
}

/**
 * Factory function of audio messages.
 *
 * @param options - Audio message options.
 * @returns Audio message object.
 * @example
 * ```js
 * await client.reply(Line.createAudio({
 *   originalContentUrl: 'https://example.com/original.m4a',
 *   duration: 60000,
 * }));
 * ```
 */
export function createAudio(
  options: Omit<LineTypes.AudioMessage, 'type'>
): LineTypes.AudioMessage;
/**
 * Factory function of audio messages.
 *
 * @param audio - Original content URL and duration of the audio.
 * @param options - Audio message options.
 * @returns Audio message object.
 * @deprecated This overload is no longer recommended.
 */
export function createAudio(
  audio: Pick<LineTypes.AudioMessage, 'originalContentUrl' | 'duration'>,
  options?: Omit<
    LineTypes.AudioMessage,
    'type' | 'originalContentUrl' | 'duration'
  >
): LineTypes.AudioMessage;
export function createAudio(
  audioOrOptions:
    | Omit<LineTypes.AudioMessage, 'type'>
    | Pick<LineTypes.AudioMessage, 'originalContentUrl' | 'duration'>,
  options?: Omit<
    LineTypes.AudioMessage,
    'type' | 'originalContentUrl' | 'duration'
  >
): LineTypes.AudioMessage {
  warning(
    !options,
    '`Line.createAudio(audio, options)` is no longer recommended. Use `Line.createAudio(options)` instead.'
  );

  return {
    type: 'audio',
    ...audioOrOptions,
    ...options,
  };
}

/**
 * Factory function of location messages.
 *
 * @param options - Location message options.
 * @returns Location message object.
 * @example
 * ```js
 * await client.reply(Line.createLocation({
 *   title: 'my location',
 *   address: '1-6-1 Yotsuya, Shinjuku-ku, Tokyo, 160-0004, Japan',
 *   latitude: 35.687574,
 *   longitude: 139.72922,
 * }));
 * ```
 */
export function createLocation(
  options: Omit<LineTypes.LocationMessage, 'type'>
): LineTypes.LocationMessage;
/**
 * Factory function of location messages.
 *
 * @param location - Title, address, latitude and longitude of the location.
 * @param options - Location message options.
 * @returns Location message object.
 * @deprecated This overload is no longer recommended.
 */
export function createLocation(
  location: Pick<
    LineTypes.LocationMessage,
    'title' | 'address' | 'latitude' | 'longitude'
  >,
  options?: Omit<
    LineTypes.LocationMessage,
    'type' | 'title' | 'address' | 'latitude' | 'longitude'
  >
): LineTypes.LocationMessage;
export function createLocation(
  locationOrOptions:
    | Omit<LineTypes.LocationMessage, 'type'>
    | Pick<
        LineTypes.LocationMessage,
        'title' | 'address' | 'latitude' | 'longitude'
      >,
  options?: Omit<
    LineTypes.LocationMessage,
    'type' | 'title' | 'address' | 'latitude' | 'longitude'
  >
): LineTypes.LocationMessage {
  warning(
    !options,
    '`Line.createLocation(location, options)` is no longer recommended. Use `Line.createLocation(options)` instead.'
  );

  return {
    type: 'location',
    ...locationOrOptions,
    ...options,
  };
}

/**
 * Factory function of imagemap messages.
 *
 * @param options - Imagemap message options.
 * @returns Imagemap message object.
 * @example
 * ```js
 * await client.reply(Line.createLocation({
 *   baseUrl: 'https://example.com/bot/images/rm001',
 *   altText: 'This is an imagemap',
 *   baseSize: {
 *     width: 1040,
 *     height: 1040,
 *   },
 *   actions: [
 *     {
 *       type: 'uri',
 *       linkUri: 'https://example.com/',
 *       area: { x: 0, y: 586, width: 520, height: 454 },
 *     },
 *   ],
 * }));
 * ```
 */
export function createImagemap(
  options: Omit<LineTypes.ImagemapMessage, 'type'>
): LineTypes.ImagemapMessage;
/**
 * Factory function of imagemap messages.
 *
 * @param altText - Alternative text.
 * @param imagemap - Base URL, base size, video and actions of the imagemap.
 * @param options - Imagemap message options.
 * @returns Imagemap message object.
 * @deprecated This overload is no longer recommended.
 */
export function createImagemap(
  altText: string,
  imagemap: Pick<
    LineTypes.ImagemapMessage,
    'baseUrl' | 'baseSize' | 'video' | 'actions'
  >,
  options?: Omit<
    LineTypes.ImagemapMessage,
    'type' | 'altText' | 'baseUrl' | 'baseSize' | 'video' | 'actions'
  >
): LineTypes.ImagemapMessage;
export function createImagemap(
  altTextOrOptions: string | Omit<LineTypes.ImagemapMessage, 'type'>,
  imagemap?: Pick<
    LineTypes.ImagemapMessage,
    'baseUrl' | 'baseSize' | 'video' | 'actions'
  >,
  options?: Omit<
    LineTypes.ImagemapMessage,
    'type' | 'altText' | 'baseUrl' | 'baseSize' | 'video' | 'actions'
  >
): LineTypes.ImagemapMessage {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createImagemap(altText, imagemap, options)` is no longer recommended. Use `Line.createImagemap(options)` instead.'
    );

    return {
      type: 'imagemap',
      altText: altTextOrOptions,
      ...(imagemap as Pick<
        LineTypes.ImagemapMessage,
        'baseUrl' | 'baseSize' | 'video' | 'actions'
      >),
      ...options,
    };
  }

  return {
    type: 'imagemap',
    ...altTextOrOptions,
  };
}

/**
 * Factory function of template messages.
 *
 * @param options - Template message options.
 * @returns Template message object.
 * @example
 * ```js
 * await client.reply(Line.createTemplate({
 *   altText: 'this is a confirm template',
 *   template: {
 *     type: 'confirm',
 *     text: 'Are you sure?',
 *     actions: [
 *       { type: 'message', label: 'Yes', text: 'yes' },
 *       { type: 'message', label: 'No', text: 'no' },
 *     ],
 *   },
 * }));
 * ```
 */
export function createTemplate<T extends LineTypes.Template>(
  options: Omit<LineTypes.TemplateMessage<T>, 'type'>
): LineTypes.TemplateMessage<T>;
/**
 * Factory function of template messages.
 *
 * @param altText - Alternative text.
 * @param template - Template object.
 * @param options - Template message options.
 * @returns Template message object.
 * @deprecated This overload is no longer recommended.
 */
export function createTemplate<T extends LineTypes.Template>(
  altText: string,
  template: T,
  options?: Omit<LineTypes.TemplateMessage<T>, 'type' | 'altText' | 'template'>
): LineTypes.TemplateMessage<T>;
export function createTemplate<T extends LineTypes.Template>(
  altTextOroptions: string | Omit<LineTypes.TemplateMessage<T>, 'type'>,
  template?: T,
  options?: Omit<LineTypes.TemplateMessage<T>, 'type' | 'altText' | 'template'>
): LineTypes.TemplateMessage<T> {
  if (typeof altTextOroptions === 'string') {
    warning(
      false,
      '`Line.createTemplate(altText, template, options)` is no longer recommended. Use `Line.createTemplate(options)` instead.'
    );

    return {
      type: 'template',
      altText: altTextOroptions,
      template: template as T,
      ...options,
    };
  }

  return {
    type: 'template',
    ...altTextOroptions,
  };
}

/**
 * Factory function of buttons template messages.
 *
 * @param options - Buttons template message options.
 * @returns Buttons template message object.
 * @example
 * ```js
 * await client.reply(Line.createButtonsTemplate({
 *   altText: 'this is a buttons template',
 *   text: 'Please select',
 *   actions: [
 *     {
 *       type: 'postback',
 *       label: 'Buy',
 *       data: 'action=buy&itemid=123',
 *     },
 *   ],
 * }));
 * ```
 */
export function createButtonsTemplate(
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'template'
  > &
    Omit<LineTypes.ButtonsTemplate, 'type'>
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
/**
 * Factory function of buttons template messages.
 *
 * @param altText - Alternative text.
 * @param template - Buttons template options.
 * @param options - Buttons template message options.
 * @returns Buttons template message object.
 * @deprecated This overload is no longer recommended.
 */
export function createButtonsTemplate(
  altText: string,
  template: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
export function createButtonsTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ButtonsTemplate, 'type'>),
  template?: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createButtonsTemplate(altText, template, options)` is no longer recommended. Use `Line.createButtonsTemplate(options)` instead.'
    );

    const templateOptions = template as Omit<LineTypes.ButtonsTemplate, 'type'>;
    return createTemplate({
      altText: altTextOrOptions,
      template: {
        type: 'buttons',
        ...templateOptions,
      },
      ...options,
    });
  }

  const restOptions = omit(altTextOrOptions, [
    'thumbnailImageUrl',
    'imageAspectRatio',
    'imageSize',
    'imageBackgroundColor',
    'title',
    'text',
    'defaultAction',
    'actions',
  ]);

  return createTemplate({
    template: {
      type: 'buttons',
      thumbnailImageUrl: altTextOrOptions.thumbnailImageUrl,
      imageAspectRatio: altTextOrOptions.imageAspectRatio,
      imageSize: altTextOrOptions.imageSize,
      imageBackgroundColor: altTextOrOptions.imageBackgroundColor,
      title: altTextOrOptions.title,
      text: altTextOrOptions.text,
      defaultAction: altTextOrOptions.defaultAction,
      actions: altTextOrOptions.actions,
    },
    ...restOptions,
  });
}

/**
 * Factory function of buttons template messages. Alias of [[Foo]].
 *
 * @param options - Buttons template message options.
 * @returns Buttons template message object.
 * @deprecated Use `createButtonsTemplate` instead.
 */
export function createButtonTemplate(
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'template'
  > &
    Omit<LineTypes.ButtonsTemplate, 'type'>
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
/**
 * Factory function of buttons template messages. Alias of [[Foo]].
 *
 * @param altText - Alternative text.
 * @param template - Buttons template options.
 * @param options - Buttons template message options.
 * @returns Buttons template message object.
 * @deprecated Use `createButtonsTemplate` instead.
 */
export function createButtonTemplate(
  altText: string,
  template: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
export function createButtonTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ButtonsTemplate, 'type'>),
  template?: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
  warning(
    false,
    '`Line.createButtonTemplate(...)` is no longer recommended. Use `Line.createButtonsTemplate(...)` instead.'
  );

  if (typeof altTextOrOptions === 'string') {
    return createButtonsTemplate(
      altTextOrOptions,
      template as Omit<LineTypes.ButtonsTemplate, 'type'>,
      options
    );
  }

  return createButtonsTemplate(altTextOrOptions);
}

/**
 * Factory function of confirm template messages.
 *
 * @param options - Confirm template message options.
 * @returns Confirm template message object.
 * @example
 * ```js
 * await client.reply(Line.createConfirmTemplate({
 *   altText: 'this is a confirm template',
 *   text: 'Are you sure?',
 *   actions: [
 *     { type: 'message', label: 'Yes', text: 'yes' },
 *     { type: 'message', label: 'No', text: 'no' },
 *   ],
 * }));
 * ```
 */
export function createConfirmTemplate(
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
    'type' | 'template'
  > &
    Omit<LineTypes.ConfirmTemplate, 'type'>
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>;
/**
 * Factory function of confirm template messages.
 *
 * @param altText - Alternative text.
 * @param template - Confirm template options.
 * @param options - Confirm template message options.
 * @returns Confirm template message object.
 * @deprecated This overload is no longer recommended.
 */
export function createConfirmTemplate(
  altText: string,
  template: Omit<LineTypes.ConfirmTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>;
export function createConfirmTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ConfirmTemplate, 'type'>),
  template?: Omit<LineTypes.ConfirmTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createConfirmTemplate(altText, template, options)` is no longer recommended. Use `Line.createConfirmTemplate(options)` instead.'
    );

    const templateOptions = template as Omit<LineTypes.ConfirmTemplate, 'type'>;
    return createTemplate({
      altText: altTextOrOptions,
      template: {
        type: 'confirm',
        text: templateOptions.text,
        actions: templateOptions.actions,
      },
      ...options,
    });
  }

  const restOptions = omit(altTextOrOptions, ['text', 'actions']);

  return createTemplate({
    template: {
      type: 'confirm',
      text: altTextOrOptions.text,
      actions: altTextOrOptions.actions,
    },
    ...restOptions,
  });
}

/**
 * Factory function of carousel template messages.
 *
 * @param options - Carousel template message options.
 * @returns Carousel template message object.
 * @example
 * ```js
 * await client.reply(Line.createCarouselTemplate({
 *   altText: 'this is a carousel template',
 *   columns: [
 *     {
 *       thumbnailImageUrl': 'https://example.com/bot/images/item1.jpg',
 *       imageBackgroundColor': '#FFFFFF',
 *       title: 'this is menu',
 *       text: 'description',
 *       actions: [
 *         {
 *           type: 'postback',
 *           label: 'Buy',
 *           data: 'action=buy&itemid=111',
 *         },
 *       ],
 *     },
 *   ],
 *   imageAspectRatio: 'rectangle',
 *   imageSize: 'cover'
 * }));
 * ```
 */
export function createCarouselTemplate(
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.CarouselTemplate>,
    'type' | 'template'
  > &
    Omit<LineTypes.CarouselTemplate, 'type'>
): LineTypes.TemplateMessage<LineTypes.CarouselTemplate>;
/**
 * Factory function of carousel template messages.
 *
 * @param altText - Alternative text.
 * @param columns - Columns of the carousel template.
 * @param options - Carousel template message options.
 * @returns Carousel template message object.
 * @deprecated This overload is no longer recommended.
 */
export function createCarouselTemplate(
  altText: string,
  columns: LineTypes.ColumnObject[],
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.CarouselTemplate>,
    'type' | 'altText' | 'template'
  > &
    Omit<LineTypes.CarouselTemplate, 'type' | 'columns'>
): LineTypes.TemplateMessage<LineTypes.CarouselTemplate>;
export function createCarouselTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.CarouselTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.CarouselTemplate, 'type'>),
  columns?: LineTypes.ColumnObject[],
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.CarouselTemplate>,
    'type' | 'altText' | 'template'
  > &
    Omit<LineTypes.CarouselTemplate, 'type' | 'columns'> = {}
): LineTypes.TemplateMessage<LineTypes.CarouselTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createCarouselTemplate(altText, columns, options)` is no longer recommended. Use `Line.createCarouselTemplate(options)` instead.'
    );

    const restOptions = omit(options, ['imageAspectRatio', 'imageSize']);

    return createTemplate({
      altText: altTextOrOptions,
      template: {
        type: 'carousel',
        columns: columns as LineTypes.ColumnObject[],
        imageAspectRatio: options.imageAspectRatio,
        imageSize: options.imageSize,
      },
      ...restOptions,
    });
  }

  const restOptions = omit(altTextOrOptions, [
    'columns',
    'imageAspectRatio',
    'imageSize',
  ]);

  return createTemplate({
    template: {
      type: 'carousel',
      columns: altTextOrOptions.columns,
      imageAspectRatio: altTextOrOptions.imageAspectRatio,
      imageSize: altTextOrOptions.imageSize,
    },
    ...restOptions,
  });
}

/**
 * Factory function of image carousel template messages.
 *
 * @param options - Image carousel template message options.
 * @returns Image carousel template message object.
 * @example
 * ```js
 * await client.reply(Line.createImageCarouselTemplate({
 *   altText: 'this is an image carousel template',
 *   columns: [
 *     {
 *       imageUrl: 'https://example.com/bot/images/item1.jpg',
 *       action: {
 *         type: 'postback',
 *         label: 'Buy',
 *         data: 'action=buy&itemid=111',
 *       },
 *     },
 *   ],
 * }));
 * ```
 */
export function createImageCarouselTemplate(
  options: Omit<
    LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>,
    'type' | 'template'
  > &
    Omit<LineTypes.ImageCarouselTemplate, 'type'>
): LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>;
/**
 * Factory function of image carousel template messages.
 *
 * @param altText - Alternative text.
 * @param columns - Columns of the image carousel template.
 * @param options - Image carousel template message options.
 * @returns Image carousel template message object.
 * @deprecated This overload is no longer recommended.
 */
export function createImageCarouselTemplate(
  altText: string,
  columns: LineTypes.ImageCarouselColumnObject[],
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>;
export function createImageCarouselTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ImageCarouselTemplate, 'type'>),
  columns?: LineTypes.ImageCarouselColumnObject[],
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createImageCarouselTemplate(altText, columns, options)` is no longer recommended. Use `Line.createImageCarouselTemplate(options)` instead.'
    );

    return createTemplate({
      altText: altTextOrOptions,
      template: {
        type: 'image_carousel',
        columns: columns as LineTypes.ImageCarouselColumnObject[],
      },
      ...options,
    });
  }

  const restOptions = omit(altTextOrOptions, ['columns']);

  return createTemplate({
    template: {
      type: 'image_carousel',
      columns: altTextOrOptions.columns,
    },
    ...restOptions,
  });
}

/**
 * Factory function of flex messages.
 *
 * @param options - Flex message options.
 * @returns Flex message object.
 * @example
 * ```js
 * await client.reply(Line.createFlex({
 *   altText: 'this is a flex message',
 *   contents: {
 *     type: 'bubble',
 *     body: {
 *       type: 'box',
 *       layout: 'vertical',
 *       contents: [
 *         { type: 'text', text: 'hello' },
 *         { type: 'text', text: 'world' },
 *       ],
 *     },
 *   },
 * }));
 * ```
 */
export function createFlex(
  options: Omit<LineTypes.FlexMessage, 'type'>
): LineTypes.FlexMessage;
/**
 * Factory function of flex messages.
 *
 * @param altText - Alternative text.
 * @param contents - Flex Message container.
 * @param options - Flex message options.
 * @returns Flex message object.
 * @deprecated This overload is no longer recommended.
 */
export function createFlex(
  altText: string,
  contents: LineTypes.FlexContainer,
  options?: Omit<LineTypes.FlexMessage, 'type' | 'altText' | 'contents'>
): LineTypes.FlexMessage;
export function createFlex(
  altTextOrOptions: string | Omit<LineTypes.FlexMessage, 'type'>,
  contents?: LineTypes.FlexContainer,
  options?: Omit<LineTypes.FlexMessage, 'type' | 'altText' | 'contents'>
): LineTypes.FlexMessage {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.createFlex(altText, contents, options)` is no longer recommended. Use `Line.createFlex(options)` instead.'
    );

    return {
      type: 'flex',
      altText: altTextOrOptions,
      contents: contents as LineTypes.FlexContainer,
      ...options,
    };
  }

  return {
    type: 'flex',
    ...altTextOrOptions,
  };
}
