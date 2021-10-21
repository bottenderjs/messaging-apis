import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #answerInlineQuery', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerInlineQuery({
    inlineQueryId: 'INLINE_QUERY_ID',
    results: [
      {
        type: 'photo',
        id: 'UNIQUE_ID',
        photoFileId: 'FILEID',
        title: 'PHOTO_TITLE',
      },
      {
        type: 'audio',
        id: 'UNIQUE_ID',
        audioFileId: 'FILEID',
        caption: 'AUDIO_TITLE',
      },
    ],
    cacheTime: 1000,
    isPersonal: true,
    nextOffset: '',
    switchPmText: '',
    switchPmParameter: '',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerInlineQuery'
  );
  expect(request?.body).toEqual({
    inline_query_id: 'INLINE_QUERY_ID',
    results: [
      {
        type: 'photo',
        id: 'UNIQUE_ID',
        photo_file_id: 'FILEID',
        title: 'PHOTO_TITLE',
      },
      {
        type: 'audio',
        id: 'UNIQUE_ID',
        audio_file_id: 'FILEID',
        caption: 'AUDIO_TITLE',
      },
    ],
    cache_time: 1000,
    is_personal: true,
    next_offset: '',
    switch_pm_text: '',
    switch_pm_parameter: '',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #answerInlineQuery shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.answerInlineQuery(
    'INLINE_QUERY_ID',
    [
      {
        type: 'photo',
        id: 'UNIQUE_ID',
        photoFileId: 'FILEID',
        title: 'PHOTO_TITLE',
      },
      {
        type: 'audio',
        id: 'UNIQUE_ID',
        audioFileId: 'FILEID',
        caption: 'AUDIO_TITLE',
      },
    ],
    {
      cacheTime: 1000,
      isPersonal: true,
      nextOffset: '',
      switchPmText: '',
      switchPmParameter: '',
    }
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/answerInlineQuery'
  );
  expect(request?.body).toEqual({
    inline_query_id: 'INLINE_QUERY_ID',
    results: [
      {
        type: 'photo',
        id: 'UNIQUE_ID',
        photo_file_id: 'FILEID',
        title: 'PHOTO_TITLE',
      },
      {
        type: 'audio',
        id: 'UNIQUE_ID',
        audio_file_id: 'FILEID',
        caption: 'AUDIO_TITLE',
      },
    ],
    cache_time: 1000,
    is_personal: true,
    next_offset: '',
    switch_pm_text: '',
    switch_pm_parameter: '',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
