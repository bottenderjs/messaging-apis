/* @flow */

import querystring from 'querystring';

import axios from 'axios';
import AxiosError from 'axios-error';
import FormData from 'form-data';
import invariant from 'invariant';
import omit from 'lodash.omit';
import isPlainObject from 'is-plain-object';
import warning from 'warning';

import Messenger from './_Messenger'; // FIXME: v0.7
import type {
  UserID,
  Recipient,
  AttachmentPayload,
  Attachment,
  TextOrAttachment,
  Message,
  SendOption,
  UploadOption,
  TemplateButton,
  MenuItem,
  GreetingConfig,
  TemplateElement,
  QuickReply,
  SenderAction,
  User,
  OpenGraphElement,
  MediaElement,
  ReceiptAttributes,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineFlightUpdateAttributes,
  PersistentMenu,
  AudienceType,
  MessengerProfile,
  MessengerProfileResponse,
  MutationSuccessResponse,
  SendMessageSucessResponse,
  SendSenderActionResponse,
  MessageTagResponse,
  FileData,
  BatchItem,
  MessengerNLPConfig,
  InsightMetric,
  InsightOptions,
  PageInfo,
} from './MessengerTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

function extractVersion(version) {
  if (version.startsWith('v')) {
    return version.slice(1);
  }
  return version;
}

function validateQuickReplies(quickReplies: Array<QuickReply>): void {
  // quick_replies is limited to 11
  invariant(
    Array.isArray(quickReplies) && quickReplies.length <= 11,
    'quick_replies is an array and limited to 11'
  );

  quickReplies.forEach(quickReply => {
    if (quickReply.content_type === 'text') {
      // title has a 20 character limit, after that it gets truncated
      invariant(
        (quickReply.title: any).trim().length <= 20,
        'title of quick reply has a 20 character limit, after that it gets truncated'
      );

      // payload has a 1000 character limit
      invariant(
        (quickReply.payload: any).length <= 1000,
        'payload of quick reply has a 1000 character limit'
      );
    }
  });
}

function handleError(err) {
  const { error } = err.response.data;
  const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
  throw new AxiosError(msg, err);
}

export default class MessengerClient {
  static connect = (
    accessToken: string,
    version?: string = '2.11'
  ): MessengerClient => new MessengerClient(accessToken, version);

  _accessToken: string;
  _version: string;
  _axios: Axios;

  constructor(accessToken: string, version?: string = '2.11') {
    this._accessToken = accessToken;
    invariant(typeof version === 'string', 'Type of `version` must be string.');
    this._version = extractVersion(version);
    this._axios = axios.create({
      baseURL: `https://graph.facebook.com/v${this._version}/`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  get version(): string {
    return this._version;
  }

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Get Page Info
   *
   * https://developers.facebook.com/docs/graph-api/using-graph-api
   * id, name
   */
  getPageInfo = (
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<PageInfo> =>
    this._axios
      .get(`/me?access_token=${customAccessToken || this._accessToken}`)
      .then(res => res.data, handleError);

  /**
   * Get User Profile
   *
   * https://www.quora.com/How-connect-Facebook-user-id-to-sender-id-in-the-Facebook-messenger-platform
   * first_name, last_name, profile_pic, locale, timezone, gender
   */
  getUserProfile = (
    userId: string,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<User> =>
    this._axios
      .get(`/${userId}?access_token=${customAccessToken || this._accessToken}`)
      .then(res => res.data, handleError);

  /**
   * Messenger Profile
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
   */
  getMessengerProfile = (
    fields: Array<string>,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<MessengerProfileResponse> =>
    this._axios
      .get(
        `/me/messenger_profile?fields=${fields.join(
          ','
        )}&access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data.data, handleError);

  setMessengerProfile = (
    profile: MessengerProfile,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<MutationSuccessResponse> =>
    this._axios
      .post(
        `/me/messenger_profile?access_token=${customAccessToken ||
          this._accessToken}`,
        profile
      )
      .then(res => res.data, handleError);

  deleteMessengerProfile = (
    fields: Array<string>,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<MutationSuccessResponse> =>
    this._axios
      .delete(
        `/me/messenger_profile?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          data: {
            fields,
          },
        }
      )
      .then(res => res.data, handleError);

  /**
   * Get Started Button
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button
   */
  getGetStarted = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['get_started'], options).then(
      res => (res[0] ? res[0].get_started : null)
    );

  setGetStarted = (
    payload: string,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        get_started: {
          payload,
        },
      },
      options
    );

  deleteGetStarted = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['get_started'], options);

  /**
   * Persistent Menu
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
   */
  getPersistentMenu = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['persistent_menu'], options).then(
      res => (res[0] ? res[0].persistent_menu : null)
    );

  setPersistentMenu = (
    menuItems: Array<MenuItem> | PersistentMenu,
    {
      composer_input_disabled: composerInputDisabled = false,
      ...options
    }: { composer_input_disabled: boolean } = {}
  ): Promise<MutationSuccessResponse> => {
    // menuItems is in type PersistentMenu
    if (menuItems.some((item: Object) => item.locale === 'default')) {
      return this.setMessengerProfile(
        {
          persistent_menu: ((menuItems: any): PersistentMenu),
        },
        options
      );
    }

    // menuItems is in type Array<MenuItem>
    return this.setMessengerProfile(
      {
        persistent_menu: [
          {
            locale: 'default',
            composer_input_disabled: composerInputDisabled,
            call_to_actions: ((menuItems: any): Array<MenuItem>),
          },
        ],
      },
      options
    );
  };

  deletePersistentMenu = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['persistent_menu'], options);

