import fs from 'fs';

import FormData from 'form-data';

import { MessengerClient } from '..';
import * as MessengerTypes from '../MessengerTypes';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

const quickReplies: MessengerTypes.QuickReply[] = [
  {
    contentType: 'text',
    title: 'Red',
    payload: '<POSTBACK_PAYLOAD>',
    imageUrl: 'http://example.com/img/red.png',
  },
];

setupMessengerServer();

it('should support #sendRequest', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendRequest({
    messagingType: 'UPDATE',
    recipient: {
      id: constants.USER_ID,
    },
    message: {
      text: 'Hello!',
    },
  });

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with default UPDATE messaging_type', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(constants.USER_ID, {
    text: 'Hello!',
  });

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage MESSAGE_TAG messaging_type when tag exists', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    constants.USER_ID,
    {
      text: 'Hello!',
    },
    {
      tag: 'CONFIRMED_EVENT_UPDATE',
    }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'MESSAGE_TAG',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
    },
    tag: 'CONFIRMED_EVENT_UPDATE',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with RESPONSE messaging_type when it provided as messaging_type', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    constants.USER_ID,
    {
      text: 'Hello!',
    },
    {
      messagingType: 'RESPONSE',
    }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'RESPONSE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage using phoneNumber as recipient', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    {
      phoneNumber: '+1(212)555-2368',
      name: { firstName: 'John', lastName: 'Doe' },
    },
    {
      text: 'Hello!',
    }
  );

  expect(res).toEqual({
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      phone_number: '+1(212)555-2368',
      name: { first_name: 'John', last_name: 'Doe' },
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage using userRef as recipient', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    {
      userRef: 'ref',
    },
    {
      text: 'Hello!',
    }
  );

  expect(res).toEqual({
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      user_ref: 'ref',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage using postId as recipient', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    {
      postId: 'post-id',
    },
    {
      text: 'Hello!',
    }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      post_id: 'post-id',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage using commentId as recipient', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(
    {
      commentId: 'comment-id',
    },
    {
      text: 'Hello!',
    }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      comment_id: 'comment-id',
    },
    message: {
      text: 'Hello!',
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendMessage with quickReplies', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendMessage(constants.USER_ID, {
    text: 'Hello!',
    quickReplies,
  });

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAttachment', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendAttachment(constants.USER_ID, {
    type: 'image',
    payload: {
      url: 'https://example.com/pic.png',
    },
  });

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      },
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendText', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendText(constants.USER_ID, 'Hello!', {
    quickReplies,
  });

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      text: 'Hello!',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAudio with audio url', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendAudio(
    constants.USER_ID,
    'https://example.com/audio.mp3',
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'audio',
        payload: {
          url: 'https://example.com/audio.mp3',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAudio with audio attachment payload', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendAudio(
    constants.USER_ID,
    {
      attachmentId: '5566',
    },
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'audio',
        payload: {
          attachment_id: '5566',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendAudio with file stream', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendAudio(
    constants.USER_ID,
    fs.createReadStream('./')
  );

  expect(data).toBeInstanceOf(FormData);

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });
});

it('should support #sendImage with image url', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendImage(
    constants.USER_ID,
    'https://example.com/pic.png',
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: 'https://example.com/pic.png',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendImage with image attachment payload', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendImage(
    constants.USER_ID,
    {
      attachmentId: '5566',
    },
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          attachment_id: '5566',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendImage with file stream', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendImage(
    constants.USER_ID,
    fs.createReadStream('./')
  );

  expect(data).toBeInstanceOf(FormData);

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });
});

it('should support #sendVideo with video url', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendVideo(
    constants.USER_ID,
    'https://example.com/video.mp4',
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'video',
        payload: {
          url: 'https://example.com/video.mp4',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideo with video attachment payload', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendVideo(
    constants.USER_ID,
    {
      attachmentId: '5566',
    },
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'video',
        payload: {
          attachment_id: '5566',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendVideo with file stream', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendVideo(
    constants.USER_ID,
    fs.createReadStream('./')
  );

  expect(data).toBeInstanceOf(FormData);

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });
});

it('should support #sendFile with file url', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendFile(
    constants.USER_ID,
    'https://example.com/word.docx',
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'file',
        payload: {
          url: 'https://example.com/word.docx',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendFile with file attachment payload', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendFile(
    constants.USER_ID,
    {
      attachmentId: '5566',
    },
    { quickReplies }
  );

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    messaging_type: 'UPDATE',
    recipient: {
      id: 'USER_ID',
    },
    message: {
      attachment: {
        type: 'file',
        payload: {
          attachment_id: '5566',
        },
      },
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: '<POSTBACK_PAYLOAD>',
          image_url: 'http://example.com/img/red.png',
        },
      ],
    },
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #sendFile with file stream', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendFile(
    constants.USER_ID,
    fs.createReadStream('./')
  );

  expect(data).toBeInstanceOf(FormData);

  expect(res).toEqual({
    recipientId: 'USER_ID',
    messageId: 'mid.1489394984387:3dd22de509',
  });
});

it('should support #sendSenderAction', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.sendSenderAction(constants.USER_ID, 'typing_on');

  expect(res).toEqual({
    recipientId: 'USER_ID',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: 'USER_ID',
    },
    sender_action: 'typing_on',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #markSeen', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.markSeen(constants.USER_ID);

  expect(res).toEqual({
    recipientId: 'USER_ID',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: 'USER_ID',
    },
    sender_action: 'mark_seen',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #typingOn', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.typingOn(constants.USER_ID);

  expect(res).toEqual({
    recipientId: 'USER_ID',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: 'USER_ID',
    },
    sender_action: 'typing_on',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #typingOff', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.typingOff(constants.USER_ID);

  expect(res).toEqual({
    recipientId: 'USER_ID',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/messages?access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.body).toEqual({
    recipient: {
      id: 'USER_ID',
    },
    sender_action: 'typing_off',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
