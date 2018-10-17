import invariant from 'invariant';

import Line from '../Line';

jest.mock('invariant');

const quickReplyOptions = {
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          type: 'cameraRoll',
          label: 'Send photo',
        },
      },
      {
        type: 'action',
        action: {
          type: 'camera',
          label: 'Open camera',
        },
      },
    ],
  },
};

describe('#createText', () => {
  it('should return text message object', () => {
    expect(Line.createText('t')).toEqual({ type: 'text', text: 't' });
    expect(Line.createText('t', quickReplyOptions)).toEqual({
      type: 'text',
      text: 't',
      ...quickReplyOptions,
    });
  });
});

describe('#createImage', () => {
  it('should return image message object', () => {
    expect(Line.createImage('http://example.com/img1.jpg')).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
    });

    expect(
      Line.createImage(
        'http://example.com/img1.jpg',
        'http://example.com/img2.jpg'
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
    });
  });

  it('should work with object', () => {
    expect(
      Line.createImage({
        originalContentUrl: 'http://example.com/img1.jpg',
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
    });

    expect(
      Line.createImage({
        originalContentUrl: 'http://example.com/img1.jpg',
        previewImageUrl: 'http://example.com/img2.jpg',
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
    });

    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
      ...quickReplyOptions,
    });

    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
          previewImageUrl: 'http://example.com/img2.jpg',
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
      ...quickReplyOptions,
    });
  });

  it('call invariant if wrong argument type #1', () => {
    Line.createImage('http://example.com/img1.jpg', {});

    expect(invariant).toBeCalled();
  });

  it('call invariant if wrong argument type #2', () => {
    Line.createImage(123);

    expect(invariant).toBeCalled();
  });
});

describe('#createVideo', () => {
  it('should return video message object', () => {
    expect(
      Line.createVideo(
        'http://example.com/video.mp4',
        'http://example.com/img.jpg'
      )
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
    });
  });

  it('should work with object', () => {
    expect(
      Line.createVideo({
        originalContentUrl: 'http://example.com/video.mp4',
        previewImageUrl: 'http://example.com/img.jpg',
      })
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
    });

    expect(
      Line.createVideo(
        {
          originalContentUrl: 'http://example.com/video.mp4',
          previewImageUrl: 'http://example.com/img.jpg',
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
      ...quickReplyOptions,
    });
  });

  it('call invariant if wrong argument type', () => {
    Line.createVideo('http://example.com/video.mp4', {});

    expect(invariant).toBeCalled();
  });
});

describe('#createAudio', () => {
  it('should return audio message object', () => {
    expect(Line.createAudio('http://example.com/audio.mp3', 240000)).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
    });
  });

  it('should work with object', () => {
    expect(
      Line.createAudio({
        originalContentUrl: 'http://example.com/audio.mp3',
        duration: 240000,
      })
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
    });

    expect(
      Line.createAudio(
        {
          originalContentUrl: 'http://example.com/audio.mp3',
          duration: 240000,
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
      ...quickReplyOptions,
    });
  });

  it('call invariant if wrong argument type', () => {
    Line.createAudio('http://example.com/audio.mp3', {});

    expect(invariant).toBeCalled();
  });
});

describe('#createLocation', () => {
  it('should return location message object', () => {
    expect(
      Line.createLocation({
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
      })
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
    });

    expect(
      Line.createLocation(
        {
          title: 'my location',
          address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
          latitude: 35.65910807942215,
          longitude: 139.70372892916203,
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
      ...quickReplyOptions,
    });
  });
});

