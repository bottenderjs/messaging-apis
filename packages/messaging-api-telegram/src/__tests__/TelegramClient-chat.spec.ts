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

// kickChatMember -> banChatMember
describe('#kickChatMember', () => {
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  it('should kick chat member', async () => {
    const { client, mock } = createMock();
    mock
      .onPost('/kickChatMember', {
        chat_id: 427770117,
        user_id: 313534466,
        until_date: 1502855973,
      })
      .reply(200, reply);

    const res = await client.kickChatMember(427770117, 313534466, {
      untilDate: 1502855973,
    });
    expect(res).toEqual(result);
  });
});

it.todo('should support #banChatMember');

it('should support #unbanChatMember', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/unbanChatMember', {
      chat_id: 427770117,
      user_id: 313534466,
    })
    .reply(200, reply);

  const res = await client.unbanChatMember(427770117, 313534466);
  expect(res).toEqual(result);
});

it('should support #restrictChatMember', async () => {
  const { client, mock } = createMock();

  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/restrictChatMember', {
      chat_id: 427770117,
      user_id: 313534466,
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true,
      },
      until_date: 1577721600,
    })
    .reply(200, reply);

  const res = await client.restrictChatMember(
    427770117,
    313534466,
    {
      canSendMessages: true,
      canSendMediaMessages: true,
      canSendPolls: true,
      canSendOtherMessages: true,
      canAddWebPagePreviews: true,
      canChangeInfo: true,
      canInviteUsers: true,
      canPinMessages: true,
    },
    {
      untilDate: 1577721600,
    }
  );
  expect(res).toEqual(result);
});

it('should support #promoteChatMember', async () => {
  const { client, mock } = createMock();

  const result = true;
  const reply = {
    ok: true,
    result,
  };
  mock
    .onPost('/promoteChatMember', {
      chat_id: 427770117,
      user_id: 313534466,
      can_change_info: true,
      can_post_messages: true,
      can_edit_messages: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_promote_members: true,
    })
    .reply(200, reply);

  const res = await client.promoteChatMember(427770117, 313534466, {
    canChangeInfo: true,
    canPostMessages: true,
    canEditMessages: true,
    canDeleteMessages: true,
    canInviteUsers: true,
    canRestrictMembers: true,
    canPinMessages: true,
    canPromoteMembers: true,
  });
  expect(res).toEqual(result);
});

it.todo('should support #setChatAdministratorCustomTitle');

it('should support #setChatPermissions', async () => {
  const { client, mock } = createMock();

  const result = true;
  const reply = {
    ok: true,
    result,
  };
  mock
    .onPost('/setChatPermissions', {
      chat_id: 427770117,
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true,
      },
    })
    .reply(200, reply);

  const res = await client.setChatPermissions(427770117, {
    canSendMessages: true,
    canSendMediaMessages: true,
    canSendPolls: true,
    canSendOtherMessages: true,
    canAddWebPagePreviews: true,
    canChangeInfo: true,
    canInviteUsers: true,
    canPinMessages: true,
  });
  expect(res).toEqual(result);
});

it('should support #exportChatInviteLink', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/exportChatInviteLink', {
      chat_id: 427770117,
    })
    .reply(200, reply);

  const res = await client.exportChatInviteLink(427770117);
  expect(res).toEqual(result);
});

it.todo('should support #createChatInviteLink');

it.todo('should support #editChatInviteLink');

it.todo('should support #revokeChatInviteLink');

it.todo('should support #setChatPhoto');

it('should support #deleteChatPhoto', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/deleteChatPhoto', {
      chat_id: 427770117,
    })
    .reply(200, reply);

  const res = await client.deleteChatPhoto(427770117);
  expect(res).toEqual(result);
});

it('should support #setChatTitle', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/setChatTitle', {
      chat_id: 427770117,
      title: 'New Title',
    })
    .reply(200, reply);

  const res = await client.setChatTitle(427770117, 'New Title');
  expect(res).toEqual(result);
});

