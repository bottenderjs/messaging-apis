import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type Update = {
  updateId: number;
  message?: Message;
  editedMessage?: Message;
  channelPost?: Message;
  editedChannelPost?: Message;
  inlineQuery?: InlineQuery;
  chosenInlineResult?: ChosenInlineResult;
  callbackQuery?: CallbackQuery;
  shippingQuery?: ShippingQuery;
  preCheckoutQuery?: PreCheckoutQuery;
  poll?: Poll;
  pollAnswer?: PollAnswer;
};

/**
 * Contains information about the current status of a webhook.
 */
export type WebhookInfo = {
  /**
   * Webhook URL, may be empty if webhook is not set up
   */
  url: string;

  /**
   * True, if a custom certificate was provided for webhook certificate checks
   */
  hasCustomCertificate: boolean;

  /**
   * Number of updates awaiting delivery
   */
  pendingUpdateCount: number;

  /**
   * Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook
   */
  lastErrorDate?: number;

  /**
   * Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
   */
  lastErrorMessage?: string;

  /**
   * Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
   */
  maxConnections?: number;

  /**
   * Optional. A list of update types the bot is subscribed to. Defaults to all update types
   */
  allowedUpdates?: string[];
};

/**
 * This object represents a Telegram user or bot.
 */
export type User = {
  /**
   * Unique identifier for this user or bot
   */
  id: number;

  /**
   * True, if this user is a bot
   */
  isBot: boolean;

  /**
   * User‘s or bot’s first name
   */
  firstName: string;

  /**
   * Optional. User‘s or bot’s last name
   */
  lastName?: string;

  /**
   * Optional. User‘s or bot’s username
   */
  username?: string;

  /**
   * Optional. (IETF language tag)[https://en.wikipedia.org/wiki/IETF_language_tag] of the user's language
   */
  languageCode?: string;

  /**
   * Optional. True, if the bot can be invited to groups. Returned only in getMe.
   */
  canJoinGroups?: boolean;

  /**
   * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
   */
  canReadAllGroupMessages?: boolean;

  /**
   * Optional. True, if the bot supports inline queries. Returned only in getMe.
   */
  supportsInlineQueries?: boolean;
};

// TODO: separate different type because some fields returned only in getChat.
export type Chat = {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: ChatPhoto;
  description?: string;
  inviteLink?: string;
  pinnedMessage?: Message;
  permissions?: ChatPermissions;
  stickerSetName?: string;
  canSetStickerSet?: boolean;
};

export type Message = {
  messageId: number;
  from?: User; // TODO: empty for messages sent to channels
  date: number;
  chat: Chat;
  forwardFrom?: User;
  forwardFromChat?: Chat;
  forwardFromMessageId?: number;
  forwardSignature?: string;
  forwardSenderName?: string;
  forwardDate?: number;
  replyToMessage?: Message;
  editDate?: number;
  mediaGroupId?: string;
  authorSignature?: string;
  text?: string;
  entities?: MessageEntity[];
  captionEntities?: MessageEntity[];
  audio?: Audio;
  document?: Document;
  animation?: Animation;
  game?: Game;
  photo?: PhotoSize[];
  sticker?: Sticker;
  video?: Video;
  voice?: Voice;
  videoNote?: VideoNote;
  caption?: string;
  contact?: Contact;
  location?: Location;
  venue?: Venue;
  poll?: Poll;
  newChatMembers?: User[];
  leftChatMember?: User;
  newChatTitle?: string;
  newChatPhoto?: PhotoSize[];
  deleteChatPhoto?: boolean;
  groupChatCreated?: boolean;
  supergroupChatCreated?: boolean;
  channelChatCreated?: boolean;
  migrateToChatId?: number;
  migrateFromChatId?: number;
  pinnedMessage?: Message;
  invoice?: Invoice;
  successfulPayment?: SuccessfulPayment;
  connectedWebsite?: string;
  passportData?: PassportData;
  replyMarkup?: InlineKeyboardMarkup;
};

export type MessageEntity = {
  type:
    | 'mention'
    | 'hashtag'
    | 'cashtag'
    | 'bot_command'
    | 'url'
    | 'email'
    | 'phone_number'
    | 'bold'
    | 'italic'
    | 'code'
    | 'pre'
    | 'text_link'
    | 'text_mention';
  offset: number;
  length: number;
  url?: string;
  user?: User;
};

export type PhotoSize = {
  fileId: string;
  width: number;
  height: number;
  fileSize?: number;
};

export type Audio = {
  fileId: string;
  duration: number;
  performer?: string;
  title?: string;
  mimeType?: string;
  fileSize?: number;
  thumb?: PhotoSize;
};

