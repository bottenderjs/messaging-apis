import { JsonObject } from 'type-fest';
import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  sender: Sender;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type SucceededResponseData<T extends unknown> = {
  status: 0;
  statusMessage: 'ok';
} & T;

export type FailedResponseData<T extends unknown> = (
  | {
      status: 1;
      statusMessage: 'invalidUrl';
    }
  | {
      status: 2;
      statusMessage: 'invalidAuthToken';
    }
  | {
      status: 3;
      statusMessage: 'badData';
    }
  | {
      status: 4;
      statusMessage: 'missingData';
    }
  | {
      status: 5;
      statusMessage: 'receiverNotRegistered';
    }
  | {
      status: 6;
      statusMessage: 'receiverNotSubscribed';
    }
  | {
      status: 7;
      statusMessage: 'publicAccountBlocked';
    }
  | {
      status: 8;
      statusMessage: 'publicAccountNotFound';
    }
  | {
      status: 9;
      statusMessage: 'publicAccountSuspended';
    }
  | {
      status: 10;
      statusMessage: 'webhookNotSet';
    }
  | {
      status: 11;
      statusMessage: 'receiverNoSuitableDevice';
    }
  | {
      status: 12;
      statusMessage: 'tooManyRequests';
    }
  | {
      status: 13;
      statusMessage: 'apiVersionNotSupported';
    }
  | {
      status: 14;
      statusMessage: 'incompatibleWithVersion';
    }
  | {
      status: 15;
      statusMessage: 'publicAccountNotAuthorized';
    }
  | {
      status: 16;
      statusMessage: 'inchatReplyMessageNotAllowed';
    }
  | {
      status: 17;
      statusMessage: 'publicAccountIsNotInline';
    }
  | {
      status: 18;
      statusMessage: 'noPublicChat';
    }
  | {
      status: 19;
      statusMessage: 'cannotSendBroadcast';
    }
  | {
      status: 20;
      statusMessage: 'broadcastNotAllowed';
    }
) &
  T;

export type SucceededBroadcastResponseData = SucceededResponseData<{
  messageToken: string;
  failedList: Failed[];
}>;

export type Failed = FailedResponseData<{ receiver: string }>;

export type ResponseData<T extends unknown> =
  | SucceededResponseData<T>
  | FailedResponseData<Record<string, never>>;

export type BroadcastResponseData =
  | SucceededBroadcastResponseData
  | FailedResponseData<Record<string, never>>;

export type EventType =
  | 'delivered'
  | 'seen'
  | 'failed'
  | 'subscribed'
  | 'unsubscribed'
  | 'conversation_started';

export type SetWebhookOptions = {
  /**
   * optional. Indicates the types of Viber events that the account owner would like to be notified about. Don’t include this parameter in your request to get all events
   */
  eventTypes?: EventType[];
  /**
   * optional. Indicates whether or not the bot should receive the user name. Default false
   */
  sendName?: boolean;
  /**
   * optional. Indicates whether or not the bot should receive the user photo. Default false
   */
  sendPhoto?: boolean;
};

export type Sender = {
  /**
   * The sender’s name to display
   */
  name: string;
  /**
   * The sender’s avatar URL
   */
  avatar?: string;
};

export type Message =
  | TextMessage
  | PictureMessage
  | VideoMessage
  | FileMessage
  | ContactMessage
  | LocationMessage
  | UrlMessage
  | StickerMessage
  | RichMediaMessage;

export type MessageOptions = {
  /**
   * Minimal API version required by clients for this message (default 1)
   */
  minApiVersion?: number;
  sender?: Sender;
  /**
   * Allow the account to track messages and user’s replies. Sent tracking_data value will be passed back with user’s reply
   */
  trackingData?: string;
  keyboard?: Keyboard;
};

export type TextMessage = {
  type: 'text';
  text: string;
} & MessageOptions;

export type Picture = {
  /**
   * Description of the photo. Can be an empty string if irrelevant. Max 120 characters.
   */
  text: string;
  /**
   * URL of the image (JPEG). Max size 1 MB. Only JPEG format is supported. Other image formats as well as animated GIFs can be sent as URL messages or file messages.
   */
  media: string;
  /**
   * URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   */
  thumbnail?: string;
};

