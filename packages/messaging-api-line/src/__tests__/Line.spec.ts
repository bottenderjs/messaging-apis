import Line from '../Line';
import * as Types from '../LineTypes';

const quickReply: Types.QuickReply = {
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
};

describe('#createText', () => {
  it('should return text message object', () => {
    expect(Line.createText('t')).toEqual({ type: 'text', text: 't' });
  });

  it('should work with quickReply', () => {
    expect(Line.createText('t', { quickReply })).toEqual({
      type: 'text',
      text: 't',
      quickReply,
    });
  });
});

describe('#createImage', () => {
  it('should return image message object', () => {
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
  });

  it('should work with quickReply', () => {
    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img1.jpg',
      quickReply,
    });

    expect(
      Line.createImage(
        {
          originalContentUrl: 'http://example.com/img1.jpg',
          previewImageUrl: 'http://example.com/img2.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'image',
      originalContentUrl: 'http://example.com/img1.jpg',
      previewImageUrl: 'http://example.com/img2.jpg',
      quickReply,
    });
  });
});

describe('#createVideo', () => {
  it('should return video message object', () => {
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
  });

  it('should work with quickReply', () => {
    expect(
      Line.createVideo(
        {
          originalContentUrl: 'http://example.com/video.mp4',
          previewImageUrl: 'http://example.com/img.jpg',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'video',
      originalContentUrl: 'http://example.com/video.mp4',
      previewImageUrl: 'http://example.com/img.jpg',
      quickReply,
    });
  });
});

describe('#createAudio', () => {
  it('should return audio message object', () => {
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
  });

  it('should work with quickReply', () => {
    expect(
      Line.createAudio(
        {
          originalContentUrl: 'http://example.com/audio.mp3',
          duration: 240000,
        },
        { quickReply }
      )
    ).toEqual({
      type: 'audio',
      originalContentUrl: 'http://example.com/audio.mp3',
      duration: 240000,
      quickReply,
    });
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
  });

  it('should work with quickReply', () => {
    expect(
      Line.createLocation(
        {
          title: 'my location',
          address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
          latitude: 35.65910807942215,
          longitude: 139.70372892916203,
        },
        { quickReply }
      )
    ).toEqual({
      type: 'location',
      title: 'my location',
      address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
      latitude: 35.65910807942215,
      longitude: 139.70372892916203,
      quickReply,
    });
  });
});

describe('#createSticker', () => {
  it('should return sticker message object', () => {
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
  });

  it('should work with quickReply', () => {
    expect(
      Line.createSticker(
        {
          packageId: '1',
          stickerId: '1',
        },
        { quickReply }
      )
    ).toEqual({
      type: 'sticker',
      packageId: '1',
      stickerId: '1',
      quickReply,
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
  });

  it('should work with quickReply', () => {
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
        { quickReply }
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
      quickReply,
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
  });

  it('should work with quickReply', () => {
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
        { quickReply }
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
      quickReply,
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
  });

  it('should work with quickReply', () => {
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
        { quickReply }
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
      quickReply,
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
  });

  it('should work with quickReply', () => {
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
        { quickReply }
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
      quickReply,
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
  });

  it('should work with quickReply', () => {
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
        { quickReply }
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
      quickReply,
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
          header: {
            separator: true,
          },
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
          header: {
            separator: true,
          },
        },
      },
    });
  });

  it('should work with quickReply', () => {
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
            header: {
              separator: true,
            },
          },
        },
        { quickReply }
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
          header: {
            separator: true,
          },
        },
      },
      quickReply,
    });
  });
});
