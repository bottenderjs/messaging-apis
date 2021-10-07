import omit from 'lodash/omit';
import warning from 'warning';

import * as LineTypes from './LineTypes';

/**
 * Factory function of text messages.
 *
 * @param txt - Message text.
 * @param options - Text message options.
 * @returns - Text message object.
 *
 * @example
 *
 * ```js
 * await client.reply(Line.text('hi'));
 * ```
 */
export function text(
  txt: string,
  options?: Omit<LineTypes.TextMessage, 'type' | 'text'>
): LineTypes.TextMessage;
/**
 * Factory function of text messages.
 *
 * @param options - Text message options.
 * @returns - Text message object.
 * @example
 * ```js
 * await client.reply(Line.text({
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
export function text(
  options: Omit<LineTypes.TextMessage, 'type'>
): LineTypes.TextMessage;
export function text(
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
 * await client.reply(Line.sticker({
 *   packageId: '446',
 *   stickerId: '1988',
 * }));
 * ```
 */
export function sticker(
  options: Omit<LineTypes.StickerMessage, 'type'>
): LineTypes.StickerMessage;
/**
 * Factory function of sticker messages.
 *
 * @param stickerIds - Package ID and sticker ID of the sticker.
 * @param options - Sticker message options.
 * @returns Sticker message object.
 * @deprecated - This overload is no longer recommended.
 */