describe('#createSticker', () => {
  it('should return sticker message object', () => {
    expect(Line.createSticker('1', '1')).toEqual({
      type: 'sticker',
      packageId: '1',
      stickerId: '1',
    });
  });

  it('should work with object', () => {
    expect(
      Line.createSticker({
        packageId: '1',
        stickerId: '1',
      })
    ).toEqual({
      type: 'sticker',
      packageId: '1',
      stickerId: '1',
    });

    expect(
      Line.createSticker(
        {
          packageId: '1',
          stickerId: '1',
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'sticker',
      packageId: '1',
      stickerId: '1',
      ...quickReplyOptions,
    });
  });

  it('call invariant if wrong argument type', () => {
    Line.createSticker('1', {});

    expect(invariant).toBeCalled();
  });
});

describe('#createImagemap', () => {
  it('should return imagemap message object', () => {
    expect(
      Line.createImagemap('this is an imagemap', {
        baseUrl: 'https://example.com/bot/images/rm001',
        baseSize: {
          width: 1040,
          height: 1040,
        },
        actions: [
          {
            type: 'uri',
            linkUri: 'https://example.com/',
            area: {
              x: 0,
              y: 0,
              width: 520,
              height: 1040,
            },
          },
          {
            type: 'message',
            text: 'hello',
            area: {
              x: 520,
              y: 0,
              width: 520,
              height: 1040,
            },
          },
        ],
      })
    ).toEqual({
      type: 'imagemap',
      altText: 'this is an imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: {
            x: 0,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
        {
          type: 'message',
          text: 'hello',
          area: {
            x: 520,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
      ],
    });

    expect(
      Line.createImagemap(
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            width: 1040,
            height: 1040,
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'imagemap',
      altText: 'this is an imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: {
            x: 0,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
        {
          type: 'message',
          text: 'hello',
          area: {
            x: 520,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
      ],
      ...quickReplyOptions,
    });
  });
});

describe('#createImagemap', () => {
  it('should return imagemap message object', () => {
    expect(
      Line.createImagemap('this is an imagemap', {
        baseUrl: 'https://example.com/bot/images/rm001',
        baseSize: {
          width: 1040,
          height: 1040,
        },
        actions: [
          {
            type: 'uri',
            linkUri: 'https://example.com/',
            area: {
              x: 0,
              y: 0,
              width: 520,
              height: 1040,
            },
          },
          {
            type: 'message',
            text: 'hello',
            area: {
              x: 520,
              y: 0,
              width: 520,
              height: 1040,
            },
          },
        ],
      })
    ).toEqual({
      type: 'imagemap',
      altText: 'this is an imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: {
            x: 0,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
        {
          type: 'message',
          text: 'hello',
          area: {
            x: 520,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
      ],
    });

    expect(
      Line.createImagemap(
        'this is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            width: 1040,
            height: 1040,
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: {
                x: 0,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
            {
              type: 'message',
              text: 'hello',
              area: {
                x: 520,
                y: 0,
                width: 520,
                height: 1040,
              },
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'imagemap',
      altText: 'this is an imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: {
            x: 0,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
        {
          type: 'message',
          text: 'hello',
          area: {
            x: 520,
            y: 0,
            width: 520,
            height: 1040,
          },
        },
      ],
      ...quickReplyOptions,
    });
  });
});

describe('#createTemplate', () => {
  it('should return template message object', () => {
    expect(
      Line.createTemplate('this is a buttons template', {
        type: 'buttons',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      })
    ).toEqual({
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
    });

    expect(
      Line.createTemplate(
        'this is a buttons template',
        {
          type: 'buttons',
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
      ...quickReplyOptions,
    });
  });
});

describe('#createTemplate', () => {
  it('should return template message object', () => {
    expect(
      Line.createTemplate('this is a confirm template', {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      })
    ).toEqual({
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
    });

    expect(
      Line.createTemplate(
        'this is a confirm template',
        {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
      ...quickReplyOptions,
    });
  });
});

describe('#createButtonTemplate', () => {
  it('should return buttons template message object', () => {
    expect(
      Line.createButtonTemplate('this is a buttons template', {
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        defaultAction: {
          type: 'uri',
          label: 'View detail',
          uri: 'http://example.com/page/123',
        },
        actions: [
          {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123',
          },
          {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123',
          },
          {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
        ],
      })
    ).toEqual({
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        defaultAction: {
          type: 'uri',
          label: 'View detail',
          uri: 'http://example.com/page/123',
        },
        actions: [
          {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123',
          },
          {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123',
          },
          {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
        ],
      },
    });

    expect(
      Line.createButtonTemplate(
        'this is a buttons template',
        {
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          title: 'Menu',
          text: 'Please select',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=123',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=123',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        actions: [
          {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123',
          },
          {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123',
          },
          {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
        ],
      },
      ...quickReplyOptions,
    });
  });

  it('should support createButtonsTemplate alias', () => {
    expect(
      Line.createButtonsTemplate('this is a buttons template', {
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        actions: [
          {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123',
          },
          {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123',
          },
          {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
        ],
      })
    ).toEqual({
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        text: 'Please select',
        actions: [
          {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=123',
          },
          {
            type: 'postback',
            label: 'Add to cart',
            data: 'action=add&itemid=123',
          },
          {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/123',
          },
        ],
      },
    });
  });
});

describe('#createConfirmTemplate', () => {
  it('should return confirm template message object', () => {
    expect(
      Line.createConfirmTemplate('this is a confirm template', {
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      })
    ).toEqual({
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
    });

    expect(
      Line.createConfirmTemplate(
        'this is a confirm template',
        {
          text: 'Are you sure?',
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'no',
            },
          ],
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
          {
            type: 'message',
            label: 'No',
            text: 'no',
          },
        ],
      },
      ...quickReplyOptions,
    });
  });
});

describe('#createCarouselTemplate', () => {
  it('should return carousel template message object', () => {
    expect(
      Line.createCarouselTemplate('this is a carousel template', [
        {
          thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
          title: 'this is menu',
          text: 'description',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=111',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/111',
            },
          ],
        },
        {
          thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
          title: 'this is menu',
          text: 'description',
          actions: [
            {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=222',
            },
            {
              type: 'postback',
              label: 'Add to cart',
              data: 'action=add&itemid=222',
            },
            {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          ],
        },
      ])
    ).toEqual({
      type: 'template',
      altText: 'this is a carousel template',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ],
      },
    });

    expect(
      Line.createCarouselTemplate(
        'this is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ],
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a carousel template',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=111',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=111',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/111',
              },
            ],
          },
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
            title: 'this is menu',
            text: 'description',
            actions: [
              {
                type: 'postback',
                label: 'Buy',
                data: 'action=buy&itemid=222',
              },
              {
                type: 'postback',
                label: 'Add to cart',
                data: 'action=add&itemid=222',
              },
              {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222',
              },
            ],
          },
        ],
      },
      ...quickReplyOptions,
    });
  });
});

