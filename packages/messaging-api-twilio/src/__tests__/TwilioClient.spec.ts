import { rest } from 'msw';

import TwilioClient from '../TwilioClient';

import {
  constants,
  getCurrentContext,
  setupTwilioServer,
} from './testing-library';

const twilioServer = setupTwilioServer();

it('should support origin', async () => {
  twilioServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({}));
    })
  );

  const twilio = new TwilioClient({
    accountSid: constants.ACCOUNT_SID,
    authToken: constants.AUTH_TOKEN,
    phoneNumber: 'whatsapp:+14155238886',
    origin: 'https://mydummytestserver.com',
  });

  await twilio.messages.create({
    to: 'whatsapp:+15005550006',
    body: 'This is a message that I want to send over WhatsApp with Twilio',
  });

  expect(getCurrentContext().request?.url.href).toBe(
    'https://mydummytestserver.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const twilio = new TwilioClient({
    accountSid: constants.ACCOUNT_SID,
    authToken: constants.AUTH_TOKEN,
    phoneNumber: 'whatsapp:+14155238886',
    onRequest,
  });

  await twilio.messages.create({
    to: 'whatsapp:+15005550006',
    body: 'This is a message that I want to send over WhatsApp with Twilio',
  });

  expect(onRequest).toBeCalledWith({
    body: {
      body: 'This is a message that I want to send over WhatsApp with Twilio',
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+15005550006',
    },
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
    url: 'https://ACCOUNT_SID:AUTH_TOKEN@api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json',
  });
});

it('should support #messages.create', async () => {
  const twilio = new TwilioClient({
    accountSid: constants.ACCOUNT_SID,
    authToken: constants.AUTH_TOKEN,
    phoneNumber: 'whatsapp:+14155238886',
  });

  const res = await twilio.messages.create({
    to: 'whatsapp:+15005550006',
    body: 'This is a message that I want to send over WhatsApp with Twilio',
    statusCallback: 'https://abc1234.free.beeceptor.com',
    applicationSid: 'APPLICATION_SID',
    maxPrice: 10,
    provideFeedback: true,
    attempt: 2,
    validityPeriod: 7200,
    forceDelivery: false,
    contentRetention: 'retain',
    addressRetention: 'retain',
    smartEncoded: true,
    persistentAction: [],
    messagingServiceSid: 'MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    mediaUrl: [
      'https://example.com/img1.gif',
      'https://example.com/img2.png',
      'https://example.com/img3.jpeg',
    ],
  });

  expect(res).toEqual({
    accountSid: 'ACCOUNT_SID',
    apiVersion: '2010-04-01',
    body: 'This is a message that I want to send over WhatsApp with Twilio',
    dateCreated: expect.any(String),
    dateSent: expect.any(String),
    dateUpdated: expect.any(String),
    direction: 'outbound-api',
    errorCode: null,
    errorMessage: null,
    from: 'whatsapp:+14155238886',
    messagingServiceSid: 'MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    numMedia: '0',
    numSegments: '1',
    price: null,
    priceUnit: null,
    sid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    status: 'sent',
    subresourceUris: {
      media:
        '/2010-04-01/Accounts/ACCOUNT_SID/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json',
    },
    to: 'whatsapp:+15005550006',
    uri: '/2010-04-01/Accounts/ACCOUNT_SID/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://ACCOUNT_SID:AUTH_TOKEN@api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json'
  );
  expect(request?.body).toEqual(
    'From=whatsapp%3A%2B14155238886&To=whatsapp%3A%2B15005550006&Body=This%20is%20a%20message%20that%20I%20want%20to%20send%20over%20WhatsApp%20with%20Twilio&StatusCallback=https%3A%2F%2Fabc1234.free.beeceptor.com&ApplicationSid=APPLICATION_SID&MaxPrice=10&ProvideFeedback=true&Attempt=2&ValidityPeriod=7200&ForceDelivery=false&ContentRetention=retain&AddressRetention=retain&SmartEncoded=true&MessagingServiceSid=MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&MediaUrl=https%3A%2F%2Fexample.com%2Fimg1.gif&MediaUrl=https%3A%2F%2Fexample.com%2Fimg2.png&MediaUrl=https%3A%2F%2Fexample.com%2Fimg3.jpeg'
  );
  expect(request?.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded'
  );
  expect(request?.url.username).toBe('ACCOUNT_SID');
  expect(request?.url.password).toBe('AUTH_TOKEN');
});

it('should handle request errors', async () => {
  twilioServer.use(
    rest.post<string>(
      `https://api.twilio.com/2010-04-01/Accounts/${constants.ACCOUNT_SID}/Messages.json`,
      (req, res, ctx) => {
        getCurrentContext().request = req;
        return res(
          ctx.status(400),
          ctx.json({
            code: 21211,
            message: "The 'To' number ? is not a valid phone number.",
            more_info: 'https://www.twilio.com/docs/errors/21211',
            status: 400,
          })
        );
      }
    )
  );

  const twilio = new TwilioClient({
    accountSid: constants.ACCOUNT_SID,
    authToken: constants.AUTH_TOKEN,
    phoneNumber: 'whatsapp:+14155238886',
  });

  await expect(
    twilio.messages.create({
      to: '?',
      body: 'This is a message that I want to send over WhatsApp with Twilio',
    })
  ).rejects.toThrowError(
    "Twilio API - 21211 The 'To' number ? is not a valid phone number. https://www.twilio.com/docs/errors/21211"
  );
});
