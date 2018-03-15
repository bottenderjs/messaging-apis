import MockAdapter from 'axios-mock-adapter';

import TelegramClient from '../TelegramClient';

const ACCESS_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';

const createMock = () => {
  const client = new TelegramClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('updating api', () => {
  describe('#editMessageText', () => {
    it('should change message text', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/editMessageText', {
          text: 'new_text',
          message_id: 66,
          disable_web_page_preview: true,
        })
        .reply(200, reply);

      const res = await client.editMessageText('new_text', {
        message_id: 66,
        disable_web_page_preview: true,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageCaption', () => {
    it('should change message caption', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/editMessageCaption', {
          caption: 'new_caption',
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageCaption('new_caption', {
        message_id: 66,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageReplyMarkup', () => {
    it('should change message reply_markup', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/editMessageReplyMarkup', {
          reply_markup: {
            keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageReplyMarkup(
        {
          keyboard: [[{ text: 'new_button_1' }, { text: 'new_button_2' }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
        { message_id: 66 }
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteMessage', () => {
    it('should delete message', async () => {
      const { client, mock } = createMock();
      const reply = {
        ok: true,
        result: true,
      };

      mock
        .onPost('/deleteMessage', {
          chat_id: 427770117,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.deleteMessage(427770117, 66);

      expect(res).toEqual(reply);
    });
  });

  describe('#editMessageLiveLocation', () => {
    it('should edit live location message', async () => {
      const { client, mock } = createMock();
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

      mock
        .onPost('/editMessageLiveLocation', {
          latitude: 11,
          longitude: 22,
          message_id: 66,
        })
        .reply(200, reply);

      const res = await client.editMessageLiveLocation(
        {
          latitude: 11,
          longitude: 22,
        },
        { message_id: 66 }
      );

      expect(res).toEqual(reply);
    });
  });
});
