import fs from 'fs';

import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  appId?: string;
  appSecret?: string;
  version?: string;
  origin?: string;
  onRequest?: OnRequestFunction;
  skipAppSecretProof?: boolean;
};

/**
 * Page Scoped User ID (PSID) of the message recipient.
 */
export type RecipientWithID = {
  id: string;
};

/**
 * Used for Customer Matching. (Closed Beta)
 */
export type RecipientWithPhoneNumber = {
  phoneNumber: string;
  name?: Record<string, any>;
};

/**
 * Used for the checkbox plugin.
 */
export type RecipientWithUserRef = {
  userRef: string;
};

/**
 * Used for Private Replies to reference the visitor post to reply to.
 */
export type RecipientWithPostId = {
  postId: string;
};

/**
 * Used for Private Replies to reference the post comment to reply to.
 */
export type RecipientWithCommentId = {
  commentId: string;
};

/**
 * Used for the Messenger Platform's One-Time Notification API.
 */
export type RecipientWithOneTimeNotifToken = {
  oneTimeNotifToken: string;
};

/**
 * Description of the message recipient. All requests must include one to identify the recipient.
 */
export type Recipient =
  | RecipientWithID
  | RecipientWithPhoneNumber
  | RecipientWithUserRef
  | RecipientWithPostId
  | RecipientWithCommentId
  | RecipientWithOneTimeNotifToken;

/**
 * Description of the message recipient. If a string is provided, it will be recognized as a psid.
 */
export type PsidOrRecipient = string | Recipient;

export type UrlMediaAttachmentPayload = {
  url: string;
  isReusable?: boolean;
};

export type AttachmentIdAttachmentPayload = {
  attachmentId: string;
};

export type MediaAttachmentPayload =
  | UrlMediaAttachmentPayload
  | AttachmentIdAttachmentPayload;

export type MediaAttachmentType = 'audio' | 'video' | 'image' | 'file';

export type FileDataAttachmentPayload = {
  isReusable?: boolean;
};

export type FileDataMediaAttachment = {
  type: MediaAttachmentType;
  payload: FileDataAttachmentPayload;
};

export type FileDataMediaAttachmentMessage = {
  attachment: FileDataMediaAttachment;
  quickReplies?: QuickReply[];
};

export type MediaAttachment = {
  type: MediaAttachmentType;
  payload: MediaAttachmentPayload;
};

export type TemplateAttachmentPayload = {
  templateType:
    | 'button'
    | 'generic'
    | 'media'
    | 'receipt'
    | 'airline_boardingpass'
    | 'airline_checkin'
    | 'airline_itinerary'
    | 'airline_update'
    | 'one_time_notif_req';
  [key: string]: any; // FIXME: list all of templates
};

export type TemplateAttachment = {
  type: 'template';
  payload: TemplateAttachmentPayload;
};

export type Attachment = MediaAttachment | TemplateAttachment;

export type TextQuickReply = {
  contentType: 'text';
  title: string;
  payload: string;
  imageUrl?: string;
};

export type UserPhoneNumberQuickReply = {
  contentType: 'user_phone_number';
};

export type UserEmailQuickReply = {
  contentType: 'user_email';
};

export type QuickReply =
  | TextQuickReply
  | UserPhoneNumberQuickReply
  | UserEmailQuickReply;

export type TextMessage = {
  text?: string;
  quickReplies?: QuickReply[];
};

export type AttachmentMessage = {
  attachment?: Attachment;
  quickReplies?: QuickReply[];
};

export type Message = TextMessage | AttachmentMessage;

export type MessagingType =
  | 'RESPONSE'
  | 'UPDATE'
  | 'MESSAGE_TAG'
  | 'NON_PROMOTIONAL_SUBSCRIPTION';

export type MessageTag =
  | 'CONFIRMED_EVENT_UPDATE'
  | 'POST_PURCHASE_UPDATE'
  | 'ACCOUNT_UPDATE'
  | 'HUMAN_AGENT';

export type InsightMetric =
  | 'page_messages_blocked_conversations_unique'
  | 'page_messages_reported_conversations_unique'
  | 'page_messages_total_messaging_connections'
  | 'page_messages_new_conversations_unique';

