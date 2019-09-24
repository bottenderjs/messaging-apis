export type Update = {
  update_id: string;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: ShippingQuery;
  pre_checkout_query?: PreCheckoutQuery;
  poll?: Poll;
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
  has_custom_certificate: boolean;

  /**
   * Number of updates awaiting delivery
   */
  pending_update_count: number;

  /**
   * Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook
   */
  last_error_date?: number;

  /**
   * Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook
   */
  last_error_message?: string;

  /**
   * Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
   */
  max_connections?: number;

  /**
   * Optional. A list of update types the bot is subscribed to. Defaults to all update types
   */
  allowed_updates?: string[];
};

export type User = {
  chat_id: number | string;
  text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

// TODO: separate different type because some fields returned only in getChat.
export type Chat = {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: ChatPhoto;
  description?: string;
  invite_link?: string;
  pinned_message?: Message;
  permissions?: ChatPermissions;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
};

export type Message = {
  message_id: number;
  from?: User; // TODO: empty for messages sent to channels
  date: number;
  chat: Chat;
  forward_from?: User;
  forward_from_chat?: Chat;
  forward_from_message_id?: number;
  forward_signature?: string;
  forward_sender_name?: string;
  forward_date?: number;
  reply_to_message?: Message;
  edit_date?: number;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities?: MessageEntity[];
  caption_entities?: MessageEntity[];
  audio?: Audio;
  document?: Document;
  animation?: Animation;
  game?: Game;
  photo?: PhotoSize[];
  sticker?: Sticker;
  video?: Video;
  voice?: Voice;
  video_note?: VideoNote;
  caption?: string;
  contact?: Contact;
  location?: Location;
  venue?: Venue;
  poll?: Poll;
  new_chat_members?: User[];
  left_chat_member?: User;
  new_chat_title?: string;
  new_chat_photo?: PhotoSize[];
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  pinned_message?: Message;
  invoice?: Invoice;
  successful_payment?: SuccessfulPayment;
  connected_website?: string;
  passport_data?: PassportData;
  reply_markup?: InlineKeyboardMarkup;
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
  file_id: string;
  width: number;
  height: number;
  file_size?: number;
};

export type Audio = {
  file_id: string;
  duration: number;
  performer?: string;
  title?: string;
  mime_type?: string;
  file_size?: number;
  thumb?: PhotoSize;
};

export type Document = {
  file_id: string;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
};

export type Video = {
  file_id: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mime_type?: string;
  file_size?: number;
};

export type Animation = {
  file_id: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
};

export type Voice = {
  file_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
};

export type VideoNote = {
  file_id: string;
  length: number;
  duration: number;
  thumb?: PhotoSize;
  file_size?: number;
};

export type Contact = {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
  vcard?: string;
};

export type Location = {
  longitude: number;
  latitude: number;
};

export type Venue = {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
};

export type PollOption = {
  text: string;
  voter_count: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  is_closed: boolean;
};

export type UserProfilePhotos = {
  total_count: number;
  photos: PhotoSize[][];
};

export type File = {
  file_id: string;
  file_size?: number;
  file_path: string;
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
   * Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply (has reply_to_message_id), sender of the original message.
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
   * Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup)
   */
  removeKeyboard: true;

  /**
   * Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets:
   * 1. users that are @mentioned in the text of the Message object
   * 2. if the bot's message is a reply (has reply_to_message_id), sender of the original message.
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
   * Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a private chat with it. Especially useful when combined with switch_pm… actions – in this case the user will be automatically returned to the chat they switched from, skipping the chat selection screen.
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
  id: string;
  from: User;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
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
   * 1. users that are @mentioned in the text of the Message object;
   * 2. if the bot's message is a reply (has reply_to_message_id), sender of the original message.
   */
  selective?: boolean;
};

export type ChatPhoto = {
  small_file_id: string;
  big_file_id: string;
};

export type ChatMember = any;

export type ChatPermissions = {
  can_send_messages?: boolean;
  can_send_media_messages?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
};

export type ResponseParameters = any;

export type InputMedia =
  | InputMediaAnimation
  | InputMediaDocument
  | InputMediaAudio
  | InputMediaPhoto
  | InputMediaVideo;

export type InputMediaPhoto = {
  type: 'photo';
  media: string;
  caption?: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
};

export type InputMediaVideo = {
  type: 'video';
  media: string;
  thumb?: string;
  caption?: string;
  parse_mode?: string;
  width?: number;
  height?: number;
  duration?: number;
  supports_streaming?: boolean;
};

