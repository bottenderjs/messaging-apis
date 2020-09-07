import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';
const CHANNEL = 'C1234567890';
const USER = 'U56781234';

const VIEW_PAYLOAD = {
  id: 'VMHU10V25',
  teamId: 'T8N4K1JN',
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Quite a plain modal',
  },
  submit: {
    type: 'plain_text',
    text: 'Create',
  },
  blocks: [
    {
      type: 'input',
      blockId: 'a_block_id',
      label: {
        type: 'plain_text',
        text: 'A simple label',
        emoji: true,
      },
      optional: false,
      element: {
        type: 'plain_text_input',
        actionId: 'an_action_id',
      },
    },
  ],
  privateMetadata: 'Shh it is a secret',
  callbackId: 'identify_your_modals',
  externalId: '',
  state: {
    values: [],
  },
  hash: '156772938.1827394',
  clearOnClose: false,
  notifyOnClose: false,
};

const VIEW_PAYLOAD_STRING =
  '{"id":"VMHU10V25","team_id":"T8N4K1JN","type":"modal","title":{"type":"plain_text","text":"Quite a plain modal"},"submit":{"type":"plain_text","text":"Create"},"blocks":[{"type":"input","block_id":"a_block_id","label":{"type":"plain_text","text":"A simple label","emoji":true},"optional":false,"element":{"type":"plain_text_input","action_id":"an_action_id"}}],"private_metadata":"Shh it is a secret","callback_id":"identify_your_modals","external_id":"","state":{"values":[]},"hash":"156772938.1827394","clear_on_close":false,"notify_on_close":false}';

