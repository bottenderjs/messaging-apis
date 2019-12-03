export type Attachment = {
  fallback: string;
  pretext?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  title?: string;
  titleLink?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    short: boolean;
  }[];
  imageUrl?: string;
  thumbUrl?: string;
  footer?: string;
  footerIcon?: string;
  callbackId?: string;
  attachmentType?: string;
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
      okText?: string;
      dismissText?: string;
    };
  }[];
  ts?: number;
};

// Block Kit

// Composition Objects
// https://api.slack.com/reference/block-kit/composition-objects

export type CompositionObject = TextObject | ConfirmObject | OptionObject;

export type TextObject = PlainTextObject | MrkdwnObject;

export type PlainTextObject = {
  type: 'plain_text';
  text: string;
  emoji?: boolean;
};

export type MrkdwnObject = {
  type: 'mrkdwn';
  text: string;
  verbatim?: boolean;
};

// https://api.slack.com/reference/block-kit/composition-objects#confirm
export type ConfirmObject = {
  title: PlainTextObject;
  text: TextObject;
  confirm: PlainTextObject;
  deny: PlainTextObject;
};

// https://api.slack.com/reference/block-kit/composition-objects#option
export type OptionObject = {
  text: PlainTextObject;
  value: string;
  url?: string; // TODO: The url attribute is only available in overflow menus
};

// https://api.slack.com/reference/block-kit/composition-objects#option_group
export type OptionGroupObject = {
  label: PlainTextObject;
  options: OptionObject[];
};

// Block Elements
// https://api.slack.com/reference/block-kit/block-elements

export type BlockElement =
  | ButtonElement
  | DatepickerElement
  | ImageElement
  | MultiSelectElement
  | OverflowElement
  | PlainTextInputElement
  | RadioButtonsElement
  | SelectElement;

export type ButtonElement = {
  type: 'button';
  text: PlainTextObject;
  actionId: string;
  url?: string;
  value?: string;
  style?: 'primary' | 'danger';
  confirm?: ConfirmObject;
};

export type DatepickerElement = {
  type: 'datepicker';
  actionId: string;
  placeholder?: PlainTextObject;
  initialDate?: string;
  confirm?: ConfirmObject;
};

export type ImageElement = {
  type: 'image';
  imageUrl: string;
  altText: string;
};

export type MultiSelectElement =
  | MultiStaticSelectElement
  | MultiExternalSelectElement
  | MultiUsersSelectElement
  | MultiConversationsSelectElement
  | MultiChannelsSelectElement;

export type MultiStaticSelectElement = {
  type: 'multi_static_select';
  placeholder: PlainTextObject;
  actionId: string;
  options: OptionObject[]; // TODO: If option_groups is specified, this field should not be.
  optionGroups?: OptionGroupObject[]; // TODO: If options is specified, this field should not be.
  initialOptions?: OptionObject[];
  confirm?: ConfirmObject;
};

export type MultiExternalSelectElement = {
  type: 'multi_external_select';
  placeholder: PlainTextObject;
  actionId: string;
  minQueryLength?: number;
  initialOptions?: OptionObject[];
  confirm?: ConfirmObject;
};

export type MultiUsersSelectElement = {
  type: 'multi_users_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialUsers?: string[];
  confirm?: ConfirmObject;
};

export type MultiConversationsSelectElement = {
  type: 'multi_conversations_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialConversations?: string[];
  confirm?: ConfirmObject;
};

export type MultiChannelsSelectElement = {
  type: 'multi_channels_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialChannels?: string[];
  confirm?: ConfirmObject;
};

export type OverflowElement = {
  type: 'overflow';
  actionId: string;
  options: OptionObject[];
  confirm?: ConfirmObject;
};

export type PlainTextInputElement = {
  type: 'plain_text_input';
  actionId: string;
  placeholder?: PlainTextObject;
  initialValue: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
};

