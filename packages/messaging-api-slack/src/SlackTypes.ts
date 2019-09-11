export type SlackAttachment = {
  fallback: string;
  pretext?: string;
  color?: string;
  author_name?: string;
  author_link?: string;
  author_icon?: string;
  title?: string;
  title_link?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    short: boolean;
  }[];
  image_url?: string;
  thumb_url?: string;
  footer?: string;
  footer_icon?: string;
  callback_id?: string;
  attachment_type?: string;
  actions: {
    name?: string;
    text?: string;
    type?: string;
    value?: string;
    style?: string;
    options?: { text: string; value: string }[];
    confirm?: {
      title?: string;
      text?: string;
      ok_text?: string;
      dismiss_text?: string;
    };
  }[];
  ts?: number;
};

export type SendMessageSuccessResponse = 'ok';

export type SlackOAuthAPIResponse = Record<string, any> & {
  ok: boolean;
};

export type SlackAvailableMethod =
  | 'api.test'
  | 'apps.permissions.info'
  | 'apps.permissions.request'
  | 'auth.revoke'
  | 'auth.test'
  | 'bots.info'
  | 'channels.archive'
  | 'channels.create'
  | 'channels.history'
  | 'channels.info'
  | 'channels.invite'
  | 'channels.join'
  | 'channels.kick'
  | 'channels.leave'
  | 'channels.list'
  | 'channels.mark'
  | 'channels.rename'
  | 'channels.replies'
  | 'channels.setPurpose'
  | 'channels.setTopic'
  | 'channels.unarchive'
  | 'chat.delete'
  | 'chat.meMessage'
  | 'chat.postEphemeral'
  | 'chat.postMessage'
  | 'chat.unfurl'
  | 'chat.update'
  | 'conversations.archive'
  | 'conversations.close'
  | 'conversations.create'
  | 'conversations.history'
  | 'conversations.info'
  | 'conversations.invite'
  | 'conversations.join'
  | 'conversations.kick'
  | 'conversations.leave'
  | 'conversations.list'
  | 'conversations.members'
  | 'conversations.open'
  | 'conversations.rename'
  | 'conversations.replies'
  | 'conversations.setPurpose'
  | 'conversations.setTopic'
  | 'conversations.unarchive'
  | 'dnd.endDnd'
  | 'dnd.endSnooze'
  | 'dnd.info'
  | 'dnd.setSnooze'
  | 'dnd.teamInfo'
  | 'emoji.list'
  | 'files.comments.add'
  | 'files.comments.delete'
  | 'files.comments.edit'
  | 'files.delete'
  | 'files.info'
  | 'files.list'
  | 'files.revokePublicURL'
  | 'files.sharedPublicURL'
  | 'files.upload'
  | 'groups.archive'
  | 'groups.create'
  | 'groups.createChild'
  | 'groups.history'
  | 'groups.info'
  | 'groups.invite'
  | 'groups.kick'
  | 'groups.leave'
  | 'groups.list'
  | 'groups.mark'
  | 'groups.open'
  | 'groups.rename'
  | 'groups.replies'
  | 'groups.setPurpose'
  | 'groups.setTopic'
  | 'groups.unarchive'
  | 'im.close'
  | 'im.history'
  | 'im.list'
  | 'im.mark'
  | 'im.open'
  | 'im.replies'
  | 'oauth.access'
  | 'oauth.token'
  | 'pins.add'
  | 'pins.list'
  | 'pins.remove'
  | 'reactions.add'
  | 'reactions.get'
  | 'reactions.list'
  | 'reactions.remove'
  | 'reminders.add'
  | 'reminders.complete'
  | 'reminders.delete'
  | 'reminders.info'
  | 'reminders.list'
  | 'rtm.connect'
  | 'rtm.start'
  | 'search.all'
  | 'search.files'
  | 'search.messages'
  | 'stars.add'
  | 'stars.list'
  | 'stars.remove'
  | 'team.accessLogs'
  | 'team.billableInfo'
  | 'team.info'
  | 'team.integrationLogs'
  | 'team.profile.get'
  | 'usergroups.create'
  | 'usergroups.disable'
  | 'usergroups.enable'
  | 'usergroups.list'
  | 'usergroups.update'
  | 'usergroups.users.list'
  | 'usergroups.users.update'
  | 'users.deletePhoto'
  | 'users.getPresence'
  | 'users.identity'
  | 'users.info'
  | 'users.list'
  | 'users.setActive'
  | 'users.setPhoto'
  | 'users.setPresence'
  | 'users.profile.get'
  | 'users.profile.set';

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
}

export type SlackChannel = {
  id: string;
  name: string;
  members?: Array<SlackUser>;
};
