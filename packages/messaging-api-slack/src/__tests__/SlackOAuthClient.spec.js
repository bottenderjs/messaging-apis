import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';
const CHANNEL = 'C1234567890';
const USER = 'U56781234';

const createMock = () => {
  const client = new SlackOAuthClient(TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#callMethod', () => {
  it('should call slack api', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.callMethod('chat.postMessage', {
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should call slack api with custom token', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          token: 'custom token',
          channel: CHANNEL,
          text: 'hello',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.callMethod('chat.postMessage', {
      token: 'custom token',
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should throw if slack api return not ok', async () => {
    expect.assertions(1);
    const { client, mock } = createMock();

    const reply = {
      ok: false,
      error: 'something wrong',
      ts: '1405895017.000506',
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    try {
      await client.callMethod('chat.postMessage', {
        channel: CHANNEL,
        text: 'hello',
      });
    } catch (err) {
      expect(err.message).toEqual('Slack API - something wrong');
    }
  });
});

describe('#postMessage', () => {
  it('should call chat.postMessage with channel and text message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, { text: 'hello' });

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and text and attachments message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(
      CHANNEL,
      {
        text: 'hello',
        attachments: [
          {
            text: 'Choose a game to play',
            fallback: 'You are unable to choose a game',
            callback_id: 'wopr_game',
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: [
              {
                name: 'game',
                text: 'Chess',
                type: 'button',
                value: 'chess',
              },
              {
                name: 'game',
                text: "Falken's Maze",
                type: 'button',
                value: 'maze',
              },
              {
                name: 'game',
                text: 'Thermonuclear War',
                style: 'danger',
                type: 'button',
                value: 'war',
                confirm: {
                  title: 'Are you sure?',
                  text: "Wouldn't you prefer a good game of chess?",
                  ok_text: 'Yes',
                  dismiss_text: 'No',
                },
              },
            ],
          },
        ],
      },
      { as_user: true }
    );

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and attachments message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(
      CHANNEL,
      {
        attachments: [
          {
            text: 'Choose a game to play',
            fallback: 'You are unable to choose a game',
            callback_id: 'wopr_game',
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: [
              {
                name: 'game',
                text: 'Chess',
                type: 'button',
                value: 'chess',
              },
              {
                name: 'game',
                text: "Falken's Maze",
                type: 'button',
                value: 'maze',
              },
              {
                name: 'game',
                text: 'Thermonuclear War',
                style: 'danger',
                type: 'button',
                value: 'war',
                confirm: {
                  title: 'Are you sure?',
                  text: "Wouldn't you prefer a good game of chess?",
                  ok_text: 'Yes',
                  dismiss_text: 'No',
                },
              },
            ],
          },
        ],
      },
      { as_user: true }
    );

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello');

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and text and optional options, including custom token', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          as_user: true,
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello', {
      as_user: true,
      token: 'custom token',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with optional options and not parse attachments string', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello', {
      attachments:
        '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
      as_user: true,
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with optional options and parse attachments to string', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello', {
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callback_id: 'wopr_game',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'game',
              text: 'Chess',
              type: 'button',
              value: 'chess',
            },
            {
              name: 'game',
              text: "Falken's Maze",
              type: 'button',
              value: 'maze',
            },
            {
              name: 'game',
              text: 'Thermonuclear War',
              style: 'danger',
              type: 'button',
              value: 'war',
              confirm: {
                title: 'Are you sure?',
                text: "Wouldn't you prefer a good game of chess?",
                ok_text: 'Yes',
                dismiss_text: 'No',
              },
            },
          ],
        },
      ],
      as_user: true,
    });

    expect(res).toEqual(reply);
  });
});