export type RadioButtonsElement = {
  type: 'radio_buttons';
  actionId: string;
  options: OptionObject[];
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type SelectElement =
  | StaticSelectElement
  | ExternalSelectElement
  | UsersSelectElement
  | ConversationsSelectElement
  | ChannelsSelectElement;

export type StaticSelectElement = {
  type: 'static_select';
  placeholder: PlainTextObject;
  actionId: string;
  options: OptionObject[]; // TODO: If option_groups is specified, this field should not be.
  optionGroups?: OptionGroupObject[]; // TODO: If options is specified, this field should not be.
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type ExternalSelectElement = {
  type: 'external_select';
  placeholder: PlainTextObject;
  actionId: string;
  minQueryLength?: number;
  initialOption?: OptionObject;
  confirm?: ConfirmObject;
};

export type UsersSelectElement = {
  type: 'users_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialUser?: string;
  confirm?: ConfirmObject;
};

export type ConversationsSelectElement = {
  type: 'conversations_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialConversation?: string;
  confirm?: ConfirmObject;
};

export type ChannelsSelectElement = {
  type: 'channels_select';
  placeholder: PlainTextObject;
  actionId: string;
  initialChannel?: string;
  confirm?: ConfirmObject;
};

// Layout Blocks
// https://api.slack.com/reference/block-kit/blocks

export type MessageBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | FileBlock
  | ImageBlock
  | SectionBlock;

export type ModalBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | ImageBlock
  | InputBlock
  | SectionBlock;

export type HomeBlock =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | ImageBlock
  | SectionBlock;

export type ActionsBlockElement =
  | ButtonElement
  | SelectElement
  | OverflowElement
  | DatepickerElement;

export type ActionsBlock = {
  type: 'action';
  elements: ActionsBlockElement[];
  blockId?: string;
};

export type ContextBlockElement = TextObject | ImageElement;

export type ContextBlock = {
  type: 'context';
  elements: ContextBlockElement[];
  blockId?: string;
};

export type DividerBlock = {
  type: 'divider';
  blockId?: string;
};

export type FileBlock = {
  type: 'file';
  externalId: string;
  source: string;
  blockId?: string;
};

export type ImageBlock = {
  type: 'image';
  imageUrl: string;
  altText: string;
  title?: PlainTextObject;
  blockId?: string;
};

export type InputBlockElement =
  | PlainTextInputElement
  | SelectElement
  | MultiSelectElement
  | DatepickerElement;

export type InputBlock = {
  type: 'input';
  label: PlainTextObject;
  element: InputBlockElement;
  blockId?: string;
  hint?: PlainTextObject;
  optional?: boolean;
};

export type SectionBlock = {
  type: 'section';
  text: TextObject;
  blockId?: string;
  fields?: TextObject[];
  accessory?: BlockElement;
};

// View
// https://api.slack.com/reference/surfaces/views
export type ViewCommon = {
  privateMetadata?: string;
  callbackId?: string;
  externalId?: string;
};

export type ModalView = {
  type: 'modal';
  title: PlainTextObject;
  blocks: ModalBlock[];
  close?: PlainTextObject;
  submit?: PlainTextObject;
  clearOnClose?: boolean;
  notifyOnClose?: boolean;
} & ViewCommon;

export type HomeView = {
  type: 'home';
  blocks: HomeBlock[];
} & ViewCommon;

export type View = ModalView | HomeView;

export type SendMessageSuccessResponse = 'ok';

export type OAuthAPIResponse = Record<string, any> & {
  ok: boolean;
};

export type AvailableMethod =
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
  | 'chat.getPermalink'
  | 'chat.scheduleMessage'
  | 'chat.deleteScheduledMessage'
  | 'chat.scheduledMessages.list'
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
  | 'users.profile.set'
  | 'views.open'
  | 'views.publish'
  | 'views.update'
  | 'views.push';

export interface User {
  id: string;
  name: string;
  realName: string;
}

export type Channel = {
  id: string;
  name: string;
  members?: User[];
};
