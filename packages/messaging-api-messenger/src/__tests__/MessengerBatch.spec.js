import MessengerBatch from '../MessengerBatch';

const RECIPIENT_ID = '1QAZ2WSX';
const LABEL_ID = 123456;

describe('createRequest', () => {
  it('should create send text request', () => {
    expect(
      MessengerBatch.createRequest({
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      })
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
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

describe('createMessage', () => {
  it('should create send text request', () => {
    expect(
      MessengerBatch.createMessage(RECIPIENT_ID, { text: 'Hello' })
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('should create send text with RESPONSE type', () => {
    expect(
      MessengerBatch.createMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        { messaging_type: 'RESPONSE' }
      )
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'RESPONSE',
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
      MessengerBatch.createMessage(
        {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
      },
    });
  });

  it('should omit options with undefined value', () => {
    expect(
      MessengerBatch.createMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        {
          messaging_type: 'RESPONSE',
          access_token: undefined,
        }
      )
    ).not.toHaveProperty('body.access_token');
  });
});

describe('createText', () => {
  it('should create send text request', () => {
    expect(MessengerBatch.createText(RECIPIENT_ID, 'Hello')).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
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

describe('createAttachment', () => {
  it('should create send attachment request', () => {
    expect(
      MessengerBatch.createAttachment(RECIPIENT_ID, {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      })
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
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

describe('createAudio', () => {
  const request = {
    method: 'POST',
    relative_url: 'me/messages',
    body: {
      messaging_type: 'UPDATE',
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
      MessengerBatch.createAudio(RECIPIENT_ID, 'https://example.com/audio.mp3')
    ).toEqual(request);
  });

  it('should create send audio request with payload', () => {
    expect(
      MessengerBatch.createAudio(RECIPIENT_ID, {
        url: 'https://example.com/audio.mp3',
      })
    ).toEqual(request);
  });
});

describe('createImage', () => {
  const request = {
    method: 'POST',
    relative_url: 'me/messages',
    body: {
      messaging_type: 'UPDATE',
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
      MessengerBatch.createImage(RECIPIENT_ID, 'https://example.com/pic.png')
    ).toEqual(request);
  });

  it('should create send image request with payload', () => {
    expect(
      MessengerBatch.createImage(RECIPIENT_ID, {
        url: 'https://example.com/pic.png',
      })
    ).toEqual(request);
  });
});

describe('createVideo', () => {
  const request = {
    method: 'POST',
    relative_url: 'me/messages',
    body: {
      messaging_type: 'UPDATE',
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
      MessengerBatch.createVideo(RECIPIENT_ID, 'https://example.com/video.mp4')
    ).toEqual(request);
  });

  it('should create send video request with payload', () => {
    expect(
      MessengerBatch.createVideo(RECIPIENT_ID, {
        url: 'https://example.com/video.mp4',
      })
    ).toEqual(request);
  });
});

describe('createFile', () => {
  const request = {
    method: 'POST',
    relative_url: 'me/messages',
    body: {
      messaging_type: 'UPDATE',
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
      MessengerBatch.createFile(RECIPIENT_ID, 'https://example.com/file.pdf')
    ).toEqual(request);
  });

  it('should create send file request with payload', () => {
    expect(
      MessengerBatch.createFile(RECIPIENT_ID, {
        url: 'https://example.com/file.pdf',
      })
    ).toEqual(request);
  });
});

describe('createTemplate', () => {
  it('should create send template request', () => {
    expect(
      MessengerBatch.createTemplate(RECIPIENT_ID, {
        template_type: 'button',
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
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
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

describe('createButtonTemplate', () => {
  it('should create send button template request', () => {
    expect(
      MessengerBatch.createButtonTemplate(RECIPIENT_ID, 'title', [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ])
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
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

describe('createGenericTemplate', () => {
  const elements = [
    {
      title: "Welcome to Peter's Hats",
      image_url: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "We've got the right hat for everyone.",
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/view?item=103',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
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
    expect(
      MessengerBatch.createGenericTemplate(RECIPIENT_ID, elements)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements,
              image_aspect_ratio: 'horizontal',
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

describe('createListTemplate', () => {
  const elements = [
    {
      title: 'Classic T-Shirt Collection',
      image_url: 'https://peterssendreceiveapp.ngrok.io/img/collection.png',
      subtitle: 'See all our colors',
      default_action: {
        type: 'web_url',
        url: 'https://peterssendreceiveapp.ngrok.io/shop_collection',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
      },
      buttons: [
        {
          title: 'View',
          type: 'web_url',
          url: 'https://peterssendreceiveapp.ngrok.io/collection',
          messenger_extensions: true,
          webview_height_ratio: 'tall',
          fallback_url: 'https://peterssendreceiveapp.ngrok.io/',
        },
      ],
    },
  ];
  const buttons = [
    {
      type: 'postback',
      title: 'Start Chatting',
      payload: 'USER_DEFINED_PAYLOAD',
    },
  ];
  it('should create send list template request', () => {
    expect(
      MessengerBatch.createListTemplate(RECIPIENT_ID, elements, buttons, {
        top_element_style: 'compact',
      })
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'list',
              elements,
              buttons,
              top_element_style: 'compact',
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

describe('createOpenGraphTemplate', () => {
  const elements = [
    {
      url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
      buttons: [
        {
          type: 'web_url',
          url: 'https://en.wikipedia.org/wiki/Rickrolling',
          title: 'View More',
        },
      ],
    },
  ];
  it('should create send open graph template request', () => {
    expect(
      MessengerBatch.createOpenGraphTemplate(RECIPIENT_ID, elements)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'open_graph',
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

describe('createReceiptTemplate', () => {
  const receipt = {
    recipient_name: 'Stephane Crozatier',
    order_number: '12345678902',
    currency: 'USD',
    payment_method: 'Visa 2345',
    order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
    timestamp: '1428444852',
    elements: [
      {
        title: 'Classic White T-Shirt',
        subtitle: '100% Soft and Luxurious Cotton',
        quantity: 2,
        price: 50,
        currency: 'USD',
        image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png',
      },
      {
        title: 'Classic Gray T-Shirt',
        subtitle: '100% Soft and Luxurious Cotton',
        quantity: 1,
        price: 25,
        currency: 'USD',
        image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png',
      },
    ],
    address: {
      street_1: '1 Hacker Way',
      street_2: '',
      city: 'Menlo Park',
      postal_code: '94025',
      state: 'CA',
      country: 'US',
    },
    summary: {
      subtotal: 75.0,
      shipping_cost: 4.95,
      total_tax: 6.19,
      total_cost: 56.14,
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
    expect(MessengerBatch.createReceiptTemplate(RECIPIENT_ID, receipt)).toEqual(
      {
        method: 'POST',
        relative_url: 'me/messages',
        body: {
          messaging_type: 'UPDATE',
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'receipt',
                ...receipt,
              },
            },
          },
          recipient: {
            id: RECIPIENT_ID,
          },
        },
      }
    );
  });
});

describe('createMediaTemplate', () => {
  const elements = [
    {
      media_type: 'image',
      attachment_id: '1854626884821032',
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
    expect(MessengerBatch.createMediaTemplate(RECIPIENT_ID, elements)).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'media',
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

describe('createAirlineBoardingPassTemplate', () => {
  const attrs = {
    intro_message: 'You are checked in.',
    locale: 'en_US',
    boarding_pass: [
      {
        passenger_name: 'SMITH/NICOLAS',
        pnr_number: 'CG4X7U',
        travel_class: 'business',
        seat: '74J',
        auxiliary_fields: [
          {
            label: 'Terminal',
            value: 'T1',
          },
          {
            label: 'Departure',
            value: '30OCT 19:05',
          },
        ],
        secondary_fields: [
          {
            label: 'Boarding',
            value: '18:30',
          },
          {
            label: 'Gate',
            value: 'D57',
          },
          {
            label: 'Seat',
            value: '74J',
          },
          {
            label: 'Sec.Nr.',
            value: '003',
          },
        ],
        logo_image_url: 'https://www.example.com/en/logo.png',
        header_image_url: 'https://www.example.com/en/fb/header.png',
        qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
        above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
        flight_info: {
          flight_number: 'KL0642',
          departure_airport: {
            airport_code: 'JFK',
            city: 'New York',
            terminal: 'T1',
            gate: 'D57',
          },
          arrival_airport: {
            airport_code: 'AMS',
            city: 'Amsterdam',
          },
          flight_schedule: {
            departure_time: '2016-01-02T19:05',
            arrival_time: '2016-01-05T17:30',
          },
        },
      },
      {
        passenger_name: 'JONES/FARBOUND',
        pnr_number: 'CG4X7U',
        travel_class: 'business',
        seat: '74K',
        auxiliary_fields: [
          {
            label: 'Terminal',
            value: 'T1',
          },
          {
            label: 'Departure',
            value: '30OCT 19:05',
          },
        ],
        secondary_fields: [
          {
            label: 'Boarding',
            value: '18:30',
          },
          {
            label: 'Gate',
            value: 'D57',
          },
          {
            label: 'Seat',
            value: '74K',
          },
          {
            label: 'Sec.Nr.',
            value: '004',
          },
        ],
        logo_image_url: 'https://www.example.com/en/logo.png',
        header_image_url: 'https://www.example.com/en/fb/header.png',
        qr_code: 'M1JONES/FARBOUND  CG4X7U nawouehgawgnapwi3jfa0wfh',
        above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
        flight_info: {
          flight_number: 'KL0642',
          departure_airport: {
            airport_code: 'JFK',
            city: 'New York',
            terminal: 'T1',
            gate: 'D57',
          },
          arrival_airport: {
            airport_code: 'AMS',
            city: 'Amsterdam',
          },
          flight_schedule: {
            departure_time: '2016-01-02T19:05',
            arrival_time: '2016-01-05T17:30',
          },
        },
      },
    ],
  };
  it('should create send airline boarding pass template request', () => {
    expect(
      MessengerBatch.createAirlineBoardingPassTemplate(RECIPIENT_ID, attrs)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'airline_boardingpass',
              ...attrs,
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

describe('createAirlineCheckinTemplate', () => {
  const attrs = {
    intro_message: 'Check-in is available now.',
    locale: 'en_US',
    pnr_number: 'ABCDEF',
    flight_info: [
      {
        flight_number: 'f001',
        departure_airport: {
          airport_code: 'SFO',
          city: 'San Francisco',
          terminal: 'T4',
          gate: 'G8',
        },
        arrival_airport: {
          airport_code: 'SEA',
          city: 'Seattle',
          terminal: 'T4',
          gate: 'G8',
        },
        flight_schedule: {
          boarding_time: '2016-01-05T15:05',
          departure_time: '2016-01-05T15:45',
          arrival_time: '2016-01-05T17:30',
        },
      },
    ],
    checkin_url: 'https://www.airline.com/check-in',
  };
  it('should create send airline checkin template request', () => {
    expect(
      MessengerBatch.createAirlineCheckinTemplate(RECIPIENT_ID, attrs)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'airline_checkin',
              ...attrs,
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

describe('createAirlineItineraryTemplate', () => {
  const attrs = {
    intro_message: "Here's your flight itinerary.",
    locale: 'en_US',
    pnr_number: 'ABCDEF',
    passenger_info: [
      {
        name: 'Farbound Smith Jr',
        ticket_number: '0741234567890',
        passenger_id: 'p001',
      },
      {
        name: 'Nick Jones',
        ticket_number: '0741234567891',
        passenger_id: 'p002',
      },
    ],
    flight_info: [
      {
        connection_id: 'c001',
        segment_id: 's001',
        flight_number: 'KL9123',
        aircraft_type: 'Boeing 737',
        departure_airport: {
          airport_code: 'SFO',
          city: 'San Francisco',
          terminal: 'T4',
          gate: 'G8',
        },
        arrival_airport: {
          airport_code: 'SLC',
          city: 'Salt Lake City',
          terminal: 'T4',
          gate: 'G8',
        },
        flight_schedule: {
          departure_time: '2016-01-02T19:45',
          arrival_time: '2016-01-02T21:20',
        },
        travel_class: 'business',
      },
      {
        connection_id: 'c002',
        segment_id: 's002',
        flight_number: 'KL321',
        aircraft_type: 'Boeing 747-200',
        travel_class: 'business',
        departure_airport: {
          airport_code: 'SLC',
          city: 'Salt Lake City',
          terminal: 'T1',
          gate: 'G33',
        },
        arrival_airport: {
          airport_code: 'AMS',
          city: 'Amsterdam',
          terminal: 'T1',
          gate: 'G33',
        },
        flight_schedule: {
          departure_time: '2016-01-02T22:45',
          arrival_time: '2016-01-03T17:20',
        },
      },
    ],
    passenger_segment_info: [
      {
        segment_id: 's001',
        passenger_id: 'p001',
        seat: '12A',
        seat_type: 'Business',
      },
      {
        segment_id: 's001',
        passenger_id: 'p002',
        seat: '12B',
        seat_type: 'Business',
      },
      {
        segment_id: 's002',
        passenger_id: 'p001',
        seat: '73A',
        seat_type: 'World Business',
        product_info: [
          {
            title: 'Lounge',
            value: 'Complimentary lounge access',
          },
          {
            title: 'Baggage',
            value: '1 extra bag 50lbs',
          },
        ],
      },
      {
        segment_id: 's002',
        passenger_id: 'p002',
        seat: '73B',
        seat_type: 'World Business',
        product_info: [
          {
            title: 'Lounge',
            value: 'Complimentary lounge access',
          },
          {
            title: 'Baggage',
            value: '1 extra bag 50lbs',
          },
        ],
      },
    ],
    price_info: [
      {
        title: 'Fuel surcharge',
        amount: '1597',
        currency: 'USD',
      },
    ],
    base_price: '12206',
    tax: '200',
    total_price: '14003',
    currency: 'USD',
  };
  it('should create send airline itinerary template request', () => {
    expect(
      MessengerBatch.createAirlineItineraryTemplate(RECIPIENT_ID, attrs)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'airline_itinerary',
              ...attrs,
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

describe('createAirlineFlightUpdateTemplate', () => {
  const attrs = {
    intro_message: 'Your flight is delayed',
    update_type: 'delay',
    locale: 'en_US',
    pnr_number: 'CF23G2',
    update_flight_info: {
      flight_number: 'KL123',
      departure_airport: {
        airport_code: 'SFO',
        city: 'San Francisco',
        terminal: 'T4',
        gate: 'G8',
      },
      arrival_airport: {
        airport_code: 'AMS',
        city: 'Amsterdam',
        terminal: 'T4',
        gate: 'G8',
      },
      flight_schedule: {
        boarding_time: '2015-12-26T10:30',
        departure_time: '2015-12-26T11:30',
        arrival_time: '2015-12-27T07:30',
      },
    },
  };
  it('should create send airline flight update template request', () => {
    expect(
      MessengerBatch.createAirlineFlightUpdateTemplate(RECIPIENT_ID, attrs)
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'airline_update',
              ...attrs,
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
      relative_url: RECIPIENT_ID,
    });
  });
});

describe('sendSenderAction', () => {
  it('should create send sender action request', () => {
    expect(MessengerBatch.sendSenderAction(RECIPIENT_ID, 'typing_on')).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        sender_action: 'typing_on',
      },
    });
  });
});

describe('typingOn', () => {
  it('should create send typing on request', () => {
    expect(MessengerBatch.typingOn(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        sender_action: 'typing_on',
      },
    });
  });
});

describe('typingOff', () => {
  it('should create send typing off request', () => {
    expect(MessengerBatch.typingOff(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        sender_action: 'typing_off',
      },
    });
  });
});

describe('markSeen', () => {
  it('should create send mark seen request', () => {
    expect(MessengerBatch.markSeen(RECIPIENT_ID)).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        recipient: {
          id: RECIPIENT_ID,
        },
        sender_action: 'mark_seen',
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
      relative_url: 'me/pass_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        target_app_id: 263902037430900,
        metadata: 'something',
      },
    });
  });
});

describe('passThreadControlToPageInbox', () => {
  it('should create pass thread control to inbox request', () => {
    expect(
      MessengerBatch.passThreadControlToPageInbox(RECIPIENT_ID, 'something')
    ).toEqual({
      method: 'POST',
      relative_url: 'me/pass_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        target_app_id: 263902037430900,
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
        relative_url: 'me/take_thread_control',
        body: {
          recipient: { id: RECIPIENT_ID },
          metadata: 'something',
        },
      }
    );
  });
});

describe('requestThreadControl', () => {
  it('should create request thread control request', () => {
    expect(
      MessengerBatch.requestThreadControl(RECIPIENT_ID, 'something')
    ).toEqual({
      method: 'POST',
      relative_url: 'me/request_thread_control',
      body: {
        recipient: { id: RECIPIENT_ID },
        metadata: 'something',
      },
    });
  });
});

describe('getThreadOwner', () => {
  it('should create get thread owner request', () => {
    expect(MessengerBatch.getThreadOwner(RECIPIENT_ID)).toEqual({
      method: 'GET',
      relative_url: 'me/thread_owner?recipient=1QAZ2WSX',
      responseAccessPath: 'data[0].thread_owner',
    });
  });
});

describe('associateLabel', () => {
  it('should create associate label request', () => {
    expect(MessengerBatch.associateLabel(RECIPIENT_ID, LABEL_ID)).toEqual({
      method: 'POST',
      relative_url: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
    });
  });
});

describe('dissociateLabel', () => {
  it('should create dissociate label request', () => {
    expect(MessengerBatch.dissociateLabel(RECIPIENT_ID, LABEL_ID)).toEqual({
      method: 'DELETE',
      relative_url: `${LABEL_ID}/label`,
      body: {
        user: RECIPIENT_ID,
      },
    });
  });
});

describe('getAssociatedLabels', () => {
  it('should create get associated labels request', () => {
    expect(MessengerBatch.getAssociatedLabels(RECIPIENT_ID)).toEqual({
      method: 'GET',
      relative_url: `${RECIPIENT_ID}/custom_labels`,
    });
  });
});
