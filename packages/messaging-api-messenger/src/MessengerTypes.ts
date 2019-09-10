import fs from 'fs';

export type UserID = string;

export type RecipientWithID = {
  id: UserID;
};

export type RecipientWithPhoneNumber = {
  phone_number: string;
  name?: Record<string, any>;
};

export type Recipient = RecipientWithID | RecipientWithPhoneNumber;

export type UrlMediaAttachmentPayload = {
  url: string;
  is_reusable?: boolean;
};

export type AttachmentIdAttachmentPayload = {
  attachment_id: string;
};

export type MediaAttachmentPayload = UrlMediaAttachmentPayload | AttachmentIdAttachmentPayload;

export type MediaAttachmentType = 'audio' | 'video' | 'image' | 'file';

export type FileDataAttachmentPayload = {
  is_reusable?: boolean;
};

export type FileDataMediaAttachment = {
  type: MediaAttachmentType;
  payload: FileDataAttachmentPayload;
};

export type FileDataMediaAttachmentMessage = {
  attachment: FileDataMediaAttachment;
  quick_replies?: QuickReply[];
};

export type MediaAttachment = {
  type: MediaAttachmentType;
  payload: MediaAttachmentPayload;
};

export type TemplateAttachmentPayload = {
  template_type: 'button' | 'generic' | 'list' | 'open_graph' | 'media' | 'receipt' | 'airline_boardingpass' | 'airline_checkin' | 'airline_itinerary' | 'airline_update';
  [key: string]: any; // FIXME: list all of templates
};

export type TemplateAttachment = {
  type: 'template';
  payload: TemplateAttachmentPayload;
};

export type Attachment = MediaAttachment | TemplateAttachment;

export type TextQuickReply = {
  content_type: 'text';
  title: string;
  payload: string;
  image_url?: string;
};

export type UserPhoneNumberQuickReply = {
  content_type: 'user_phone_number';
};

export type UserEmailQuickReply = {
  content_type: 'user_email';
};

export type QuickReply = TextQuickReply | UserPhoneNumberQuickReply | UserEmailQuickReply;

export type TextMessage = {
  text?: string;
  quick_replies?: QuickReply[];
};

export type AttachmentMessage = {
  attachment?: Attachment;
  quick_replies?: QuickReply[];
}

export type Message = TextMessage | AttachmentMessage;

export type MessagingType =
  | 'RESPONSE'
  | 'UPDATE'
  | 'MESSAGE_TAG'
  | 'NON_PROMOTIONAL_SUBSCRIPTION';

export type MessageTag =
  | 'BUSINESS_PRODUCTIVITY'
  | 'COMMUNITY_ALERT'
  | 'CONFIRMED_EVENT_REMINDER'
  | 'NON_PROMOTIONAL_SUBSCRIPTION'
  | 'PAIRING_UPDATE'
  | 'APPLICATION_UPDATE'
  | 'ACCOUNT_UPDATE'
  | 'PAYMENT_UPDATE'
  | 'PERSONAL_FINANCE_UPDATE'
  | 'SHIPPING_UPDATE'
  | 'RESERVATION_UPDATE'
  | 'ISSUE_RESOLUTION'
  | 'APPOINTMENT_UPDATE'
  | 'GAME_EVENT'
  | 'TRANSPORTATION_UPDATE'
  | 'FEATURE_FUNCTIONALITY_UPDATE'
  | 'TICKET_UPDATE';

export type InsightMetric =
  | 'page_messages_blocked_conversations_unique'
  | 'page_messages_reported_conversations_unique'
  | 'page_messages_total_messaging_connections'
  | 'page_messages_new_conversations_unique';

export type InsightOptions = {
  since?: number;
  until?: number;
  access_token?: string;
};

export type SendOption = {
  messaging_type?: MessagingType;
  tag?: MessageTag;
  quick_replies?: Array<QuickReply>;
  access_token?: string;
};

export type UploadOption = {
  filename?: string;
  is_reusable?: boolean;
  access_token?: string;
};

export type TemplateButton = {
  type: string;
  title: string;
  url?: string;
  payload?: string;
  webview_height_ratio?: 'compact' | 'tall' | 'full';
};

export type MenuItem = TemplateButton;

export type TemplateElement = {
  title: string;
  image_url: string;
  subtitle: string;
  default_action: {
    type: string;
    url: string;
    messenger_extensions: boolean;
    webview_height_ratio: string;
    fallback_url: string;
  };
  buttons: Array<TemplateButton>;
};

export type OpenGraphElement = {
  url: string;
  buttons?: Array<TemplateButton>;
};

export type MediaElement = {
  media_type: 'image' | 'video';
  attachment_id?: string;
  url?: string;
  buttons?: Array<TemplateButton>;
};

export type Address = {
  street_1: string;
  street_2?: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
};

export type Summary = {
  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
  total_cost: number;
};

export type Adjustment = {
  name?: string;
  ammont?: number;
};