describe('#postEphemeral', () => {
  it('should call chat.postEphemeral with channel, user and text message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(CHANNEL, USER, { text: 'hello' });

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with channel, user and text and attachments message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(
      CHANNEL,
      USER,
      {
        text: 'hello',
        attachments: [
          {
            text: 'Choose a game to play',
            fallback: 'You are unable to choose a game',
            callback_id: 'wopr_game',
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: [
              {
                name: 'game',
                text: 'Chess',
                type: 'button',
                value: 'chess',
              },
              {
                name: 'game',
                text: "Falken's Maze",
                type: 'button',
                value: 'maze',
              },
              {
                name: 'game',
                text: 'Thermonuclear War',
                style: 'danger',
                type: 'button',
                value: 'war',
                confirm: {
                  title: 'Are you sure?',
                  text: "Wouldn't you prefer a good game of chess?",
                  ok_text: 'Yes',
                  dismiss_text: 'No',
                },
              },
            ],
          },
        ],
      },
      { as_user: true }
    );

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with channel, user and attachments message', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(
      CHANNEL,
      USER,
      {
        attachments: [
          {
            text: 'Choose a game to play',
            fallback: 'You are unable to choose a game',
            callback_id: 'wopr_game',
            color: '#3AA3E3',
            attachment_type: 'default',
            actions: [
              {
                name: 'game',
                text: 'Chess',
                type: 'button',
                value: 'chess',
              },
              {
                name: 'game',
                text: "Falken's Maze",
                type: 'button',
                value: 'maze',
              },
              {
                name: 'game',
                text: 'Thermonuclear War',
                style: 'danger',
                type: 'button',
                value: 'war',
                confirm: {
                  title: 'Are you sure?',
                  text: "Wouldn't you prefer a good game of chess?",
                  ok_text: 'Yes',
                  dismiss_text: 'No',
                },
              },
            ],
          },
        ],
      },
      { as_user: true }
    );

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with channel, user and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(CHANNEL, USER, 'hello');

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with channel, user and text and optional options, including custom token', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          as_user: true,
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(CHANNEL, USER, 'hello', {
      as_user: true,
      token: 'custom token',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with optional options and not parse attachments string', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(CHANNEL, USER, 'hello', {
      attachments:
        '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
      as_user: true,
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.postEphemeral with optional options and parse attachments to string', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postEphemeral',
        querystring.stringify({
          channel: CHANNEL,
          user: USER,
          text: 'hello',
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postEphemeral(CHANNEL, USER, 'hello', {
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callback_id: 'wopr_game',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'game',
              text: 'Chess',
              type: 'button',
              value: 'chess',
            },
            {
              name: 'game',
              text: "Falken's Maze",
              type: 'button',
              value: 'maze',
            },
            {
              name: 'game',
              text: 'Thermonuclear War',
              style: 'danger',
              type: 'button',
              value: 'war',
              confirm: {
                title: 'Are you sure?',
                text: "Wouldn't you prefer a good game of chess?",
                ok_text: 'Yes',
                dismiss_text: 'No',
              },
            },
          ],
        },
      ],
      as_user: true,
    });

    expect(res).toEqual(reply);
  });
});

describe('#getUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'dXNlcjpVMEc5V0ZYTlo=',
      },
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserList();

    expect(res).toEqual({ members, next: 'dXNlcjpVMEc5V0ZYTlo=' });
  });

  it('support no cursor in reply', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserList();

    expect(res).toEqual({ members, next: undefined });
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'dXNlcjpVMEc5V0ZYTlo=',
      },
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserList({ token: 'custom token' });

    expect(res).toEqual({ members, next: 'dXNlcjpVMEc5V0ZYTlo=' });
  });

  it('support cursor and custom token in options', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'dXNlcjpVMEc5V0ZYTlo=',
      },
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: 'cursor',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserList({
      cursor: 'cursor',
      token: 'custom token',
    });

    expect(res).toEqual({ members, next: 'dXNlcjpVMEc5V0ZYTlo=' });
  });
});

