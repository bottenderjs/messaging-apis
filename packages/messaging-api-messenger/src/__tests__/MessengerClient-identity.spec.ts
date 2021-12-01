import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #getUserProfile', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getUserProfile(constants.USER_ID);

  expect(res).toEqual({
    id: 'USER_ID',
    firstName: 'Kevin',
    lastName: 'Durant',
    profilePic: 'https://example.com/pic.png',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/USER_ID?fields=id,name,first_name,last_name,profile_pic&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getUserProfile with custom fields', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getUserProfile(constants.USER_ID, {
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
  });

  expect(res).toEqual({
    id: 'USER_ID',
    firstName: 'Kevin',
    lastName: 'Durant',
    profilePic: 'https://example.com/pic.png',
    locale: 'en_US',
    timezone: 8,
    gender: 'male',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/USER_ID?fields=id,name,first_name,last_name,profile_pic,locale,timezone,gender&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support getIdsForApps', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appSecret: constants.APP_SECRET,
  });

  const res = await messenger.getIdsForApps({
    userId: constants.USER_ID,
    appSecret: constants.APP_SECRET,
    page: '5678',
  });

  expect(res).toEqual({
    data: [
      {
        id: '10152368852405295',
        app: {
          category: 'Business',
          link: 'https://www.facebook.com/games/?app_id=1419232575008550',
          name: "John's Game App",
          id: '1419232575008550',
        },
      },
      {
        id: '645195294',
        app: {
          link: 'https://apps.facebook.com/johnsmovieappns/',
          name: 'JohnsMovieApp',
          namespace: 'johnsmovieappns',
          id: '259773517400382',
        },
      },
    ],
    paging: {
      cursors: {
        before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
        after: 'NDAwMDExOTA3MDM1ODMwA',
      },
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/USER_ID/ids_for_apps?access_token=ACCESS_TOKEN&appsecret_proof=a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c&page=5678'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support getIdsForPages', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
    appSecret: constants.APP_SECRET,
  });

  const res = await messenger.getIdsForPages({
    userId: constants.USER_ID,
    appSecret: constants.APP_SECRET,
    app: '5678',
  });

  expect(res).toEqual({
    data: [
      {
        id: '12345123', // The psid for the user for that page
        page: {
          category: 'Musician',
          link: 'https://www.facebook.com/Johns-Next-Great-Thing-380374449010653/',
          name: "John's Next Great Thing",
          id: '380374449010653',
        },
      },
    ],
    paging: {
      cursors: {
        before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
        after: 'NDAwMDExOTA3MDM1ODMwA',
      },
    },
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/USER_ID/ids_for_pages?access_token=ACCESS_TOKEN&appsecret_proof=a727796e1b4e9053916f82f7a0b90f240862b289bb3c9ac5ff6e2231e18a491c&app=5678'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
