import * as Messenger from '../Messenger';
import * as MessengerTypes from '../MessengerTypes';

const quickReplies: MessengerTypes.QuickReply[] = [
  {
    contentType: 'text',
    title: 'Red',
    payload: '<POSTBACK_PAYLOAD>',
    imageUrl: 'http://example.com/img/red.png',
  },
  {
    contentType: 'text',
    title: 'Green',
    payload: '<POSTBACK_PAYLOAD>',
    imageUrl: 'http://example.com/img/green.png',
  },
];

it('should support #message', () => {
  expect(Messenger.message({ text: 'Hello' })).toEqual({ text: 'Hello' });
  expect(Messenger.message({ text: 'Hello', quickReplies })).toEqual({
    text: 'Hello',
    quickReplies,
  });
  expect(
    Messenger.message({
      attachment: {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      },
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'https://example.com/pic.png',
      },
    },
  });
  expect(
    Messenger.message({
      attachment: {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      },
      quickReplies,
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'https://example.com/pic.png',
      },
    },
    quickReplies,
  });
});

it('should support #text', () => {
  expect(Messenger.text('Hello')).toEqual({ text: 'Hello' });
  expect(Messenger.text('Hello', { quickReplies })).toEqual({
    text: 'Hello',
    quickReplies,
  });
});

it('should support #attachment', () => {
  expect(
    Messenger.attachment({
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
    },
  });
  expect(
    Messenger.attachment({
      type: 'image',
      payload: {
        attachmentId: '1745504518999123',
      },
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        attachmentId: '1745504518999123',
      },
    },
  });
  expect(
    Messenger.attachment(
      {
        type: 'image',
        payload: {
          url: 'http://www.messenger-rocks.com/image.jpg',
          isReusable: true,
        },
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
    },
    quickReplies,
  });
});

it('should support #audio', () => {
  expect(
    Messenger.audio({
      url: 'http://www.messenger-rocks.com/audio.mp3',
      isReusable: true,
    })
  ).toEqual({
    attachment: {
      type: 'audio',
      payload: {
        url: 'http://www.messenger-rocks.com/audio.mp3',
        isReusable: true,
      },
    },
  });
  expect(
    Messenger.audio(
      {
        url: 'http://www.messenger-rocks.com/audio.mp3',
        isReusable: true,
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'audio',
      payload: {
        url: 'http://www.messenger-rocks.com/audio.mp3',
        isReusable: true,
      },
    },
    quickReplies,
  });
});

it('should support #audio shorthand', () => {
  expect(Messenger.audio('http://www.messenger-rocks.com/audio.mp3')).toEqual({
    attachment: {
      type: 'audio',
      payload: {
        url: 'http://www.messenger-rocks.com/audio.mp3',
      },
    },
  });
  expect(
    Messenger.audio('http://www.messenger-rocks.com/audio.mp3', {
      quickReplies,
    })
  ).toEqual({
    attachment: {
      type: 'audio',
      payload: {
        url: 'http://www.messenger-rocks.com/audio.mp3',
      },
    },
    quickReplies,
  });
});

it('should support #image', () => {
  expect(
    Messenger.image({
      url: 'http://www.messenger-rocks.com/image.jpg',
      isReusable: true,
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
    },
  });
  expect(
    Messenger.image(
      {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
        isReusable: true,
      },
    },
    quickReplies,
  });
});

it('should support #image shorthand', () => {
  expect(Messenger.image('http://www.messenger-rocks.com/image.jpg')).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
      },
    },
  });
  expect(
    Messenger.image('http://www.messenger-rocks.com/image.jpg', {
      quickReplies,
    })
  ).toEqual({
    attachment: {
      type: 'image',
      payload: {
        url: 'http://www.messenger-rocks.com/image.jpg',
      },
    },
    quickReplies,
  });
});

it('should support #video', () => {
  expect(
    Messenger.video({
      url: 'http://www.messenger-rocks.com/video.mp4',
      isReusable: true,
    })
  ).toEqual({
    attachment: {
      type: 'video',
      payload: {
        url: 'http://www.messenger-rocks.com/video.mp4',
        isReusable: true,
      },
    },
  });
  expect(
    Messenger.video(
      {
        url: 'http://www.messenger-rocks.com/video.mp4',
        isReusable: true,
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'video',
      payload: {
        url: 'http://www.messenger-rocks.com/video.mp4',
        isReusable: true,
      },
    },
    quickReplies,
  });
});

