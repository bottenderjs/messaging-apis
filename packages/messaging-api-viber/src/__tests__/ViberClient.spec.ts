import { rest } from 'msw';

import ViberClient from '../ViberClient';

import {
  constants,
  getCurrentContext,
  setupViberServer,
} from './testing-library';

const viberServer = setupViberServer();

it('should support origin', async () => {
  viberServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(ctx.json({ status: 0, statusMessage: 'ok' }));
    })
  );

  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
    origin: 'https://mydummytestserver.com',
  });

  await viber.getAccountInfo();

  expect(getCurrentContext().request?.url.href).toBe(
    'https://mydummytestserver.com/pa/get_account_info'
  );
});

it('should support onRequest', async () => {
  const onRequest = jest.fn();

  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
    onRequest,
  });

  await viber.getAccountInfo();

  expect(onRequest).toBeCalledWith({
    body: {},
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'X-Viber-Auth-Token':
        '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9',
    },
    method: 'post',
    url: 'https://chatapi.viber.com/pa/get_account_info',
  });
});

it('should handle errors', async () => {
  viberServer.use(
    rest.post('*', (req, res, ctx) => {
      getCurrentContext().request = req;
      return res(
        ctx.json({
          status: 2,
          statusMessage: 'invalidAuthToken',
        })
      );
    })
  );

  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  await expect(viber.getAccountInfo()).rejects.toThrowError(
    'Viber API - 2 invalidAuthToken'
  );
});

it('should support #getAccountInfo', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const res = await viber.getAccountInfo();

  expect(res).toEqual({
    status: 0,
    statusMessage: 'ok',
    id: 'pa:75346594275468546724',
    name: 'account name',
    uri: 'accountUri',
    icon: 'http://example.com',
    background: 'http://example.com',
    category: 'category',
    subcategory: 'sub category',
    location: {
      lon: 0.1,
      lat: 0.2,
    },
    country: 'UK',
    webhook: 'https://my.site.com',
    eventTypes: ['delivered', 'seen'],
    subscribersCount: 35,
    members: [
      {
        id: '01234567890A=',
        name: 'my name',
        avatar: 'http://example.com',
        role: 'admin',
      },
    ],
  });
});

it('should support #getUserDetails', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const res = await viber.getUserDetails('01234567890A=');

  expect(res).toEqual({
    id: '01234567890A=',
    name: 'John McClane',
    avatar: 'http://avatar.example.com',
    country: 'UK',
    language: 'en',
    primaryDeviceOs: 'android 7.1',
    apiVersion: 1,
    viberVersion: '6.5.0',
    mcc: 1,
    mnc: 1,
    deviceType: 'iPhone9,4',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://chatapi.viber.com/pa/get_user_details'
  );
  expect(request?.body).toEqual({ id: '01234567890A=' });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('X-Viber-Auth-Token')).toBe(
    '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9'
  );
});

it('should support #getOnlineStatus', async () => {
  const viber = new ViberClient({
    accessToken: constants.AUTH_TOKEN,
    sender: constants.SENDER,
  });

  const res = await viber.getOnlineStatus([
    '01234567890=',
    '01234567891=',
    '01234567893=',
  ]);

  expect(res).toEqual([
    {
      id: '01234567890=',
      onlineStatus: 0,
      onlineStatusMessage: 'online',
    },
    {
      id: '01234567891=',
      onlineStatus: 1,
      onlineStatusMessage: 'offline',
      lastOnline: 1457764197627,
    },
    {
      id: '01234567893=',
      onlineStatus: 3,
      onlineStatusMessage: 'tryLater',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe('https://chatapi.viber.com/pa/get_online');
  expect(request?.body).toEqual({
    ids: ['01234567890=', '01234567891=', '01234567893='],
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('X-Viber-Auth-Token')).toBe(
    '445da6az1s345z78-dazcczb2542zv51a-e0vc5fva17480im9'
  );
});
