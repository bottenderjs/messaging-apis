import querystring from 'querystring';

import axios from 'axios';
import FormData from 'form-data';
import invariant from 'invariant';
import omit from 'lodash.omit';
import isPlainObject from 'is-plain-object';
import warning from 'warning';

import type {
  UserID,
  Recipient,
  AttachmentPayload,
  Attachment,
  TextOrAttachment,
  Message,
  SendOption,
  TemplateButton,
  MenuItem,
  GreetingConfig,
  TemplateElement,
  QuickReply,
  SenderAction,
  User,
  OpenGraphElement,
  ReceiptAttributes,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineFlightUpdateAttributes,
  PersistentMenu,
  MessengerProfile,
  MessengerProfileResponse,
  MutationSuccessResponse,
  SendMessageSucessResponse,
  SendSenderActionResponse,
  MessageTagResponse,
  FileData,
  BatchItem,
} from './MessengerTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

export default class MessengerClient {
  static connect = (
    accessToken: string,
    version?: string = 'v2.10'
  ): MessengerClient => new MessengerClient(accessToken, version);

  _accessToken: string;
  _version: string;
  _http: Axios;

  constructor(accessToken: string, version?: string = 'v2.10') {
    this._accessToken = accessToken;
    this._version = version;
    this._http = axios.create({
      baseURL: `https://graph.facebook.com/${version}/`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  get version(): string {
    return this._version;
  }

  getHTTPClient: () => Axios = () => this._http;

  /**
   * Get User Profile
   *
   * https://www.quora.com/How-connect-Facebook-user-id-to-sender-id-in-the-Facebook-messenger-platform
   * first_name, last_name, profile_pic, locale, timezone, gender
   */
  getUserProfile = (userId: string): Promise<User> =>
    this._http
      .get(`/${userId}?access_token=${this._accessToken}`)
      .then(res => res.data);

  /**
   * Messenger Profile
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile
   */
  getMessengerProfile = (
    fields: Array<string>
  ): Promise<MessengerProfileResponse> =>
    this._http
      .get(
        `/me/messenger_profile?fields=${fields.join(',')}&access_token=${this
          ._accessToken}`
      )
      .then(res => res.data.data);

  setMessengerProfile = (
    profile: MessengerProfile
  ): Promise<MutationSuccessResponse> =>
    this._http
      .post(`/me/messenger_profile?access_token=${this._accessToken}`, profile)
      .then(res => res.data);

  deleteMessengerProfile = (
    fields: Array<string>
  ): Promise<MutationSuccessResponse> =>
    this._http
      .delete(`/me/messenger_profile?access_token=${this._accessToken}`, {
        data: {
          fields,
        },
      })
      .then(res => res.data);

  /**
   * Get Started Button
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/get-started-button
   */
  getGetStartedButton = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['get_started']).then(res => res[0].get_started);

  setGetStartedButton = (payload: string): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      get_started: {
        payload,
      },
    });