describe('#createImageCarouselTemplate', () => {
  it('should return image carousel template message object', () => {
    expect(
      Line.createImageCarouselTemplate('this is a image carousel template', [
        {
          imageUrl: 'https://example.com/bot/images/item1.jpg',
          action: {
            type: 'postback',
            label: 'Buy',
            data: 'action=buy&itemid=111',
          },
        },
        {
          imageUrl: 'https://example.com/bot/images/item2.jpg',
          action: {
            type: 'message',
            label: 'Yes',
            text: 'yes',
          },
        },
        {
          imageUrl: 'https://example.com/bot/images/item3.jpg',
          action: {
            type: 'uri',
            label: 'View detail',
            uri: 'http://example.com/page/222',
          },
        },
      ])
    ).toEqual({
      type: 'template',
      altText: 'this is a image carousel template',
      template: {
        type: 'image_carousel',
        columns: [
          {
            imageUrl: 'https://example.com/bot/images/item1.jpg',
            action: {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item2.jpg',
            action: {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item3.jpg',
            action: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          },
        ],
      },
    });

    expect(
      Line.createImageCarouselTemplate(
        'this is a image carousel template',
        [
          {
            imageUrl: 'https://example.com/bot/images/item1.jpg',
            action: {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item2.jpg',
            action: {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item3.jpg',
            action: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          },
        ],
        quickReplyOptions
      )
    ).toEqual({
      type: 'template',
      altText: 'this is a image carousel template',
      template: {
        type: 'image_carousel',
        columns: [
          {
            imageUrl: 'https://example.com/bot/images/item1.jpg',
            action: {
              type: 'postback',
              label: 'Buy',
              data: 'action=buy&itemid=111',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item2.jpg',
            action: {
              type: 'message',
              label: 'Yes',
              text: 'yes',
            },
          },
          {
            imageUrl: 'https://example.com/bot/images/item3.jpg',
            action: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
          },
        ],
      },
      ...quickReplyOptions,
    });
  });
});

describe('#createFlex', () => {
  it('should return flex message object', () => {
    expect(
      Line.createFlex('this is a flex message', {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Header text',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://example.com/flex/images/image.jpg',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Body text',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Footer text',
            },
          ],
        },
        styles: {
          comment: 'See the example of a bubble style object',
        },
      })
    ).toEqual({
      type: 'flex',
      altText: 'this is a flex message',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Header text',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://example.com/flex/images/image.jpg',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Body text',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Footer text',
            },
          ],
        },
        styles: {
          comment: 'See the example of a bubble style object',
        },
      },
    });

    expect(
      Line.createFlex(
        'this is a flex message',
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Header text',
              },
            ],
          },
          hero: {
            type: 'image',
            url: 'https://example.com/flex/images/image.jpg',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Body text',
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Footer text',
              },
            ],
          },
          styles: {
            comment: 'See the example of a bubble style object',
          },
        },
        quickReplyOptions
      )
    ).toEqual({
      type: 'flex',
      altText: 'this is a flex message',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Header text',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://example.com/flex/images/image.jpg',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Body text',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Footer text',
            },
          ],
        },
        styles: {
          comment: 'See the example of a bubble style object',
        },
      },
      ...quickReplyOptions,
    });
  });
});
