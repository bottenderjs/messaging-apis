import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#answerInlineQuery', () => {
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  it('should send answers to an inline query', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/answerInlineQuery', {
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
      })
      .reply(200, reply);

    const res = await client.answerInlineQuery(
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
      }
    );
    expect(res).toEqual(result);
  });
});

describe('#answerCallbackQuery', () => {
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  it('should send answers to an callback query', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/answerCallbackQuery', {
        callback_query_id: 'CALLBACK_QUERY_ID',
        text: 'text',
        show_alert: true,
        url: 'http://example.com/',
        cache_time: 1000,
      })
      .reply(200, reply);

    const res = await client.answerCallbackQuery('CALLBACK_QUERY_ID', {
      text: 'text',
      showAlert: true,
      url: 'http://example.com/',
      cacheTime: 1000,
    });
    expect(res).toEqual(result);
  });
});