export function sticker(
  stickerIds: Pick<LineTypes.StickerMessage, 'packageId' | 'stickerId'>,
  options?: Omit<LineTypes.StickerMessage, 'type' | 'packageId' | 'stickerId'>
): LineTypes.StickerMessage;
export function sticker(
  stickerOrOptions:
    | Omit<LineTypes.StickerMessage, 'type'>
    | Pick<LineTypes.StickerMessage, 'packageId' | 'stickerId'>,
  options?: Omit<LineTypes.StickerMessage, 'type' | 'packageId' | 'stickerId'>
): LineTypes.StickerMessage {
  warning(
    !options,
    '`Line.sticker(stickerIds, options)` is no longer recommended. Use `Line.sticker(options)` instead.'
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
 * await client.reply(Line.image('https://example.com/original.jpg'));
 * ```
 */
export function image(
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
 * await client.reply(Line.image({
 *   originalContentUrl: 'https://example.com/original.jpg',
 *   previewImageUrl: 'https://example.com/preview.jpg',
 * }));
 * ```
 */
export function image(
  options: Omit<LineTypes.ImageMessage, 'type'>
): LineTypes.ImageMessage;
export function image(
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
 * await client.reply(Line.video({
 *   originalContentUrl: 'https://example.com/original.mp4',
 *   previewImageUrl: 'https://example.com/preview.jpg',
 * }));
 * ```
 */
export function video(
  options: Omit<LineTypes.VideoMessage, 'type'>
): LineTypes.VideoMessage;
/**
 * Factory function of video messages.
 *
 * @param videoOptions - Original content URL and preview image URL of the video.
 * @param options - Video message options.
 * @returns Video message object.
 * @deprecated This overload is no longer recommended.
 */
export function video(
  videoOptions: Pick<
    LineTypes.VideoMessage,
    'originalContentUrl' | 'previewImageUrl' | 'trackingId'
  >,
  options: Omit<
    LineTypes.VideoMessage,
    'type' | 'originalContentUrl' | 'previewImageUrl' | 'trackingId'
  >
): LineTypes.VideoMessage;
export function video(
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
    '`Line.video(videoOptions, options)` is no longer recommended. Use `Line.video(options)` instead.'
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
 * await client.reply(Line.audio({
 *   originalContentUrl: 'https://example.com/original.m4a',
 *   duration: 60000,
 * }));
 * ```
 */
export function audio(
  options: Omit<LineTypes.AudioMessage, 'type'>
): LineTypes.AudioMessage;
/**
 * Factory function of audio messages.
 *
 * @param audioOptions - Original content URL and duration of the audio.
 * @param options - Audio message options.
 * @returns Audio message object.
 * @deprecated This overload is no longer recommended.
 */
export function audio(
  audioOptions: Pick<LineTypes.AudioMessage, 'originalContentUrl' | 'duration'>,
  options?: Omit<
    LineTypes.AudioMessage,
    'type' | 'originalContentUrl' | 'duration'
  >
): LineTypes.AudioMessage;
export function audio(
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
    '`Line.audio(audioOptions, options)` is no longer recommended. Use `Line.audio(options)` instead.'
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
 * await client.reply(Line.location({
 *   title: 'my location',
 *   address: '1-6-1 Yotsuya, Shinjuku-ku, Tokyo, 160-0004, Japan',
 *   latitude: 35.687574,
 *   longitude: 139.72922,
 * }));
 * ```
 */
export function location(
  options: Omit<LineTypes.LocationMessage, 'type'>
): LineTypes.LocationMessage;
/**
 * Factory function of location messages.
 *
 * @param locationOptions - Title, address, latitude and longitude of the location.
 * @param options - Location message options.
 * @returns Location message object.
 * @deprecated This overload is no longer recommended.
 */
export function location(
  locationOptions: Pick<
    LineTypes.LocationMessage,
    'title' | 'address' | 'latitude' | 'longitude'
  >,
  options?: Omit<
    LineTypes.LocationMessage,
    'type' | 'title' | 'address' | 'latitude' | 'longitude'
  >
): LineTypes.LocationMessage;
export function location(
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
    '`Line.location(locationOptions, options)` is no longer recommended. Use `Line.location(options)` instead.'
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
 * await client.reply(Line.location({
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
export function imagemap(
  options: Omit<LineTypes.ImagemapMessage, 'type'>
): LineTypes.ImagemapMessage;
/**
 * Factory function of imagemap messages.
 *
 * @param altText - Alternative text.
 * @param imagemapOptions - Base URL, base size, video and actions of the imagemap.
 * @param options - Imagemap message options.
 * @returns Imagemap message object.
 * @deprecated This overload is no longer recommended.
 */
export function imagemap(
  altText: string,
  imagemapOptions: Pick<
    LineTypes.ImagemapMessage,
    'baseUrl' | 'baseSize' | 'video' | 'actions'
  >,
  options?: Omit<
    LineTypes.ImagemapMessage,
    'type' | 'altText' | 'baseUrl' | 'baseSize' | 'video' | 'actions'
  >
): LineTypes.ImagemapMessage;
export function imagemap(
  altTextOrOptions: string | Omit<LineTypes.ImagemapMessage, 'type'>,
  imagemapOptions?: Pick<
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
      '`Line.imagemap(altText, imagemap, options)` is no longer recommended. Use `Line.imagemap(options)` instead.'
    );

    return {
      type: 'imagemap',
      altText: altTextOrOptions,
      ...(imagemapOptions as Pick<
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
 * await client.reply(Line.template({
 *   altText: 'This is a confirm template',
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
export function template<T extends LineTypes.Template>(
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
export function template<T extends LineTypes.Template>(
  altText: string,
  tmpl: T,
  options?: Omit<LineTypes.TemplateMessage<T>, 'type' | 'altText' | 'template'>
): LineTypes.TemplateMessage<T>;
export function template<T extends LineTypes.Template>(
  altTextOroptions: string | Omit<LineTypes.TemplateMessage<T>, 'type'>,
  tmpl?: T,
  options?: Omit<LineTypes.TemplateMessage<T>, 'type' | 'altText' | 'template'>
): LineTypes.TemplateMessage<T> {
  if (typeof altTextOroptions === 'string') {
    warning(
      false,
      '`Line.template(altText, tmpl, options)` is no longer recommended. Use `Line.template(options)` instead.'
    );

    return {
      type: 'template',
      altText: altTextOroptions,
      template: tmpl as T,
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
 * await client.reply(Line.buttonsTemplate({
 *   altText: 'This is a buttons template',
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
export function buttonsTemplate(
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
export function buttonsTemplate(
  altText: string,
  tmpl: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
export function buttonsTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ButtonsTemplate, 'type'>),
  tmpl?: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.buttonsTemplate(altText, template, options)` is no longer recommended. Use `Line.buttonsTemplate(options)` instead.'
    );

    const templateOptions = tmpl as Omit<LineTypes.ButtonsTemplate, 'type'>;
    return template({
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

  return template({
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
 * @deprecated Use `buttonsTemplate` instead.
 */
export function buttonTemplate(
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
 * @deprecated Use `buttonsTemplate` instead.
 */
export function buttonTemplate(
  altText: string,
  tmpl: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>;
export function buttonTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ButtonsTemplate, 'type'>),
  tmpl?: Omit<LineTypes.ButtonsTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ButtonsTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ButtonsTemplate> {
  warning(
    false,
    '`Line.buttonTemplate(...)` is no longer recommended. Use `Line.buttonsTemplate(...)` instead.'
  );

  if (typeof altTextOrOptions === 'string') {
    return buttonsTemplate(
      altTextOrOptions,
      tmpl as Omit<LineTypes.ButtonsTemplate, 'type'>,
      options
    );
  }

  return buttonsTemplate(altTextOrOptions);
}

/**
 * Factory function of confirm template messages.
 *
 * @param options - Confirm template message options.
 * @returns Confirm template message object.
 * @example
 * ```js
 * await client.reply(Line.confirmTemplate({
 *   altText: 'This is a confirm template',
 *   text: 'Are you sure?',
 *   actions: [
 *     { type: 'message', label: 'Yes', text: 'yes' },
 *     { type: 'message', label: 'No', text: 'no' },
 *   ],
 * }));
 * ```
 */
export function confirmTemplate(
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
export function confirmTemplate(
  altText: string,
  tmpl: Omit<LineTypes.ConfirmTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>;
export function confirmTemplate(
  altTextOrOptions:
    | string
    | (Omit<
        LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
        'type' | 'template'
      > &
        Omit<LineTypes.ConfirmTemplate, 'type'>),
  tmpl?: Omit<LineTypes.ConfirmTemplate, 'type'>,
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ConfirmTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ConfirmTemplate> {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.confirmTemplate(altText, tmpl, options)` is no longer recommended. Use `Line.confirmTemplate(options)` instead.'
    );

    const templateOptions = tmpl as Omit<LineTypes.ConfirmTemplate, 'type'>;
    return template({
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

  return template({
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
 * await client.reply(Line.carouselTemplate({
 *   altText: 'This is a carousel template',
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
export function carouselTemplate(
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
export function carouselTemplate(
  altText: string,
  columns: LineTypes.ColumnObject[],
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.CarouselTemplate>,
    'type' | 'altText' | 'template'
  > &
    Omit<LineTypes.CarouselTemplate, 'type' | 'columns'>
): LineTypes.TemplateMessage<LineTypes.CarouselTemplate>;
export function carouselTemplate(
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
      '`Line.carouselTemplate(altText, columns, options)` is no longer recommended. Use `Line.carouselTemplate(options)` instead.'
    );

    const restOptions = omit(options, ['imageAspectRatio', 'imageSize']);

    return template({
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

  return template({
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
 * await client.reply(Line.imageCarouselTemplate({
 *   altText: 'This is an image carousel template',
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
export function imageCarouselTemplate(
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
export function imageCarouselTemplate(
  altText: string,
  columns: LineTypes.ImageCarouselColumnObject[],
  options?: Omit<
    LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>,
    'type' | 'altText' | 'template'
  >
): LineTypes.TemplateMessage<LineTypes.ImageCarouselTemplate>;
export function imageCarouselTemplate(
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
      '`Line.imageCarouselTemplate(altText, columns, options)` is no longer recommended. Use `Line.imageCarouselTemplate(options)` instead.'
    );

    return template({
      altText: altTextOrOptions,
      template: {
        type: 'image_carousel',
        columns: columns as LineTypes.ImageCarouselColumnObject[],
      },
      ...options,
    });
  }

  const restOptions = omit(altTextOrOptions, ['columns']);

  return template({
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
 * await client.reply(Line.flex({
 *   altText: 'This is a flex message',
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
export function flex(
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
export function flex(
  altText: string,
  contents: LineTypes.FlexContainer,
  options?: Omit<LineTypes.FlexMessage, 'type' | 'altText' | 'contents'>
): LineTypes.FlexMessage;
export function flex(
  altTextOrOptions: string | Omit<LineTypes.FlexMessage, 'type'>,
  contents?: LineTypes.FlexContainer,
  options?: Omit<LineTypes.FlexMessage, 'type' | 'altText' | 'contents'>
): LineTypes.FlexMessage {
  if (typeof altTextOrOptions === 'string') {
    warning(
      false,
      '`Line.flex(altText, contents, options)` is no longer recommended. Use `Line.flex(options)` instead.'
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