export type PictureMessage = {
  type: 'picture';
} & Picture &
  MessageOptions;

export type Video = {
  /**
   * URL of the video (MP4, H264). Max size 50 MB. Only MP4 and H264 are supported.
   */
  media: string;
  /**
   * Size of the video in bytes.
   */
  size: number;
  /**
   * Video duration in seconds; will be displayed to the receiver. Max 180 seconds.
   */
  duration?: number;
  /**
   * URL of a reduced size image (JPEG). Max size 100 kb. Recommended: 400x400. Only JPEG format is supported.
   */
  thumbnail?: string;
};

export type VideoMessage = {
  type: 'video';
} & Video &
  MessageOptions;

export type File = {
  /**
   * URL of the file. Max size 50 MB. See [forbidden file formats](https://developers.viber.com/docs/api/rest-bot-api/#forbiddenFileFormats) for unsupported file types.
   */
  media: string;
  /**
   * Size of the file in bytes.
   */
  size: number;
  /**
   *  Name of the file. File name should include extension. Max 256 characters (including file extension).
   */
  fileName: string;
};

export type FileMessage = {
  type: 'file';
} & File &
  MessageOptions;

export type Contact = {
  /**
   * Name of the contact. Max 28 characters.
   */
  name: string;
  /**
   * Phone number of the contact. Max 18 characters.
   */
  phoneNumber: string;
};

export type ContactMessage = {
  type: 'contact';
  contact: Contact;
} & MessageOptions;

export type Location = {
  /**
   * Latitude (±90°) within valid ranges.
   */
  lat: string;
  /**
   * Longitude (±180°) within valid ranges.
   */
  lon: string;
};

export type LocationMessage = {
  type: 'location';
  location: Location;
} & MessageOptions;

export type UrlMessage = {
  type: 'url';
  media: string;
} & MessageOptions;

export type StickerMessage = {
  type: 'sticker';
  stickerId: number;
} & MessageOptions;

export type RichMedia = {
  type: 'rich_media';
  /**
   * Number of columns per carousel content block. Default 6 columns. Possible values: 1 - 6.
   */
  buttonsGroupColumns: number;
  /**
   * Number of rows per carousel content block. Default 7 rows. Possible values: 1 - 7.
   */
  buttonsGroupRows: number;
  bgColor: string;
  /**
   * Array of buttons.
   */
  buttons: RichMediaButton[];
};

export type RichMediaButton = {
  columns: number;
  rows: number;
  text?: string;
  actionType: 'open-url' | 'reply';
  actionBody: string;
  textSize?: 'small' | 'medium' | 'large';
  textVAlign?: 'middle';
  textHAlign?: 'left' | 'middle' | 'right';
  image?: string;
};

export type RichMediaMessage = {
  type: 'rich_media';
  richMedia: RichMedia;
} & MessageOptions;

export type AccountInfo = {
  /**
   * Unique numeric id of the account
   */
  id: string;
  /**
   * Account name
   */
  name: string;
  /**
   * Unique URI of the Account
   */
  uri: string;
  /**
   * Account icon URL
   */
  icon: string;
  /**
   * Conversation background URL
   */
  background: string;
  /**
   * Account category
   */
  category: string;
  /**
   * Account sub-category
   */
  subcategory: string;
  /**
   * Account location (coordinates). Will be used for finding accounts near me
   */
  location: {
    lon: number;
    lat: number;
  };
  /**
   * Account country
   */
  country: string;
  /**
   * Account registered webhook
   */
  webhook: string;
  /**
   * Account registered events – as set by set_webhook request
   */
  eventTypes: 'delivered' | 'seen' | 'failed' | 'conversation_started';
  /**
   * Number of subscribers
   */
  subscribersCount: number;
  /**
   * Members of the bot’s public chat
   */
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
};

