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

describe('group api', () => {
  describe('#kickChatMember', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should kick chat member with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/kickChatMember', {
          chat_id: 427770117,
          user_id: 313534466,
          until_date: 1502855973,
        })
        .reply(200, reply);

      const res = await client.kickChatMember(427770117, 313534466, {
        until_date: 1502855973,
      });
      expect(res).toEqual(result);
    });

    it('should kick chat member with camelcase', async () => {
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

  describe('#unbanChatMember', () => {
    it('should unban chat member', async () => {
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
  });

  describe('#restrictChatMember', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should restrict chat member with snakecase', async () => {
      const { client, mock } = createMock();
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
          can_send_messages: true,
          can_send_media_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_change_info: true,
          can_invite_users: true,
          can_pin_messages: true,
        },
        {
          until_date: 1577721600,
        }
      );
      expect(res).toEqual(result);
    });
    it('should restrict chat member with camelcase', async () => {
      const { client, mock } = createMock();
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
  });

  describe('#promoteChatMember', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should pormote chat member with snakecase', async () => {
      const { client, mock } = createMock();
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
        can_change_info: true,
        can_post_messages: true,
        can_edit_messages: true,
        can_delete_messages: true,
        can_invite_users: true,
        can_restrict_members: true,
        can_pin_messages: true,
        can_promote_members: true,
      });
      expect(res).toEqual(result);
    });

    it('should pormote chat member with camelcase', async () => {
      const { client, mock } = createMock();
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
  });

  describe('#setChatPermissions', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should set chat permissions with snakecase', async () => {
      const { client, mock } = createMock();
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
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: true,
        can_invite_users: true,
        can_pin_messages: true,
      });
      expect(res).toEqual(result);
    });

    it('should set chat permissions with camelcase', async () => {
      const { client, mock } = createMock();
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
  });

  describe('#exportChatInviteLink', () => {
    it('should export chat invite link', async () => {
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
  });

  describe('#deleteChatPhoto', () => {
    it('should delete chat photo', async () => {
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
  });

  describe('#setChatTitle', () => {
    it('should set chat title', async () => {
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
  });

  describe('#setChatDescription', () => {
    it('should set chat description', async () => {
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
  });

  describe('#setChatStickerSet', () => {
    it('should set a new group sticker set', async () => {
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
  });

  describe('#deleteChatStickerSet', () => {
    it('should set a new group sticker set', async () => {
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
  });

  describe('#pinChatMessage', () => {
    const result = true;
    const reply = {
      ok: true,
      result,
    };

    it('should pin a message in chat with snakecase', async () => {
      const { client, mock } = createMock();
      mock
        .onPost('/pinChatMessage', {
          chat_id: 427770117,
          message_id: 1,
          disable_notification: true,
        })
        .reply(200, reply);

      const res = await client.pinChatMessage(427770117, 1, {
        disable_notification: true,
      });
      expect(res).toEqual(result);
    });

    it('should pin a message in chat with camelcase', async () => {
      const { client, mock } = createMock();
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
  });

  describe('#unpinChatMessage', () => {
    it('should unpin a message in chat', async () => {
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
  });

  describe('#leaveChat', () => {
    it('should leave chat', async () => {
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
  });
});
