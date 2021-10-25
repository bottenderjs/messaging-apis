import { MessengerBatch } from '..';

const RECIPIENT_ID = '1QAZ2WSX';
const LABEL_ID = 123456;

describe('sendRequest', () => {
  it('should create send text request', () => {
    expect(
      MessengerBatch.sendRequest({
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.sendRequest(
        {
          messagingType: 'UPDATE',
          message: {
            text: 'Hello',
          },
          recipient: {
            id: RECIPIENT_ID,
          },
        },
        {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('sendMessage', () => {
  it('should create send text request', () => {
    expect(MessengerBatch.sendMessage(RECIPIENT_ID, { text: 'Hello' })).toEqual(
      {
        method: 'POST',
        relativeUrl: 'me/messages',
        body: {
          messagingType: 'UPDATE',
          message: {
            text: 'Hello',
          },
          recipient: {
            id: RECIPIENT_ID,
          },
        },
      }
    );
  });

  it('should create send text with RESPONSE type', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        { messagingType: 'RESPONSE' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'RESPONSE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('can create request with phone_number', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          phoneNumber: '+1(212)555-2368',
          name: { firstName: 'John', lastName: 'Doe' },
        },
      },
    });
  });

  it('can create request with user_ref', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          userRef: 'user-ref',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          userRef: 'user-ref',
        },
      },
    });
  });

  it('can create request with post_id', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          postId: 'post-id',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          postId: 'post-id',
        },
      },
    });
  });

  it('can create request with comment_id', () => {
    expect(
      MessengerBatch.sendMessage(
        {
          commentId: 'comment-id',
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          commentId: 'comment-id',
        },
      },
    });
  });

  it('should omit options with undefined value', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        {
          messagingType: 'RESPONSE',
          accessToken: undefined,
        }
      )
    ).not.toHaveProperty('body.accessToken');
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.sendMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('sendText', () => {
  it('should create send text request', () => {
    expect(MessengerBatch.sendText(RECIPIENT_ID, 'Hello')).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAttachment', () => {
  it('should create send attachment request', () => {
    expect(
      MessengerBatch.sendAttachment(RECIPIENT_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: 'https://example.com/pic.png',
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendAudio', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'audio',
          payload: {
            url: 'https://example.com/audio.mp3',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send audio request with url', () => {
    expect(
      MessengerBatch.sendAudio(RECIPIENT_ID, 'https://example.com/audio.mp3')
    ).toEqual(request);
  });

  it('should create send audio request with payload', () => {
    expect(
      MessengerBatch.sendAudio(RECIPIENT_ID, {
        url: 'https://example.com/audio.mp3',
      })
    ).toEqual(request);
  });
});

describe('sendImage', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://example.com/pic.png',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send image request with url', () => {
    expect(
      MessengerBatch.sendImage(RECIPIENT_ID, 'https://example.com/pic.png')
    ).toEqual(request);
  });

  it('should create send image request with payload', () => {
    expect(
      MessengerBatch.sendImage(RECIPIENT_ID, {
        url: 'https://example.com/pic.png',
      })
    ).toEqual(request);
  });
});

describe('sendVideo', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'video',
          payload: {
            url: 'https://example.com/video.mp4',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send video request with url', () => {
    expect(
      MessengerBatch.sendVideo(RECIPIENT_ID, 'https://example.com/video.mp4')
    ).toEqual(request);
  });

  it('should create send video request with payload', () => {
    expect(
      MessengerBatch.sendVideo(RECIPIENT_ID, {
        url: 'https://example.com/video.mp4',
      })
    ).toEqual(request);
  });
});

describe('sendFile', () => {
  const request = {
    method: 'POST',
    relativeUrl: 'me/messages',
    body: {
      messagingType: 'UPDATE',
      message: {
        attachment: {
          type: 'file',
          payload: {
            url: 'https://example.com/file.pdf',
          },
        },
      },
      recipient: {
        id: RECIPIENT_ID,
      },
    },
  };
  it('should create send file request with url', () => {
    expect(
      MessengerBatch.sendFile(RECIPIENT_ID, 'https://example.com/file.pdf')
    ).toEqual(request);
  });

  it('should create send file request with payload', () => {
    expect(
      MessengerBatch.sendFile(RECIPIENT_ID, {
        url: 'https://example.com/file.pdf',
      })
    ).toEqual(request);
  });
});