export type Document = {
  fileId: string;
  thumb?: PhotoSize;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export type Video = {
  fileId: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mimeType?: string;
  fileSize?: number;
};

export type Animation = {
  fileId: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export type Voice = {
  fileId: string;
  duration: number;
  mimeType?: string;
  fileSize?: number;
};

export type VideoNote = {
  fileId: string;
  length: number;
  duration: number;
  thumb?: PhotoSize;
  fileSize?: number;
};

export type Contact = {
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  userId?: number;
  vcard?: string;
};

/**
 * This object represents a point on the map.
 */
export type Location = {
  /**
   * Longitude as defined by sender
   */
  longitude: number;
  /**
   * Latitude as defined by sender
   */
  latitude: number;
};

/**
 * This object represents a venue.
 */
export type Venue = {
  /**
   * Latitude of the venue
   */
  latitude: number;

  /**
   * Longitude of the venue
   */
  longitude: number;

  /**
   * Name of the venue
   */
  title: string;

  /**
   * Address of the venue
   */
  address: string;

  /**
   * Optional. Foursquare identifier of the venue
   */
  foursquareId?: string;

  /**
   * Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
   */
  foursquareType?: string;
};

export type PollOption = {
  text: string;
  voterCount: number;
};

export type Poll = {
  /**
   * Unique poll identifier
   */
  id: string;

  /**
   * Poll question, 1-255 characters
   */
  question: string;

  /**
   * List of poll options
   */
  options: PollOption[];

  /**
   * Total number of users that voted in the poll
   */
  totalVoterCount: number;

  /**
   * True, if the poll is closed
   */
  isClosed: boolean;

  /**
   * True, if the poll is anonymous
   */
  isAnonymous: boolean;

  /**
   * Poll type, currently can be “regular” or “quiz”
   */
  type: string;

  /**
   * True, if the poll allows multiple answers
   */
  allowsMultipleAnswers: boolean;

  /**
   * Optional. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot.
   */
  correctOptionId?: number;

  /**
   * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters
   */
  explanation?: string;

  /**
   * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
   */
  explanationEntities?: MessageEntity[];

  /**
   * Optional. Amount of time in seconds the poll will be active after creation
   */
  openPeriod?: number;

  /**
   * Optional. Point in time (Unix timestamp) when the poll will be automatically closed
   */
  closeDate?: number;
};

/**
 * This object represents an answer of a user in a non-anonymous poll.
 */
export type PollAnswer = {
  /**
   * Unique poll identifier
   */
  pollId: string;

  /**
   * The user, who changed the answer to the poll
   */
  user: User;

  /**
   * 0-based identifiers of answer options, chosen by the user. May be empty if the user retracted their vote.
   */
  optionIds: number[];
};

export type UserProfilePhotos = {
  totalCount: number;
  photos: PhotoSize[][];
};

export type File = {
  fileId: string;
  fileSize?: number;
  filePath: string;
};

/**
 * This object represents a custom keyboard with reply options.
 *
 * - https://core.telegram.org/bots#keyboards
 * - https://core.telegram.org/bots/api#replykeyboardmarkup
 */
export type ReplyKeyboardMarkup = {
  /**
   * Array of button rows, each represented by an Array of KeyboardButton objects
   *
   * - https://core.telegram.org/bots/api#keyboardbutton
   */
  keyboard: KeyboardButton[][];

  /**
   * Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard.
   */
  resizeKeyboard?: boolean;

  /**
   * Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat – the user can press a special button in the input field to see the custom keyboard again. Defaults to false.
   */
  oneTimeKeyboard?: boolean;

  /**
   * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are `@mentioned` in the text of the Message object; 2) if the bot's message is a reply (has replyToMessageId), sender of the original message.
   *
   * Example: A user requests to change the bot‘s language, bot replies to the request with a keyboard to select the new language. Other users in the group don’t see the keyboard.
   */
  selective?: boolean;
};

/**
 * This object represents one button of the reply keyboard. For simple text buttons String can be used instead of this object to specify text of the button. Optional fields are mutually exclusive.
 *
 * - https://core.telegram.org/bots/api#keyboardbutton
 */
export type KeyboardButton = {
  /**
   * Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
   */
  text: string;

  /**
   * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only
   */
  requestContact?: boolean;

  /**
   * Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only
   */
  requestLocation?: boolean;
};

/**
 * Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see ReplyKeyboardMarkup).
 *
 * - https://core.telegram.org/bots/api#replykeyboardremove
 * - https://core.telegram.org/bots/api#replykeyboardmarkup
 */
export type ReplyKeyboardRemove = {
  /**
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use oneTimeKeyboard in ReplyKeyboardMarkup)
   */
  removeKeyboard: true;

  /**
   * Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets:
   * 1. users that are `@mentioned` in the text of the Message object
   * 2. if the bot's message is a reply (has replyToMessageId), sender of the original message.
   *
   * Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.
   */
  selective?: boolean;
};

/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 *
 * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
 */
export type InlineKeyboardMarkup = {
  /**
   * Array of button rows, each represented by an Array of InlineKeyboardButton objects
   *
   * - https://core.telegram.org/bots/api#inlinekeyboardbutton
   */
  inlineKeyboard: InlineKeyboardButton[][];
};

/**
 * This object represents one button of an inline keyboard. You must use exactly one of the optional fields.
 *
 * - https://core.telegram.org/bots/api#inlinekeyboardbutton
 */
export type InlineKeyboardButton = {
  /**
   * Label text on the button
   */
  text: string;

  /**
   * Optional. HTTP or tg:// url to be opened when button is pressed
   */
  url?: string;

  /**
   * Optional. An HTTP URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget.
   *
   * - https://core.telegram.org/bots/api#loginurl
   * - https://core.telegram.org/widgets/login
   */
  loginUrl?: LoginUrl;

  /**
   * Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
   */
  callbackData?: string;

  /**
   * Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field. Can be empty, in which case just the bot’s username will be inserted.
   *
   * Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a private chat with it. Especially useful when combined with switchPm… actions – in this case the user will be automatically returned to the chat they switched from, skipping the chat selection screen.
   */
  switchInlineQuery?: string;

  /**
   * Optional. If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field. Can be empty, in which case only the bot’s username will be inserted.
   *
   * This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting something from multiple options.
   */
  switchInlineQueryCurrentChat?: string;

  /**
   * Optional. Description of the game that will be launched when the user presses the button.
   *
   * NOTE: This type of button must always be the first button in the first row.
   *
   * - https://core.telegram.org/bots/api#callbackgame
   */
  callbackGame?: CallbackGame;

  /**
   * Optional. Specify True, to send a Pay button.
   *
   * NOTE: This type of button must always be the first button in the first row.
   *
   * - https://core.telegram.org/bots/api#payments
   */
  pay?: boolean;
};

/**
 * This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the Telegram Login Widget when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:
 *
 * - https://core.telegram.org/bots/api#loginurl
 */
export type LoginUrl = {
  /**
   * An HTTP URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data.
   *
   * NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.
   *
   * - https://core.telegram.org/widgets/login#receiving-authorization-data
   * - https://core.telegram.org/widgets/login#checking-authorization
   */
  url: string;

  /**
   * Optional. New text of the button in forwarded messages.
   */
  forwardText?: string;

  /**
   * Optional. Username of a bot, which will be used for user authorization. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details.
   *
   * - https://core.telegram.org/widgets/login#setting-up-a-bot
   * - https://core.telegram.org/widgets/login#linking-your-domain-to-the-bot
   */
  botUsername?: string;

  /**
   * Optional. Pass True to request the permission for your bot to send messages to the user.
   */
  requestWriteAccess?: boolean;
};

export type CallbackQuery = {
  /**
   * Unique identifier for this query
   */
  id: string;
  /**
   * Sender
   */
  from: User;
  /**
   * Optional. Message with the callback button that originated the query. Note that message content and message date will not be available if the message is too old
   */
  message?: Message;
  /**
   * Optional. Identifier of the message sent via the bot in inline mode, that originated the query.
   */
  inlineMessageId?: string;
  /**
   * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
   */
  chatInstance: string;
  /**
   * Optional. Data associated with the callback button. Be aware that a bad client can send arbitrary data in this field.
   */
  data?: string;
  /**
   * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
   */
  gameShortName?: string;
};

/**
 * Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot‘s message and tapped ’Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice privacy mode.
 *
 * - https://core.telegram.org/bots/api#forcereply
 * - https://core.telegram.org/bots#privacy-mode
 */
export type ForceReply = {
  /**
   * Shows reply interface to the user, as if they manually selected the bot‘s message and tapped ’Reply'
   */
  forceReply: boolean;

  /**
   * Optional. Use this parameter if you want to force reply from specific users only. Targets:
   * 1. users that are `@mentioned` in the text of the Message object;
   * 2. if the bot's message is a reply (has replyToMessageId), sender of the original message.
   */
  selective?: boolean;
};

export type ChatPhoto = {
  /**
   * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
   */
  smallFileId: string;

  /**
   * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
   */
  smallFileUniqueId: string;

  /**
   * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
   */
  bigFileId: string;

  /**
   * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
   */
  bigFileUniqueId: string;
};

export type ChatInviteLink = {
  /**
   * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.
   */
  inviteLink: string;

  /**
   * Creator of the link
   */
  creator: User;

  /**
   * True, if the link is primary
   */
  isPrimary: boolean;

  /**
   * True, if the link is revoked
   */
  isRevoked: boolean;

  /**
   * Optional. Point in time (Unix timestamp) when the link will expire or has been expired
   */
  expireDate?: number;

  /**
   * Optional. Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   */
  memberLimit?: number;
};

export type ChatMember = any;

/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
export type ChatPermissions = {
  /**
   * Optional. True, if the user is allowed to send text messages, contacts, locations and venues
   */
  canSendMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages
   */
  canSendMediaMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to send polls, implies can_send_messages
   */
  canSendPolls?: boolean;

  /**
   * Optional. True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages
   */
  canSendOtherMessages?: boolean;

  /**
   * Optional. True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages
   */
  canAddWebPagePreviews?: boolean;

  /**
   * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups
   */
  canChangeInfo?: boolean;

  /**
   * Optional. True, if the user is allowed to invite new users to the chat
   */
  canInviteUsers?: boolean;

  /**
   * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups
   */
  canPinMessages?: boolean;
};

export type ResponseParameters = any;

export type InputMedia =
  | InputMediaAnimation
  | InputMediaDocument
  | InputMediaAudio
  | InputMediaPhoto
  | InputMediaVideo;

export type InputMediaType =
  | 'photo'
  | 'video'
  | 'animation'
  | 'audio'
  | 'document';

export type InputMediaPhoto = {
  /**
   * Type of the result, must be photo
   */
  type: 'photo';

  /**
   * File to send. Pass a fileId to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL for Telegram to get a file from the Internet. Upload file is not supported yet.
   */
  media: string;

  /**
   * Optional. Caption of the photo to be sent, 0-1024 characters
   */
  caption?: string;

  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   */
  parseMode?: ParseMode;
};

export type InputMediaVideo = {
  /**
   * Type of the result, must be video
   */
  type: 'video';

  /**
   * File to send. Pass a fileId to send a file that exists on the Telegram servers (recommended) or pass an HTTP URL for Telegram to get a file from the Internet. Upload file is not supported yet.
   */
  media: string;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Optional. Caption of the video to be sent, 0-1024 characters
   */
  caption?: string;

  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   */
  parseMode?: string;

  /**
   * Optional. Video width
   */
  width?: number;

  /**
   * Optional. Video height
   */
  height?: number;

  /**
   * Optional. Video duration
   */
  duration?: number;

  /**
   * Optional. Pass True, if the uploaded video is suitable for streaming
   */
  supportsStreaming?: boolean;
};

export type InputMediaAnimation = {
  type: 'animation';
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type InputMediaAudio = {
  type: 'audio';
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
  duration?: number;
  performer?: string;
  title?: string;
};

export type InputMediaDocument = {
  type: 'document';
  media: string;
  thumb?: string;
  caption?: string;
  parseMode?: string;
};

export type ChatAction =
  | 'typing'
  | 'upload_photo'
  | 'record_video'
  | 'upload_video'
  | 'record_audio'
  | 'upload_audio'
  | 'upload_document'
  | 'find_location'
  | 'record_video_note'
  | 'upload_video_note';

// Stickers
export type Sticker = {
  fileId: string;
  width: number;
  height: number;
  isAnimated: boolean;
  thumb?: PhotoSize;
  emoji?: string;
  setName?: string;
  maskPosition?: MaskPosition;
  fileSize?: number;
};

export type StickerSet = {
  name: string;
  title: string;
  isAnimated: boolean;
  containsMasks: boolean;
  stickers: Sticker[];
};

export type MaskPosition = {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  xShift: number;
  yShift: number;
  scale: number;
};

// Inline Mode
export type InlineQuery = {
  id: string;
  from: User;
  location?: Location;
  query: string;
  offset: string;
};

export type InlineQueryResult =
  | InlineQueryResultCachedAudio
  | InlineQueryResultCachedDocument
  | InlineQueryResultCachedGif
  | InlineQueryResultCachedMpeg4Gif
  | InlineQueryResultCachedPhoto
  | InlineQueryResultCachedSticker
  | InlineQueryResultCachedVideo
  | InlineQueryResultCachedVoice
  | InlineQueryResultArticle
  | InlineQueryResultAudio
  | InlineQueryResultContact
  | InlineQueryResultGame
  | InlineQueryResultDocument
  | InlineQueryResultGif
  | InlineQueryResultLocation
  | InlineQueryResultMpeg4Gif
  | InlineQueryResultPhoto
  | InlineQueryResultVenue
  | InlineQueryResultVideo
  | InlineQueryResultVoice;

export type InlineQueryResultArticle = {
  type: 'article';
  id: string;
  title: string;
  inputMessageContent: InputMessageContent;
  replyMarkup?: InlineKeyboardMarkup;
  url?: string;
  hideUrl?: boolean;
  description?: string;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultPhoto = {
  type: 'photo';
  id: string;
  photoUrl: string;
  thumbUrl: string;
  title?: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultGif = {
  type: 'gif';
  id: string;
  gifUrl: string;
  gifWidth?: number;
  gifHeight?: number;
  gifDuration?: number;
  thumbUrl: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4Url: string;
  mpeg4Width?: number;
  mpeg4Height?: number;
  mpeg4Duration?: number;
  thumbUrl: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultVideo = {
  type: 'video';
  id: string;
  videoUrl: string;
  mimeType: string;
  thumbUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  videoWidth?: number;
  videoHeight?: number;
  videoDuration?: number;
  description?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultAudio = {
  type: 'audio';
  id: string;
  audioUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  performer?: string;
  audioDuration?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultVoice = {
  type: 'voice';
  id: string;
  voiceUrl: string;
  title: string;
  caption?: string;
  parseMode?: string;
  voiceDuration?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultDocument = {
  type: 'document';
  id: string;
  title: string;
  caption?: string;
  parseMode?: string;
  documentUrl: string;
  mimeType: string;
  description?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultLocation = {
  type: 'location';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  livePeriod?: number;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultVenue = {
  type: 'venue';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquareId?: string;
  foursquareType?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultContact = {
  type: 'contact';
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  vcard?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
  thumbUrl?: string;
  thumbWidth?: number;
  thumbHeight?: number;
};

export type InlineQueryResultGame = {
  type: 'game';
  id: string;
  gameShortName: string;
  replyMarkup?: InlineKeyboardMarkup;
};

export type InlineQueryResultCachedPhoto = {
  type: 'photo';
  id: string;
  photoFileId: string;
  title?: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedGif = {
  type: 'gif';
  id: string;
  gifFileId: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4FileId: string;
  title?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedSticker = {
  type: 'sticker';
  id: string;
  stickerFileId: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedDocument = {
  type: 'document';
  id: string;
  title: string;
  documentFileId: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedVideo = {
  type: 'video';
  id: string;
  videoFileId: string;
  title: string;
  description?: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedVoice = {
  type: 'voice';
  id: string;
  voiceFileId: string;
  title: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InlineQueryResultCachedAudio = {
  type: 'audio';
  id: string;
  audioFileId: string;
  caption?: string;
  parseMode?: string;
  replyMarkup?: InlineKeyboardMarkup;
  inputMessageContent?: InputMessageContent;
};

export type InputMessageContent =
  | InputTextMessageContent
  | InputLocationMessageContent
  | InputVenueMessageContent
  | InputContactMessageContent;

export type InputTextMessageContent = {
  messageText: string;
  parseMode?: string;
  disableWebPagePreview?: boolean;
};

export type InputLocationMessageContent = {
  latitude: number;
  longitude: number;
  livePeriod?: number;
};

export type InputVenueMessageContent = {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquareId?: string;
  foursquareType?: string;
};

export type InputContactMessageContent = {
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  vcard?: string;
};

export type ChosenInlineResult = {
  resultId: string;
  from: User;
  location?: Location;
  inlineMessageId?: string;
  query: string;
};

// Payments
export type LabeledPrice = {
  label: string;
  amount: number;
};

export type Invoice = {
  title: string;
  description: string;
  startParameter: string;
  currency: string;
  totalAmount: number;
};

export type Product = {
  /**
   * name, 1-32 characters
   */
  title: string;
  /**
   * Product description, 1-255 characters
   */
  description: string;
  /**
   * Unique deep-linking parameter that can be used to generate this invoice when used as a start parameter
   */
  startParameter: string;
  /**
   * Three-letter ISO 4217 currency code, see more on currencies
   */
  currency: string;
  /**
   * Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
   */
  payload: string;
  /**
   * Payments provider token, obtained via Botfather
   */
  providerToken: string;
  /**
   * Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
   */
  prices: LabeledPrice[];
};

export type ShippingAddress = {
  countryCode: string;
  state: string;
  city: string;
  streetLine1: string;
  streetLine2: string;
  postCode: string;
};

export type OrderInfo = {
  name?: string;
  phoneNumber?: string;
  email?: string;
  shippingAddress?: ShippingAddress;
};

export type ShippingOption = {
  id: string;
  title: string;
  prices: LabeledPrice[];
};

export type SuccessfulPayment = {
  currency: string;
  totalAmount: number;
  invoicePayload: string;
  shippingOptionId?: string;
  orderInfo?: OrderInfo;
  telegramPaymentChargeId: string;
  providerPaymentChargeId: string;
};

export type ShippingQuery = {
  id: string;
  from: User;
  invoicePayload: string;
  shippingAddress: ShippingAddress;
};

export type PreCheckoutQuery = {
  id: string;
  from: User;
  currency: string;
  totalAmount: number;
  invoicePayload: string;
  shippingOptionId?: string;
  orderInfo?: OrderInfo;
};

// Telegram Passport
export type PassportData = {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
};

export type PassportFile = {
  fileId: string;
  fileSize: number;
  fileDate: number;
};

export type EncryptedPassportElement = {
  type:
    | 'personal_details'
    | 'passport'
    | 'driver_license'
    | 'identity_card'
    | 'internal_passport'
    | 'address'
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration'
    | 'phone_number'
    | 'email';
  data?: string;
  phoneNumber?: string;
  email?: string;
  files?: PassportFile[];
  frontSide?: PassportFile;
  reverseSide?: PassportFile;
  selfie?: PassportFile;
  translation?: PassportFile[];
  hash: string;
};

export type EncryptedCredentials = {
  data: string;
  hash: string;
  secret: string;
};

export type PassportElementError =
  | PassportElementErrorDataField
  | PassportElementErrorFrontSide
  | PassportElementErrorReverseSide
  | PassportElementErrorSelfie
  | PassportElementErrorFile
  | PassportElementErrorFiles
  | PassportElementErrorTranslationFile
  | PassportElementErrorTranslationFiles
  | PassportElementErrorUnspecified;

export type PassportElementErrorDataField = {
  source: string;
  type:
    | 'personal_details'
    | 'passport'
    | 'driver_license'
    | 'identity_card'
    | 'internal_passport'
    | 'address';
  fieldName: string;
  dataHash: string;
  message: string;
};

export type PassportElementErrorFrontSide = {
  source: 'front_side';
  type: 'passport' | 'driver_license' | 'identity_card' | 'internal_passport';
  fileHash: string;
  message: string;
};

export type PassportElementErrorReverseSide = {
  source: 'reverse_side';
  type: 'driver_license' | 'identity_card';
  fileHash: string;
  message: string;
};

export type PassportElementErrorSelfie = {
  source: 'selfie';
  type: 'passport' | 'driver_license' | 'identity_card' | 'internal_passport';
  fileHash: string;
  message: string;
};

export type PassportElementErrorFile = {
  source: 'file';
  type:
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration';
  fileHash: string;
  message: string;
};

export type PassportElementErrorFiles = {
  source: 'files';
  type:
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration';
  fileHashes: string[];
  message: string;
};

export type PassportElementErrorTranslationFile = {
  source: 'translation_file';
  type:
    | 'passport'
    | 'driver_license'
    | 'identity_card'
    | 'internal_passport'
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration';
  fileHash: string;
  message: string;
};

export type PassportElementErrorTranslationFiles = {
  source: 'translation_files';
  type:
    | 'passport'
    | 'driver_license'
    | 'identity_card'
    | 'internal_passport'
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration';
  fileHashes: string[];
  message: string;
};

export type PassportElementErrorUnspecified = {
  source: 'unspecified';
  type: string;
  elementHash: string;
  message: string;
};

// Games
export type Game = {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  textEntities?: MessageEntity[];
  animation?: Animation;
};

/**
 * A placeholder, currently holds no information. Use BotFather to set up your game.
 *
 * - https://core.telegram.org/bots/api#callbackgame
 */
export type CallbackGame = any;

export type GameHighScore = {
  position: number;
  user: User;
  score: number;
};

export type SetWebhookOption = {
  /**
   * HTTPS url to send updates to. Use an empty string to remove webhook integration
   */
  url: string;

  /**
   * The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
   */
  ipAddress?: string;

  /**
   * not supported yet.
   */
  certificate?: string;

  /**
   * Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot‘s server, and higher values to increase your bot’s throughput.
   */
  maxConnections?: number;

  /**
   * List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all updates regardless of type (default). If not specified, the previous setting will be used.
   *
   * Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.
   */
  allowedUpdates?: string[];
};

export type DeleteWebhookOption = {
  /**
   * Pass True to drop all pending updates
   */
  dropPendingUpdates?: boolean;
};

export type GetUpdatesOption = {
  /**
   * Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its updateId. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten.
   */
  offset?: number;

  /**
   * Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100.
   */
  limit?: number;

  /**
   * Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
   */
  timeout?: number;

  /**
   * List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all updates regardless of type (default). If not specified, the previous setting will be used.
   *
   * Please note that this parameter doesn't affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time.
   */
  allowedUpdates?: string[];
};

export type SendMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Text of the message to be sent, 1-4096 characters after entities parsing
   */
  text: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   */
  entities?: MessageEntity[];

  /**
   * Disables link previews for links in this message
   */
  disableWebPagePreview?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type ParseMode = 'MarkdownV2' | 'HTML' | 'Markdown';

export type ForwardMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
  /**
   * Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   */
  fromChatId: string | number;
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disableNotification?: boolean;
  /**
   * Message identifier in the chat specified in from_chat_id
   */
  messageId: number;
};

export type CopyMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
  /**
   * Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
   */
  fromChatId: string | number;
  /**
   * Message identifier in the chat specified in from_chat_id
   */
  messageId: number;
  /**
   * New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept
   */
  caption?: string;
  /**
   * Mode for parsing entities in the new caption. See formatting options for more details.
   */
  parseMode?: ParseMode;
  /**
   * A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disableNotification?: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;
  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;
  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type MessageId = {
  /**
   * Unique message identifier
   */
  messageId: number;
};

export type SendPhotoOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
  /**
   * Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More info on Sending Files »
   */
  photo: string;
  /**
   * Photo caption (may also be used when resending photos by fileId), 0-1024 characters
   */
  caption?: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendAudioOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data.
   */
  audio: string;

  /**
   * Audio caption, 0-1024 characters
   */
  caption?: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Duration of the audio in seconds
   */
  duration?: number;

  /**
   * Performer
   */
  performer?: string;

  /**
   * Track name
   */
  title?: string;

  /**
   * Thumb is not supported yet.
   * TODO: support it
   */
  thumb?: string;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendDocumentOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
   */
  document: string;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Document caption (may also be used when resending documents by fileId), 0-1024 characters
   */
  caption?: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Disables automatic server-side content type detection for files uploaded using multipart/form-data
   */
  disableContentTypeDetection?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendVideoOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
   */
  video: string;

  /**
   * Duration of sent video in seconds
   */
  duration?: number;

  /**
   * Video width
   */
  width?: number;

  /**
   * Video height
   */
  height?: number;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Video caption (may also be used when resending videos by fileId), 0-1024 characters
   */
  caption?: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Pass True, if the uploaded video is suitable for streaming
   */
  supportsStreaming?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendAnimationOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data.
   */
  animation: string;

  /**
   * Duration of sent animation in seconds
   */
  duration?: number;

  /**
   * Animation width
   */
  width?: number;

  /**
   * Animation height
   */
  height?: number;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Animation caption (may also be used when resending animation by fileId), 0-1024 characters
   */
  caption?: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendVoiceOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
   */
  voice: string;

  /**
   * Voice message caption, 0-1024 characters
   */
  caption?: string;

  /**
   * Duration of the voice message in seconds
   */
  duration?: number;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendVideoNoteOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data.
   */
  videoNote: string;

  /**
   * Duration of sent video in seconds
   */
  duration?: number;

  /**
   * Video width and height, i.e. diameter of the video message
   */
  length?: number;

  /**
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendMediaGroupOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * A JSON-serialized array describing messages to be sent, must include 2-10 items
   */
  media: (InputMediaPhoto | InputMediaVideo)[];

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;
};

export type SendLocationOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Latitude of the location
   */
  latitude: number;

  /**
   * Longitude of the location
   */
  longitude: number;

  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontalAccuracy?: number;

  /**
   * Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
   *
   * - https://telegram.org/blog/live-locations
   */
  livePeriod?: number;

  /**
   * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
   */
  heading?: number;

  /**
   * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
   */
  proximityAlertRadius?: number;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type EditOption =
  | {
      /**
       * Required if inlineMessageId is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
       */
      chatId: number | string;

      /**
       * Required if inlineMessageId is not specified. Identifier of the message to edit
       */
      messageId: number;
    }
  | {
      /**
       * Required if chatId and messageId are not specified. Identifier of the inline message
       */
      inlineMessageId: string;
    };

export type EditMessageLiveLocationOption = EditOption & {
  /**
   * Latitude of new location
   */
  latitude: number;

  /**
   * Longitude of new location
   */
  longitude: number;

  /**
   * The radius of uncertainty for the location, measured in meters; 0-1500
   */
  horizontalAccuracy?: number;

  /**
   * For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
   */
  heading?: number;

  /**
   * For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
   */
  proximityAlertRadius?: number;

  /**
   * A JSON-serialized object for a new inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type StopMessageLiveLocationOption = EditOption & {
  /**
   * A JSON-serialized object for a new inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type SendVenueOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Latitude of the venue
   */
  latitude: number;

  /**
   * Longitude of the venue
   */
  longitude: number;

  /**
   * Name of the venue
   */
  title: string;

  /**
   * Address of the venue
   */
  address: string;

  /**
   * Optional. Foursquare identifier of the venue
   */
  foursquareId?: string;

  /**
   * Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)
   */
  foursquareType?: string;

  /**
   * Google Places identifier of the venue
   */
  googlePlaceId?: string;

  /**
   * Google Places type of the venue.
   */
  googlePlaceType?: string;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendContactOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Contact's phone number
   */
  phoneNumber: string;

  /**
   * Contact's first name
   */
  firstName: string;

  /**
   * Contact's last name
   */
  lastName?: string;

  /**
   * Additional data about the contact in the form of a vCard, 0-2048 bytes
   *
   * - https://en.wikipedia.org/wiki/VCard
   */
  vcard?: string;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendPollOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Poll question, 1-300 characters
   */
  question: string;

  /**
   * A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
   */
  options: string[];

  /**
   * True, if the poll needs to be anonymous, defaults to True
   */
  isAnonymous?: boolean;

  /**
   * Poll type, “quiz” or “regular”, defaults to “regular”
   */
  type?: string;

  /**
   * True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
   */
  allowsMultipleAnswers?: boolean;

  /**
   * 0-based identifier of the correct answer option, required for polls in quiz mode
   */
  correctOptionId?: number;

  /**
   * Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
   */
  explanation?: string;

  /**
   * Mode for parsing entities in the explanation. See formatting options for more details.
   */
  explanationParseMode?: string;

  /**
   * A JSON-serialized list of special entities that appear in the poll explanation, which can be specified instead of parse_mode
   */
  explanationEntities?: MessageEntity[];

  /**
   * Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date.
   */
  openPeriod?: number;

  /**
   * Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period.
   */
  closeDate?: number;

  /**
   * Pass True, if the poll needs to be immediately closed. This can be useful for poll preview.
   */
  isClosed?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendDiceOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, “🎳”, or “🎰”. Dice can have values 1-6 for “🎲”, “🎯” and “🎳”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
   */
  emoji?: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰';

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type SendChatActionOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
   */
  action: ChatAction;
};

export type GetUserProfilePhotosOption = {
  /**
   * Unique identifier of the target user
   */
  userId: number;
  /**
   * Sequential number of the first photo to be returned. By default, all photos are returned.
   */
  offset?: number;

  /**
   * Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
   */
  limit?: number;
};

export type GetFileOption = {
  /**
   * File identifier to get info about
   */
  fileId: string;
};

export type BanChatMemberOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;

  /**
   * Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   */
  untilDate?: number;

  /**
   * Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.
   */
  revokeMessages?: boolean;
};

export type UnbanChatMemberOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;

  /**
   * Do nothing if the user is not banned
   */
  onlyIfBanned?: boolean;
};

export type RestrictChatMemberOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;

  /**
   * A JSON-serialized object for new user permissions
   */
  permissions: ChatPermissions;

  /**
   * Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
   */
  untilDate?: number;
};

export type PromoteChatMemberOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;

  /**
   * Pass True, if the administrator's presence in the chat is hidden
   */
  isAnonymous?: boolean;

  /**
   * Pass True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege
   */
  canManageChat?: boolean;

  /**
   * Pass True, if the administrator can create channel posts, channels only
   */
  canPostMessages?: boolean;

  /**
   * Pass True, if the administrator can edit messages of other users and can pin messages, channels only
   */
  canEditMessages?: boolean;

  /**
   * Pass True, if the administrator can delete messages of other users
   */
  canDeleteMessages?: boolean;

  /**
   * Pass True, if the administrator can manage voice chats
   */
  canManageVoiceChats?: boolean;

  /**
   * Pass True, if the administrator can restrict, ban or unban chat members
   */
  canRestrictMembers?: boolean;

  /**
   * Pass True, if the administrator can add new administrators with a subset of his own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
   */
  canPromoteMembers?: boolean;

  /**
   * Pass True, if the administrator can invite new users to the chat
   */
  canInviteUsers?: boolean;

  /**
   * Pass True, if the administrator can change chat title, photo and other settings
   */
  canChangeInfo?: boolean;

  /**
   * Pass True, if the administrator can pin messages, supergroups only
   */
  canPinMessages?: boolean;
};

export type SetChatAdministratorCustomTitleOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;

  /**
   * New custom title for the administrator; 0-16 characters, emoji are not allowed
   */
  customTitle: string;
};

export type SetChatPermissionsOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * A JSON-serialized object for new default chat permissions
   */
  permissions: ChatPermissions;
};

export type ExportChatInviteLinkOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type CreateChatInviteLinkOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Point in time (Unix timestamp) when the link will expire
   */
  expireDate?: number;

  /**
   * Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   */
  memberLimit?: number;
};

export type EditChatInviteLinkOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * The invite link to edit
   */
  inviteLink: string;

  /**
   * Point in time (Unix timestamp) when the link will expire
   */
  expireDate?: number;

  /**
   * Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
   */
  memberLimit?: number;
};

export type RevokeChatInviteLinkOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * The invite link to edit
   */
  inviteLink: string;
};

export type DeleteChatPhotoOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type SetChatTitleOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * New chat title, 1-255 characters
   */
  title: string;
};

export type SetChatDescriptionOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * New chat description, 0-255 characters
   */
  description: string;
};

export type PinChatMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Identifier of a message to pin
   */
  messageId: number;

  /**
   * Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels.
   */
  disableNotification?: boolean;
};

export type UnpinChatMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Identifier of a message to pin
   */
  messageId: number;
};

export type UnpinAllChatMessagesOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type LeaveChatOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type GetChatOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type GetChatAdministratorsOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type GetChatMemberCountOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type GetChatMemberOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Unique identifier of the target user
   */
  userId: number;
};

export type SetChatStickerSetOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Name of the sticker set to be set as the group sticker set
   */
  stickerSetName: string;
};