  /**
   * Greeting Text
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
   */
  getGreeting = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['greeting'], options).then(
      res => (res[0] ? res[0].greeting : null)
    );

  setGreeting = (
    greeting: string | Array<GreetingConfig>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> => {
    if (typeof greeting === 'string') {
      return this.setMessengerProfile(
        {
          greeting: [
            {
              locale: 'default',
              text: greeting,
            },
          ],
        },
        options
      );
    }

    return this.setMessengerProfile(
      {
        greeting,
      },
      options
    );
  };

  deleteGreeting = (options?: Object = {}): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['greeting'], options);

  /**
   * Whitelisted Domains
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/domain-whitelisting
   */
  getWhitelistedDomains = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['whitelisted_domains'], options).then(
      res => (res[0] ? res[0].whitelisted_domains : null)
    );

  setWhitelistedDomains = (
    domains: Array<string>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        whitelisted_domains: domains,
      },
      options
    );

  deleteWhitelistedDomains = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['whitelisted_domains'], options);

  /**
   * Account Linking URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/account-linking-url
   */
  getAccountLinkingURL = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['account_linking_url'], options).then(
      res => (res[0] ? res[0] : null)
    );

  setAccountLinkingURL = (
    url: string,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        account_linking_url: url,
      },
      options
    );

  deleteAccountLinkingURL = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['account_linking_url'], options);

  /**
   * Payment Settings
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/payment-settings
   */
  getPaymentSettings = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['payment_settings'], options).then(
      res => (res[0] ? res[0] : null)
    );

  setPaymentPrivacyPolicyURL = (
    url: string,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        payment_settings: {
          privacy_url: url,
        },
      },
      options
    );

  setPaymentPublicKey = (
    key: string,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        payment_settings: {
          public_key: key,
        },
      },
      options
    );

  setPaymentTestUsers = (
    users: Array<string>,
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        payment_settings: {
          test_users: users,
        },
      },
      options
    );

  deletePaymentSettings = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['payment_settings'], options);

  /**
   * Target Audience
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/target-audience
   */
  getTargetAudience = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['target_audience'], options).then(
      res => (res[0] ? res[0] : null)
    );

  setTargetAudience = (
    type: AudienceType,
    whitelist: ?Array<string> = [],
    blacklist: ?Array<string> = [],
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        target_audience: {
          audience_type: type,
          countries: {
            whitelist,
            blacklist,
          },
        },
      },
      options
    );

  deleteTargetAudience = (
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['target_audience'], options);

  /**
   * Chat Extension Home URL
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/home-url
   */
  getHomeURL = (
    options?: Object = {}
  ): Promise<MessengerProfileResponse | null> =>
    this.getMessengerProfile(['home_url'], options).then(
      res => (res[0] ? res[0] : null)
    );

  setHomeURL = (
    url: string,
    {
      webview_share_button,
      in_test,
    }: {
      webview_share_button?: 'hide' | 'show',
      in_test: boolean,
    },
    options?: Object = {}
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile(
      {
        home_url: {
          url,
          webview_height_ratio: 'tall',
          in_test,
          webview_share_button,
        },
      },
      options
    );

  deleteHomeURL = (options?: Object = {}): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['home_url'], options);

  /**
   * Message tags
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags
   */
  getMessageTags = (
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<MessageTagResponse> =>
    this._axios
      .get(
        `/page_message_tags?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);

  /**
   * Send API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/send-api
   */
  // TODO: body flowtype
  sendRawBody = (body: Object): Promise<SendMessageSucessResponse> => {
    const { access_token: customAccessToken } = body;

    return this._axios
      .post(
        `/me/messages?access_token=${customAccessToken || this._accessToken}`,
        body
      )
      .then(res => res.data, handleError);
  };

  sendMessage = (
    idOrRecipient: UserID | Recipient,
    message: Message,
    options?: SendOption = {}
  ): Promise<SendMessageSucessResponse> => {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;

    let messageType = 'UPDATE';

    if (options.messaging_type) {
      messageType = options.messaging_type;
    } else if (options.tag) {
      messageType = 'MESSAGE_TAG';
    }

    const { quick_replies: quickReplies, ...otherOptions } = options;

    if (quickReplies) {
      validateQuickReplies(quickReplies);
      message.quick_replies = quickReplies; // eslint-disable-line no-param-reassign
    }

    return this.sendRawBody({
      messaging_type: messageType,
      recipient,
      message,
      ...otherOptions,
    });
  };

  sendMessageFormData = (
    recipient: UserID | Recipient,
    message: Message,
    filedata: FileData,
    options?: SendOption = {}
  ) => {
    const form = new FormData();
    const recipientObject =
      typeof recipient === 'string'
        ? {
            id: recipient,
          }
        : recipient;

    let messageType = 'UPDATE';
    if (options.messaging_type) {
      messageType = options.messaging_type;
    } else if (options.tag) {
      messageType = 'MESSAGE_TAG';
    }

    if (options.quick_replies) {
      validateQuickReplies(options.quick_replies);
      message.quick_replies = options.quick_replies; // eslint-disable-line no-param-reassign
    }

    form.append('messaging_type', messageType);
    form.append('recipient', JSON.stringify(recipientObject));
    form.append('message', JSON.stringify(message));
    form.append('filedata', filedata);
    return this._axios
      .post(
        `/me/messages?access_token=${options.access_token ||
          this._accessToken}`,
        form,
        {
          headers: form.getHeaders(),
        }
      )
      .then(res => res.data, handleError);
  };

  /**
   * Content Types
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages#content_types
   */
  sendAttachment = (
    recipient: UserID | Recipient,
    attachment: Attachment,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createAttachment(attachment),
      options
    );

  sendAttachmentFormData = (
    recipient: UserID | Recipient,
    attachment: Attachment,
    filedata: FileData,
    option?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessageFormData(recipient, { attachment }, filedata, option);

  sendText = (
    recipient: UserID | Recipient,
    text: string,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(recipient, Messenger.createText(text), options);

  sendAudio = (
    recipient: UserID | Recipient,
    audio: string | FileData | AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'audio',
      payload: {},
    };

    if (typeof audio === 'string') {
      attachment.payload.url = audio;
      return this.sendAttachment(recipient, attachment, options);
    } else if (audio && isPlainObject(audio)) {
      attachment.payload = audio;
      return this.sendAttachment(recipient, attachment, options);
    }

    // $FlowFixMe
    return this.sendAttachmentFormData(recipient, attachment, audio, options);
  };

  sendImage = (
    recipient: UserID | Recipient,
    image: string | FileData | AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'image',
      payload: {},
    };

    if (typeof image === 'string') {
      attachment.payload.url = image;
      return this.sendAttachment(recipient, attachment, options);
    } else if (image && isPlainObject(image)) {
      attachment.payload = image;
      return this.sendAttachment(recipient, attachment, options);
    }

    // $FlowFixMe
    return this.sendAttachmentFormData(recipient, attachment, image, options);
  };

  sendVideo = (
    recipient: UserID | Recipient,
    video: string | FileData | AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'video',
      payload: {},
    };

    if (typeof video === 'string') {
      attachment.payload.url = video;
      return this.sendAttachment(recipient, attachment, options);
    } else if (video && isPlainObject(video)) {
      attachment.payload = video;
      return this.sendAttachment(recipient, attachment, options);
    }

    // $FlowFixMe
    return this.sendAttachmentFormData(recipient, attachment, video, options);
  };

  sendFile = (
    recipient: UserID | Recipient,
    file: string | FileData | AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'file',
      payload: {},
    };

    if (typeof file === 'string') {
      attachment.payload.url = file;
      return this.sendAttachment(recipient, attachment, options);
    } else if (file && isPlainObject(file)) {
      attachment.payload = file;
      return this.sendAttachment(recipient, attachment, options);
    }

    // $FlowFixMe
    return this.sendAttachmentFormData(recipient, attachment, file, options);
  };

  /**
   * Message Templates
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/templates
   */
  sendTemplate = (
    recipient: UserID | Recipient,
    payload: AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(recipient, Messenger.createTemplate(payload), options);

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/button
  sendButtonTemplate = (
    recipient: UserID | Recipient,
    text: string,
    buttons: Array<TemplateButton>,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createButtonTemplate(text, buttons),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
  sendGenericTemplate = (
    recipient: UserID | Recipient,
    elements: Array<TemplateElement>,
    options?: {
      ...SendOption,
      image_aspect_ratio?: 'horizontal' | 'square',
    } = {}
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createGenericTemplate(elements, {
        image_aspect_ratio: options.image_aspect_ratio || 'horizontal',
      }),
      omit(options, ['image_aspect_ratio'])
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/list
  sendListTemplate = (
    recipient: UserID | Recipient,
    elements: Array<TemplateElement>,
    buttons: Array<TemplateButton>,
    options?: {
      ...SendOption,
      top_element_style?: 'large' | 'compact',
    } = {}
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createListTemplate(elements, buttons, {
        top_element_style: options.top_element_style || 'large',
      }),
      omit(options, ['top_element_style'])
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/open-graph
  sendOpenGraphTemplate = (
    recipient: UserID | Recipient,
    elements: Array<OpenGraphElement>,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createOpenGraphTemplate(elements),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt
  sendReceiptTemplate = (
    recipient: UserID | Recipient,
    attrs: ReceiptAttributes,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createReceiptTemplate(attrs),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/media
  sendMediaTemplate = (
    recipient: UserID | Recipient,
    elements: Array<MediaElement>,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createMediaTemplate(elements),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#boarding_pass
  sendAirlineBoardingPassTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineBoardingPassAttributes,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createAirlineBoardingPassTemplate(attrs),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#check_in
  sendAirlineCheckinTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineCheckinAttributes,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createAirlineCheckinTemplate(attrs),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#itinerary
  sendAirlineItineraryTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineItineraryAttributes,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createAirlineItineraryTemplate(attrs),
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline#update
  sendAirlineFlightUpdateTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineFlightUpdateAttributes,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(
      recipient,
      Messenger.createAirlineFlightUpdateTemplate(attrs),
      options
    );

  /**
   * Quick Replies
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
   */
  sendQuickReplies = (
    recipient: UserID | Recipient,
    textOrAttachment: TextOrAttachment,
    quickReplies: Array<QuickReply>,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    warning(
      false,
      '`sendQuickReplies` is deprecated. Use send message methods with `options.quick_replies` instead.'
    );
    validateQuickReplies(quickReplies);

    return this.sendMessage(
      recipient,
      {
        ...textOrAttachment,
        quick_replies: quickReplies,
      },
      options
    );
  };

  /**
   * Typing
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
   */
  sendSenderAction = (
    idOrRecipient: UserID | Recipient,
    action: SenderAction,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<SendSenderActionResponse> => {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;
    return this.sendRawBody({
      recipient,
      sender_action: action,
      access_token: customAccessToken,
    });
  };

  markSeen = (
    recipient: UserID | Recipient,
    options?: Object = {}
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'mark_seen', options);

  typingOn = (
    recipient: UserID | Recipient,
    options?: Object = {}
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'typing_on', options);

  typingOff = (
    recipient: UserID | Recipient,
    options?: Object = {}
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'typing_off', options);

  /**
   * Send Batch Request
   *
   * https://developers.facebook.com/docs/graph-api/making-multiple-requests
   */
  sendBatch = (
    batch: Array<BatchItem>,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<Array<SendMessageSucessResponse>> => {
    invariant(
      batch.length <= 50,
      'limit the number of requests which can be in a batch to 50'
    );

    const bodyEncodedbatch = batch.map(item => {
      if (item.body) {
        return {
          ...item,
          body: Object.keys(item.body)
            .map(key => {
              // $FlowFixMe item.body should not possible as undefined.
              const val = item.body[key];
              return `${encodeURIComponent(key)}=${encodeURIComponent(
                typeof val === 'object' ? JSON.stringify(val) : val
              )}`;
            })
            .join('&'),
        };
      }
      return item;
    });
    return axios
      .post('https://graph.facebook.com/', {
        access_token: customAccessToken || this._accessToken,
        batch: bodyEncodedbatch,
      })
      .then(res => res.data);
  };

  /**
   * Broadcast API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/broadcast-api
   */

  /**
   * Create Message Creative
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages#creative
   */
  createMessageCreative = (
    messages: Array<Object> = [],
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/me/message_creatives?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          messages,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Send Broadcast Message
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages#sending
   */
  sendBroadcastMessage = (messageCreativeId: number, options?: Object = {}) =>
    this._axios
      .post(
        `/me/broadcast_messages?access_token=${options.access_token ||
          this._accessToken}`,
        {
          message_creative_id: messageCreativeId,
          ...options,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Send Sponsored Message
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/sponsored-messages#message
   */
  sendSponsoredMessage = (adAccountId: string, message: Object) =>
    this._axios
      .post(
        `/act_${adAccountId}/sponsored_message_ads?access_token=${this
          ._accessToken}`,
        message
      )
      .then(res => res.data, handleError);

  /**
   * Label API
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts
   */

  /**
   * Create Label
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#create_label
   */
  createLabel = (
    name: string,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/me/custom_labels?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          name,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Associating a Label to a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#associate_label
   */
  associateLabel = (
    userId: UserID,
    labelId: number,
    { access_token: customAccessToken }: { access_token: ?string } = {}
  ) =>
    this._axios
      .post(
        `/${labelId}/label?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          user: userId,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Removing a Label From a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#associate_label
   */
  dissociateLabel = (
    userId: UserID,
    labelId: number,
    { access_token: customAccessToken }: { access_token: ?string } = {}
  ) =>
    this._axios
      .delete(
        `/${labelId}/label?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          data: { user: userId },
        }
      )
      .then(res => res.data, handleError);

  /**
   * Retrieving Labels Associated with a PSID
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_all_labels
   */
  getAssociatedLabels = (
    userId: UserID,
    { access_token: customAccessToken }: { access_token: ?string } = {}
  ) =>
    this._axios
      .get(
        `/${userId}/custom_labels?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);

  /**
   * Retrieving Label Details
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_label_details
   */
  getLabelDetails = (labelId: number, options?: Object = {}) => {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/${labelId}?fields=${fields}&access_token=${options.access_token ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  };

  /**
   * Retrieving a List of All Labels
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#get_all_labels
   */
  getLabelList = (options?: Object = {}) => {
    const fields = options.fields ? options.fields.join(',') : 'name';
    return this._axios
      .get(
        `/me/custom_labels?fields=${fields}&access_token=${options.access_token ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  };

  /**
   * Deleting a Label
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/target-broadcasts#delete_label
   */
  deleteLabel = (
    labelId: number,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .delete(
        `/${labelId}?access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);

  /**
   * Starting a Reach Estimation
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach#start
   */
  startReachEstimation = (
    customLabelId: number,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/broadcast_reach_estimations?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          custom_label_id: customLabelId,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Retrieving a Reach Estimate
   *
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach#get
   */
  getReachEstimate = (
    reachEstimationId: number,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/${reachEstimationId}?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);

  /**
   * Broadcast Metrics
   *
   * Once a broadcast has been delivered, you can find out the total number of people it reached.
   * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/#metrics
   */
  getBroadcastMessagesSent = (
    broadcastId: number,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/${broadcastId}/insights/messages_sent?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);

  /**
   * Upload API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api
   */
  uploadAttachment = (
    type: 'audio' | 'image' | 'video' | 'file',
    attachment: string | FileData,
    options?: UploadOption = {}
  ) => {
    const args = [];

    const isReusable = options.is_reusable || false;

    if (typeof attachment === 'string') {
      args.push({
        message: {
          attachment: {
            type,
            payload: {
              url: attachment,
              is_reusable: isReusable,
            },
          },
        },
      });
    } else {
      const form = new FormData();

      form.append(
        'message',
        JSON.stringify({
          attachment: {
            type,
            payload: {
              is_reusable: isReusable,
            },
          },
        })
      );

      form.append('filedata', attachment, omit(options, ['is_reusable']));

      args.push(form, {
        headers: form.getHeaders(),
      });
    }

    return this._axios
      .post(
        `/me/message_attachments?access_token=${options.access_token ||
          this._accessToken}`,
        ...args
      )
      .then(res => res.data, handleError);
  };

  uploadAudio = (attachment: string | FileData, options?: UploadOption) =>
    this.uploadAttachment('audio', attachment, options);
  uploadImage = (attachment: string | FileData, options?: UploadOption) =>
    this.uploadAttachment('image', attachment, options);
  uploadVideo = (attachment: string | FileData, options?: UploadOption) =>
    this.uploadAttachment('video', attachment, options);
  uploadFile = (attachment: string | FileData, options?: UploadOption) =>
    this.uploadAttachment('file', attachment, options);

  /**
   * Messenger Code API
   *
   * https://developers.facebook.com/docs/messenger-platform/discovery/messenger-codes
   */
  generateMessengerCode = (options: Object = {}) =>
    this._axios
      .post(
        `/me/messenger_codes?access_token=${options.access_token ||
          this._accessToken}`,
        {
          type: 'standard',
          ...options,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Handover Protocol API
   *
   * https://developers.facebook.com/docs/messenger-platform/handover-protocol
   */

  /**
   * Pass Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/pass-thread-control
   */
  passThreadControl = (
    recipientId: string,
    targetAppId: number,
    metadata?: string,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(
        `/me/pass_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          target_app_id: targetAppId,
          metadata,
        }
      )
      .then(res => res.data, handleError);

  passThreadControlToPageInbox = (
    recipientId: string,
    metadata?: string,
    options?: Object = {}
  ) => this.passThreadControl(recipientId, 263902037430900, metadata, options);

  /**
   * Take Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/take-thread-control
   */
  takeThreadControl = (
    recipientId: string,
    metadata?: string,
    { access_token: customAccessToken }: { access_token: ?string } = {}
  ) =>
    this._axios
      .post(
        `/me/take_thread_control?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          recipient: { id: recipientId },
          metadata,
        }
      )
      .then(res => res.data, handleError);

  /**
   * Secondary Receivers List
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/handover-protocol/secondary-receivers
   */
  getSecondaryReceivers = (
    { access_token: customAccessToken }: { access_token: ?string } = {}
  ) =>
    this._axios
      .get(
        `/me/secondary_receivers?fields=id,name&access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data.data, handleError);

  /**
   * Page Messaging Insights API
   *
   * https://developers.facebook.com/docs/messenger-platform/reference/messaging-insights-api
   */
  getInsights = (
    metrics: Array<InsightMetric>,
    options?: InsightOptions = {}
  ) =>
    this._axios
      .get(
        `/me/insights/?${querystring.stringify({
          metric: metrics.join(','),
          access_token: options.access_token || this._accessToken,
          ...options,
        })}`
      )
      .then(res => res.data.data, handleError);

  getDailyUniqueActiveThreadCounts = (options?: Object = {}) =>
    this.getInsights(['page_messages_active_threads_unique'], options);

  getBlockedConversations = (options?: Object = {}) =>
    this.getInsights(['page_messages_blocked_conversations_unique'], options);

  getReportedConversations = (options?: Object = {}) =>
    this.getInsights(['page_messages_reported_conversations_unique'], options);

  getReportedConversationsByReportType = (options?: Object = {}) =>
    this.getInsights(['page_messages_blocked_conversations_unique'], options);

  getDailyUniqueConversationCounts = () => {
    warning(
      false,
      'page_messages_feedback_by_action_unique is deprecated as of November 7, 2017.\nThis metric will be removed in Graph API v2.12.'
    );
    return this.getInsights(['page_messages_feedback_by_action_unique']);
  };

  /**
   * Built-in NLP API
   *
   * https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   */
  setNLPConfigs = (
    config: MessengerNLPConfig = {},
    { access_token: customAccessToken }: { access_token?: string } = {}
  ) =>
    this._axios
      .post(`/me/nlp_configs?${querystring.stringify(config)}`, {
        access_token: customAccessToken || this._accessToken,
      })
      .then(res => res.data, handleError);

  enableNLP = (options?: Object = {}) =>
    this.setNLPConfigs({ nlp_enabled: true }, options);
  disableNLP = (options?: Object = {}) =>
    this.setNLPConfigs({ nlp_enabled: false }, options);

  /**
   * Logging Custom Events
   *
   * https://developers.facebook.com/docs/app-events/bots-for-messenger#logging-custom-events
   */
  logCustomEvents = ({
    appId,
    pageId,
    userId,
    events,
    access_token: customAccessToken,
  }: {
    appId: number,
    pageId: number,
    userId: UserID,
    events: Array<Object>,
    access_token?: string,
  }) =>
    this._axios
      .post(
        `/${appId}/activities?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify(events),
          advertiser_tracking_enabled: 0,
          application_tracking_enabled: 0,
          extinfo: JSON.stringify(['mb1']),
          page_id: pageId,
          page_scoped_user_id: userId,
        }
      )
      .then(res => res.data, handleError);
}