export type ReceiptAttributes = {
  recipient_name: string;
  merchant_name?: string;
  order_number: string; // must be unique
  currency: string;
  payment_method: string;
  timestamp?: string;
  order_url?: string;
  elements?: Array<TemplateElement>;
  address?: Address;
  summary: Summary;
  adjustments?: Array<Adjustment>;
};

export type Airport = {
  airport_code: string;
  city: string;
  terminal?: string;
  gate?: string;
};

export type FlightSchedule = {
  boarding_time?: string;
  departure_time: string;
  arrival_time?: string;
};

export type FlightInfo = {
  flight_number: string;
  departure_airport: Airport;
  arrival_airport: Airport;
  flight_schedule: FlightSchedule;
};

export type Field = {
  label: string;
  value: string;
};

export type BoardingPass = {
  passenger_name: string;
  pnr_number: string;
  travel_class?: string;
  seat?: string;
  auxiliary_fields?: Array<Field>;
  secondary_fields?: Array<Field>;
  logo_image_url: string;
  header_image_url?: string;
  header_text_field?: Field;
  qr_code?: string; // FIXME: qr_code or barcode_image_url
  barcode_image_url?: string;
  above_bar_code_image_url: string;
  flight_info: FlightInfo;
};

export type AirlineBoardingPassAttributes = {
  intro_message: string;
  locale: string;
  boarding_pass: Array<BoardingPass>;
};

export type PassengerInfo = {
  passenger_id: string;
  ticket_number?: string;
  name: string;
};

export type PassengerSegmentInfo = {
  segment_id: string;
  passenger_id: string;
  seat: string;
  seat_type: string;
  product_info?: string;
};

export type PriceInfo = {
  title: string;
  ammont: number;
  currency?: string;
};

export type AirlineCheckinAttributes = {
  intro_message: string;
  locale: string;
  theme_color?: string;
  pnr_number: string;
  passenger_info: Array<PassengerInfo>;
  flight_info: Array<FlightInfo>;
  passenger_segment_info: Array<PassengerSegmentInfo>;
  price_info?: Array<PriceInfo>;
  base_price?: number;
  tax?: number;
  total_price: number;
  currency: string;
};

export type AirlineItineraryAttributes = {};

export type AirlineUpdateAttributes = {};

export type SenderAction = string;

export type User = {
  first_name: string;
  last_name: string;
  profile_pic: string;
  locale: string;
  timezone: number;
  gender: string;
};

export type PersistentMenu = Array<{
  locale: string;
  composer_input_disabled: boolean;
  call_to_actions: Array<MenuItem>;
}>;

export type GreetingConfig = {
  locale: string;
  text: string;
};

export type AudienceType = 'all' | 'custom' | 'none';

export type MessengerProfile = {
  get_started?: {
    payload: string;
  };
  persistent_menu?: PersistentMenu;
  greeting?: Array<{
    locale: string;
    text: string;
  }>;
  whitelisted_domains?: Array<string>;
  account_linking_url?: string;
  payment_settings?: {
    privacy_url?: string;
    public_key?: string;
    test_users?: Array<string>;
  };
  target_audience?: {
    audience_type: AudienceType;
    countries?: {
      whitelist?: Array<string>;
      blacklist?: Array<string>;
    };
  };
  home_url?: {
    url: string;
    webview_height_ratio: 'tall';
    webview_share_button?: 'hide' | 'show';
    in_test: boolean;
  };
};

export type MessengerProfileResponse = {
  data: Array<MessengerProfile>;
};

export type MutationSuccessResponse = {
  result: string;
};

export type SendMessageSuccessResponse = {
  recipient_id: string;
  message_id: string;
};

export type SendSenderActionResponse = {
  recipient_id: string;
};

export type MessageTagResponse = Array<{
  tag: MessageTag;
  description: string;
}>;

export type FileData = Buffer | fs.ReadStream;

export type BatchItem = {
  method: string;
  relative_url: string;
  name?: string;
  body?: Record<string, any>;
  responseAccessPath?: string;
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
  nlp_enabled?: boolean;
  model?: Model;
  custom_token?: string;
  verbose?: boolean;
  n_best?: number;
};

export type PageInfo = {
  name: string;
  id: string;
};

type Scope = string;

export type TokenInfo = {
  app_id: string;
  type: 'PAGE' | 'APP' | 'USER';
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: true;
  issued_at?: number;
  profile_id: string;
  scopes: Array<Scope>;
  user_id: string;
};

export type MessagingFeatureReview = {
  feature: string;
  status: 'pending' | 'rejected' | 'approved' | 'limited';
};

export type Persona = {
  name: string;
  profile_picture_url: string;
};

export type SubscriptionFields = {
  name: string;
  version: string;
};

export type MessengerSubscription = {
  object: string;
  callback_url: string;
  active: boolean;
  fields: Array<SubscriptionFields>;
};