const snakecaseMembers = [
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

const camelcaseMembers = [
  {
    id: 'U023BECGF',
    teamId: 'T021F9ZE2',
    name: 'bobby',
    deleted: false,
    color: '9f69e7',
    realName: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    profile: {
      avatarHash: 'ge3b51ca72de',
      currentStatus: ':mountain_railway: riding a train',
      firstName: 'Bobby',
      lastName: 'Tables',
      realName: 'Bobby Tables',
      email: 'bobby@slack.com',
      skype: 'my-skype-name',
      phone: '+1 (123) 456 7890',
      image24: 'https://...',
      image32: 'https://...',
      image48: 'https://...',
      image72: 'https://...',
      image192: 'https://...',
    },
    isAdmin: true,
    isOwner: true,
    updated: 1490054400,
    has2fa: false,
  },
  {
    id: 'W07QCRPA4',
    teamId: 'T0G9PQBBK',
    name: 'glinda',
    deleted: false,
    color: '9f69e7',
    realName: 'Glinda Southgood',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    profile: {
      avatarHash: '8fbdd10b41c6',
      image24: 'https://a.slack-edge.com...png',
      image32: 'https://a.slack-edge.com...png',
      image48: 'https://a.slack-edge.com...png',
      image72: 'https://a.slack-edge.com...png',
      image192: 'https://a.slack-edge.com...png',
      image512: 'https://a.slack-edge.com...png',
      image1024: 'https://a.slack-edge.com...png',
      imageOriginal: 'https://a.slack-edge.com...png',
      firstName: 'Glinda',
      lastName: 'Southgood',
      title: 'Glinda the Good',
      phone: '',
      skype: '',
      realName: 'Glinda Southgood',
      realNameNormalized: 'Glinda Southgood',
      email: 'glenda@south.oz.coven',
    },
    isAdmin: true,
    isOwner: false,
    isPrimaryOwner: false,
    isRestricted: false,
    isUltraRestricted: false,
    isBot: false,
    updated: 1480527098,
    has2fa: false,
  },
];

const snakecaseUser = {
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

const camelcaseUser = {
  id: 'U023BECGF',
  name: 'bobby',
  deleted: false,
  color: '9f69e7',
  profile: {
    avatarHash: 'ge3b51ca72de',
    currentStatus: ':mountain_railway: riding a train',
    firstName: 'Bobby',
    lastName: 'Tables',
    realName: 'Bobby Tables',
    tz: 'America/Los_Angeles',
    tzLabel: 'Pacific Daylight Time',
    tzOffset: -25200,
    email: 'bobby@slack.com',
    skype: 'my-skype-name',
    phone: '+1 (123) 456 7890',
    image24: 'https://...',
    image32: 'https://...',
    image48: 'https://...',
    image72: 'https://...',
    image192: 'https://...',
  },
  isAdmin: true,
  isOwner: true,
  updated: 1490054400,
  has2fa: true,
};

const createMock = (): { client: SlackOAuthClient; mock: MockAdapter } => {
  const client = new SlackOAuthClient({
    accessToken: TOKEN,
  });
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

describe('#chat.postMessage', () => {
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

    const res = await client.chat.postMessage({
      channel: CHANNEL,
      text: 'hello',
    });

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

    const res = await client.chat.postMessage({
      channel: CHANNEL,
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callbackId: 'wopr_game',
          color: '#3AA3E3',
          attachmentType: 'default',
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
                okText: 'Yes',
                dismissText: 'No',
              },
            },
          ],
        },
      ],
      asUser: true,
    });

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

    const res = await client.chat.postMessage({
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should support blocks', async () => {
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
          blocks: '[{"type":"section","text":{"type":"mrkdwn","text":"..."}}]',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.postMessage({
      channel: CHANNEL,
      text: 'hello',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '...',
          },
        },
      ],
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.postEphemeral', () => {
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

    const res = await client.chat.postEphemeral({
      channel: CHANNEL,
      user: USER,
      text: 'hello',
    });

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

    const res = await client.chat.postEphemeral({
      channel: CHANNEL,
      user: USER,
      text: 'hello',
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callbackId: 'wopr_game',
          color: '#3AA3E3',
          attachmentType: 'default',
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
                okText: 'Yes',
                dismissText: 'No',
              },
            },
          ],
        },
      ],
      asUser: true,
    });

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

    const res = await client.chat.postEphemeral({
      channel: CHANNEL,
      user: USER,
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callbackId: 'wopr_game',
          color: '#3AA3E3',
          attachmentType: 'default',
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
                okText: 'Yes',
                dismissText: 'No',
              },
            },
          ],
        },
      ],
      asUser: true,
    });

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

    const res = await client.chat.postEphemeral({
      channel: CHANNEL,
      user: USER,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should support blocks', async () => {
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
          blocks: '[{"type":"section","text":{"type":"mrkdwn","text":"..."}}]',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.postEphemeral({
      channel: CHANNEL,
      user: USER,
      text: 'hello',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '...',
          },
        },
      ],
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.update', () => {
  it('should call chat.update with channel, text and ts', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.update',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          ts: '1405894322.332768',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.update({
      channel: CHANNEL,
      text: 'hello',
      ts: '1405894322.332768',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.update with channel, attachments and ts', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.update',
        querystring.stringify({
          channel: CHANNEL,
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          ts: '1405894322.332768',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.update({
      channel: CHANNEL,
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callbackId: 'wopr_game',
          color: '#3AA3E3',
          attachmentType: 'default',
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
                okText: 'Yes',
                dismissText: 'No',
              },
            },
          ],
        },
      ],
      asUser: true,
      ts: '1405894322.332768',
    });

    expect(res).toEqual(reply);
  });

  it('should support blocks', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.update',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          ts: '1405895017.000506',
          blocks: '[{"type":"section","text":{"type":"mrkdwn","text":"..."}}]',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.update({
      channel: CHANNEL,
      text: 'hello',
      ts: '1405895017.000506',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '...',
          },
        },
      ],
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.delete', () => {
  it('should call chat.delete with channel and ts', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.000006',
    };

    mock
      .onPost(
        '/chat.delete',
        querystring.stringify({
          channel: CHANNEL,
          ts: '1405894322.002768',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.delete({
      channel: CHANNEL,
      ts: '1405894322.002768',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.delete with channel, ts and optional options', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.000009',
    };

    mock
      .onPost(
        '/chat.delete',
        querystring.stringify({
          channel: CHANNEL,
          ts: '1405894322.022768',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.delete({
      channel: CHANNEL,
      ts: '1405894322.022768',
      asUser: true,
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.meMessage', () => {
  it('should call chat.meMessage with channel and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.000006',
    };

    mock
      .onPost(
        '/chat.meMessage',
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

    const res = await client.chat.meMessage({
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.getPermalink', () => {
  it('should call chat.getPermalink with channel and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C1H9RESGA',
      permalink: 'https://yoctol.slack.com/archives/C1H9RESGA/p135854651500008',
    };

    mock
      .onPost(
        '/chat.getPermalink',
        querystring.stringify({
          channel: CHANNEL,
          message_ts: '9234567891.321456',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.getPermalink({
      channel: CHANNEL,
      message_ts: '9234567891.321456',
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.scheduleMessage', () => {
  it('should call chat.scheduleMessage with channel, text and post_at', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.scheduleMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          post_at: '299876400',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.scheduleMessage({
      channel: CHANNEL,
      text: 'hello',
      postAt: '299876400',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.scheduleMessage with channel, attachments and post_at', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.scheduleMessage',
        querystring.stringify({
          channel: CHANNEL,
          attachments:
            '[{"text":"Choose a game to play","fallback":"You are unable to choose a game","callback_id":"wopr_game","color":"#3AA3E3","attachment_type":"default","actions":[{"name":"game","text":"Chess","type":"button","value":"chess"},{"name":"game","text":"Falken\'s Maze","type":"button","value":"maze"},{"name":"game","text":"Thermonuclear War","style":"danger","type":"button","value":"war","confirm":{"title":"Are you sure?","text":"Wouldn\'t you prefer a good game of chess?","ok_text":"Yes","dismiss_text":"No"}}]}]',
          as_user: true,
          post_at: '299876400',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.scheduleMessage({
      channel: CHANNEL,
      attachments: [
        {
          text: 'Choose a game to play',
          fallback: 'You are unable to choose a game',
          callbackId: 'wopr_game',
          color: '#3AA3E3',
          attachmentType: 'default',
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
                okText: 'Yes',
                dismissText: 'No',
              },
            },
          ],
        },
      ],
      asUser: true,
      postAt: '299876400',
    });

    expect(res).toEqual(reply);
  });

  it('should support blocks', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.scheduleMessage',
        querystring.stringify({
          channel: 'C1234567890',
          text: 'hello',
          post_at: '299876400',
          blocks: '[{"type":"section","text":{"type":"mrkdwn","text":"..."}}]',
          token: 'xxxx-xxxxxxxxx-xxxx',
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.scheduleMessage({
      channel: CHANNEL,
      text: 'hello',
      postAt: '299876400',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '...',
          },
        },
      ],
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.deleteScheduledMessage', () => {
  it('should call chat.deleteScheduledMessage with channel and scheduledMessageId', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.040006',
    };

    mock
      .onPost(
        '/chat.deleteScheduledMessage',
        querystring.stringify({
          channel: CHANNEL,
          scheduled_message_id: 'Q1234ABCD',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.deleteScheduledMessage({
      channel: CHANNEL,
      scheduledMessageId: 'Q1234ABCD',
    });

    expect(res).toEqual(reply);
  });

  it('should call chat.deleteScheduledMessage with channel, scheduledMessageId and optional options', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.040006',
    };

    mock
      .onPost(
        '/chat.deleteScheduledMessage',
        querystring.stringify({
          channel: CHANNEL,
          scheduled_message_id: 'Q1234ABCD',
          as_user: true,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.deleteScheduledMessage({
      channel: CHANNEL,
      scheduledMessageId: 'Q1234ABCD',
      as_user: true,
    });

    expect(res).toEqual(reply);
  });
});

describe('#chat.scheduledMessages.list', () => {
  it('should call chat.scheduledMessages.list', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      scheduledMessages: [
        {
          id: 1298393284,
          channelId: 'C1H9RESGL',
          postAt: 1551991428,
          dateCreated: 1551891734,
        },
      ],
      responseMetadata: {
        nextCursor: '',
      },
    };

    mock
      .onPost(
        '/chat.scheduledMessages.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.scheduledMessages.list({});

    expect(res).toEqual(reply);
  });
});

describe('#chat.unfurl', () => {
  it('should call chat.unfurl with channel, ts and unfurls', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: 'C024BE91L',
      ts: '1417671948.990006',
    };

    mock
      .onPost(
        '/chat.unfurl',
        querystring.stringify({
          channel: CHANNEL,
          ts: '1405894322.992768',
          unfurls: {
            'https://example.com/': {
              text: 'Every day is the test.',
            },
          },
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.chat.unfurl({
      channel: CHANNEL,
      ts: '1405894322.992768',
      unfurls: {
        'https://example.com/': {
          text: 'Every day is the test.',
        },
      },
    });

    expect(res).toEqual(reply);
  });
});

describe('#views.open', () => {
  it('should call views.open with triggerId and view payload', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.open',
        querystring.stringify({
          trigger_id: '12345.98765.abcd2358fdea',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.open({
      triggerId: '12345.98765.abcd2358fdea',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });
});

describe('#views.publish', () => {
  it('should call views.publish with userId and view payload', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.publish',
        querystring.stringify({
          user_id: 'U0BPQUNTA',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.publish({
      userId: 'U0BPQUNTA',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });

  it('should call views.publish with userId, view payload and hash', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.publish',
        querystring.stringify({
          user_id: 'U0BPQUNTA',
          view: VIEW_PAYLOAD_STRING,
          hash: '156772938.1827394',
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.publish({
      userId: 'U0BPQUNTA',
      view: VIEW_PAYLOAD,
      hash: '156772938.1827394',
    });

    expect(res).toEqual(reply);
  });
});

describe('#views.update', () => {
  it('should call views.update with externalId and view payload', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.update',
        querystring.stringify({
          external_id: 'bmarley_view2',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.update({
      externalId: 'bmarley_view2',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });

  it('should call views.update with viewId and view payload', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.update',
        querystring.stringify({
          view_id: 'VMM512F2U',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.update({
      viewId: 'VMM512F2U',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });

  it('should call views.update with viewId, view payload and hash', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.update',
        querystring.stringify({
          view_id: 'VMM512F2U',
          hash: '156772938.1827394',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.update({
      viewId: 'VMM512F2U',
      hash: '156772938.1827394',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });
});

describe('#views.push', () => {
  it('should call views.push with triggerId and view payload', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      view: VIEW_PAYLOAD,
    };

    mock
      .onPost(
        '/views.push',
        querystring.stringify({
          trigger_id: '12345.98765.abcd2358fdea',
          view: VIEW_PAYLOAD_STRING,
          token: TOKEN,
        }),
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.views.push({
      triggerId: '12345.98765.abcd2358fdea',
      view: VIEW_PAYLOAD,
    });

    expect(res).toEqual(reply);
  });
});

describe('#getUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      members: snakecaseMembers,
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

    expect(res).toEqual({
      members: camelcaseMembers,
      next: 'dXNlcjpVMEc5V0ZYTlo=',
    });
  });

  it('support no cursor in reply', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      members: snakecaseMembers,
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

    expect(res).toEqual({ members: camelcaseMembers, next: undefined });
  });
});

describe('#getAllUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const reply1 = {
      ok: true,
      members: [snakecaseMembers[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [snakecaseMembers[1]],
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

    expect(res).toEqual(camelcaseMembers);
  });
});

describe('#getUserInfo', () => {
  it('should call users.info with user id', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      user: snakecaseUser,
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

    expect(res).toEqual(camelcaseUser);
  });
});

describe('#getChannelInfo', () => {
  const snakecaseChannelInfo = {
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

  const camelcaseChannelInfo = {
    id: 'C024BE91L',
    name: 'fun',

    created: 1360782804,
    creator: 'U024BE7LH',

    isArchived: false,
    isGeneral: false,
    isMember: true,
    isStarred: true,

    members: [],

    topic: {},
    purpose: {},

    lastRead: '1401383885.000061',
    latest: {},
    unreadCount: 0,
    unreadCountDisplay: 0,
  };

  it('should call channels.info with channel id', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: snakecaseChannelInfo,
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

    expect(res).toEqual(camelcaseChannelInfo);
  });
});

describe('#getConversationInfo', () => {
  const snakecaseChannelInfo = {
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

  const camelcaseChannelInfo = {
    id: 'C012AB3CD',
    name: 'general',
    isChannel: true,
    isGroup: false,
    isIm: false,
    created: 1449252889,
    creator: 'W012A3BCD',
    isArchived: false,
    isGeneral: true,
    unlinked: 0,
    nameNormalized: 'general',
    isReadOnly: false,
    isShared: false,
    isExtShared: false,
    isOrgShared: false,
    pendingShared: [],
    isPendingExtShared: false,
    isMember: true,
    isPrivate: false,
    isMpim: false,
    lastRead: '1502126650.228446',
    topic: {
      value: 'For public discussion of generalities',
      creator: 'W012A3BCD',
      lastSet: 1449709364,
    },
    purpose: {
      value: 'This part of the workspace is for fun. Make fun here.',
      creator: 'W012A3BCD',
      lastSet: 1449709364,
    },
    previousNames: ['specifics', 'abstractions', 'etc'],
    numMembers: 23,
    locale: 'en-US',
  };

  it('should call conversations.info with channel id', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channel: snakecaseChannelInfo,
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

    expect(res).toEqual(camelcaseChannelInfo);
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
});

describe('#getConversationList', () => {
  const snakecaseChannels = [
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
        value: 'Group messaging with: @mr.banks @slactions-jackson @beforebot',
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

  const camelcaseChannels = [
    {
      id: 'G0AKFJBEU',
      name: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
      isChannel: false,
      isGroup: true,
      isIm: false,
      created: 1493657761,
      creator: 'U061F7AUR',
      isArchived: false,
      isGeneral: false,
      unlinked: 0,
      nameNormalized: 'mpdm-mr.banks--slactions-jackson--beforebot-1',
      isShared: false,
      isExtShared: false,
      isOrgShared: false,
      pendingShared: [],
      isPendingExtShared: false,
      isMember: true,
      isPrivate: true,
      isMpim: true,
      lastRead: '0000000000.000000',
      latest: {
        type: 'message',
        user: 'U061F7AUR',
        text: 'test',
        ts: '1493657775.857762',
      },
      unreadCount: 0,
      unreadCountDisplay: 0,
      isOpen: true,
      topic: {
        value: 'Group messaging',
        creator: 'U061F7AUR',
        lastSet: 1493657761,
      },
      purpose: {
        value: 'Group messaging with: @mr.banks @slactions-jackson @beforebot',
        creator: 'U061F7AUR',
        lastSet: 1493657761,
      },
      priority: 0,
    },
    {
      id: 'D0C0F7S8Y',
      created: 1498500348,
      isIm: true,
      isOrgShared: false,
      user: 'U0BS9U4SV',
      isUserDeleted: false,
      priority: 0,
    },
    {
      id: 'D0BSHH4AD',
      created: 1498511030,
      isIm: true,
      isOrgShared: false,
      user: 'U0C0NS9HN',
      isUserDeleted: false,
      priority: 0,
    },
  ];

  it('should call conversations.list api', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channels: snakecaseChannels,
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

    expect(res).toEqual({
      channels: camelcaseChannels,
      next: 'aW1faWQ6RDBCSDk1RExI',
    });
  });

  it('support no cursor in reply', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      channels: snakecaseChannels,
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

    expect(res).toEqual({ channels: camelcaseChannels, next: undefined });
  });
});

describe('#getAllConversationList', () => {
  const snakecaseChannels = [
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

  const camelcaseChannels = [
    {
      id: 'C012AB3CD',
      name: 'general',
      isChannel: true,
      isGroup: false,
      isIm: false,
      created: 1449252889,
      creator: 'U012A3CDE',
      isArchived: false,
      isGeneral: true,
      unlinked: 0,
      nameNormalized: 'general',
      isShared: false,
      isExtShared: false,
      isOrgShared: false,
      pendingShared: [],
      isPendingExtShared: false,
      isMember: true,
      isPrivate: false,
      isMpim: false,
      topic: {
        value: 'Company-wide announcements and work-based matters',
        creator: '',
        lastSet: 0,
      },
      purpose: {
        value:
          'This channel is for team-wide communication and announcements. All team members are in this channel.',
        creator: '',
        lastSet: 0,
      },
      previousNames: [],
      numMembers: 4,
    },
    {
      id: 'C061EG9T2',
      name: 'random',
      isChannel: true,
      isGroup: false,
      isIm: false,
      created: 1449252889,
      creator: 'U061F7AUR',
      isArchived: false,
      isGeneral: false,
      unlinked: 0,
      nameNormalized: 'random',
      isShared: false,
      isExtShared: false,
      isOrgShared: false,
      pendingShared: [],
      isPendingExtShared: false,
      isMember: true,
      isPrivate: false,
      isMpim: false,
      topic: {
        value: 'Non-work banter and water cooler conversation',
        creator: '',
        lastSet: 0,
      },
      purpose: {
        value:
          "A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.",
        creator: '',
        lastSet: 0,
      },
      previousNames: [],
      numMembers: 4,
    },
  ];

  it('should call conversations.list api', async () => {
    const { client, mock } = createMock();

    const reply1 = {
      ok: true,
      channels: [snakecaseChannels[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      channels: [snakecaseChannels[1]],
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

    expect(res).toEqual(camelcaseChannels);
  });
});
