import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  origin?: string;
  onRequest?: OnRequestFunction;
};

type MessageAddressRetention = 'retain';

type MessageContentRetention = 'retain';

/**
 * Options to pass to create
 */
export interface MessageListInstanceCreateOptions {
  /**
   * Determines if the address can be stored or obfuscated based on privacy settings.
   */
  addressRetention?: MessageAddressRetention;
  /**
   * The application to use for callbacks.
   */
  applicationSid?: string;
  /**
   * Total numer of attempts made , this inclusive to send out the message.
   */
  attempt?: number;
  /**
   * The text of the message you want to send. Can be up to 1,600 characters in length.
   */
  body?: string;
  /**
   * Determines if the message content can be stored or redacted based on privacy settings.
   */
  contentRetention?: MessageContentRetention;
  /**
   * Reserved
   */
  forceDelivery?: boolean;
  /**
   * The phone number that initiated the message.
   */
  from?: string;
  /**
   * The total maximum price up to 4 decimal places in US dollars acceptable for the message to be delivered.
   */
  maxPrice?: number;
  /**
   * The URL of the media to send with the message.
   */
  mediaUrl?: string | string[];
  /**
   * The SID of the Messaging Service you want to associate with the message.
   */
  messagingServiceSid?: string;
  /**
   * Rich actions for Channels Messages.
   */
  persistentAction?: string | string[];
  /**
   * Whether to confirm delivery of the message.
   */
  provideFeedback?: boolean;
  /**
   * Whether to detect Unicode characters that have a similar GSM-7 character and replace them.
   */
  smartEncoded?: boolean;
  /**
   * The URL we should call to send status information to your application.
   */
  statusCallback?: string;
  /**
   * The destination phone number.
   */
  to: string;
  /**
   * The number of seconds that the message can remain in our outgoing queue.
   */
  validityPeriod?: number;
}

type MessageDirection =
  | 'inbound'
  | 'outbound-api'
  | 'outbound-call'
  | 'outbound-reply';

type MessageStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'delivered'
  | 'undelivered'
  | 'receiving'
  | 'received'
  | 'accepted'
  | 'scheduled'
  | 'read'
  | 'partially_delivered'
  | 'canceled';

export interface MessageResource {
  account_sid: string;
  api_version: string;
  body: string;
  date_created: Date;
  date_sent: Date;
  date_updated: Date;
  direction: MessageDirection;
  error_code: number;
  error_message: string;
  from: string;
  messaging_service_sid: string;
  num_media: string;
  num_segments: string;
  price: string;
  price_unit: string;
  sid: string;
  status: MessageStatus;
  subresource_uris: string;
  to: string;
  uri: string;
}
