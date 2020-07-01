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

describe('game api', () => {
  describe('sendGame', () => {
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
      game: {
        title: 'Mario Bros.',
        description: 'Mario Bros. is fun!',
        photo: [
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
            fileSize: 14650,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
            fileSize: 39019,
            width: 320,
            height: 320,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
            fileSize: 132470,
            width: 640,
            height: 640,
          },
        ],
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
        game: {
          title: 'Mario Bros.',
          description: 'Mario Bros. is fun!',
          photo: [
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
              file_size: 14650,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
              file_size: 39019,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
              file_size: 132470,
              width: 640,
              height: 640,
            },
          ],
        },
      },
    };

    it('should send a game with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/sendGame', {
          chat_id: 427770117,
          game_short_name: 'Mario Bros.',
          disable_notification: true,
          reply_to_message_id: 9527,
        })
        .reply(200, reply);

      const res = await client.sendGame(427770117, 'Mario Bros.', {
        disable_notification: true,
        reply_to_message_id: 9527,
      });

      expect(res).toEqual(result);
    });

    it('should send a game with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/sendGame', {
          chat_id: 427770117,
          game_short_name: 'Mario Bros.',
          disable_notification: true,
          reply_to_message_id: 9527,
        })
        .reply(200, reply);

      const res = await client.sendGame(427770117, 'Mario Bros.', {
        disableNotification: true,
        replyToMessageId: 9527,
      });

      expect(res).toEqual(result);
    });
  });

  describe('setGameScore', () => {
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
      game: {
        title: 'Mario Bros.',
        description: 'Mario Bros. is fun!',
        photo: [
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
            fileSize: 14650,
            width: 160,
            height: 160,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
            fileSize: 39019,
            width: 320,
            height: 320,
          },
          {
            fileId: 'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
            fileSize: 132470,
            width: 640,
            height: 640,
          },
        ],
        text: 'User 427770117 score is 999.',
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
        game: {
          title: 'Mario Bros.',
          description: 'Mario Bros. is fun!',
          photo: [
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABHahi76pN-aO0UoDA050',
              file_size: 14650,
              width: 160,
              height: 160,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABKCfooqTgFUX0EoD5B1C',
              file_size: 39019,
              width: 320,
              height: 320,
            },
            {
              file_id:
                'AgADBAADGTo4Gz8cZAeR-ouu4XBx78EeqRkABPL_pC9K3UpI0koD1B1C',
              file_size: 132470,
              width: 640,
              height: 640,
            },
          ],
          text: 'User 427770117 score is 999.',
        },
      },
    };

    it('should set the score of the specified user in a game with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/setGameScore', {
          user_id: 427770117,
          score: 999,
          force: true,
          disable_edit_message: true,
          message_id: 1,
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.setGameScore(427770117, 999, {
        force: true,
        disable_edit_message: true,
        message_id: 1,
        chat_id: 427770117,
      });

      expect(res).toEqual(result);
    });

    it('should set the score of the specified user in a game with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/setGameScore', {
          user_id: 427770117,
          score: 999,
          force: true,
          disable_edit_message: true,
          message_id: 1,
          chat_id: 427770117,
        })
        .reply(200, reply);

      const res = await client.setGameScore(427770117, 999, {
        force: true,
        disableEditMessage: true,
        messageId: 1,
        chatId: 427770117,
      });

      expect(res).toEqual(result);
    });
  });

  describe('getGameHighScores', () => {
    const result = [
      {
        position: 1,
        user: {
          id: 427770117,
          isBot: false,
          firstName: 'first',
        },
        score: 999,
      },
    ];
    const reply = {
      ok: true,
      result: [
        {
          position: 1,
          user: {
            id: 427770117,
            is_bot: false,
            first_name: 'first',
          },
          score: 999,
        },
      ],
    };

    it('should get data for high score tables with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/getGameHighScores', {
          user_id: 427770117,
          chat_id: 427770117,
          message_id: 1,
        })
        .reply(200, reply);

      const res = await client.getGameHighScores(427770117, {
        // @ts-expect-error
        chat_id: 427770117,
        message_id: 1,
      });

      expect(res).toEqual(result);
    });

    it('should get data for high score tables with camelcase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/getGameHighScores', {
          user_id: 427770117,
          chat_id: 427770117,
          message_id: 1,
        })
        .reply(200, reply);

      const res = await client.getGameHighScores(427770117, {
        chatId: 427770117,
        messageId: 1,
      });

      expect(res).toEqual(result);
    });
  });
});
