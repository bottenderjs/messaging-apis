import * as Line from '../Line';
import * as Types from '../LineTypes';

jest.mock('warning');

const sender = {
  name: 'Cony',
  iconUrl: 'https://line.me/conyprof',
};
const quickReply: Types.QuickReply = {
  items: [
    {
      type: 'action',
      action: {
        type: 'cameraRoll',
        label: 'Send photo',
      },
    },
  ],
};

describe('#text', () => {
  it('should support shorthand', () => {
    expect(Line.text('hi')).toEqual({ type: 'text', text: 'hi' });
    expect(
      Line.text('$ LINE emoji', {
        emojis: [
          {
            index: 0,
            productId: '5ac1bfd5040ab15980c9b435',
            emojiId: '001',
          },
        ],
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'text',
      text: '$ LINE emoji',
      emojis: [
        {
          index: 0,
          productId: '5ac1bfd5040ab15980c9b435',
          emojiId: '001',
        },
      ],
      sender,
      quickReply,
    });
  });

  it('should support creating with full object', () => {
    expect(Line.text({ text: 'hi' })).toEqual({
      type: 'text',
      text: 'hi',
    });
    expect(
      Line.text({
        text: '$ LINE emoji',
        emojis: [
          {
            index: 0,
            productId: '5ac1bfd5040ab15980c9b435',
            emojiId: '001',
          },
        ],
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'text',
      text: '$ LINE emoji',
      emojis: [
        {
          index: 0,
          productId: '5ac1bfd5040ab15980c9b435',
          emojiId: '001',
        },
      ],
      sender,
      quickReply,
    });
  });
});

describe('#sticker', () => {
  it('should create a sticker message object', () => {
    expect(
      Line.sticker({
        packageId: '446',
        stickerId: '1988',
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'sticker',
      packageId: '446',
      stickerId: '1988',
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.sticker(
        {
          packageId: '446',
          stickerId: '1988',
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'sticker',
      packageId: '446',
      stickerId: '1988',
      sender,
      quickReply,
    });
  });
});

describe('#image', () => {
  it('should support shorthand', () => {
    expect(Line.image('https://example.com/original.jpg')).toEqual({
      type: 'image',
      originalContentUrl: 'https://example.com/original.jpg',
      previewImageUrl: 'https://example.com/original.jpg',
    });
    expect(
      Line.image('https://example.com/original', {
        previewImageUrl: 'https://example.com/preview.jpg',
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'https://example.com/original',
      previewImageUrl: 'https://example.com/preview.jpg',
      sender,
      quickReply,
    });
  });

  it('should support creating with full object', () => {
    expect(
      Line.image({
        originalContentUrl: 'https://example.com/original.jpg',
        previewImageUrl: 'https://example.com/original.jpg',
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'image',
      originalContentUrl: 'https://example.com/original.jpg',
      previewImageUrl: 'https://example.com/original.jpg',
      sender,
      quickReply,
    });
  });
});

describe('#video', () => {
  it('should create a video message object', () => {
    expect(
      Line.video({
        originalContentUrl: 'https://example.com/original.mp4',
        previewImageUrl: 'https://example.com/preview.jpg',
        trackingId: 'track-id',
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'video',
      originalContentUrl: 'https://example.com/original.mp4',
      previewImageUrl: 'https://example.com/preview.jpg',
      trackingId: 'track-id',
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.video(
        {
          originalContentUrl: 'https://example.com/original.mp4',
          previewImageUrl: 'http://example.com/img.jpg',
          trackingId: 'track-id',
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'video',
      originalContentUrl: 'https://example.com/original.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
      trackingId: 'track-id',
      sender,
      quickReply,
    });
  });
});

describe('#audio', () => {
  it('should create an audio message object', () => {
    expect(
      Line.audio({
        originalContentUrl: 'https://example.com/original.m4a',
        duration: 60000,
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'https://example.com/original.m4a',
      duration: 60000,
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.audio(
        {
          originalContentUrl: 'https://example.com/original.m4a',
          duration: 60000,
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'https://example.com/original.m4a',
      duration: 60000,
      sender,
      quickReply,
    });
  });
});

describe('#location', () => {
  it('should create a location message object', () => {
    expect(
      Line.location({
        title: 'my location',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203,
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.location(
        {
          title: 'my location',
          address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
          latitude: 35.65910807942215,
          longitude: 139.70372892916203,
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
      sender,
      quickReply,
    });
  });
});

describe('#imagemap', () => {
  it('should create an imagemap message object', () => {
    expect(
      Line.imagemap({
        baseUrl: 'https://example.com/bot/images/rm001',
        altText: 'This is an imagemap',
        baseSize: {
          width: 1040,
          height: 1040,
        },
        video: {
          originalContentUrl: 'https://example.com/video.mp4',
          previewImageUrl: 'https://example.com/video_preview.jpg',
          area: { x: 0, y: 0, width: 1040, height: 585 },
          externalLink: {
            linkUri: 'https://example.com/see_more.html',
            label: 'See More',
          },
        },
        actions: [
          {
            type: 'uri',
            linkUri: 'https://example.com/',
            area: { x: 0, y: 586, width: 520, height: 454 },
          },
        ],
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      altText: 'This is an imagemap',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      video: {
        originalContentUrl: 'https://example.com/video.mp4',
        previewImageUrl: 'https://example.com/video_preview.jpg',
        area: { x: 0, y: 0, width: 1040, height: 585 },
        externalLink: {
          linkUri: 'https://example.com/see_more.html',
          label: 'See More',
        },
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: { x: 0, y: 586, width: 520, height: 454 },
        },
      ],
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.imagemap(
        'This is an imagemap',
        {
          baseUrl: 'https://example.com/bot/images/rm001',
          baseSize: {
            width: 1040,
            height: 1040,
          },
          video: {
            originalContentUrl: 'https://example.com/video.mp4',
            previewImageUrl: 'https://example.com/video_preview.jpg',
            area: { x: 0, y: 0, width: 1040, height: 585 },
            externalLink: {
              linkUri: 'https://example.com/see_more.html',
              label: 'See More',
            },
          },
          actions: [
            {
              type: 'uri',
              linkUri: 'https://example.com/',
              area: { x: 0, y: 586, width: 520, height: 454 },
            },
          ],
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'imagemap',
      baseUrl: 'https://example.com/bot/images/rm001',
      altText: 'This is an imagemap',
      baseSize: {
        width: 1040,
        height: 1040,
      },
      video: {
        originalContentUrl: 'https://example.com/video.mp4',
        previewImageUrl: 'https://example.com/video_preview.jpg',
        area: { x: 0, y: 0, width: 1040, height: 585 },
        externalLink: {
          linkUri: 'https://example.com/see_more.html',
          label: 'See More',
        },
      },
      actions: [
        {
          type: 'uri',
          linkUri: 'https://example.com/',
          area: { x: 0, y: 586, width: 520, height: 454 },
        },
      ],
      sender,
      quickReply,
    });
  });
});

describe('#template', () => {
  it('should create a template message object', () => {
    expect(
      Line.template({
        altText: 'This is a confirm template',
        template: {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [
            { type: 'message', label: 'Yes', text: 'yes' },
            { type: 'message', label: 'No', text: 'no' },
          ],
        },
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'template',
      altText: 'This is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          { type: 'message', label: 'Yes', text: 'yes' },
          { type: 'message', label: 'No', text: 'no' },
        ],
      },
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.template(
        'This is a confirm template',
        {
          type: 'confirm',
          text: 'Are you sure?',
          actions: [
            { type: 'message', label: 'Yes', text: 'yes' },
            { type: 'message', label: 'No', text: 'no' },
          ],
        },
        {
          sender,
          quickReply,
        }
      )
    ).toEqual({
      type: 'template',
      altText: 'This is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          { type: 'message', label: 'Yes', text: 'yes' },
          { type: 'message', label: 'No', text: 'no' },
        ],
      },
      sender,
      quickReply,
    });
  });
});

describe.each(['buttonsTemplate', 'buttonTemplate'] as const)(
  '%s',
  (method) => {
    it('should create a buttons template message object', () => {
      expect(
        Line[method]({
          altText: 'This is a buttons template',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
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
          sender,
          quickReply,
        })
      ).toEqual({
        type: 'template',
        altText: 'This is a buttons template',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
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
        sender,
        quickReply,
      });
    });

    it('should support multi-object creation', () => {
      expect(
        Line[method](
          'This is a buttons template',
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
          { sender, quickReply }
        )
      ).toEqual({
        type: 'template',
        altText: 'This is a buttons template',
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
        sender,
        quickReply,
      });
    });
  }
);

describe('#confirmTemplate', () => {
  it('should create a confirm template message object', () => {
    expect(
      Line.confirmTemplate({
        altText: 'This is a confirm template',
        text: 'Are you sure?',
        actions: [
          { type: 'message', label: 'Yes', text: 'yes' },
          { type: 'message', label: 'No', text: 'no' },
        ],
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'template',
      altText: 'This is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          { type: 'message', label: 'Yes', text: 'yes' },
          { type: 'message', label: 'No', text: 'no' },
        ],
      },
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.confirmTemplate(
        'This is a confirm template',
        {
          text: 'Are you sure?',
          actions: [
            { type: 'message', label: 'Yes', text: 'yes' },
            { type: 'message', label: 'No', text: 'no' },
          ],
        },
        { sender, quickReply }
      )
    ).toEqual({
      type: 'template',
      altText: 'This is a confirm template',
      template: {
        type: 'confirm',
        text: 'Are you sure?',
        actions: [
          { type: 'message', label: 'Yes', text: 'yes' },
          { type: 'message', label: 'No', text: 'no' },
        ],
      },
      sender,
      quickReply,
    });
  });
});

describe('#carouselTemplate', () => {
  it('should create a carousel template message object', () => {
    expect(
      Line.carouselTemplate({
        altText: 'This is a carousel template',
        columns: [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            imageBackgroundColor: '#FFFFFF',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
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
            imageBackgroundColor: '#000000',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
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
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'template',
      altText: 'This is a carousel template',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            imageBackgroundColor: '#FFFFFF',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
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
            imageBackgroundColor: '#000000',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
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
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
      },
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.carouselTemplate(
        'This is a carousel template',
        [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            imageBackgroundColor: '#FFFFFF',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
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
            imageBackgroundColor: '#000000',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
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
        {
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          sender,
          quickReply,
        }
      )
    ).toEqual({
      type: 'template',
      altText: 'This is a carousel template',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            imageBackgroundColor: '#FFFFFF',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/123',
            },
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
            imageBackgroundColor: '#000000',
            title: 'this is menu',
            text: 'description',
            defaultAction: {
              type: 'uri',
              label: 'View detail',
              uri: 'http://example.com/page/222',
            },
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
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
      },
      sender,
      quickReply,
    });
  });
});

describe('#imageCarouselTemplate', () => {
  it('should create an image carousel template message object', () => {
    expect(
      Line.imageCarouselTemplate({
        altText: 'This is an image carousel template',
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
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'template',
      altText: 'This is an image carousel template',
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
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.imageCarouselTemplate(
        'This is an image carousel template',
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
        { sender, quickReply }
      )
    ).toEqual({
      type: 'template',
      altText: 'This is an image carousel template',
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
      sender,
      quickReply,
    });
  });
});

describe('#flex', () => {
  it('should create a flex message object', () => {
    expect(
      Line.flex({
        altText: 'This is a flex message',
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
            header: {
              separator: true,
            },
          },
        },
        sender,
        quickReply,
      })
    ).toEqual({
      type: 'flex',
      altText: 'This is a flex message',
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
          header: {
            separator: true,
          },
        },
      },
      sender,
      quickReply,
    });
  });

  it('should support multi-object creation', () => {
    expect(
      Line.flex(
        'This is a flex message',
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
            header: {
              separator: true,
            },
          },
        },
        {
          sender,
          quickReply,
        }
      )
    ).toEqual({
      type: 'flex',
      altText: 'This is a flex message',
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
          header: {
            separator: true,
          },
        },
      },
      sender,
      quickReply,
    });
  });
});