export type DeleteChatStickerSetOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;
};

export type EditMessageTextOption = EditOption & {
  /**
   * New text of the message, 1-4096 characters after entities parsing
   */
  text: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   */
  entities?: MessageEntity[];

  /**
   * Disables link previews for links in this message
   */
  disableWebPagePreview?: boolean;

  /**
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type EditMessageCaptionOption = EditOption & {
  /**
   * New caption of the message, 0-1024 characters after entities parsing
   */
  caption: string;

  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

  /**
   * A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  captionEntities?: MessageEntity[];

  /**
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type EditMessageMediaOption = EditOption & {
  /**
   * A JSON-serialized object for a new media content of the message
   */
  media: InputMedia;

  /**
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type EditMessageReplyMarkupOption = EditOption & {
  /**
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type StopPollOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Identifier of the original message with the poll
   */
  messageId: number;

  /**
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type DeleteMessageOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Identifier of the message to delete
   */
  messageId: number;
};

export type SendStickerOption = {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)
   */
  chatId: number | string;

  /**
   * Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data.
   */
  sticker: string;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * Pass True, if the message should be sent even if the specified replied-to message is not found
   */
  allowSendingWithoutReply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots#keyboards
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardmarkup
   * - https://core.telegram.org/bots/api#replykeyboardremove
   * - https://core.telegram.org/bots/api#forcereply
   */
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type GetStickerSetOption = {
  /**
   * Name of the sticker set
   */
  name: string;
};

