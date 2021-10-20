import TelegramClient from '../TelegramClient';

import {
  constants,
  getCurrentContext,
  setupTelegramServer,
} from './testing-library';

setupTelegramServer();

it('should support #banChatMember', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.banChatMember({
    chatId: 427770117,
    userId: 313534466,
    untilDate: 1502855973,
    revokeMessages: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/banChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    until_date: 1502855973,
    revoke_messages: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #banChatMember shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.banChatMember(427770117, 313534466, {
    untilDate: 1502855973,
    revokeMessages: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/banChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    until_date: 1502855973,
    revoke_messages: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unbanChatMember', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unbanChatMember({
    chatId: 427770117,
    userId: 313534466,
    onlyIfBanned: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unbanChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    only_if_banned: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unbanChatMember shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unbanChatMember(427770117, 313534466, {
    onlyIfBanned: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unbanChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    only_if_banned: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #restrictChatMember', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.restrictChatMember({
    chatId: 427770117,
    userId: 313534466,
    permissions: {
      canSendMessages: true,
      canSendMediaMessages: true,
      canSendPolls: true,
      canSendOtherMessages: true,
      canAddWebPagePreviews: true,
      canChangeInfo: true,
      canInviteUsers: true,
      canPinMessages: true,
    },
    untilDate: 1577721600,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/restrictChatMember'
  );
  expect(request?.body).toEqual({
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
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #restrictChatMember shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.restrictChatMember(
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

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/restrictChatMember'
  );
  expect(request?.body).toEqual({
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
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #promoteChatMember', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.promoteChatMember({
    chatId: 427770117,
    userId: 313534466,
    isAnonymous: true,
    canManageChat: true,
    canPostMessages: true,
    canEditMessages: true,
    canDeleteMessages: true,
    canManageVoiceChats: true,
    canRestrictMembers: true,
    canPromoteMembers: true,
    canChangeInfo: true,
    canInviteUsers: true,
    canPinMessages: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/promoteChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    is_anonymous: true,
    can_manage_chat: true,
    can_post_messages: true,
    can_edit_messages: true,
    can_manage_voice_chats: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_promote_members: true,
    can_change_info: true,
    can_invite_users: true,
    can_pin_messages: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #promoteChatMember shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.promoteChatMember(427770117, 313534466, {
    isAnonymous: true,
    canManageChat: true,
    canPostMessages: true,
    canEditMessages: true,
    canDeleteMessages: true,
    canManageVoiceChats: true,
    canRestrictMembers: true,
    canPromoteMembers: true,
    canChangeInfo: true,
    canInviteUsers: true,
    canPinMessages: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/promoteChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    is_anonymous: true,
    can_manage_chat: true,
    can_post_messages: true,
    can_edit_messages: true,
    can_manage_voice_chats: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_promote_members: true,
    can_change_info: true,
    can_invite_users: true,
    can_pin_messages: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatAdministratorCustomTitle', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatAdministratorCustomTitle({
    chatId: 427770117,
    userId: 313534466,
    customTitle: 'Custom Title',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatAdministratorCustomTitle'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    custom_title: 'Custom Title',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatAdministratorCustomTitle shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatAdministratorCustomTitle(
    427770117,
    313534466,
    'Custom Title'
  );

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatAdministratorCustomTitle'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    user_id: 313534466,
    custom_title: 'Custom Title',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatPermissions', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatPermissions({
    chatId: 427770117,
    permissions: {
      canSendMessages: true,
      canSendMediaMessages: true,
      canSendPolls: true,
      canSendOtherMessages: true,
      canAddWebPagePreviews: true,
      canChangeInfo: true,
      canInviteUsers: true,
      canPinMessages: true,
    },
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatPermissions'
  );
  expect(request?.body).toEqual({
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
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatPermissions shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatPermissions(427770117, {
    canSendMessages: true,
    canSendMediaMessages: true,
    canSendPolls: true,
    canSendOtherMessages: true,
    canAddWebPagePreviews: true,
    canChangeInfo: true,
    canInviteUsers: true,
    canPinMessages: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatPermissions'
  );
  expect(request?.body).toEqual({
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
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #exportChatInviteLink', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.exportChatInviteLink({
    chatId: 427770117,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/exportChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #exportChatInviteLink shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.exportChatInviteLink(427770117);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/exportChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #createChatInviteLink', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.createChatInviteLink({
    chatId: 427770117,
    expireDate: 1634751130,
    memberLimit: 10,
  });

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: false,
    expireDate: 1634751130,
    memberLimit: 10,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/createChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    expire_date: 1634751130,
    member_limit: 10,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #createChatInviteLink shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.createChatInviteLink(427770117, {
    expireDate: 1634751130,
    memberLimit: 10,
  });

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: false,
    expireDate: 1634751130,
    memberLimit: 10,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/createChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    expire_date: 1634751130,
    member_limit: 10,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editChatInviteLink', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editChatInviteLink({
    chatId: 427770117,
    inviteLink: 'https://www.example.com/link',
    expireDate: 1634751130,
    memberLimit: 10,
  });

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: false,
    expireDate: 1634751130,
    memberLimit: 10,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    invite_link: 'https://www.example.com/link',
    expire_date: 1634751130,
    member_limit: 10,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #editChatInviteLink shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.editChatInviteLink(
    427770117,
    'https://www.example.com/link',
    {
      expireDate: 1634751130,
      memberLimit: 10,
    }
  );

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: false,
    expireDate: 1634751130,
    memberLimit: 10,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/editChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    invite_link: 'https://www.example.com/link',
    expire_date: 1634751130,
    member_limit: 10,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #revokeChatInviteLink', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.revokeChatInviteLink({
    chatId: 427770117,
    inviteLink: 'https://www.example.com/link',
  });

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/revokeChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    invite_link: 'https://www.example.com/link',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #revokeChatInviteLink shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.revokeChatInviteLink(
    427770117,
    'https://www.example.com/link'
  );

  expect(res).toEqual({
    inviteLink: 'https://www.example.com/link',
    creator: {
      id: 313534466,
      firstName: 'first',
      username: 'a_bot',
    },
    isPrimary: true,
    isRevoked: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/revokeChatInviteLink'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    invite_link: 'https://www.example.com/link',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it.todo('should support #setChatPhoto');

it('should support #deleteChatPhoto', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteChatPhoto({
    chatId: 427770117,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteChatPhoto'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteChatPhoto shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteChatPhoto(427770117);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteChatPhoto'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatTitle', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatTitle({
    chatId: 427770117,
    title: 'New Title',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatTitle'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    title: 'New Title',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatTitle shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatTitle(427770117, 'New Title');

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatTitle'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    title: 'New Title',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatDescription', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatDescription({
    chatId: 427770117,
    description: 'New Description',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatDescription'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    description: 'New Description',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatDescription shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatDescription(427770117, 'New Description');

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatDescription'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    description: 'New Description',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #pinChatMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.pinChatMessage({
    chatId: 427770117,
    messageId: 1,
    disableNotification: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/pinChatMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 1,
    disable_notification: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #pinChatMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.pinChatMessage(427770117, 1, {
    disableNotification: true,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/pinChatMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 1,
    disable_notification: true,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unpinChatMessage', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unpinChatMessage({
    chatId: 427770117,
    messageId: 1,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unpinChatMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 1,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unpinChatMessage shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unpinChatMessage(427770117, 1);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unpinChatMessage'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    message_id: 1,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unpinAllChatMessages', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unpinAllChatMessages({
    chatId: 427770117,
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unpinAllChatMessages'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #unpinAllChatMessages shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.unpinAllChatMessages(427770117);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/unpinAllChatMessages'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #leaveChat', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.leaveChat({ chatId: 427770117 });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/leaveChat'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #leaveChat shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.leaveChat(427770117);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/leaveChat'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChat', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChat({ chatId: 313534466 });

  expect(res).toEqual({
    id: 313534466,
    firstName: 'first',
    lastName: 'last',
    username: 'username',
    type: 'private',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChat'
  );
  expect(request?.body).toEqual({
    chat_id: 313534466,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChat shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChat(313534466);

  expect(res).toEqual({
    id: 313534466,
    firstName: 'first',
    lastName: 'last',
    username: 'username',
    type: 'private',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChat'
  );
  expect(request?.body).toEqual({
    chat_id: 313534466,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatAdministrators', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatAdministrators({ chatId: -427770117 });

  expect(res).toEqual([
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
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatAdministrators'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatAdministrators shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatAdministrators(-427770117);

  expect(res).toEqual([
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
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatAdministrators'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatMemberCount', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatMemberCount({ chatId: -427770117 });

  expect(res).toEqual('6');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatMemberCount'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatMemberCount shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatMemberCount(-427770117);

  expect(res).toEqual('6');

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatMemberCount'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatMember', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatMember({
    chatId: -427770117,
    userId: 313534466,
  });

  expect(res).toEqual({
    user: {
      id: 313534466,
      firstName: 'first',
      lastName: 'last',
      username: 'username',
      languangeCode: 'zh-TW',
    },
    status: 'creator',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
    user_id: 313534466,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getChatMember shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.getChatMember(-427770117, 313534466);

  expect(res).toEqual({
    user: {
      id: 313534466,
      firstName: 'first',
      lastName: 'last',
      username: 'username',
      languangeCode: 'zh-TW',
    },
    status: 'creator',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getChatMember'
  );
  expect(request?.body).toEqual({
    chat_id: -427770117,
    user_id: 313534466,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatStickerSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatStickerSet({
    chatId: 427770117,
    stickerSetName: 'Sticker Set Name',
  });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatStickerSet'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    sticker_set_name: 'Sticker Set Name',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #setChatStickerSet shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.setChatStickerSet(427770117, 'Sticker Set Name');

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setChatStickerSet'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
    sticker_set_name: 'Sticker Set Name',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteChatStickerSet', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteChatStickerSet({ chatId: 427770117 });

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteChatStickerSet'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #deleteChatStickerSet shorthand', async () => {
  const telegram = new TelegramClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await telegram.deleteChatStickerSet(427770117);

  expect(res).toEqual(true);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/deleteChatStickerSet'
  );
  expect(request?.body).toEqual({
    chat_id: 427770117,
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