describe('#getAllUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply1 = {
      ok: true,
      members: [members[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [members[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: undefined,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: 'cursor1',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllUserList();

    expect(res).toEqual(members);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply1 = {
      ok: true,
      members: [members[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [members[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: undefined,
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: 'cursor1',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllUserList({ token: 'custom token' });

    expect(res).toEqual(members);
  });
});

describe('#getUserInfo', () => {
  it('should call users.info with user id', async () => {
    const { client, mock } = createMock();

    const user = {
      id: 'U023BECGF',
      name: 'bobby',
      deleted: false,
      color: '9f69e7',
      profile: {
        avatar_hash: 'ge3b51ca72de',
        current_status: ':mountain_railway: riding a train',
        first_name: 'Bobby',
        last_name: 'Tables',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        email: 'bobby@slack.com',
        skype: 'my-skype-name',
        phone: '+1 (123) 456 7890',
        image_24: 'https://...',
        image_32: 'https://...',
        image_48: 'https://...',
        image_72: 'https://...',
        image_192: 'https://...',
      },
      is_admin: true,
      is_owner: true,
      updated: 1490054400,
      has_2fa: true,
    };

    const reply = {
      ok: true,
      user,
    };

    mock
      .onPost(
        '/users.info',
        querystring.stringify({
          user: 'U023BECGF',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserInfo('U023BECGF');

    expect(res).toEqual(user);
  });

  it('cupport custom token in options', async () => {
    const { client, mock } = createMock();

    const user = {
      id: 'U023BECGF',
      name: 'bobby',
      deleted: false,
      color: '9f69e7',
      profile: {
        avatar_hash: 'ge3b51ca72de',
        current_status: ':mountain_railway: riding a train',
        first_name: 'Bobby',
        last_name: 'Tables',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        email: 'bobby@slack.com',
        skype: 'my-skype-name',
        phone: '+1 (123) 456 7890',
        image_24: 'https://...',
        image_32: 'https://...',
        image_48: 'https://...',
        image_72: 'https://...',
        image_192: 'https://...',
      },
      is_admin: true,
      is_owner: true,
      updated: 1490054400,
      has_2fa: true,
    };

    const reply = {
      ok: true,
      user,
    };

    mock
      .onPost(
        '/users.info',
        querystring.stringify({
          user: 'U023BECGF',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserInfo('U023BECGF', {
      token: 'custom token',
    });

    expect(res).toEqual(user);
  });
});

describe('#getChannelList', () => {
  it('should call channels.list api', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'C024BE91L',
        name: 'fun',
        created: 1360782804,
        creator: 'U024BE7LH',
        is_archived: false,
        is_member: false,
        num_members: 6,
        topic: {
          value: 'Fun times',
          creator: 'U024BE7LV',
          last_set: 1369677212,
        },
        purpose: {
          value: 'This channel is for fun',
          creator: 'U024BE7LH',
          last_set: 1360782804,
        },
      },
    ];

    const reply = {
      ok: true,
      channels,
    };

    mock
      .onPost(
        '/channels.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelList();

    expect(res).toEqual(channels);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'C024BE91L',
        name: 'fun',
        created: 1360782804,
        creator: 'U024BE7LH',
        is_archived: false,
        is_member: false,
        num_members: 6,
        topic: {
          value: 'Fun times',
          creator: 'U024BE7LV',
          last_set: 1369677212,
        },
        purpose: {
          value: 'This channel is for fun',
          creator: 'U024BE7LH',
          last_set: 1360782804,
        },
      },
    ];

    const reply = {
      ok: true,
      channels,
    };

    mock
      .onPost(
        '/channels.list',
        querystring.stringify({
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelList({ token: 'custom token' });

    expect(res).toEqual(channels);
  });
});

describe('#getChannelInfo', () => {
  it('should call channels.info with channel id', async () => {
    const { client, mock } = createMock();

    const channel = {
      id: 'C024BE91L',
      name: 'fun',

      created: 1360782804,
      creator: 'U024BE7LH',

      is_archived: false,
      is_general: false,
      is_member: true,
      is_starred: true,

      members: [],

      topic: {},
      purpose: {},

      last_read: '1401383885.000061',
      latest: {},
      unread_count: 0,
      unread_count_display: 0,
    };

    const reply = {
      ok: true,
      channel,
    };

    mock
      .onPost(
        '/channels.info',
        querystring.stringify({
          channel: 'C024BE91L',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelInfo('C024BE91L');

    expect(res).toEqual(channel);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const channel = {
      id: 'C024BE91L',
      name: 'fun',

      created: 1360782804,
      creator: 'U024BE7LH',

      is_archived: false,
      is_general: false,
      is_member: true,
      is_starred: true,

      members: [],

      topic: {},
      purpose: {},

      last_read: '1401383885.000061',
      latest: {},
      unread_count: 0,
      unread_count_display: 0,
    };

    const reply = {
      ok: true,
      channel,
    };

    mock
      .onPost(
        '/channels.info',
        querystring.stringify({
          channel: 'C024BE91L',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelInfo('C024BE91L', {
      token: 'custom token',
    });

    expect(res).toEqual(channel);
  });
});

describe('#getConversationInfo', () => {
  it('should call conversations.info with channel id', async () => {
    const { client, mock } = createMock();

    const channel = {
      id: 'C012AB3CD',
      name: 'general',
      is_channel: true,
      is_group: false,
      is_im: false,
      created: 1449252889,
      creator: 'W012A3BCD',
      is_archived: false,
      is_general: true,
      unlinked: 0,
      name_normalized: 'general',
      is_read_only: false,
      is_shared: false,
      is_ext_shared: false,
      is_org_shared: false,
      pending_shared: [],
      is_pending_ext_shared: false,
      is_member: true,
      is_private: false,
      is_mpim: false,
      last_read: '1502126650.228446',
      topic: {
        value: 'For public discussion of generalities',
        creator: 'W012A3BCD',
        last_set: 1449709364,
      },
      purpose: {
        value: 'This part of the workspace is for fun. Make fun here.',
        creator: 'W012A3BCD',
        last_set: 1449709364,
      },
      previous_names: ['specifics', 'abstractions', 'etc'],
      num_members: 23,
      locale: 'en-US',
    };

    const reply = {
      ok: true,
      channel,
    };

    mock
      .onPost(
        '/conversations.info',
        querystring.stringify({
          channel: 'C024BE91L',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationInfo('C024BE91L');

    expect(res).toEqual(channel);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const channel = {
      id: 'C012AB3CD',
      name: 'general',
      is_channel: true,
      is_group: false,
      is_im: false,
      created: 1449252889,
      creator: 'W012A3BCD',
      is_archived: false,
      is_general: true,
      unlinked: 0,
      name_normalized: 'general',
      is_read_only: false,
      is_shared: false,
      is_ext_shared: false,
      is_org_shared: false,
      pending_shared: [],
      is_pending_ext_shared: false,
      is_member: true,
      is_private: false,
      is_mpim: false,
      last_read: '1502126650.228446',
      topic: {
        value: 'For public discussion of generalities',
        creator: 'W012A3BCD',
        last_set: 1449709364,
      },
      purpose: {
        value: 'This part of the workspace is for fun. Make fun here.',
        creator: 'W012A3BCD',
        last_set: 1449709364,
      },
      previous_names: ['specifics', 'abstractions', 'etc'],
      num_members: 23,
      locale: 'en-US',
    };

    const reply = {
      ok: true,
      channel,
    };

    mock
      .onPost(
        '/conversations.info',
        querystring.stringify({
          channel: 'C024BE91L',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationInfo('C024BE91L', {
      token: 'custom token',
    });

    expect(res).toEqual(channel);
  });
});

describe('#getConversationMembers', () => {
  it('should call conversations.members api', async () => {
    const { client, mock } = createMock();

    const members = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
      },
    };

    mock
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationMembers('C012AB3CD');

    expect(res).toEqual({ members, next: 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==' });
  });

  it('support no cursor in reply', async () => {
    const { client, mock } = createMock();

    const members = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationMembers('C012AB3CD');

    expect(res).toEqual({ members, next: undefined });
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const members = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
      },
    };

    mock
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationMembers('C012AB3CD', {
      token: 'custom token',
    });

    expect(res).toEqual({ members, next: 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==' });
  });
});

describe('#getAllConversationMembers', () => {
  it('should call conversations.members api', async () => {
    const { client, mock } = createMock();

    const members = ['U023BECGF', 'U061F7AUR'];

    const reply1 = {
      ok: true,
      members: [members[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [members[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          cursor: undefined,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          cursor: 'cursor1',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllConversationMembers('C012AB3CD');

    expect(res).toEqual(members);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const members = ['U023BECGF', 'U061F7AUR'];

    const reply1 = {
      ok: true,
      members: [members[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [members[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          cursor: undefined,
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/conversations.members',
        querystring.stringify({
          channel: 'C012AB3CD',
          cursor: 'cursor1',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllConversationMembers('C012AB3CD', {
      token: 'custom token',
    });

    expect(res).toEqual(members);
  });
});

describe('#getConversationList', () => {
  it('should call conversations.list api', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'G0AKFJBEU',
        name: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_channel: false,
        is_group: true,
        is_im: false,
        created: 1493657761,
        creator: 'U061F7AUR',
        is_archived: false,
        is_general: false,
        unlinked: 0,
        name_normalized: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: true,
        is_mpim: true,
        last_read: '0000000000.000000',
        latest: {
          type: 'message',
          user: 'U061F7AUR',
          text: 'test',
          ts: '1493657775.857762',
        },
        unread_count: 0,
        unread_count_display: 0,
        is_open: true,
        topic: {
          value: 'Group messaging',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        purpose: {
          value:
            'Group messaging with: @mr.banks @slactions-jackson @beforebot',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        priority: 0,
      },
      {
        id: 'D0C0F7S8Y',
        created: 1498500348,
        is_im: true,
        is_org_shared: false,
        user: 'U0BS9U4SV',
        is_user_deleted: false,
        priority: 0,
      },
      {
        id: 'D0BSHH4AD',
        created: 1498511030,
        is_im: true,
        is_org_shared: false,
        user: 'U0C0NS9HN',
        is_user_deleted: false,
        priority: 0,
      },
    ];

    const reply = {
      ok: true,
      channels,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'aW1faWQ6RDBCSDk1RExI',
      },
    };

    mock
      .onPost(
        '/conversations.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationList();

    expect(res).toEqual({ channels, next: 'aW1faWQ6RDBCSDk1RExI' });
  });

  it('support no cursor in reply', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'G0AKFJBEU',
        name: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_channel: false,
        is_group: true,
        is_im: false,
        created: 1493657761,
        creator: 'U061F7AUR',
        is_archived: false,
        is_general: false,
        unlinked: 0,
        name_normalized: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: true,
        is_mpim: true,
        last_read: '0000000000.000000',
        latest: {
          type: 'message',
          user: 'U061F7AUR',
          text: 'test',
          ts: '1493657775.857762',
        },
        unread_count: 0,
        unread_count_display: 0,
        is_open: true,
        topic: {
          value: 'Group messaging',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        purpose: {
          value:
            'Group messaging with: @mr.banks @slactions-jackson @beforebot',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        priority: 0,
      },
      {
        id: 'D0C0F7S8Y',
        created: 1498500348,
        is_im: true,
        is_org_shared: false,
        user: 'U0BS9U4SV',
        is_user_deleted: false,
        priority: 0,
      },
      {
        id: 'D0BSHH4AD',
        created: 1498511030,
        is_im: true,
        is_org_shared: false,
        user: 'U0C0NS9HN',
        is_user_deleted: false,
        priority: 0,
      },
    ];

    const reply = {
      ok: true,
      channels,
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationList();

    expect(res).toEqual({ channels, next: undefined });
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'G0AKFJBEU',
        name: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_channel: false,
        is_group: true,
        is_im: false,
        created: 1493657761,
        creator: 'U061F7AUR',
        is_archived: false,
        is_general: false,
        unlinked: 0,
        name_normalized: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: true,
        is_mpim: true,
        last_read: '0000000000.000000',
        latest: {
          type: 'message',
          user: 'U061F7AUR',
          text: 'test',
          ts: '1493657775.857762',
        },
        unread_count: 0,
        unread_count_display: 0,
        is_open: true,
        topic: {
          value: 'Group messaging',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        purpose: {
          value:
            'Group messaging with: @mr.banks @slactions-jackson @beforebot',
          creator: 'U061F7AUR',
          last_set: 1493657761,
        },
        priority: 0,
      },
      {
        id: 'D0C0F7S8Y',
        created: 1498500348,
        is_im: true,
        is_org_shared: false,
        user: 'U0BS9U4SV',
        is_user_deleted: false,
        priority: 0,
      },
      {
        id: 'D0BSHH4AD',
        created: 1498511030,
        is_im: true,
        is_org_shared: false,
        user: 'U0C0NS9HN',
        is_user_deleted: false,
        priority: 0,
      },
    ];

    const reply = {
      ok: true,
      channels,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'aW1faWQ6RDBCSDk1RExI',
      },
    };

    mock
      .onPost(
        '/conversations.list',
        querystring.stringify({
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getConversationList({ token: 'custom token' });

    expect(res).toEqual({ channels, next: 'aW1faWQ6RDBCSDk1RExI' });
  });
});

describe('#getAllConversationList', () => {
  it('should call conversations.list api', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'C012AB3CD',
        name: 'general',
        is_channel: true,
        is_group: false,
        is_im: false,
        created: 1449252889,
        creator: 'U012A3CDE',
        is_archived: false,
        is_general: true,
        unlinked: 0,
        name_normalized: 'general',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        topic: {
          value: 'Company-wide announcements and work-based matters',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value:
            'This channel is for team-wide communication and announcements. All team members are in this channel.',
          creator: '',
          last_set: 0,
        },
        previous_names: [],
        num_members: 4,
      },
      {
        id: 'C061EG9T2',
        name: 'random',
        is_channel: true,
        is_group: false,
        is_im: false,
        created: 1449252889,
        creator: 'U061F7AUR',
        is_archived: false,
        is_general: false,
        unlinked: 0,
        name_normalized: 'random',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        topic: {
          value: 'Non-work banter and water cooler conversation',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value:
            "A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.",
          creator: '',
          last_set: 0,
        },
        previous_names: [],
        num_members: 4,
      },
    ];

    const reply1 = {
      ok: true,
      channels: [channels[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      channels: [channels[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/conversations.list',
        querystring.stringify({
          cursor: 'cursor1',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllConversationList();

    expect(res).toEqual(channels);
  });

  it('support custom token in options', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'C012AB3CD',
        name: 'general',
        is_channel: true,
        is_group: false,
        is_im: false,
        created: 1449252889,
        creator: 'U012A3CDE',
        is_archived: false,
        is_general: true,
        unlinked: 0,
        name_normalized: 'general',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        topic: {
          value: 'Company-wide announcements and work-based matters',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value:
            'This channel is for team-wide communication and announcements. All team members are in this channel.',
          creator: '',
          last_set: 0,
        },
        previous_names: [],
        num_members: 4,
      },
      {
        id: 'C061EG9T2',
        name: 'random',
        is_channel: true,
        is_group: false,
        is_im: false,
        created: 1449252889,
        creator: 'U061F7AUR',
        is_archived: false,
        is_general: false,
        unlinked: 0,
        name_normalized: 'random',
        is_shared: false,
        is_ext_shared: false,
        is_org_shared: false,
        pending_shared: [],
        is_pending_ext_shared: false,
        is_member: true,
        is_private: false,
        is_mpim: false,
        topic: {
          value: 'Non-work banter and water cooler conversation',
          creator: '',
          last_set: 0,
        },
        purpose: {
          value:
            "A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.",
          creator: '',
          last_set: 0,
        },
        previous_names: [],
        num_members: 4,
      },
    ];

    const reply1 = {
      ok: true,
      channels: [channels[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      channels: [channels[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/conversations.list',
        querystring.stringify({
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/conversations.list',
        querystring.stringify({
          cursor: 'cursor1',
          token: 'custom token',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllConversationList({ token: 'custom token' });

    expect(res).toEqual(channels);
  });
});