it('should support #video shorthand', () => {
  expect(Messenger.video('http://www.messenger-rocks.com/video.mp4')).toEqual({
    attachment: {
      type: 'video',
      payload: {
        url: 'http://www.messenger-rocks.com/video.mp4',
      },
    },
  });
  expect(
    Messenger.video('http://www.messenger-rocks.com/video.mp4', {
      quickReplies,
    })
  ).toEqual({
    attachment: {
      type: 'video',
      payload: {
        url: 'http://www.messenger-rocks.com/video.mp4',
      },
    },
    quickReplies,
  });
});

it('should support #file', () => {
  expect(
    Messenger.file({
      url: 'http://www.messenger-rocks.com/file.pdf',
      isReusable: true,
    })
  ).toEqual({
    attachment: {
      type: 'file',
      payload: {
        url: 'http://www.messenger-rocks.com/file.pdf',
        isReusable: true,
      },
    },
  });
  expect(
    Messenger.file(
      {
        url: 'http://www.messenger-rocks.com/file.pdf',
        isReusable: true,
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'file',
      payload: {
        url: 'http://www.messenger-rocks.com/file.pdf',
        isReusable: true,
      },
    },
    quickReplies,
  });
});

it('should support #file shorthand', () => {
  expect(Messenger.file('http://www.messenger-rocks.com/file.pdf')).toEqual({
    attachment: {
      type: 'file',
      payload: {
        url: 'http://www.messenger-rocks.com/file.pdf',
      },
    },
  });
  expect(
    Messenger.file('http://www.messenger-rocks.com/file.pdf', {
      quickReplies,
    })
  ).toEqual({
    attachment: {
      type: 'file',
      payload: {
        url: 'http://www.messenger-rocks.com/file.pdf',
      },
    },
    quickReplies,
  });
});