export type UserDetails = {
  /**
   * Unique Viber user id
   */
  id: string;
  /**
   * User’s Viber name
   */
  name: string;
  /**
   * URL of the user’s avatar
   */
  avatar: string;
  /**
   * User’s country code
   * 2 letters country code - ISO ALPHA-2 Code
   */
  country: string;
  /**
   * User’s phone language. Will be returned according to the device language
   * ISO 639-1
   */
  language: string;
  /**
   * The operating system type and version of the user’s primary device.
   */
  primaryDeviceOs: string;
  /**
   * Max API version, matching the most updated user’s device
   */
  apiVersion: number;
  /**
   * The Viber version installed on the user’s primary device
   */
  viberVersion: string;
  /**
   * Mobile country code
   */
  mcc: number;
  /**
   * Mobile network code
   */
  mnc: number;
  /**
   * The user’s device type
   */
  deviceType: string;
};

export type UserOnlineStatus = {
  /**
   * Unique Viber user id
   */
  id: string;
  /**
   * Online status code
   * 0 for online, 1 for offline, 2 for undisclosed - user set Viber to hide status, 3 for try later - internal error, 4 for unavailable - not a Viber user / unsubscribed / unregistered
   */
  onlineStatus: 0 | 1 | 2 | 3 | 4;
  /**
   * Online status message
   */
  onlineStatusMessage: 'online';
};

export type Keyboard = {
  type: 'keyboard';
  /**
   * required. Array containing all keyboard buttons by order. See buttons parameters below for buttons parameters details
   */
  buttons: KeyboardButton[];
  /**
   * optional. Background color of the keyboard
   */
  bgColor?: string;
  /**
   * optional. When true - the keyboard will always be displayed with the same height as the native keyboard.When false - short keyboards will be displayed with the minimal possible height. Maximal height will be native keyboard height
   */
  defaultHeight?: boolean;
  /**
   * optional (api level 3). How much percent of free screen space in chat should be taken by keyboard. The final height will be not less than height of system keyboard
   */
  customDefaultHeight?: number;
  /**
   * optional (api level 3). Allow use custom aspect ratio for Carousel content blocks. Scales the height of the default square block (which is defined on client side) to the given value in percents. It means blocks can become not square and it can be used to create Carousel content with correct custom aspect ratio. This is applied to all blocks in the Carousel content
   */
  heightScale?: number;
  /**
   * optional (api level 4). Represents size of block for grouping buttons during layout
   */
  buttonsGroupColumns?: number;
  /**
   * optional (api level 4). Represents size of block for grouping buttons during layout
   */
  buttonsGroupRows?: number;
  /**
   * optional (api level 4). Customize the keyboard input field. regular- display regular size input field. minimized - display input field minimized by default. hidden - hide the input field
   */
  inputFieldState?: 'regular' | 'minimized' | 'hidden';
  /**
   * optional (api level 6). JSON Object, which describes Carousel content to be saved via favorites bot, if saving is available
   */
  favoritesMetadata?: JsonObject;
};