export type SetStickerPositionInSetOption = {
  /**
   * File identifier of the sticker
   */
  sticker: string;

  /**
   * New sticker position in the set, zero-based
   */
  position: number;
};

export type DeleteStickerFromSetOption = {
  /**
   * File identifier of the sticker
   */
  sticker: string;
};

export type SetStickerSetThumbOption = {
  /**
   * Name of the sticker set
   */
  name: string;

  /**
   * User identifier of the sticker set owner
   */
  userId: number;

  /**
   * A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size
   */
  thumb: string;
};

export type AnswerInlineQueryOption = {
  /**
   * Unique identifier for the answered query
   */
  inlineQueryId: string;

  /**
   * A JSON-serialized array of results for the inline query
   */
  results: InlineQueryResult[];

  /**
   * The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
   */
  cacheTime?: number;

  /**
   * Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
   */
  isPersonal?: boolean;

  /**
   * Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.
   */
  nextOffset?: string;

  /**
   * If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switchPmParameter
   */
  switchPmText?: string;

  /**
   * Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.
   *
   * Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a ‘Connect your YouTube account’ button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an oauth link. Once done, the bot can offer a switchInline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
   *
   * - https://core.telegram.org/bots#deep-linking
   */
  switchPmParameter?: string;
};

export type SendInvoiceOption = {
  /**
   * JSON-encoded data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
   */
  providerData?: string;

  /**
   * URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.
   */
  photoUrl?: string;

  /**
   * Photo size
   */
  photoSize?: number;

  /**
   * Photo width
   */
  photoWidth?: number;

  /**
   * Photo height
   */
  photoHeight?: number;

  /**
   * Pass True, if you require the user's full name to complete the order
   */
  needName?: boolean;

  /**
   * Pass True, if you require the user's phone number to complete the order
   */
  needPhoneNumber?: boolean;

  /**
   * Pass True, if you require the user's email address to complete the order
   */
  needEmail?: boolean;

  /**
   * Pass True, if you require the user's shipping address to complete the order
   */
  needShippingAddress?: boolean;

  /**
   * Pass True, if user's phone number should be sent to provider
   */
  sendPhoneNumberToProvider?: boolean;

  /**
   * Pass True, if user's email address should be sent to provider
   */
  sendEmailToProvider?: boolean;

  /**
   * Pass True, if the final price depends on the shipping method
   */
  isFlexible?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type AnswerShippingQueryOption =
  | {
      /**
       * Required if ok is True. A JSON-serialized array of available shipping options.
       */
      shippingOptions?: ShippingOption[];
    }
  | {
      /**
       * Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user.
       */
      errorMessage?: string;
    };

export type AnswerPreCheckoutQueryOption = {
  /**
   * Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.
   */
  errorMessage?: string;
};

export type AnswerCallbackQueryOption = {
  /**
   * Unique identifier for the query to be answered
   */
  callbackQueryId: string;

  /**
   * Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
   */
  text?: string;

  /**
   * If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
   */
  showAlert?: boolean;

  /**
   * URL that will be opened by the user's client. If you have created a Game and accepted the conditions via `@Botfather`, specify the URL that opens your game – note that this will only work if the query comes from a callback_game button.
   *
   * Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
   */
  url?: string;

  /**
   * The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.
   */
  cacheTime?: number;
};

export type BotCommand = {
  /**
   * Text of the command, 1-32 characters. Can contain only lowercase English letters, digits and underscores.
   */
  command: string;

  /**
   * Description of the command, 3-256 characters.
   */
  description: string;
};

export type BotCommandScope =
  | BotCommandScopeDefault
  | BotCommandScopeAllPrivateChats
  | BotCommandScopeAllGroupChats
  | BotCommandScopeAllChatAdministrators
  | BotCommandScopeChat
  | BotCommandScopeChatAdministrators
  | BotCommandScopeChatMember;

export type BotCommandScopeDefault = { type: 'default' };

export type BotCommandScopeAllPrivateChats = { type: 'all_private_chats' };

export type BotCommandScopeAllGroupChats = { type: 'all_group_chats' };

export type BotCommandScopeAllChatAdministrators = {
  type: 'all_chat_administrators';
};

export type BotCommandScopeChat = { type: 'chat'; chatId: number | string };

export type BotCommandScopeChatAdministrators = {
  type: 'default';
  chatId: number | string;
};

export type BotCommandScopeChatMember = {
  type: 'default';
  chatId: number | string;
  userId: number;
};

export type SetMyCommandsOption = {
  /**
   * A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.
   */
  commands: BotCommand[];
  /**
   * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
   */
  scope?: BotCommandScope;
  /**
   * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
   */
  languageCode?: string;
};

export type DeleteMyCommandsOption = {
  /**
   * A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.
   */
  scope?: BotCommandScope;
  /**
   * A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands
   */
  languageCode?: string;
};

export type GetMyCommandsOption = {
  /**
   * A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.
   */
  scope?: BotCommandScope;

  /**
   * A two-letter ISO 639-1 language code or an empty string
   */
  languageCode?: string;
};

export type SendGameOption = {
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;

  /**
   * A JSON-serialized object for an inline keyboard. If empty, one ‘Play game_title’ button will be shown. If not empty, the first button must launch the game.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type SetGameScoreOption = EditOption & {
  /**
   * Pass True, if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters
   */
  force?: boolean;

  /**
   * Pass True, if the game message should not be automatically edited to include the current scoreboard
   */
  disableEditMessage?: boolean;
};

export type GetGameHighScoresOption = EditOption;

export type CreateNewStickerSetOption = {
  /**
   * User identifier of created sticker set owner
   */
  userId: number;

  /**
   * Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in “_by_<bot username>”. <bot_username> is case insensitive. 1-64 characters.
   */
  name: string;

  /**
   * Sticker set title, 1-64 characters
   */
  title: string;

  /**
   * PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
   */
  pngSticker?: string;

  /**
   * Not supported yet.
   */
  tgsSticker?: Buffer;

  /**
   * One or more emoji corresponding to the sticker
   */
  emojis: string;

  /**
   * Pass True, if a set of mask stickers should be created
   */
  containsMasks?: boolean;

  /**
   * A JSON-serialized object for position where the mask should be placed on faces
   */
  maskPosition?: MaskPosition;
};

export type AddStickerToSetOption = {
  /**
   * User identifier of sticker set owner
   */
  userId: number;

  /**
   * Sticker set name
   */
  name: string;

  /**
   * 	PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
   */
  pngSticker?: string;

  /**
   * Not supported yet.
   */
  tgsSticker?: Buffer;

  /**
   * One or more emoji corresponding to the sticker
   */
  emojis: string;

  /**
   * A JSON-serialized object for position where the mask should be placed on faces
   */
  maskPosition?: MaskPosition;
};