export type AccessTokenOptions = {
  accessToken?: string;
};

export type InsightOptions = {
  since?: number;
  until?: number;
  accessToken?: string;
};

export type SendOption = {
  messagingType?: MessagingType;
  tag?: MessageTag;
  quickReplies?: QuickReply[];
  accessToken?: string;
};

export type UploadOption = {
  filename?: string;
  isReusable?: boolean;
  accessToken?: string;
};

export type TemplateButton = {
  type: string;
  title: string;
  url?: string;
  payload?: string;
  webviewHeightRatio?: 'compact' | 'tall' | 'full';
};

export type MenuItem = TemplateButton;

export type TemplateElement = {
  title: string;
  imageUrl: string;
  subtitle: string;
  defaultAction: {
    type: string;
    url: string;
    messengerExtensions: boolean;
    webviewHeightRatio: string;
    fallbackUrl: string;
  };
  buttons: TemplateButton[];
};

export type MediaElement = {
  mediaType: 'image' | 'video';
  attachmentId?: string;
  url?: string;
  buttons?: TemplateButton[];
};

export type Address = {
  street1: string;
  street2?: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
};

export type Summary = {
  subtotal?: number;
  shippingCost?: number;
  totalTax?: number;
  totalCost: number;
};

export type Adjustment = {
  name?: string;
  amount?: number;
};

export type ReceiptElement = {
  title: string;
  subtitle?: string;
  quantity?: number;
  price: number;
  currency?: string;
  imageUrl: string;
};

export type ReceiptAttributes = {
  recipientName: string;
  merchantName?: string;
  orderNumber: string; // must be unique
  currency: string;
  paymentMethod: string;
  timestamp?: string;
  orderUrl?: string;
  elements?: ReceiptElement[];
  address?: Address;
  summary: Summary;
  adjustments?: Adjustment[];
};

export type Airport = {
  airportCode: string;
  city: string;
  terminal?: string;
  gate?: string;
};

export type FlightSchedule = {
  boardingTime?: string;
  departureTime: string;
  arrivalTime?: string;
};

export type FlightInfo = {
  connectionId: string;
  segmentId: string | PassengerSegmentInfo;
  flightNumber: string;
  aircraftType?: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  flightSchedule: FlightSchedule;
  travelClass: 'economy' | 'business' | 'first_class';
};

export type Field = {
  label: string;
  value: string;
};

export type BoardingPass = {
  passengerName: string;
  pnrNumber: string;
  travelClass?: string;
  seat?: string;
  auxiliaryFields?: Field[];
  secondaryFields?: Field[];
  logoImageUrl: string;
  headerImageUrl?: string;
  headerTextField?: Field;
  qrCode?: string; // FIXME: qr_code or barcode_image_url
  barcodeImageUrl?: string;
  aboveBarCodeImageUrl: string;
  flightInfo: FlightInfo;
};

export type AirlineBoardingPassAttributes = {
  introMessage: string;
  locale: string;
  boardingPass: BoardingPass[];
};

export type PassengerInfo = {
  passengerId: string;
  ticketNumber?: string;
  name: string;
};

export type ProductInfo = {
  title: string;
  value: string;
};

export type PassengerSegmentInfo = {
  segmentId: string;
  passengerId: string;
  seat: string;
  seatType: string;
  productInfo?: ProductInfo[];
};

export type PriceInfo = {
  title: string;
  amount: string;
  currency?: string;
};

export type AirlineCheckinAttributes = {
  introMessage: string;
  locale: string;
  pnrNumber?: string;
  checkinUrl: string;
  flightInfo: FlightInfo[];
};

export type AirlineItineraryAttributes = {
  introMessage: string;
  locale: string;
  themeColor?: string;
  pnrNumber: string;
  passengerInfo: PassengerInfo[];
  flightInfo: FlightInfo[];
  passengerSegmentInfo: PassengerSegmentInfo[];
  priceInfo?: PriceInfo[];
  basePrice?: string;
  tax?: string;
  totalPrice: string;
  currency: string;
};

export type UpdateFlightInfo = {
  flightNumber: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  flightSchedule: FlightSchedule;
};

