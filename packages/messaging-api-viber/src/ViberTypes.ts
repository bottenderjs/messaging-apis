import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  sender: Sender;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type SucceededResponseData<T extends object> = {
  status: 0;
  statusMessage: 'ok';
} & T;

export type FailedResponseData<T extends object> = (
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

export type ResponseData<T extends object> =
  | SucceededResponseData<T>
  | FailedResponseData<{}>;

export type BroadcastResponseData =
  | SucceededBroadcastResponseData
  | FailedResponseData<{}>;

export enum EventType {
  Delivered = 'delivered',
  Seen = 'seen',
  Failed = 'failed',
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
  ConversationStarted = 'conversation_started',
}

export type Sender = {
  name: string;
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
  minApiVersion?: number;
  sender?: Sender;
  trackingData?: string;
  keyboard?: Keyboard;
};

export type TextMessage = {
  type: 'text';
  text: string;
} & MessageOptions;

export type Picture = {
  text: string;
  media: string;
  thumbnail?: string;
};

export type PictureMessage = {
  type: 'picture';
} & Picture &
  MessageOptions;

export type Video = {
  media: string;
  size: number;
  duration?: number;
  thumbnail?: string;
};

export type VideoMessage = {
  type: 'video';
} & Video &
  MessageOptions;

export type File = {
  media: string;
  size: number;
  fileName: string;
};

export type FileMessage = {
  type: 'file';
} & File &
  MessageOptions;

export type Contact = {
  name: string;
  phoneNumber: string;
};

export type ContactMessage = {
  type: 'contact';
  contact: Contact;
} & MessageOptions;

export type Location = {
  lat: string;
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
  buttonsGroupColumns: number;
  buttonsGroupRows: number;
  bgColor: string;
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
  id: string;
  name: string;
  uri: string;
  icon: string;
  background: string;
  category: string;
  subcategory: string;
  location: {
    lon: number;
    lat: number;
  };
  country: string;
  webhook: string;
  eventTypes:
    | EventType.Delivered
    | EventType.Seen
    | EventType.Failed
    | EventType.ConversationStarted;
  subscribersCount: number;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
};

export type UserDetails = {
  id: string;
  name: string;
  avatar: string;
  country: string;
  language: string;
  primaryDeviceOs: string;
  apiVersion: number;
  viberVersion: string;
  mcc: number;
  mnc: number;
  deviceType: string;
};

export type UserOnlineStatus = {
  id: string;
  onlineStatus: 0 | 1 | 2 | 3 | 4;
  onlineStatusMessage: 'online';
};

export type Keyboard = {
  buttons: KeyboardButton[];
  bgColor?: string;
  defaultHeight?: boolean;
  customDefaultHeight?: number;
  heightScale?: number;
  buttonsGroupColumns?: number;
  buttonsGroupRows?: number;
  inputFieldState?: 'regular' | 'minimized' | 'hidden';
  favoritesMetadata?: any;
};

export type KeyboardButton = {
  columns?: number;
  rows?: number;
  bgColor?: string;
  silent?: boolean;
  bgMediaType?: 'picture' | 'gif';
  bgMedia?: string;
  bgMediaScaleType?: 'crop' | 'fill' | 'fit';
  imageScaleType?: 'crop' | 'fill' | 'fit';
  bgLoop?: boolean;
  actionType?:
    | 'reply'
    | 'open-url'
    | 'location-picker'
    | 'share-phone'
    | 'none';
  actionBody: string;
  image?: string;
  text?: string;
  textVAlign?: 'top' | 'middle' | 'bottom';
  textHAlign?: 'left' | 'center' | 'right';
  textPaddings?: [number, number, number, number];
  textOpacity?: number;
  textSize?: 'small' | 'regular' | 'large';
  openURLType?: 'internal' | 'external';
  openURLMediaType?: 'not-media' | 'video' | 'gif' | 'picture';
  textBgGradientColor?: string;
  textShouldFit?: boolean;
  internalBrowser?: KeyboardButtonInternalBrowser;
  map?: KeyboardButtonMap;
  frame?: KeyboardButtonFrame;
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
