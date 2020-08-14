import { OnRequestFunction } from 'messaging-api-common';

export namespace SlackTypes {
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

  export type Message = {
    text?: string;
    attachments?: Attachment[] | string;
    blocks?: MessageBlock[] | string;
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
    type: 'actions';
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

  // Slack API Payloads
  type CommonOptions = {
    token?: string;
    accessToken?: string;
  };

  // channels.info
  // https://api.slack.com/methods/channels.info
  export type GetInfoOptions = CommonOptions & {
    includeLocale?: boolean;
  };

  // users.info
  // https://api.slack.com/methods/users.info
  export type UserInfoOptions = CommonOptions & {
    includeLocale?: boolean;
  };

  export interface PostMessageOptionalOptions extends CommonOptions {
    asUser?: boolean;
    attachments?: string | Attachment[];
    iconEmoji?: string;
    iconUrl?: string;
    linkNames?: boolean;
    parse?: 'none' | 'full';
    replyBroadcast?: boolean;
    threadTs?: string;
    unfurlLinks?: boolean;
    unfurlMedia?: boolean;
    username?: string;
  }

  export type PostEphemeralOptionalOptions = CommonOptions & {
    /**
     * Pass true to post the message as the authed user. Defaults to true if the chat:write:bot scope is not included. Otherwise, defaults to false.
     */
    asUser?: boolean;
    /**
     * A JSON-based array of structured attachments, presented as a URL-encoded string.
     */
    attachments?: string | Attachment[];
    /**
     * Find and link channel names and usernames.
     */
    linkNames?: boolean;
    /**
     * Change how messages are treated. Defaults to `none`. See below.
     */
    parse?: 'none' | 'full';
  };

  // chat.postMessage
  // https://api.slack.com/methods/chat.postMessage
  export type PostMessageOptions = PostMessageOptionalOptions &
    Message & {
      channel: string;
    };

  // chat.postEphemeral
  // https://api.slack.com/methods/chat.postEphemeral
  export type PostEphemeralOptions = PostEphemeralOptionalOptions &
    Message & {
      /**
       * Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name.
       */
      channel: string;
      /**
       * `id` of the user who will receive the ephemeral message. The user should be in the `channel` specified by the channel argument.
       */
      user: string;
    };

  // chat.update
  // https://api.slack.com/methods/chat.update
  export type UpdateMessageOptions = CommonOptions &
    Message & {
      /**
       * Channel containing the message to be updated.
       */
      channel: string;
      /**
       * Timestamp of the message to be updated.
       */
      ts: string;
      /**
       * Pass true to update the message as the authed user. Bot users in this context are considered authed users.
       */
      asUser?: boolean;
      /**
       * A JSON-based array of structured attachments, presented as a URL-encoded string. This field is required when not presenting text. If you don't include this field, the message's previous attachments will be retained. To remove previous attachments, include an empty array for this field.
       */
      attachments?: string | Attachment[];
      /**
       * A JSON-based array of structured blocks, presented as a URL-encoded string. If you don't include this field, the message's previous blocks will be retained. To remove previous blocks, include an empty array for this field.
       */
      blocks?: any; // FIXME
      /**
       * Find and link channel names and usernames. Defaults to none. If you do not specify a value for this field, the original value set for the message will be overwritten with the default, none.
       */
      linkNames?: boolean;
      /**
       * Change how messages are treated. Defaults to client, unlike chat.postMessage. Accepts either none or full. If you do not specify a value for this field, the original value set for the message will be overwritten with the default, client.
       */
      parse?: 'none' | 'full';
      /**
       * New text for the message, using the default formatting rules. It's not required when presenting blocks or attachments.
       */
      text?: string;
    };

  // chat.delete
  // https://api.slack.com/methods/chat.delete
  export type DeleteMessageOptions = CommonOptions & {
    /**
     * Channel containing the message to be deleted.
     */
    channel: string;
    /**
     * Timestamp of the message to be deleted.
     */
    ts: string;
    /**
     * Pass true to delete the message as the authed user with chat:write:user scope. Bot users in this context are considered authed users. If unused or false, the message will be deleted with chat:write:bot scope.
     */
    asUser?: boolean;
  };

  // chat.getPermalink
  // https://api.slack.com/methods/chat.getPermalink
  export type GetPermalinkOptions = CommonOptions & {
    /**
     * The ID of the conversation or channel containing the message
     */
    channel: string;
    /**
     * A message's ts value, uniquely identifying it within a channel
     */
    messageTs: string;
  };

  // chat.meMessage
  // https://api.slack.com/methods/chat.meMessage
  export type MeMessageOptions = CommonOptions & {
    /**
     * Channel to send message to. Can be a public channel, private group or IM channel. Can be an encoded ID, or a name.
     */
    channel: string;
    /**
     * Text of the message to send.
     */
    text: string;
  };

  // chat.deleteScheduledMessage
  // https://api.slack.com/methods/chat.deleteScheduledMessage
  export type DeleteScheduledMessageOptions = CommonOptions & {
    /**
     * The channel the scheduled message is posting to
     */
    channel: string;
    /**
     * `scheduledMessageId` returned from call to chat.scheduleMessage
     */
    scheduledMessageId: string;
    /**
     * Pass true to delete the message as the authed user with chat:write:user scope. Bot users in this context are considered authed users. If unused or false, the message will be deleted with chat:write:bot scope.
     */
    asUser?: boolean;
  };

  // chat.scheduleMessage
  // https://api.slack.com/methods/chat.scheduleMessage
  export type ScheduleMessageOptions = CommonOptions &
    Message & {
      /**
       * Channel, private group, or DM channel to send message to. Can be an encoded ID, or a name. See below for more details.
       */
      channel: string;
      /**
       * Pass true to post the message as the authed user, instead of as a bot. Defaults to false. See chat.postMessage.
       */
      asUser?: boolean;
      /**
       * A JSON-based array of structured attachments, presented as a URL-encoded string.
       */
      attachments?: string | Attachment[];
      /**
       * Find and link channel names and usernames.
       */
      linkNames?: boolean;
      /**
       * Change how messages are treated. Defaults to none. See chat.postMessage.
       */
      parse?: 'none' | 'full';
      /**
       * Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to false.
       */
      replyBroadcast?: boolean;
      /**
       * Provide another message's ts value to make this message a reply. Avoid using a reply's ts value; use its parent instead.
       */
      threadTs?: string;
      /**
       * Pass true to enable unfurling of primarily text-based content.
       */
      unfurlLinks?: boolean;
      /**
       * Pass false to disable unfurling of media content.
       */
      unfurlMedia?: boolean;
      /**
       * Unix EPOCH timestamp of time in future to send the message.
       */
      postAt?: string;
    };

  // chat.scheduledMessages.list
  // https://api.slack.com/methods/chat.scheduledMessages.list
  export type GetScheduledMessagesOptions = CommonOptions & {
    /**
     * The channel of the scheduled messages
     */
    channel?: string;
    /**
     * For pagination purposes, this is the `cursor` value returned from a previous call to `chat.scheduledmessages.list` indicating where you want to start this call from.
     */
    cursor?: string;
    /**
     * A UNIX timestamp of the latest value in the time range
     */
    latest?: string;
    /**
     * Maximum number of original entries to return.
     */
    limit?: number;
    /**
     * A UNIX timestamp of the oldest value in the time range
     */
    oldest?: string;
  };

  // conversations.members
  // https://api.slack.com/methods/conversations.members
  export type ConversationMembersOptions = CommonOptions & {
    cursor?: string;
    limit?: number;
  };

  // conversations.list
  // https://api.slack.com/methods/conversations.list
  export type ConversationListOptions = CommonOptions & {
    cursor?: string;
    excludeArchived?: boolean;
    limit?: number;
    types?: string;
  };

  // users.list
  // https://api.slack.com/methods/users.list
  export type UserListOptions = CommonOptions & {
    cursor?: string;
    includeLocale?: boolean;
    limit?: number;
  };

  export type ClientConfig = {
    accessToken: string;
    origin?: string;
    onRequest?: OnRequestFunction;
  };

  // chat.unfurl
  // https://api.slack.com/methods/chat.unfurl
  export type UnfurlOptions = CommonOptions & {
    /**
     * Channel ID of the message
     */
    channel: string;
    /**
     * Timestamp of the message to add unfurl behavior to.
     */
    ts: string;
    /**
     * URL-encoded JSON map with keys set to URLs featured in the the message, pointing to their unfurl blocks or message attachments.
     */
    unfurls: Record<string, any>;
    /**
     * Provide a simply-formatted string to send as an ephemeral message to the user as invitation to authenticate further and enable full unfurling behavior
     */
    userAuthMessage?: string;
    /**
     * Set to true or 1 to indicate the user must install your Slack app to trigger unfurls for this domain
     */
    userAuthRequired?: boolean;
    /**
     * Send users to this custom URL where they will complete authentication in your app to fully trigger unfurling. Value should be properly URL-encoded.
     */
    userAuthUrl?: string;
  };

  // views.open
  // https://api.slack.com/methods/views.open
  export type OpenViewOptions = {
    /**
     * Exchange a trigger to post to the user.
     */
    triggerId: string;
    /**
     * A view payload.
     */
    view: View;
  };

  // views.publish
  // https://api.slack.com/methods/views.publish
  export type PublishViewOptions = {
    /**
     * `id` of the user you want publish a view to.
     */
    userId: string;
    /**
     * A view payload.
     */
    view: View;
    /**
     * A string that represents view state to protect against possible race conditions.
     */
    hash?: string;
  };

  // views.update
  // https://api.slack.com/methods/views.update
  export type UpdateViewOptions = {
    /**
     * A view object.
     */
    view: View;
    /**
     * A unique identifier of the view set by the developer. Must be unique for all views on a team. Max length of 255 characters. Either viewId or externalId is required.
     */
    externalId?: string;
    /**
     * A string that represents view state to protect against possible race conditions.
     */
    hash?: string;
    /**
     * A unique identifier of the view to be updated. Either viewId or externalId is required.
     */
    viewId?: string;
  };

  // views.push
  // https://api.slack.com/methods/views.push
  export type PushViewOptions = {
    /**
     * Exchange a trigger to post to the user.
     */
    triggerId: string;
    /**
     * A view payload.
     */
    view: View;
  };
}