export type AirlineUpdateAttributes = {
  introMessage: string;
  themeColor?: string;
  updateType: 'delay' | 'gate_change' | 'cancellation';
  locale: string;
  pnrNumber?: string;
  updateFlightInfo: UpdateFlightInfo;
};

export type OneTimeNotifReqAttributes = {
  title: string;
  payload: string;
};

export type SenderAction = 'mark_seen' | 'typing_on' | 'typing_off';

/**
 * Fields can be retrieved from a person's profile information
 */
export type UserProfileField =
  // Granted by default
  | 'id'
  | 'name'
  | 'first_name'
  | 'last_name'
  | 'profile_pic'
  // Needs approval by Facebook
  | 'locale'
  | 'timezone'
  | 'gender';

/**
 * The User Profile API allows you to use a Page-scoped ID (PSID) to retrieve user profile information in this format
 */
export type User = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  locale?: string;
  timezone?: number;
  gender?: string;
};

export type PersistentMenu = {
  locale: string;
  composerInputDisabled: boolean;
  callToActions: MenuItem[];
}[];

export type GreetingConfig = {
  locale: string;
  text: string;
};

export type IceBreaker = {
  question: string;
  payload: string;
};

export type MessengerProfile = {
  getStarted?: {
    payload: string;
  };
  persistentMenu?: PersistentMenu;
  greeting?: {
    locale: string;
    text: string;
  }[];
  iceBreakers?: IceBreaker[];
  whitelistedDomains?: string[];
  accountLinkingUrl?: string;
  paymentSettings?: {
    privacyUrl?: string;
    publicKey?: string;
    testUsers?: string[];
  };
  homeUrl?: {
    url: string;
    webviewHeightRatio: 'tall';
    webviewShareButton?: 'hide' | 'show';
    inTest: boolean;
  };
};

export type MessengerProfileResponse = {
  data: MessengerProfile[];
};

export type MutationSuccessResponse = {
  result: string;
};

export type SendMessageSuccessResponse = {
  recipientId: string;
  messageId: string;
};

export type SendSenderActionResponse = {
  recipientId: string;
};

export type MessageTagResponse = {
  tag: MessageTag;
  description: string;
}[];

export type FileData = Buffer | fs.ReadStream;

export type BatchRequestOptions = {
  name?: string;
  dependsOn?: string;
};

export type Model =
  | 'CUSTOM'
  | 'CHINESE'
  | 'CROATIAN'
  | 'DANISH'
  | 'DUTCH'
  | 'ENGLISH'
  | 'FRENCH_STANDARD'
  | 'GERMAN_STANDARD'
  | 'HEBREW'
  | 'HUNGARIAN'
  | 'IRISH'
  | 'ITALIAN_STANDARD'
  | 'KOREAN'
  | 'NORWEGIAN_BOKMAL'
  | 'POLISH'
  | 'PORTUGUESE'
  | 'ROMANIAN'
  | 'SPANISH'
  | 'SWEDISH'
  | 'VIETNAMESE';

export type MessengerNLPConfig = {
  nlpEnabled?: boolean;
  model?: Model;
  customToken?: string;
  verbose?: boolean;
  nBest?: number;
};

export type PageInfo = {
  name: string;
  id: string;
};

type Scope = string;

export type TokenInfo = {
  appId: string;
  type: 'PAGE' | 'APP' | 'USER';
  application: string;
  dataAccessExpiresAt: number;
  expiresAt: number;
  isValid: true;
  issuedAt?: number;
  profileId: string;
  scopes: Scope[];
  userId: string;
};

export type MessagingFeatureReview = {
  feature: string;
  status: 'pending' | 'rejected' | 'approved' | 'limited';
};

export type Persona = {
  name: string;
  profilePictureUrl: string;
};

export type SubscriptionFields = {
  name: string;
  version: string;
};

export type MessengerSubscription = {
  object: string;
  callbackUrl: string;
  active: boolean;
  fields: SubscriptionFields[];
};

export type BatchItem = {
  method: string;
  relativeUrl: string;
  name?: string;
  body?: Record<string, any>;
  responseAccessPath?: string;
} & BatchRequestOptions;
