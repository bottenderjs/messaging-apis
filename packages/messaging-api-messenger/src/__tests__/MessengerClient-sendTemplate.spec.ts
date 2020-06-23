import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios');
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = (): { client: MessengerClient; mock: MockAdapter } => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#sendTemplate', () => {
  it('should call messages api with template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendTemplate(USER_ID, {
      templateType: 'button',
      text: 'title',
      buttons: [
        {
          type: 'postback',
          title: 'Start Chatting',
          payload: 'USER_DEFINED_PAYLOAD',
        },
      ],
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendButtonTemplate', () => {
  it('should call messages api with button template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendButtonTemplate(USER_ID, 'title', [
      {
        type: 'postback',
        title: 'Start Chatting',
        payload: 'USER_DEFINED_PAYLOAD',
      },
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
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
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendGenericTemplate', () => {
  it('should call messages api with generic template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(USER_ID, [
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
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });

  it('can use square generic template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(
      USER_ID,
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
      {
        imageAspectRatio: 'square',
      }
    );

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
            image_aspect_ratio: 'square',
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });

  it('can use generic template with tag', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendGenericTemplate(
      USER_ID,
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
      {
        tag: 'CONFIRMED_EVENT_UPDATE',
      }
    );

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'MESSAGE_TAG',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
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
            ],
          },
        },
      },
      tag: 'CONFIRMED_EVENT_UPDATE',
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendMediaTemplate', () => {
  it('should call messages api with media template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendMediaTemplate(USER_ID, [
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
    ]);

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'media',
            elements: [
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
            ],
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendReceiptTemplate', () => {
  it('should call messages api with receipt template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendReceiptTemplate(USER_ID, {
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
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'receipt',
            recipient_name: 'Stephane Crozatier',
            order_number: '12345678902',
            currency: 'USD',
            payment_method: 'Visa 2345',
            order_url:
              'http://petersapparel.parseapp.com/order?order_id=123456',
            timestamp: '1428444852',
            elements: [
              {
                title: 'Classic White T-Shirt',
                subtitle: '100% Soft and Luxurious Cotton',
                quantity: 2,
                price: 50,
                currency: 'USD',
                image_url:
                  'http://petersapparel.parseapp.com/img/whiteshirt.png',
              },
              {
                title: 'Classic Gray T-Shirt',
                subtitle: '100% Soft and Luxurious Cotton',
                quantity: 1,
                price: 25,
                currency: 'USD',
                image_url:
                  'http://petersapparel.parseapp.com/img/grayshirt.png',
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
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendAirlineBoardingPassTemplate', () => {
  it('should call messages api with airline boardingpass template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendAirlineBoardingPassTemplate(USER_ID, {
      introMessage: 'You are checked in.',
      locale: 'en_US',
      boardingPass: [
        {
          passengerName: 'SMITH/NICOLAS',
          pnrNumber: 'CG4X7U',
          travelClass: 'business',
          seat: '74J',
          auxiliaryFields: [
            {
              label: 'Terminal',
              value: 'T1',
            },
            {
              label: 'Departure',
              value: '30OCT 19:05',
            },
          ],
          secondaryFields: [
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
          logoImageUrl: 'https://www.example.com/en/logo.png',
          headerImageUrl: 'https://www.example.com/en/fb/header.png',
          qrCode: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
          aboveBarCodeImageUrl: 'https://www.example.com/en/PLAT.png',
          flightInfo: {
            flightNumber: 'KL0642',
            departureAirport: {
              airportCode: 'JFK',
              city: 'New York',
              terminal: 'T1',
              gate: 'D57',
            },
            arrivalAirport: {
              airportCode: 'AMS',
              city: 'Amsterdam',
            },
            flightSchedule: {
              departureTime: '2016-01-02T19:05',
              arrivalTime: '2016-01-05T17:30',
            },
          },
        },
      ],
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'airline_boardingpass',
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
            ],
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendAirlineCheckinTemplate', () => {
  it('should call messages api with airline checkin template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock
      .onPost(`/me/messages?access_token=${ACCESS_TOKEN}`, {
        messaging_type: 'UPDATE',
        recipient: {
          id: USER_ID,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'airline_checkin',
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
            },
          },
        },
      })
      .reply((config) => {
        url = config.url;
        data = config.data;
        return [200, reply];
      });

    const res = await client.sendAirlineCheckinTemplate(USER_ID, {
      introMessage: 'Check-in is available now.',
      locale: 'en_US',
      pnrNumber: 'ABCDEF',
      flightInfo: [
        {
          flightNumber: 'f001',
          departureAirport: {
            airportCode: 'SFO',
            city: 'San Francisco',
            terminal: 'T4',
            gate: 'G8',
          },
          arrivalAirport: {
            airportCode: 'SEA',
            city: 'Seattle',
            terminal: 'T4',
            gate: 'G8',
          },
          flightSchedule: {
            boardingTime: '2016-01-05T15:05',
            departureTime: '2016-01-05T15:45',
            arrivalTime: '2016-01-05T17:30',
          },
        },
      ],
      checkinUrl: 'https://www.airline.com/check-in',
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'airline_checkin',
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
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendAirlineItineraryTemplate', () => {
  it('should call messages api with airline itinerary template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendAirlineItineraryTemplate(USER_ID, {
      introMessage: "Here's your flight itinerary.",
      locale: 'en_US',
      pnrNumber: 'ABCDEF',
      passengerInfo: [
        {
          name: 'Farbound Smith Jr',
          ticketNumber: '0741234567890',
          passengerId: 'p001',
        },
        {
          name: 'Nick Jones',
          ticketNumber: '0741234567891',
          passengerId: 'p002',
        },
      ],
      flightInfo: [
        {
          connectionId: 'c001',
          segmentId: 's001',
          flightNumber: 'KL9123',
          aircraftType: 'Boeing 737',
          departureAirport: {
            airportCode: 'SFO',
            city: 'San Francisco',
            terminal: 'T4',
            gate: 'G8',
          },
          arrivalAirport: {
            airportCode: 'SLC',
            city: 'Salt Lake City',
            terminal: 'T4',
            gate: 'G8',
          },
          flightSchedule: {
            departureTime: '2016-01-02T19:45',
            arrivalTime: '2016-01-02T21:20',
          },
          travelClass: 'business' as any,
        },
        {
          connectionId: 'c002',
          segmentId: 's002',
          flightNumber: 'KL321',
          aircraftType: 'Boeing 747-200',
          travelClass: 'business' as any,
          departureAirport: {
            airportCode: 'SLC',
            city: 'Salt Lake City',
            terminal: 'T1',
            gate: 'G33',
          },
          arrivalAirport: {
            airportCode: 'AMS',
            city: 'Amsterdam',
            terminal: 'T1',
            gate: 'G33',
          },
          flightSchedule: {
            departureTime: '2016-01-02T22:45',
            arrivalTime: '2016-01-03T17:20',
          },
        },
      ],
      passengerSegmentInfo: [
        {
          segmentId: 's001',
          passengerId: 'p001',
          seat: '12A',
          seatType: 'Business',
        },
        {
          segmentId: 's001',
          passengerId: 'p002',
          seat: '12B',
          seatType: 'Business',
        },
        {
          segmentId: 's002',
          passengerId: 'p001',
          seat: '73A',
          seatType: 'World Business',
          productInfo: [
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
          segmentId: 's002',
          passengerId: 'p002',
          seat: '73B',
          seatType: 'World Business',
          productInfo: [
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
      priceInfo: [
        {
          title: 'Fuel surcharge',
          amount: '1597',
          currency: 'USD',
        },
      ],
      basePrice: '12206',
      tax: '200',
      totalPrice: '14003',
      currency: 'USD',
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'airline_itinerary',
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
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendAirlineUpdateTemplate', () => {
  it('should call messages api with airline flight update template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendAirlineUpdateTemplate(USER_ID, {
      introMessage: 'Your flight is delayed',
      updateType: 'delay',
      locale: 'en_US',
      pnrNumber: 'CF23G2',
      updateFlightInfo: {
        flightNumber: 'KL123',
        departureAirport: {
          airportCode: 'SFO',
          city: 'San Francisco',
          terminal: 'T4',
          gate: 'G8',
        },
        arrivalAirport: {
          airportCode: 'AMS',
          city: 'Amsterdam',
          terminal: 'T4',
          gate: 'G8',
        },
        flightSchedule: {
          boardingTime: '2015-12-26T10:30',
          departureTime: '2015-12-26T11:30',
          arrivalTime: '2015-12-27T07:30',
        },
      },
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'airline_update',
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
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});

describe('#sendOneTimeNotifReqTemplate', () => {
  it('should call messages api with one time notif req template', async () => {
    const { client, mock } = createMock();

    const reply = {
      recipient_id: USER_ID,
      message_id: 'mid.1489394984387:3dd22de509',
    };

    let url;
    let data;
    mock.onPost().reply((config) => {
      url = config.url;
      data = config.data;
      return [200, reply];
    });

    const res = await client.sendOneTimeNotifReqTemplate(USER_ID, {
      title: '<TITLE_TEXT>',
      payload: '<USER_DEFINED_PAYLOAD>',
    });

    expect(url).toEqual(`/me/messages?access_token=${ACCESS_TOKEN}`);
    expect(JSON.parse(data)).toEqual({
      messaging_type: 'UPDATE',
      recipient: {
        id: USER_ID,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'one_time_notif_req',
            title: '<TITLE_TEXT>',
            payload: '<USER_DEFINED_PAYLOAD>',
          },
        },
      },
    });

    expect(res).toEqual({
      recipientId: USER_ID,
      messageId: 'mid.1489394984387:3dd22de509',
    });
  });
});