it('should support #setChatDescription', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/setChatDescription', {
      chat_id: 427770117,
      description: 'New Description',
    })
    .reply(200, reply);

  const res = await client.setChatDescription(427770117, 'New Description');
  expect(res).toEqual(result);
});

it('should support #pinChatMessage', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };
  mock
    .onPost('/pinChatMessage', {
      chat_id: 427770117,
      message_id: 1,
      disable_notification: true,
    })
    .reply(200, reply);

  const res = await client.pinChatMessage(427770117, 1, {
    disableNotification: true,
  });
  expect(res).toEqual(result);
});

it('should support #unpinChatMessage', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/unpinChatMessage', {
      chat_id: 427770117,
    })
    .reply(200, reply);

  const res = await client.unpinChatMessage(427770117);
  expect(res).toEqual(result);
});

it.todo('should support #unpinAllChatMessages');

it('should support #leaveChat', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/leaveChat', {
      chat_id: 427770117,
    })
    .reply(200, reply);

  const res = await client.leaveChat(427770117);
  expect(res).toEqual(result);
});

it('should support #getChat', async () => {
  const { client, mock } = createMock();
  const result = {
    id: 313534466,
    firstName: 'first',
    lastName: 'last',
    username: 'username',
    type: 'private',
  };
  const reply = {
    ok: true,
    result: {
      id: 313534466,
      first_name: 'first',
      last_name: 'last',
      username: 'username',
      type: 'private',
    },
  };

  mock
    .onPost('/getChat', {
      chat_id: 313534466,
    })
    .reply(200, reply);

  const res = await client.getChat(313534466);

  expect(res).toEqual(result);
});

it('should support #getChatAdministrators', async () => {
  const { client, mock } = createMock();
  const result = [
    {
      user: {
        id: 313534466,
        firstName: 'first',
        lastName: 'last',
        username: 'username',
        languangeCode: 'zh-TW',
      },
      status: 'creator',
    },
  ];
  const reply = {
    ok: true,
    result: [
      {
        user: {
          id: 313534466,
          first_name: 'first',
          last_name: 'last',
          username: 'username',
          languange_code: 'zh-TW',
        },
        status: 'creator',
      },
    ],
  };

  mock
    .onPost('/getChatAdministrators', {
      chat_id: -427770117,
    })
    .reply(200, reply);

  const res = await client.getChatAdministrators(-427770117);

  expect(res).toEqual(result);
});

it('should support #getChatMembersCount', async () => {
  const { client, mock } = createMock();
  const result = '6';
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/getChatMembersCount', {
      chat_id: -427770117,
    })
    .reply(200, reply);

  const res = await client.getChatMembersCount(-427770117);

  expect(res).toEqual(result);
});

it('should support #getChatMember', async () => {
  const { client, mock } = createMock();
  const result = {
    user: {
      id: 313534466,
      firstName: 'first',
      lastName: 'last',
      username: 'username',
      languangeCode: 'zh-TW',
    },
    status: 'creator',
  };
  const reply = {
    ok: true,
    result: {
      user: {
        id: 313534466,
        first_name: 'first',
        last_name: 'last',
        username: 'username',
        languange_code: 'zh-TW',
      },
      status: 'creator',
    },
  };

  mock
    .onPost('/getChatMember', {
      chat_id: -427770117,
      user_id: 313534466,
    })
    .reply(200, reply);

  const res = await client.getChatMember(-427770117, 313534466);

  expect(res).toEqual(result);
});

it('should support #setChatStickerSet', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/setChatStickerSet', {
      chat_id: 427770117,
      sticker_set_name: 'Sticker Set Name',
    })
    .reply(200, reply);

  const res = await client.setChatStickerSet(427770117, 'Sticker Set Name');
  expect(res).toEqual(result);
});

it('should support #deleteChatStickerSet', async () => {
  const { client, mock } = createMock();
  const result = true;
  const reply = {
    ok: true,
    result,
  };

  mock
    .onPost('/deleteChatStickerSet', {
      chat_id: 427770117,
    })
    .reply(200, reply);

  const res = await client.deleteChatStickerSet(427770117);
  expect(res).toEqual(result);
});
