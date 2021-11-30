import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #createPersona', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.createPersona({
    name: 'kpman',
    profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
  });

  expect(res).toEqual({ id: '311884619589478' });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/personas?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    name: 'kpman',
    profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getPersona', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getPersona('311884619589478');

  expect(res).toEqual({
    name: 'kpman',
    profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
    id: '311884619589478',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/311884619589478?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getAllPersonas', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getAllPersonas();

  expect(res).toEqual([
    {
      name: '1',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '1007240332817468',
    },
    {
      name: '2',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '243523459665626',
    },
    {
      name: '3',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '313552169447330',
    },
    {
      name: '4',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '1007240332817468',
    },
    {
      name: '5',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '243523459665626',
    },
    {
      name: '6',
      profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
      id: '313552169447330',
    },
  ]);
});

it('should support #getPersonas', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const cursor =
    'QVFIUmRJYXR4Y3dBN1JpcU5pU0lfLWhZAS0IzMjZADZAWxWYksxLWVHdW1HSnJmV21paEZA3NEl2RW5LY25fRFZAnZAkg2OVBJR0VLZAXIzeFRTZAGFrSldjMVRlV3Fn';

  const res = await messenger.getPersonas(cursor);

  expect(res).toEqual({
    data: [
      {
        name: '4',
        profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
        id: '1007240332817468',
      },
      {
        name: '5',
        profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
        id: '243523459665626',
      },
      {
        name: '6',
        profilePictureUrl: 'https://i.imgur.com/zV6uy4T.jpg',
        id: '313552169447330',
      },
    ],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/personas?access_token=ACCESS_TOKEN&after=QVFIUmRJYXR4Y3dBN1JpcU5pU0lfLWhZAS0IzMjZADZAWxWYksxLWVHdW1HSnJmV21paEZA3NEl2RW5LY25fRFZAnZAkg2OVBJR0VLZAXIzeFRTZAGFrSldjMVRlV3Fn'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deletePersona', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.deletePersona('311884619589478');

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/311884619589478?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
