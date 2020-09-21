import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';
import * as TelegramTypes from '../TelegramTypes';

const { ParseMode } = TelegramTypes;

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = (): { client: TelegramClient; mock: MockAdapter } => {
  const client = new TelegramClient({
    accessToken: ACCESS_TOKEN,
  });
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('updating api', () => {
  describe('#editMessageText', () => {
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499402829,
      text: 'new_text',
    };
    const reply = {
      ok: true,
      result: {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499402829,
        text: 'new_text',
      },
    };

    it('should change message text with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageText', {
          text: 'new_text',
          chat_id: 427770117,
          message_id: 66,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        })
        .reply(200, reply);

      const res = await client.editMessageText('new_text', {
        chat_id: 427770117,
        message_id: 66,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });

      expect(res).toEqual(result);
    });

    it('should change message text with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageText', {
          text: 'new_text',
          chat_id: 427770117,
          message_id: 66,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        })
        .reply(200, reply);

      const res = await client.editMessageText('new_text', {
        chatId: 427770117,
        messageId: 66,
        parseMode: ParseMode.Markdown,
        disableWebPagePreview: true,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#editMessageCaption', () => {
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499403678,
      audio: {
        duration: 108,
        mimeType: 'audio/mpeg',
        title: 'Song_Title',
        performer: 'Song_Performer',
        fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
        fileSize: 1739320,
      },
      caption: 'new_caption',
    };
    const reply = {
      ok: true,
      result: {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499403678,
        audio: {
          duration: 108,
          mime_type: 'audio/mpeg',
          title: 'Song_Title',
          performer: 'Song_Performer',
          file_id: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
          file_size: 1739320,
        },
        caption: 'new_caption',
      },
    };

    it('should change message caption with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageCaption', {
          caption: 'new_caption',
          chat_id: 427770117,
          message_id: 66,
          parse_mode: 'Markdown',
        })
        .reply(200, reply);

      const res = await client.editMessageCaption('new_caption', {
        chat_id: 427770117,
        message_id: 66,
        parse_mode: 'Markdown',
      });

      expect(res).toEqual(result);
    });

    it('should change message caption with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageCaption', {
          caption: 'new_caption',
          chat_id: 427770117,
          message_id: 66,
          parse_mode: 'Markdown',
        })
        .reply(200, reply);

      const res = await client.editMessageCaption('new_caption', {
        chatId: 427770117,
        messageId: 66,
        parseMode: ParseMode.Markdown,
      });

      expect(res).toEqual(result);
    });
  });

  describe('#editMessageMedia', () => {
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499403678,
      audio: {
        duration: 108,
        mimeType: 'audio/mpeg',
        title: 'Song_Title',
        performer: 'Song_Performer',
        fileId: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
        fileSize: 1739320,
      },
      caption: 'new_caption',
    };
    const reply = {
      ok: true,
      result: {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499403678,
        audio: {
          duration: 108,
          mime_type: 'audio/mpeg',
          title: 'Song_Title',
          performer: 'Song_Performer',
          file_id: 'CQADBAADgJMAAkIeZAdcAAGmY-4zEngC',
          file_size: 1739320,
        },
        caption: 'new_caption',
      },
    };

    it('should change message media with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageMedia', {
          media: {
            type: 'audio',
            media: 'https://example.com/audio.mp3',
            caption: 'caption',
            parse_mode: 'Markdown',
            duration: 1,
            performer: 'performer',
            title: 'title',
          },
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageMedia(
        {
          type: 'audio',
          media: 'https://example.com/audio.mp3',
          caption: 'caption',
          parse_mode: 'Markdown',
          duration: 1,
          performer: 'performer',
          title: 'title',
        },
        {
          chat_id: 427770117,
          message_id: 66,
        }
      );

      expect(res).toEqual(result);
    });

    it('should change message media with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageMedia', {
          media: {
            type: 'audio',
            media: 'https://example.com/audio.mp3',
            caption: 'caption',
            parse_mode: 'Markdown',
            duration: 1,
            performer: 'performer',
            title: 'title',
          },
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageMedia(
        {
          type: 'audio',
          media: 'https://example.com/audio.mp3',
          caption: 'caption',
          parseMode: ParseMode.Markdown,
          duration: 1,
          performer: 'performer',
          title: 'title',
        },
        {
          chatId: 427770117,
          messageId: 66,
        }
      );

      expect(res).toEqual(result);
    });
  });

  describe('#editMessageReplyMarkup', () => {
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499402829,
      text: 'hi',
    };
    const reply = {
      ok: true,
      result: {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499402829,
        text: 'hi',
      },
    };

    it('should change message reply_markup with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageReplyMarkup', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'new_button_1' }, { text: 'new_button_2' }],
            ],
          },
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [{ text: 'new_button_1' }, { text: 'new_button_2' }],
          ],
        },
        {
          chat_id: 427770117,
          message_id: 66,
        }
      );

      expect(res).toEqual(result);
    });

    it('should change message reply_markup with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageReplyMarkup', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'new_button_1' }, { text: 'new_button_2' }],
            ],
          },
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageReplyMarkup(
        {
          inlineKeyboard: [
            [{ text: 'new_button_1' }, { text: 'new_button_2' }],
          ],
        },
        {
          chatId: 427770117,
          messageId: 66,
        }
      );

      expect(res).toEqual(result);
    });
  });

  describe('#deleteMessage', () => {
    it('should delete message', async () => {
      const { client, mock } = createMock();
      const result = true;
      const reply = {
        ok: true,
        result,
      };

      mock
        .onPost('/deleteMessage', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.deleteMessage(427770117, 66);

      expect(res).toEqual(result);
    });
  });

  describe('#editMessageLiveLocation', () => {
    const result = {
      messageId: 66,
      from: {
        id: 313534466,
        firstName: 'first',
        username: 'a_bot',
      },
      chat: {
        id: 427770117,
        firstName: 'first',
        lastName: 'last',
        type: 'private',
      },
      date: 1499402829,
      location: {
        latitude: 11,
        longitude: 22,
      },
    };
    const reply = {
      ok: true,
      result: {
        message_id: 66,
        from: {
          id: 313534466,
          first_name: 'first',
          username: 'a_bot',
        },
        chat: {
          id: 427770117,
          first_name: 'first',
          last_name: 'last',
          type: 'private',
        },
        date: 1499402829,
        location: {
          latitude: 11,
          longitude: 22,
        },
      },
    };

    it('should edit live location message with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageLiveLocation', {
          latitude: 11,
          longitude: 22,
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageLiveLocation(
        {
          latitude: 11,
          longitude: 22,
        },
        {
          chat_id: 427770117,
          message_id: 66,
        }
      );

      expect(res).toEqual(result);
    });
    it('should edit live location message with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/editMessageLiveLocation', {
          latitude: 11,
          longitude: 22,
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageLiveLocation(
        {
          latitude: 11,
          longitude: 22,
        },
        {
          chatId: 427770117,
          messageId: 66,
        }
      );

      expect(res).toEqual(result);
    });
  });

  describe('#stopPoll', () => {
    const result = {
      id: '6107039600482451458',
      question: 'q',
      options: [
        {
          text: 'a',
          voterCount: 1,
        },
        {
          text: 'b',
          voterCount: 0,
        },
      ],
      isClosed: true,
    };
    const reply = {
      ok: true,
      result: {
        id: '6107039600482451458',
        question: 'q',
        options: [
          {
            text: 'a',
            voter_count: 1,
          },
          {
            text: 'b',
            voter_count: 0,
          },
        ],
        is_closed: true,
      },
    };

    it('should stop poll', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/stopPoll', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.stopPoll(427770117, 66);

      expect(res).toEqual(result);
    });
  });
});
