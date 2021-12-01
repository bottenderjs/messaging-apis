import fs from 'fs';
import path from 'path';

import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #uploadAttachment', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadAttachment(
    'image',
    'http://www.yoctol-rocks.com/image.jpg'
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'http://www.yoctol-rocks.com/image.jpg',
          is_reusable: false,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('can upload reusable attachment', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadAttachment(
    'image',
    'http://www.yoctol-rocks.com/image.jpg',
    { isReusable: true }
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'http://www.yoctol-rocks.com/image.jpg',
          is_reusable: true,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('can call api with file stream', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadAttachment(
    'file',
    fs.createReadStream(path.resolve(`${__dirname}/./fixtures/cat.png`))
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  // TODO: assert body after File is supported by msw
  // https://github.com/mswjs/msw/issues/947
  expect(request?.body).toEqual(expect.anything());
  expect(request?.headers.get('Content-Type')).toMatch(
    /^multipart\/form-data;\sboundary=--------------------------\d+$/
  );
});

it('should support #uploadAudio', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadAudio(
    'http://www.yoctol-rocks.com/audio.mp3'
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'audio',
        payload: {
          url: 'http://www.yoctol-rocks.com/audio.mp3',
          is_reusable: false,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #uploadImage', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadImage(
    'http://www.yoctol-rocks.com/image.jpg'
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'http://www.yoctol-rocks.com/image.jpg',
          is_reusable: false,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #uploadVideo', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadVideo(
    'http://www.yoctol-rocks.com/video.mp4'
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'video',
        payload: {
          url: 'http://www.yoctol-rocks.com/video.mp4',
          is_reusable: false,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #uploadFile', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.uploadFile(
    'http://www.yoctol-rocks.com/file.pdf'
  );

  expect(res).toEqual({
    attachmentId: '1854626884821032',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/message_attachments?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    message: {
      attachment: {
        type: 'file',
        payload: {
          url: 'http://www.yoctol-rocks.com/file.pdf',
          is_reusable: false,
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