  deleteGetStartedButton = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['get_started']);

  /**
   * Persistent Menu
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/persistent-menu
   */
  getPersistentMenu = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['persistent_menu']).then(
      res => res[0].persistent_menu
    );

  setPersistentMenu = (
    menuItems: Array<MenuItem> | PersistentMenu,
    { composerInputDisabled = false }: { composerInputDisabled: boolean } = {}
  ): Promise<MutationSuccessResponse> => {
    // menuItems is in type PersistentMenu
    if (menuItems.some(item => item.locale === 'default')) {
      return this.setMessengerProfile({
        persistent_menu: menuItems,
      });
    }

    // menuItems is in type Array<MenuItem>
    return this.setMessengerProfile({
      persistent_menu: [
        {
          locale: 'default',
          composer_input_disabled: composerInputDisabled,
          call_to_actions: menuItems,
        },
      ],
    });
  };

  deletePersistentMenu = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['persistent_menu']);

  /**
   * Greeting Text
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/greeting-text
   */
  getGreetingText = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['greeting']).then(res => res[0].greeting);

  setGreetingText = (
    greeting: string | Array<GreetingConfig>
  ): Promise<MutationSuccessResponse> => {
    if (typeof greeting === 'string') {
      return this.setMessengerProfile({
        greeting: [
          {
            locale: 'default',
            text: greeting,
          },
        ],
      });
    }

    return this.setMessengerProfile({
      greeting,
    });
  };

  deleteGreetingText = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['greeting']);

  /**
   * Domain Whitelist
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting
   */
  getDomainWhitelist = (): Promise<MessengerProfileResponse> => {
    warning(
      false,
      '`getDomainWhitelist` is deprecated. use `getWhitelistedDomains` instead.'
    );
    return this.getWhitelistedDomains();
  };

  setDomainWhitelist = (
    domains: Array<string>
  ): Promise<MutationSuccessResponse> => {
    warning(
      false,
      '`setDomainWhitelist` is deprecated. use `setWhitelistedDomains` instead.'
    );
    return this.setWhitelistedDomains(domains);
  };

  deleteDomainWhitelist = (): Promise<MutationSuccessResponse> => {
    warning(
      false,
      '`deleteDomainWhitelist` is deprecated. use `deleteWhitelistedDomains` instead.'
    );
    return this.deleteWhitelistedDomains();
  };

  /**
   * Whitelisted Domains
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/domain-whitelisting
   */
  getWhitelistedDomains = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['whitelisted_domains']).then(
      res => res[0].whitelisted_domains
    );

  setWhitelistedDomains = (
    domains: Array<string>
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      whitelisted_domains: domains,
    });

  deleteWhitelistedDomains = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['whitelisted_domains']);

  /**
   * Account Linking URL
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/account-linking-url
   */
  getAccountLinkingURL = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['account_linking_url']).then(res => res[0]);

  setAccountLinkingURL = (url: string): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      account_linking_url: url,
    });

  deleteAccountLinkingURL = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['account_linking_url']);

  /**
   * Payment Settings
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/payment-settings
   */
  getPaymentSettings = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['payment_settings']).then(res => res[0]);

  setPaymentPrivacyPolicyURL = (
    url: string
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      payment_settings: {
        privacy_url: url,
      },
    });

  setPaymentPublicKey = (key: string): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      payment_settings: {
        public_key: key,
      },
    });

  setPaymentTestUsers = (
    users: Array<string>
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      payment_settings: {
        test_users: users,
      },
    });

  deletePaymentSettings = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['payment_settings']);

  /**
   * Target Audience
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/target-audience
   */
  getTargetAudience = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['target_audience']).then(res => res[0]);

  setTargetAudience = (
    type: string,
    whitelist: ?Array<string> = [],
    blacklist: ?Array<string> = []
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      target_audience: {
        audience_type: type,
        countries: {
          whitelist,
          blacklist,
        },
      },
    });

  deleteTargetAudience = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['target_audience']);

  /**
   * Chat Extension Home URL
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-profile/home-url
   */
  getChatExtensionHomeURL = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['home_url']).then(res => res[0]);

  setChatExtensionHomeURL = (
    url: string,
    {
      webview_height_ratio,
      webview_share_button,
      in_test,
    }: {
      webview_height_ratio: string,
      webview_share_button?: string,
      in_test: boolean,
    }
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      home_url: {
        url,
        webview_height_ratio,
        in_test,
        webview_share_button,
      },
    });

  deleteChatExtensionHomeURL = (): Promise<MutationSuccessResponse> =>
    this.deleteMessengerProfile(['home_url']);

  /**
   * Message tags
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/
   */
  getMessageTags = (): Promise<MessageTagResponse> =>
    this._http
      .get(`/page_message_tags?access_token=${this._accessToken}`)
      .then(res => res.data.data);

  /**
   * Send API
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference
   */
  // TODO: body flowtype
  sendRawBody = (body: Object): Promise<SendMessageSucessResponse> =>
    this._http
      .post(`/me/messages?access_token=${this._accessToken}`, body)
      .then(res => res.data);

  sendMessage = (
    idOrRecipient: UserID | Recipient,
    message: Message,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> => {
    const recipient =
      typeof idOrRecipient === 'string'
        ? {
            id: idOrRecipient,
          }
        : idOrRecipient;
    return this.sendRawBody({
      recipient,
      message,
      ...options,
    });
  };

  sendMessageFormData = (
    recipient: UserID | Recipient,
    message: Message,
    filedata: FileData
  ) => {
    const form = new FormData();
    const recipientObject =
      typeof recipient === 'string'
        ? {
            id: recipient,
          }
        : recipient;
    form.append('recipient', JSON.stringify(recipientObject));
    form.append('message', JSON.stringify(message));
    form.append('filedata', filedata);
    return this._http
      .post(`/me/messages?access_token=${this._accessToken}`, form, {
        headers: form.getHeaders(),
      })
      .then(res => res.data);
  };

  /**
   * Content Types
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes
   */
  sendAttachment = (
    recipient: UserID | Recipient,
    attachment: Attachment,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(recipient, { attachment }, options);

  sendAttachmentFormData = (
    recipient: UserID | Recipient,
    attachment: Attachment,
    filedata: FileData
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessageFormData(recipient, { attachment }, filedata);

  sendText = (
    recipient: UserID | Recipient,
    text: string,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendMessage(recipient, { text }, options);

  sendAudio = (
    recipient: UserID | Recipient,
    audio: string | FileData | AttachmentPayload
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'audio',
      payload: {},
    };

    if (typeof audio === 'string') {
      attachment.payload.url = audio;
      return this.sendAttachment(recipient, attachment);
    } else if (audio && isPlainObject(audio)) {
      attachment.payload = audio;
      return this.sendAttachment(recipient, attachment);
    }

    return this.sendAttachmentFormData(recipient, attachment, audio);
  };

  sendImage = (
    recipient: UserID | Recipient,
    image: string | FileData | AttachmentPayload
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'image',
      payload: {},
    };

    if (typeof image === 'string') {
      attachment.payload.url = image;
      return this.sendAttachment(recipient, attachment);
    } else if (image && isPlainObject(image)) {
      attachment.payload = image;
      return this.sendAttachment(recipient, attachment);
    }

    return this.sendAttachmentFormData(recipient, attachment, image);
  };

  sendVideo = (
    recipient: UserID | Recipient,
    video: string | FileData | AttachmentPayload
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'video',
      payload: {},
    };

    if (typeof video === 'string') {
      attachment.payload.url = video;
      return this.sendAttachment(recipient, attachment);
    } else if (video && isPlainObject(video)) {
      attachment.payload = video;
      return this.sendAttachment(recipient, attachment);
    }

    return this.sendAttachmentFormData(recipient, attachment, video);
  };

  sendFile = (
    recipient: UserID | Recipient,
    file: string | FileData | AttachmentPayload
  ): Promise<SendMessageSucessResponse> => {
    const attachment = {
      type: 'file',
      payload: {},
    };

    if (typeof file === 'string') {
      attachment.payload.url = file;
      return this.sendAttachment(recipient, attachment);
    } else if (file && isPlainObject(file)) {
      attachment.payload = file;
      return this.sendAttachment(recipient, attachment);
    }

    return this.sendAttachmentFormData(recipient, attachment, file);
  };

  /**
   * Templates
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates
   */
  sendTemplate = (
    recipient: UserID | Recipient,
    payload: AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(
      recipient,
      {
        type: 'template',
        payload,
      },
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template
  sendButtonTemplate = (
    recipient: UserID | Recipient,
    text: string,
    buttons: Array<TemplateButton>
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'button',
      text,
      buttons,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
  sendGenericTemplate = (
    recipient: UserID | Recipient,
    elements: Array<TemplateElement>,
    options?: {
      ...SendOption,
      image_aspect_ratio?: 'horizontal' | 'square',
    } = {}
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(
      recipient,
      {
        template_type: 'generic',
        elements,
        image_aspect_ratio: options.image_aspect_ratio || 'horizontal',
      },
      omit(options, ['image_aspect_ratio'])
    );

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template
  sendListTemplate = (
    recipient: UserID | Recipient,
    elements: Array<TemplateElement>,
    buttons: Array<TemplateButton>,
    options?: { top_element_style?: 'large' | 'compact' } = {}
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'list',
      elements,
      buttons,
      top_element_style: options.top_element_style || 'large',
    });

  // https://developers.facebook.com/docs/messenger-platform/open-graph-template
  sendOpenGraphTemplate = (
    recipient: UserID | Recipient,
    elements: Array<OpenGraphElement>
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'open_graph',
      elements,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template
  sendReceiptTemplate = (
    recipient: UserID | Recipient,
    attrs: ReceiptAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'receipt',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template
  sendAirlineBoardingPassTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineBoardingPassAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'airline_boardingpass',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template
  sendAirlineCheckinTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineCheckinAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'airline_checkin',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template
  sendAirlineItineraryTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineItineraryAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'airline_itinerary',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template
  sendAirlineFlightUpdateTemplate = (
    recipient: UserID | Recipient,
    attrs: AirlineFlightUpdateAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipient, {
      template_type: 'airline_update',
      ...attrs,
    });

  /**
   * Quick Replies
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
   */
  sendQuickReplies = (
    recipient: UserID | Recipient,
    textOrAttachment: TextOrAttachment,
    quickReplies: Array<QuickReply>
  ): Promise<SendMessageSucessResponse> => {
    // quick_replies is limited to 11
    invariant(
      Array.isArray(quickReplies) && quickReplies.length <= 11,
      'quickReplies is an array and limited to 11'
    );

    quickReplies.forEach(quickReply => {
      if (quickReply.content_type === 'text') {
        // title has a 20 character limit, after that it gets truncated
        invariant(
          (quickReply.title: any).trim().length <= 20,
          'title of quickReply has a 20 character limit, after that it gets truncated'
        );

        // payload has a 1000 character limit
        invariant(
          (quickReply.payload: any).length <= 1000,
          'payload of quickReply has a 1000 character limit'
        );
      }
    });

    return this.sendMessage(recipient, {
      ...textOrAttachment,
      quick_replies: quickReplies,
    });
  };

  /**
   * Typing
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
   */
  sendSenderAction = (
    idOrRecipient: UserID | Recipient,
    action: SenderAction
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
    });
  };

  markSeen = (
    recipient: UserID | Recipient
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'mark_seen');

  typingOn = (
    recipient: UserID | Recipient
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'typing_on');

  typingOff = (
    recipient: UserID | Recipient
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipient, 'typing_off');

  /**
   * Send Batch Request
   *
   * https://developers.facebook.com/docs/graph-api/making-multiple-requests
   */
  sendBatch = (
    batch: Array<BatchItem>
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
        access_token: this._accessToken,
        batch: bodyEncodedbatch,
      })
      .then(res => res.data);
  };

  /**
   * Upload API
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload
   */
  uploadAttachment = (type: string, url: string) =>
    this._http
      .post(`/me/message_attachments?access_token=${this._accessToken}`, {
        message: {
          attachment: {
            type,
            payload: {
              url,
              is_reusable: true,
            },
          },
        },
      })
      .then(res => res.data);

  uploadAudio = (url: string) => this.uploadAttachment('audio', url);
  uploadImage = (url: string) => this.uploadAttachment('image', url);
  uploadVideo = (url: string) => this.uploadAttachment('video', url);
  uploadFile = (url: string) => this.uploadAttachment('file', url);

  /**
   * Messenger Code API
   *
   * https://developers.facebook.com/docs/messenger-platform/messenger-code
   */
  generateMessengerCode = (options = {}) =>
    this._http
      .post(`/me/messenger_codes?access_token=${this._accessToken}`, {
        type: 'standard',
        ...options,
      })
      .then(res => res.data);

  /**
   * Handover Protocol API
   *
   * https://developers.facebook.com/docs/messenger-platform/handover-protocol
   */

  /**
   * Pass Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/pass-thread-control
   */
  passThreadControl = (
    recipientId: string,
    targetAppId: number,
    metadata?: string
  ) =>
    this._http
      .post(`/me/pass_thread_control?access_token=${this._accessToken}`, {
        recipient: { id: recipientId },
        target_app_id: targetAppId,
        metadata,
      })
      .then(res => res.data);

  /**
   * Take Thread Control
   *
   * https://developers.facebook.com/docs/messenger-platform/take-thread-control
   */
  takeThreadControl = (recipientId: string, metadata?: string) =>
    this._http
      .post(`/me/take_thread_control?access_token=${this._accessToken}`, {
        recipient: { id: recipientId },
        metadata,
      })
      .then(res => res.data);

  /**
   * Secondary Receivers List
   *
   * https://developers.facebook.com/docs/messenger-platform/secondary-receivers
   */
  getSecondaryReceivers = () =>
    this._http
      .get(
        `/me/secondary_receivers?fields=id,name&access_token=${this
          ._accessToken}`
      )
      .then(res => res.data.data);

  /**
   * Page Messaging Insights API
   *
   * https://developers.facebook.com/docs/messenger-platform/insights/page-messaging
   */
  getDailyUniqueActiveThreadCounts = () =>
    this._http
      .get(
        `/me/insights/page_messages_active_threads_unique&access_token=${this
          ._accessToken}`
      )
      .then(res => res.data.data);

  getDailyUniqueConversationCounts = () =>
    this._http
      .get(
        `/me/insights/page_messages_feedback_by_action_unique&access_token=${this
          ._accessToken}`
      )
      .then(res => res.data.data);

  /**
   * Built-in NLP API
   *
   * https://developers.facebook.com/docs/messenger-platform/built-in-nlp
   */
  setNLPConfigs = (config = {}) => {
    const query = {
      nlp_enabled: config.nlp_enabled ? 'true' : 'false',
    };
    if (config.custom_token) {
      query.custom_token = config.custom_token;
    }

    return this._http
      .post(`/me/nlp_configs?${querystring.stringify(query)}`, {
        access_token: this._accessToken,
      })
      .then(res => res.data);
  };

  enableNLP = () => this.setNLPConfigs({ nlp_enabled: true });
  disableNLP = () => this.setNLPConfigs({ nlp_enabled: false });
}