export type InputMediaAnimation = {
  type: 'animation';
  media: string;
  thumb?: string;
  caption?: string;
  parse_mode?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type InputMediaAudio = {
  type: 'audio';
  media: string;
  thumb?: string;
  caption?: string;
  parse_mode?: string;
  duration?: number;
  performer?: string;
  title?: string;
};

export type InputMediaDocument = {
  type: 'document';
  media: string;
  thumb?: string;
  caption?: string;
  parse_mode?: string;
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
  file_id: string;
  width: number;
  height: number;
  is_animated: boolean;
  thumb?: PhotoSize;
  emoji?: string;
  set_name?: string;
  mask_position?: MaskPosition;
  file_size?: number;
};

export type StickerSet = {
  name: string;
  title: string;
  is_animated: boolean;
  contains_masks: boolean;
  stickers: Sticker[];
};

export type MaskPosition = {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  x_shift: number;
  y_shift: number;
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
  input_message_content: InputMessageContent;
  reply_markup?: InlineKeyboardMarkup;
  url?: string;
  hide_url?: boolean;
  description?: string;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InlineQueryResultPhoto = {
  type: 'photo';
  id: string;
  photo_url: string;
  thumb_url: string;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultGif = {
  type: 'gif';
  id: string;
  gif_url: string;
  gif_width?: number;
  gif_height?: number;
  gif_duration?: number;
  thumb_url: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4_url: string;
  mpeg4_width?: number;
  mpeg4_height?: number;
  mpeg4_duration?: number;
  thumb_url: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultVideo = {
  type: 'video';
  id: string;
  video_url: string;
  mime_type: string;
  thumb_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  video_width?: number;
  video_height?: number;
  video_duration?: number;
  description?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultAudio = {
  type: 'audio';
  id: string;
  audio_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  performer?: string;
  audio_duration?: number;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultVoice = {
  type: 'voice';
  id: string;
  voice_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  voice_duration?: number;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultDocument = {
  type: 'document';
  id: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  document_url: string;
  mime_type: string;
  description?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InlineQueryResultLocation = {
  type: 'location';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  live_period?: number;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InlineQueryResultVenue = {
  type: 'venue';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InlineQueryResultContact = {
  type: 'contact';
  id: string;
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InlineQueryResultGame = {
  type: 'game';
  id: string;
  game_short_name: string;
  reply_markup?: InlineKeyboardMarkup;
};

export type InlineQueryResultCachedPhoto = {
  type: 'photo';
  id: string;
  photo_file_id: string;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedGif = {
  type: 'gif';
  id: string;
  gif_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedMpeg4Gif = {
  type: 'mpeg4_gif';
  id: string;
  mpeg4_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedSticker = {
  type: 'sticker';
  id: string;
  sticker_file_id: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedDocument = {
  type: 'document';
  id: string;
  title: string;
  document_file_id: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedVideo = {
  type: 'video';
  id: string;
  video_file_id: string;
  title: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedVoice = {
  type: 'voice';
  id: string;
  voice_file_id: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InlineQueryResultCachedAudio = {
  type: 'audio';
  id: string;
  audio_file_id: string;
  caption?: string;
  parse_mode?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
};

export type InputMessageContent =
  | InputTextMessageContent
  | InputLocationMessageContent
  | InputVenueMessageContent
  | InputContactMessageContent;

export type InputTextMessageContent = {
  message_text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
};

export type InputLocationMessageContent = {
  latitude: number;
  longitude: number;
  live_period?: number;
};

export type InputVenueMessageContent = {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
};

export type InputContactMessageContent = {
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
};

export type ChosenInlineResult = {
  result_id: string;
  from: User;
  location?: Location;
  inline_message_id?: string;
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
  start_parameter: string;
  currency: string;
  total_amount: number;
};

export type ShippingAddress = {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
};

export type OrderInfo = {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
};

export type ShippingOption = {
  id: string;
  title: string;
  prices: LabeledPrice[];
};

export type SuccessfulPayment = {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
};

export type ShippingQuery = {
  id: string;
  from: User;
  invoice_payload: string;
  shipping_address: ShippingAddress;
};

export type PreCheckoutQuery = {
  id: string;
  from: User;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
};

// Telegram Passport
export type PassportData = {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
};

export type PassportFile = {
  file_id: string;
  file_size: number;
  file_date: number;
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
  phone_number?: string;
  email?: string;
  files?: PassportFile[];
  front_side?: PassportFile;
  reverse_side?: PassportFile;
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
  field_name: string;
  data_hash: string;
  message: string;
};

export type PassportElementErrorFrontSide = {
  source: 'front_side';
  type: 'passport' | 'driver_license' | 'identity_card' | 'internal_passport';
  file_hash: string;
  message: string;
};

export type PassportElementErrorReverseSide = {
  source: 'reverse_side';
  type: 'driver_license' | 'identity_card';
  file_hash: string;
  message: string;
};

export type PassportElementErrorSelfie = {
  source: 'selfie';
  type: 'passport' | 'driver_license' | 'identity_card' | 'internal_passport';
  file_hash: string;
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
  file_hash: string;
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
  file_hashes: string[];
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
  file_hash: string;
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
  file_hashes: string[];
  message: string;
};

export type PassportElementErrorUnspecified = {
  source: 'unspecified';
  type: string;
  element_hash: string;
  message: string;
};

// Games
export type Game = {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
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

export type GetUpdatesOption = {
  /**
   * Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten.
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
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

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

export enum ParseMode {
  Markdown = 'Markdown',
  HTML = 'HTML',
}

export type ForwardMessageOption = {
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disableNotification?: boolean;
};

export type SendPhotoOption = {
  /**
   * Photo caption (may also be used when resending photos by file_id), 0-1024 characters
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
   * Thumb is not supported yet.
   */
  thumb?: string;

  /**
   * Document caption (may also be used when resending documents by file_id), 0-1024 characters
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
   * Video caption (may also be used when resending videos by file_id), 0-1024 characters
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
   * Animation caption (may also be used when resending animation by file_id), 0-1024 characters
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
   * Sends the message silently. Users will receive a notification with no sound.
   *
   * - https://telegram.org/blog/channels-2-0#silent-messages
   */
  disableNotification?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  replyToMessageId?: number;
};

export type SendLocationOption = {
  /**
   * Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
   *
   * - https://telegram.org/blog/live-locations
   */
  livePeriod?: number;

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
       * Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
       */
      chatId: number | string;

      /**
       * Required if inline_message_id is not specified. Identifier of the message to edit
       */
      messageId: number;
    }
  | {
      /**
       * Required if chat_id and message_id are not specified. Identifier of the inline message
       */
      inlineMessageId: string;
    };

export type EditMessageLiveLocationOption = EditOption & {
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
   * Foursquare identifier of the venue
   */
  foursquareId?: string;

  /**
   * Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquareType?: string;

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
   * Contact's last name
   */
  lastName?: string;

  /**
   * Additional data about the contact in the form of a vCard, 0-2048 bytes
   *
   * - https://en.wikipedia.org/wiki/VCard
   */
  vacrd?: string;

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

export type GetUserProfilePhotosOption = {
  /**
   * Sequential number of the first photo to be returned. By default, all photos are returned.
   */
  offset?: number;

  /**
   * Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
   */
  limit?: number;
};

export type KickChatMemberOption = {
  /**
   * Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
   */
  untilDate?: number;
};

export type RestrictChatMemberOption = {
  /**
   * Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
   */
  untilDate?: number;
};

export type PromoteChatMemberOption = {
  /**
   * Pass True, if the administrator can change chat title, photo and other settings
   */
  canChangeInfo?: boolean;

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
   * Pass True, if the administrator can invite new users to the chat
   */
  canInviteUsers?: boolean;

  /**
   * Pass True, if the administrator can restrict, ban or unban chat members
   */
  canRestrictMembers?: boolean;

  /**
   * Pass True, if the administrator can pin messages, supergroups only
   */
  canPinMessages?: boolean;

  /**
   * Pass True, if the administrator can add new administrators with a subset of his own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
   */
  canPromoteMembers?: boolean;
};

export type PinChatMessageOption = {
  /**
   * Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels.
   */
  disableNotification?: boolean;
};

export type EditMessageTextOption = EditOption & {
  /**
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

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
   * Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
   *
   * - https://core.telegram.org/bots/api#markdown-style
   * - https://core.telegram.org/bots/api#html-style
   * - https://core.telegram.org/bots/api#formatting-options
   */
  parseMode?: ParseMode;

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
   * A JSON-serialized object for an inline keyboard.
   *
   * - https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating
   * - https://core.telegram.org/bots/api#inlinekeyboardmarkup
   */
  replyMarkup?: InlineKeyboardMarkup;
};

export type SendStickerOption = {
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

export type AnswerInlineQueryOption = {
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
   * Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a ‘Connect your YouTube account’ button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an oauth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
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
