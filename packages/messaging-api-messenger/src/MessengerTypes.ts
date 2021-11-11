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

export type GenericTemplatePayload = {
  /**
   * Value must be `generic`
   */
  templateType: 'generic';
  /**
   * Optional. The aspect ratio used to render images specified by `element.imageUrl`. Must be `horizontal` (1.91:1) or `square` (1:1). Defaults to `horizontal`.
   */
  imageAspectRatio?: string;
  /**
   * An array of element objects that describe instances of the generic template to be sent. Specifying multiple elements will send a horizontally scrollable carousel of templates. A maximum of 10 elements is supported.
   */
  elements: TemplateElement[];
};

export type ButtonTemplatePayload = {
  /**
   * Value must be `button`
   */
  templateType: 'button';
  /**
   * UTF-8-encoded text of up to 640 characters. Text will appear above the buttons.
   */
  text: string;
  /**
   * Set of 1-3 buttons that appear as call-to-actions.
   */
  buttons: TemplateButton[];
};

export type MediaTemplatePayload = {
  /**
   * Value must be `media`
   */
  templateType: 'media';
  /**
   * An array containing 1 element object that describe the media in the message. A maximum of 1 element is supported.
   */
  elements: MediaElement[];
  /**
   * Optional. Set to `true` to enable the native share button in Messenger for the template message. Defaults to `false`.
   */
  sharable?: boolean;
};

export type ReceiptTemplatePayload = {
  /**
   * Value must be `receipt`.
   */
  templateType: 'receipt';
  /**
   * Optional. Set to `true` to enable the native share button in Messenger for the template message. Defaults to `false`.
   */
  sharable?: boolean;
  /**
   * The recipient's name.
   */
  recipientName: string;
  /**
   * Optional. The merchant's name. If present this is shown as logo text.
   */
  merchantName?: string;
  /**
   * The order number. Must be unique.
   */
  orderNumber: string;
  /**
   * The currency of the payment.
   */
  currency: string;
  /**
   * The payment method used. Providing enough information for the customer to decipher which payment method and account they used is recommended. This can be a custom string, such as, "Visa 1234".
   */
  paymentMethod: string;
  /**
   * Optional. Timestamp of the order in seconds.
   */
  timestamp?: string;
  /**
   * Optional. Array of a maximum of 100 `element` objects that describe items in the order. Sort order of the elements is not guaranteed.
   */
  elements?: ReceiptElement[];
  /**
   * Optional. The shipping address of the order.
   */
  address?: Address;
  /**
   * The payment summary. See `Summary`.
   */
  summary: Summary;
  /**
   * Optional. An array of payment objects that describe payment adjustments, such as discounts.
   */
  adjustments?: Adjustment[];

  orderUrl?: string;
};

export type OneTimeNotifReqTemplatePayload = {
  templateType: 'one_time_notif_req';
  title: string;
  payload: string;
};

export type TemplateAttachmentPayload =
  | GenericTemplatePayload
  | ButtonTemplatePayload
  | MediaTemplatePayload
  | ReceiptTemplatePayload
  | OneTimeNotifReqTemplatePayload;

// TODO: add product, feedback template

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

/**
 * https://developers.facebook.com/docs/messenger-platform/send-messages/#messaging_types
 */
export type MessagingType = 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG';

/**
 * https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags
 */
export type MessageTag =
  | 'CONFIRMED_EVENT_UPDATE'
  | 'POST_PURCHASE_UPDATE'
  | 'ACCOUNT_UPDATE'
  | 'HUMAN_AGENT'
  | 'CUSTOMER_FEEDBACK';

export type InsightMetric =
  | 'page_messages_blocked_conversations_unique'
  | 'page_messages_reported_conversations_unique'
  | 'page_messages_total_messaging_connections'
  | 'page_messages_new_conversations_unique';

export type InsightOptions = {
  since?: number;
  until?: number;
};

export type MessageOptions = { quickReplies?: QuickReply[] };

export type SendOption = {
  messagingType?: MessagingType;
  tag?: MessageTag;
  quickReplies?: QuickReply[];
  personaId?: string;
};

export type SenderActionOption = {
  personaId?: string;
};

export type UploadOption = {
  filename?: string;
  isReusable?: boolean;
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
  imageUrl?: string;
  subtitle?: string;
  defaultAction?: {
    type: string;
    url: string;
    messengerExtensions?: boolean;
    webviewHeightRatio?: string;
    fallbackUrl?: string;
  };
  buttons?: TemplateButton[];
};

export type MediaElement = {
  mediaType: 'image' | 'video';
  attachmentId?: string;
  url?: string;
  buttons?: TemplateButton[];
};

export type Address = {
  /**
   * The street address, line 1.
   */
  street1: string;
  /**
   * Optional. The street address, line 2.
   */
  street2?: string;
  /**
   * The city name of the address.
   */
  city: string;
  /**
   * The postal code of the address.
   */
  postalCode: string;
  /**
   * The state abbreviation for U.S. addresses, or the region/province for non-U.S. addresses.
   */
  state: string;
  /**
   * The two-letter country abbreviation of the address.
   */
  country: string;
};

export type Summary = {
  /**
   * Optional. The sub-total of the order.
   */
  subtotal?: number;
  /**
   * Optional. The shipping cost of the order.
   */
  shippingCost?: number;
  /**
   * Optional. The tax of the order.
   */
  totalTax?: number;
  /**
   * The total cost of the order, including sub-total, shipping, and tax.
   */
  totalCost: number;
};

export type Adjustment = {
  /**
   * Required if the `adjustments` array is set. Name of the adjustment.
   */
  name: string;
  /**
   * Required if the `adjustments` array is set. The amount of the adjustment.
   */
  amount: number;
};

export type ReceiptElement = {
  /**
   * The name to display for the item.
   */
  title: string;
  /**
   * Optional. The subtitle for the item, usually a brief item description.
   */
  subtitle?: string;
  /**
   * Optional. The quantity of the item purchased.
   */
  quantity?: number;
  /**
   * The price of the item. For free items, '0' is allowed.
   */
  price: number;
  /**
   * Optional. The currency of the item price.
   */
  currency?: string;
  /**
   * Optional. The URL of an image to be displayed with the item.
   */
  imageUrl?: string;
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

export type PersistentMenuItem = {
  locale: string;
  composerInputDisabled: boolean;
  callToActions: MenuItem[];
};

export type PersistentMenu = PersistentMenuItem[];

export type GreetingConfig = {
  locale: string;
  text: string;
};

export type IceBreaker = {
  question: string;
  payload: string;
};

export type UserPersistentMenu = {
  userLevelPersistentMenu?: PersistentMenu;
  pageLevelPersistentMenu?: PersistentMenu;
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
  omitResponseOnSuccess?: boolean;
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