export type KeyboardButton = {
  /**
   * optional. Button width in columns. See keyboard design for more details
   */
  columns?: number;
  /**
   * optional. Button height in rows. See keyboard design for more details
   */
  rows?: number;
  /**
   * optional. Background color of button
   */
  bgColor?: string;
  /**
   * optional. Determine whether the user action is presented in the conversation
   */
  silent?: boolean;
  /**
   * optional. Type of the background media
   */
  bgMediaType?: 'picture' | 'gif';
  /**
   * optional. URL for background media content (picture or gif). Will be placed with aspect to fill logic
   */
  bgMedia?: string;
  /**
   * optional (api level 6). Options for scaling the bounds of the background to the bounds of this view: crop - contents scaled to fill with fixed aspect. some portion of content may be clipped. fill - contents scaled to fill without saving fixed aspect. fit - at least one axis (X or Y) will fit exactly, aspect is saved
   */
  bgMediaScaleType?: 'crop' | 'fill' | 'fit';
  /**
   * optional (api level 6). Options for scaling the bounds of an image to the bounds of this view: crop - contents scaled to fill with fixed aspect. some portion of content may be clipped. fill - contents scaled to fill without saving fixed aspect. fit - at least one axis (X or Y) will fit exactly, aspect is saved
   */
  imageScaleType?: 'crop' | 'fill' | 'fit';
  /**
   * optional. When true - animated background media (gif) will loop continuously. When false - animated background media will play once and stop
   */
  bgLoop?: boolean;
  /**
   * optional. Type of action pressing the button will perform. Reply - will send a reply to the bot. open-url - will open the specified URL and send the URL as reply to the bot. See reply logic for more details. Note: location-picker and share-phone are not supported on desktop, and require adding any text in the ActionBody parameter.
   */
  actionType?:
    | 'reply'
    | 'open-url'
    | 'location-picker'
    | 'share-phone'
    | 'none';
  /**
   * required. Text for reply and none. ActionType or URL for open-url. See reply logic for more details
   */
  actionBody: string;
  /**
   * optional. URL of image to place on top of background (if any). Can be a partially transparent image that will allow showing some of the background. Will be placed with aspect to fill logic
   */
  image?: string;
  /**
   * optional. Text to be displayed on the button. Can contain some HTML tags - see keyboard design for more details
   */
  text?: string;
  /**
   * optional. Vertical alignment of the text
   */
  textVAlign?: 'top' | 'middle' | 'bottom';
  /**
   * optional. Horizontal align of the text
   */
  textHAlign?: 'left' | 'center' | 'right';
  /**
   * optional (api level 4). Custom paddings for the text in points. The value is an array of Integers [top, left, bottom, right]
   */
  textPaddings?: [number, number, number, number];
  /**
   * optional. Text opacity
   */
  textOpacity?: number;
  /**
   * optional. Text size out of 3 available options
   */
  textSize?: 'small' | 'regular' | 'large';
  /**
   * optional. Determine the open-url action result, in app or external browser
   */
  openURLType?: 'internal' | 'external';
  /**
   * optional. Determine the url media type. not-media - force browser usage. video - will be opened via media player. gif - client will play the gif in full screen mode. picture - client will open the picture in full screen mode
   */
  openURLMediaType?: 'not-media' | 'video' | 'gif' | 'picture';
  /**
   * optional. Background gradient to use under text, Works only when TextVAlign is equal to top or bottom
   */
  textBgGradientColor?: string;
  /**
   * optional. (api level 6) If true the size of text will decreased to fit (minimum size is 12)
   */
  textShouldFit?: boolean;
  /**
   * optional (api level 3). JSON Object, which includes internal browser configuration for open-url action with internal type
   */
  internalBrowser?: KeyboardButtonInternalBrowser;
  /**
   * optional (api level 6). JSON Object, which includes map configuration for open-map action with internal type
   */
  map?: KeyboardButtonMap;
  /**
   * optional (api level 6). JSON Object. Draw frame above the background on the button, the size will be equal the size of the button
   */
  frame?: KeyboardButtonFrame;
  /**
   * optional (api level 6). JSON Object. Specifies media player options. Will be ignored if OpenURLMediaType is not video or audio
   */
  mediaPlayer?: KeyboardButtonMediaPlayer;
};

export type KeyboardButtonInternalBrowser = {
  actionButton?:
    | 'forward'
    | 'send'
    | 'open-externally'
    | 'send-to-bot'
    | 'none';
  actionPredefinedURL?: string;
  titleType?: 'domain' | 'default';
  customTitle?: string;
  mode?:
    | 'fullscreen'
    | 'fullscreen-portrait'
    | 'fullscreen-landscape'
    | 'partial-size';
  footerType?: 'default' | 'hidden';
  actionReplyData?: string;
};

export type KeyboardButtonMap = {
  latitude?: number;
  longitude?: number;
};

export type KeyboardButtonFrame = {
  borderWidth?: number;
  borderColor?: string;
  cornerRadius?: number;
};

export type KeyboardButtonMediaPlayer = {
  title?: string;
  subtitle?: string;
  thumbnailURL?: string;
  loop?: boolean;
};