describe('sendTemplate', () => {
  it('should create send template request', () => {
    expect(
      MessengerBatch.sendTemplate(RECIPIENT_ID, {
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
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
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
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendButtonTemplate', () => {
  it('should create send button template request', () => {
    expect(
      MessengerBatch.sendButtonTemplate(RECIPIENT_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ])
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
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
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendGenericTemplate', () => {
  const elements = [
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
  ];
  it('should create send generic template request', () => {
    expect(MessengerBatch.sendGenericTemplate(RECIPIENT_ID, elements)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'generic',
              elements,
              imageAspectRatio: 'horizontal',
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendReceiptTemplate', () => {
  const receipt = {
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
  };
  it('should create send receipt template request', () => {
    expect(MessengerBatch.sendReceiptTemplate(RECIPIENT_ID, receipt)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'receipt',
              ...receipt,
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendMediaTemplate', () => {
  const elements = [
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
  ];
  it('should create send media template request', () => {
    expect(MessengerBatch.sendMediaTemplate(RECIPIENT_ID, elements)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'media',
              elements,
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('sendOneTimeNotifReqTemplate', () => {
  it('should create send one time notif req template request', () => {
    expect(
      MessengerBatch.sendOneTimeNotifReqTemplate(RECIPIENT_ID, {
        title: '<TITLE_TEXT>',
        payload: '<USER_DEFINED_PAYLOAD>',
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        messagingType: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              templateType: 'one_time_notif_req',
              title: '<TITLE_TEXT>',
              payload: '<USER_DEFINED_PAYLOAD>',
            },
          },
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('getUserProfile', () => {
  it('should create get user profile request', () => {
    expect(MessengerBatch.getUserProfile(RECIPIENT_ID)).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}?fields=id,name,first_name,last_name,profile_pic`,
    });
  });

  it('should support custom fields', () => {
    expect(
      MessengerBatch.getUserProfile(RECIPIENT_ID, {
        fields: [
          'id',
          'name',
          'first_name',
          'last_name',
          'profile_pic',
          'locale',
          'timezone',
          'gender',
        ],
      })
    ).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}?fields=id,name,first_name,last_name,profile_pic,locale,timezone,gender`,
    });
  });

  it('should support custom fields and access_token', () => {
    expect(
      MessengerBatch.getUserProfile(RECIPIENT_ID, {
        fields: [
          'id',
          'name',
          'first_name',
          'last_name',
          'profile_pic',
          'locale',
          'timezone',
          'gender',
        ],
        accessToken: 'ACCESS_TOKEN',
      })
    ).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}?fields=id,name,first_name,last_name,profile_pic,locale,timezone,gender&access_token=ACCESS_TOKEN`,
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.getUserProfile(RECIPIENT_ID, {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}?fields=id,name,first_name,last_name,profile_pic`,
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('#userPersistentMenu', () => {
  describe('getUserPersistentMenu', () => {
    it('should create get user persistent menu request', () => {
      expect(MessengerBatch.getUserPersistentMenu(RECIPIENT_ID)).toEqual({
        method: 'GET',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}`,
      });
    });

    it('should support access_token', () => {
      expect(
        MessengerBatch.getUserPersistentMenu(RECIPIENT_ID, {
          accessToken: 'ACCESS_TOKEN',
        })
      ).toEqual({
        method: 'GET',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}&access_token=ACCESS_TOKEN`,
      });
    });

    it('should support specifying dependencies between operations', () => {
      expect(
        MessengerBatch.getUserPersistentMenu(RECIPIENT_ID, {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        })
      ).toEqual({
        method: 'GET',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}`,
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      });
    });
  });

  describe('setUserPersistentMenu', () => {
    it('should create set user persistent menu request', () => {
      expect(
        MessengerBatch.setUserPersistentMenu(RECIPIENT_ID, [
          {
            locale: 'default',
            composerInputDisabled: false,
            callToActions: [
              {
                type: 'postback',
                title: 'Restart Conversation',
                payload: 'RESTART',
              },
              {
                type: 'web_url',
                title: 'Powered by ALOHA.AI, Yoctol',
                url: 'https://www.yoctol.com/',
              },
            ],
          },
        ])
      ).toEqual({
        method: 'POST',
        relativeUrl: `/me/custom_user_settings`,
        body: {
          psid: `${RECIPIENT_ID}`,
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
        },
      });
    });

    it('should respond correctly if input is not a full Persistent Menu', () => {
      expect(
        MessengerBatch.setUserPersistentMenu(RECIPIENT_ID, [
          {
            type: 'postback',
            title: 'Restart Conversation',
            payload: 'RESTART',
          },
          {
            type: 'web_url',
            title: 'Powered by ALOHA.AI, Yoctol',
            url: 'https://www.yoctol.com/',
          },
        ])
      ).toEqual({
        method: 'POST',
        relativeUrl: `/me/custom_user_settings`,
        body: {
          psid: `${RECIPIENT_ID}`,
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
        },
      });
    });

    it('should support access_token', () => {
      expect(
        MessengerBatch.setUserPersistentMenu(
          RECIPIENT_ID,
          [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
          {
            accessToken: 'ACCESS_TOKEN',
          }
        )
      ).toEqual({
        method: 'POST',
        relativeUrl: `/me/custom_user_settings?access_token=ACCESS_TOKEN`,
        body: {
          psid: `${RECIPIENT_ID}`,
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
        },
      });
    });

    it('should support specifying dependencies between operations', () => {
      expect(
        MessengerBatch.setUserPersistentMenu(
          RECIPIENT_ID,
          [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
          {
            name: 'second',
            dependsOn: 'first',
            omitResponseOnSuccess: false,
          }
        )
      ).toEqual({
        method: 'POST',
        relativeUrl: `/me/custom_user_settings`,
        body: {
          psid: `${RECIPIENT_ID}`,
          persistentMenu: [
            {
              locale: 'default',
              composerInputDisabled: false,
              callToActions: [
                {
                  type: 'postback',
                  title: 'Restart Conversation',
                  payload: 'RESTART',
                },
                {
                  type: 'web_url',
                  title: 'Powered by ALOHA.AI, Yoctol',
                  url: 'https://www.yoctol.com/',
                },
              ],
            },
          ],
        },
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      });
    });
  });

  describe('deleteUserPersistentMenu', () => {
    it('should create delete user persistent menu request', () => {
      expect(MessengerBatch.deleteUserPersistentMenu(RECIPIENT_ID)).toEqual({
        method: 'DELETE',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}&params=[%22persistent_menu%22]`,
      });
    });

    it('should support access_token', () => {
      expect(
        MessengerBatch.deleteUserPersistentMenu(RECIPIENT_ID, {
          accessToken: 'ACCESS_TOKEN',
        })
      ).toEqual({
        method: 'DELETE',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}&params=[%22persistent_menu%22]&access_token=ACCESS_TOKEN`,
      });
    });

    it('should support specifying dependencies between operations', () => {
      expect(
        MessengerBatch.deleteUserPersistentMenu(RECIPIENT_ID, {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        })
      ).toEqual({
        method: 'DELETE',
        relativeUrl: `/me/custom_user_settings?psid=${RECIPIENT_ID}&params=[%22persistent_menu%22]`,
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      });
    });
  });
});

describe('sendSenderAction', () => {
  it('should create send sender action request', () => {
    expect(MessengerBatch.sendSenderAction(RECIPIENT_ID, 'typing_on')).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        senderAction: 'typing_on',
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.sendSenderAction(RECIPIENT_ID, 'typing_on', {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        senderAction: 'typing_on',
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('typingOn', () => {
  it('should create send typing on request', () => {
    expect(MessengerBatch.typingOn(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        senderAction: 'typing_on',
      },
    });
  });
});

describe('typingOff', () => {
  it('should create send typing off request', () => {
    expect(MessengerBatch.typingOff(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        senderAction: 'typing_off',
      },
    });
  });
});

describe('markSeen', () => {
  it('should create send mark seen request', () => {
    expect(MessengerBatch.markSeen(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relativeUrl: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        senderAction: 'mark_seen',
      },
    });
  });
});

describe('passThreadControl', () => {
  it('should create pass thread control request', () => {
    expect(
      MessengerBatch.passThreadControl(
        RECIPIENT_ID,
        263902037430900,
        'something'
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/pass_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        targetAppId: 263902037430900,
        metadata: 'something',
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.passThreadControl(
        RECIPIENT_ID,
        263902037430900,
        'something',
        {
          name: 'second',
          dependsOn: 'first',
          omitResponseOnSuccess: false,
        }
      )
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/pass_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        targetAppId: 263902037430900,
        metadata: 'something',
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('passThreadControlToPageInbox', () => {
  it('should create pass thread control to inbox request', () => {
    expect(
      MessengerBatch.passThreadControlToPageInbox(RECIPIENT_ID, 'something')
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/pass_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        targetAppId: 263902037430900,
        metadata: 'something',
      },
    });
  });
});

describe('takeThreadControl', () => {
  it('should create take thread control request', () => {
    expect(MessengerBatch.takeThreadControl(RECIPIENT_ID, 'something')).toEqual(
      {
        method: 'POST',
        relativeUrl: 'me/take_thread_control',
        body: {
          recipient: { id: RECIPIENT_ID },
          metadata: 'something',
        },
      }
    );
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.takeThreadControl(RECIPIENT_ID, 'something', {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/take_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        metadata: 'something',
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('requestThreadControl', () => {
  it('should create request thread control request', () => {
    expect(
      MessengerBatch.requestThreadControl(RECIPIENT_ID, 'something')
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/request_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        metadata: 'something',
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.requestThreadControl(RECIPIENT_ID, 'something', {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: 'me/request_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        metadata: 'something',
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('getThreadOwner', () => {
  it('should create get thread owner request', () => {
    expect(MessengerBatch.getThreadOwner(RECIPIENT_ID)).toEqual({
      method: 'GET',
      relativeUrl: 'me/thread_owner?recipient=1QAZ2WSX',
      responseAccessPath: 'data[0].threadOwner',
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.getThreadOwner(RECIPIENT_ID, {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'GET',
      relativeUrl: 'me/thread_owner?recipient=1QAZ2WSX',
      responseAccessPath: 'data[0].threadOwner',
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('associateLabel', () => {
  it('should create associate label request', () => {
    expect(MessengerBatch.associateLabel(RECIPIENT_ID, LABEL_ID)).toEqual({
      method: 'POST',
      relativeUrl: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.associateLabel(RECIPIENT_ID, LABEL_ID, {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'POST',
      relativeUrl: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('dissociateLabel', () => {
  it('should create dissociate label request', () => {
    expect(MessengerBatch.dissociateLabel(RECIPIENT_ID, LABEL_ID)).toEqual({
      method: 'DELETE',
      relativeUrl: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.dissociateLabel(RECIPIENT_ID, LABEL_ID, {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'DELETE',
      relativeUrl: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});

describe('getAssociatedLabels', () => {
  it('should create get associated labels request', () => {
    expect(MessengerBatch.getAssociatedLabels(RECIPIENT_ID)).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}/custom_labels`,
    });
  });

  it('should support specifying dependencies between operations', () => {
    expect(
      MessengerBatch.getAssociatedLabels(RECIPIENT_ID, {
        name: 'second',
        dependsOn: 'first',
        omitResponseOnSuccess: false,
      })
    ).toEqual({
      method: 'GET',
      relativeUrl: `${RECIPIENT_ID}/custom_labels`,
      name: 'second',
      dependsOn: 'first',
      omitResponseOnSuccess: false,
    });
  });
});