it('should support #template', () => {
  expect(
    Messenger.template({
      templateType: 'button',
      text: 'title',
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
  });
  expect(
    Messenger.template(
      {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #template', () => {
  expect(
    Messenger.template({
      templateType: 'button',
      text: 'title',
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
  });
  expect(
    Messenger.template(
      {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
      {
        quickReplies,
      }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #buttonTemplate', () => {
  expect(
    Messenger.buttonTemplate({
      text: 'title',
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
  });
  expect(
    Messenger.buttonTemplate(
      {
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #buttonTemplate shorthand', () => {
  expect(
    Messenger.buttonTemplate('title', [
      {
        type: 'postback',
        title: 'Start Chatting',
        payload: 'USER_DEFINED_PAYLOAD',
      },
    ])
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
  });
  expect(
    Messenger.buttonTemplate(
      'title',
      [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'button',
        text: 'title',
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'USER_DEFINED_PAYLOAD',
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #genericTemplate', () => {
  expect(
    Messenger.genericTemplate({
      elements: [
        {
          title: "Welcome to Peter's Hats",
          imageUrl: 'https://petersfancybrownhats.com/company_image.png',
          subtitle: "We've got the right hat for everyone.",
          defaultAction: {
            type: 'web_url',
            url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            messengerExtensions: true,
            webviewHeightRatio: 'tall',
            fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
          },
          buttons: [
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            },
          ],
        },
      ],
      imageAspectRatio: 'square',
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'generic',
        elements: [
          {
            title: "Welcome to Peter's Hats",
            imageUrl: 'https://petersfancybrownhats.com/company_image.png',
            subtitle: "We've got the right hat for everyone.",
            defaultAction: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
              messengerExtensions: true,
              webviewHeightRatio: 'tall',
              fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                type: 'postback',
                title: 'Start Chatting',
                payload: 'DEVELOPER_DEFINED_PAYLOAD',
              },
            ],
          },
        ],
        imageAspectRatio: 'square',
      },
    },
  });
  expect(
    Messenger.genericTemplate(
      {
        elements: [
          {
            title: "Welcome to Peter's Hats",
            imageUrl: 'https://petersfancybrownhats.com/company_image.png',
            subtitle: "We've got the right hat for everyone.",
            defaultAction: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
              messengerExtensions: true,
              webviewHeightRatio: 'tall',
              fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                type: 'postback',
                title: 'Start Chatting',
                payload: 'DEVELOPER_DEFINED_PAYLOAD',
              },
            ],
          },
        ],
        imageAspectRatio: 'square',
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'generic',
        elements: [
          {
            title: "Welcome to Peter's Hats",
            imageUrl: 'https://petersfancybrownhats.com/company_image.png',
            subtitle: "We've got the right hat for everyone.",
            defaultAction: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
              messengerExtensions: true,
              webviewHeightRatio: 'tall',
              fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                type: 'postback',
                title: 'Start Chatting',
                payload: 'DEVELOPER_DEFINED_PAYLOAD',
              },
            ],
          },
        ],
        imageAspectRatio: 'square',
      },
    },
    quickReplies,
  });
});

it('should support #genericTemplate shorthand', () => {
  expect(
    Messenger.genericTemplate([
      {
        title: "Welcome to Peter's Hats",
        imageUrl: 'https://petersfancybrownhats.com/company_image.png',
        subtitle: "We've got the right hat for everyone.",
        defaultAction: {
          type: 'web_url',
          url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
          messengerExtensions: true,
          webviewHeightRatio: 'tall',
          fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
        },
        buttons: [
          {
            type: 'postback',
            title: 'Start Chatting',
            payload: 'DEVELOPER_DEFINED_PAYLOAD',
          },
        ],
      },
    ])
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'generic',
        elements: [
          {
            title: "Welcome to Peter's Hats",
            imageUrl: 'https://petersfancybrownhats.com/company_image.png',
            subtitle: "We've got the right hat for everyone.",
            defaultAction: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
              messengerExtensions: true,
              webviewHeightRatio: 'tall',
              fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                type: 'postback',
                title: 'Start Chatting',
                payload: 'DEVELOPER_DEFINED_PAYLOAD',
              },
            ],
          },
        ],
      },
    },
  });
  expect(
    Messenger.genericTemplate(
      [
        {
          title: "Welcome to Peter's Hats",
          imageUrl: 'https://petersfancybrownhats.com/company_image.png',
          subtitle: "We've got the right hat for everyone.",
          defaultAction: {
            type: 'web_url',
            url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            messengerExtensions: true,
            webviewHeightRatio: 'tall',
            fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
          },
          buttons: [
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            },
          ],
        },
      ],
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'generic',
        elements: [
          {
            title: "Welcome to Peter's Hats",
            imageUrl: 'https://petersfancybrownhats.com/company_image.png',
            subtitle: "We've got the right hat for everyone.",
            defaultAction: {
              type: 'web_url',
              url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
              messengerExtensions: true,
              webviewHeightRatio: 'tall',
              fallbackUrl: 'https://peterssendreceiveapp.ngrok.io/',
            },
            buttons: [
              {
                type: 'postback',
                title: 'Start Chatting',
                payload: 'DEVELOPER_DEFINED_PAYLOAD',
              },
            ],
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #mediaTemplate', () => {
  expect(
    Messenger.mediaTemplate({
      elements: [
        {
          mediaType: 'image',
          attachmentId: '1854626884821032',
          buttons: [
            {
              type: 'web_url',
              url: '<WEB_URL>',
              title: 'View Website',
            },
          ],
        },
      ],
      sharable: true,
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'media',
        elements: [
          {
            mediaType: 'image',
            attachmentId: '1854626884821032',
            buttons: [
              {
                type: 'web_url',
                url: '<WEB_URL>',
                title: 'View Website',
              },
            ],
          },
        ],
        sharable: true,
      },
    },
  });
  expect(
    Messenger.mediaTemplate(
      {
        elements: [
          {
            mediaType: 'image',
            attachmentId: '1854626884821032',
            buttons: [
              {
                type: 'web_url',
                url: '<WEB_URL>',
                title: 'View Website',
              },
            ],
          },
        ],
        sharable: true,
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'media',
        elements: [
          {
            mediaType: 'image',
            attachmentId: '1854626884821032',
            buttons: [
              {
                type: 'web_url',
                url: '<WEB_URL>',
                title: 'View Website',
              },
            ],
          },
        ],
        sharable: true,
      },
    },
    quickReplies,
  });
});

it('should support #mediaTemplate shorthand', () => {
  expect(
    Messenger.mediaTemplate([
      {
        mediaType: 'image',
        attachmentId: '1854626884821032',
        buttons: [
          {
            type: 'web_url',
            url: '<WEB_URL>',
            title: 'View Website',
          },
        ],
      },
    ])
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'media',
        elements: [
          {
            mediaType: 'image',
            attachmentId: '1854626884821032',
            buttons: [
              {
                type: 'web_url',
                url: '<WEB_URL>',
                title: 'View Website',
              },
            ],
          },
        ],
      },
    },
  });
  expect(
    Messenger.mediaTemplate(
      [
        {
          mediaType: 'image',
          attachmentId: '1854626884821032',
          buttons: [
            {
              type: 'web_url',
              url: '<WEB_URL>',
              title: 'View Website',
            },
          ],
        },
      ],
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'media',
        elements: [
          {
            mediaType: 'image',
            attachmentId: '1854626884821032',
            buttons: [
              {
                type: 'web_url',
                url: '<WEB_URL>',
                title: 'View Website',
              },
            ],
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #receiptTemplate', () => {
  expect(
    Messenger.receiptTemplate({
      recipientName: 'Stephane Crozatier',
      orderNumber: '12345678902',
      currency: 'USD',
      paymentMethod: 'Visa 2345',
      orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
      timestamp: '1428444852',
      elements: [
        {
          title: 'Classic White T-Shirt',
          subtitle: '100% Soft and Luxurious Cotton',
          quantity: 2,
          price: 50,
          currency: 'USD',
          imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
        },
        {
          title: 'Classic Gray T-Shirt',
          subtitle: '100% Soft and Luxurious Cotton',
          quantity: 1,
          price: 25,
          currency: 'USD',
          imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
        },
      ],
      address: {
        street1: '1 Hacker Way',
        street2: '',
        city: 'Menlo Park',
        postalCode: '94025',
        state: 'CA',
        country: 'US',
      },
      summary: {
        subtotal: 75.0,
        shippingCost: 4.95,
        totalTax: 6.19,
        totalCost: 56.14,
      },
      adjustments: [
        {
          name: 'New Customer Discount',
          amount: 20,
        },
        {
          name: '$10 Off Coupon',
          amount: 10,
        },
      ],
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'receipt',
        recipientName: 'Stephane Crozatier',
        orderNumber: '12345678902',
        currency: 'USD',
        paymentMethod: 'Visa 2345',
        orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
        timestamp: '1428444852',
        elements: [
          {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
          },
          {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
          },
        ],
        address: {
          street1: '1 Hacker Way',
          street2: '',
          city: 'Menlo Park',
          postalCode: '94025',
          state: 'CA',
          country: 'US',
        },
        summary: {
          subtotal: 75.0,
          shippingCost: 4.95,
          totalTax: 6.19,
          totalCost: 56.14,
        },
        adjustments: [
          {
            name: 'New Customer Discount',
            amount: 20,
          },
          {
            name: '$10 Off Coupon',
            amount: 10,
          },
        ],
      },
    },
  });
  expect(
    Messenger.receiptTemplate(
      {
        recipientName: 'Stephane Crozatier',
        orderNumber: '12345678902',
        currency: 'USD',
        paymentMethod: 'Visa 2345',
        orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
        timestamp: '1428444852',
        elements: [
          {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
          },
          {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
          },
        ],
        address: {
          street1: '1 Hacker Way',
          street2: '',
          city: 'Menlo Park',
          postalCode: '94025',
          state: 'CA',
          country: 'US',
        },
        summary: {
          subtotal: 75.0,
          shippingCost: 4.95,
          totalTax: 6.19,
          totalCost: 56.14,
        },
        adjustments: [
          {
            name: 'New Customer Discount',
            amount: 20,
          },
          {
            name: '$10 Off Coupon',
            amount: 10,
          },
        ],
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'receipt',
        recipientName: 'Stephane Crozatier',
        orderNumber: '12345678902',
        currency: 'USD',
        paymentMethod: 'Visa 2345',
        orderUrl: 'http://petersapparel.parseapp.com/order?order_id=123456',
        timestamp: '1428444852',
        elements: [
          {
            title: 'Classic White T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 2,
            price: 50,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
          },
          {
            title: 'Classic Gray T-Shirt',
            subtitle: '100% Soft and Luxurious Cotton',
            quantity: 1,
            price: 25,
            currency: 'USD',
            imageUrl: 'http://petersapparel.parseapp.com/img/grayshirt.png',
          },
        ],
        address: {
          street1: '1 Hacker Way',
          street2: '',
          city: 'Menlo Park',
          postalCode: '94025',
          state: 'CA',
          country: 'US',
        },
        summary: {
          subtotal: 75.0,
          shippingCost: 4.95,
          totalTax: 6.19,
          totalCost: 56.14,
        },
        adjustments: [
          {
            name: 'New Customer Discount',
            amount: 20,
          },
          {
            name: '$10 Off Coupon',
            amount: 10,
          },
        ],
      },
    },
    quickReplies,
  });
});

it('should support #oneTimeNotifReqTemplate', () => {
  expect(
    Messenger.oneTimeNotifReqTemplate({
      title: '<TITLE_TEXT>',
      payload: 'USER_DEFINED_PAYLOAD',
    })
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'one_time_notif_req',
        title: '<TITLE_TEXT>',
        payload: 'USER_DEFINED_PAYLOAD',
      },
    },
  });
  expect(
    Messenger.oneTimeNotifReqTemplate(
      {
        title: '<TITLE_TEXT>',
        payload: 'USER_DEFINED_PAYLOAD',
      },
      { quickReplies }
    )
  ).toEqual({
    attachment: {
      type: 'template',
      payload: {
        templateType: 'one_time_notif_req',
        title: '<TITLE_TEXT>',
        payload: 'USER_DEFINED_PAYLOAD',
      },
    },
    quickReplies,
  });
});
