import axios from 'axios';
import invariant from 'invariant';

import type {
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
  MessageTag,
  MessageTagResponse,
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
  _http: Axios;

  constructor(accessToken: string, version?: string = 'v2.10') {
    this._accessToken = accessToken;
    this._http = axios.create({
      baseURL: `https://graph.facebook.com/${version}/`,
      headers: { 'Content-Type': 'application/json' },
    });
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
  getDomainWhitelist = (): Promise<MessengerProfileResponse> =>
    this.getMessengerProfile(['whitelisted_domains']).then(
      res => res[0].whitelisted_domains
    );

  setDomainWhitelist = (
    domains: Array<string>
  ): Promise<MutationSuccessResponse> =>
    this.setMessengerProfile({
      whitelisted_domains: domains,
    });

  deleteDomainWhitelist = (): Promise<MutationSuccessResponse> =>
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

  send = (
    recipientId: string,
    message: Message,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendRawBody({
      recipient: {
        id: recipientId,
      },
      message,
      ...options,
    });

  /**
   * Content Types
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/contenttypes
   */
  sendAttachment = (
    recipientId: string,
    attachment: Attachment,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.send(recipientId, { attachment }, options);

  sendText = (
    recipientId: string,
    text: string,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.send(recipientId, { text }, options);

  sendIssueResolutionText = (
    recipientId: string,
    text: string
  ): Promise<SendMessageSucessResponse> =>
    this.sendText(recipientId, text, { tag: 'ISSUE_RESOLUTION' });

  // TODO: support formdata fileupload?
  // FIXME: prettier bug?
  sendAudio = (
    recipientId: string,
    url: string
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(recipientId, {
      type: 'audio', // eslint-disable-line
      payload: {
        url,
      },
    });

  // TODO: support formdata fileupload?
  sendImage = (
    recipientId: string,
    url: string
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(recipientId, {
      type: 'image',
      payload: {
        url,
      },
    });

  // TODO: support formdata fileupload?
  sendVideo = (
    recipientId: string,
    url: string
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(recipientId, {
      type: 'video',
      payload: {
        url,
      },
    });

  // TODO: support formdata fileupload?
  sendFile = (
    recipientId: string,
    url: string
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(recipientId, {
      type: 'file',
      payload: {
        url,
      },
    });

  /**
   * Templates
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/templates
   */
  sendTemplate = (
    recipientId: string,
    payload: AttachmentPayload,
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendAttachment(
      recipientId,
      {
        type: 'template',
        payload,
      },
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template
  sendButtonTemplate = (
    recipientId: string,
    text: string,
    buttons: Array<TemplateButton>
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'button',
      text,
      buttons,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
  sendGenericTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal',
    options?: SendOption
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(
      recipientId,
      {
        template_type: 'generic',
        elements,
        image_aspect_ratio: ratio, // FIXME rename to image_aspect_ratio?
      },
      options
    );

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/tags/
  sendTaggedTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    tag: MessageTag,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendGenericTemplate(recipientId, elements, ratio, { tag });

  sendShippingUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'SHIPPING_UPDATE', ratio);

  sendReservationUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'RESERVATION_UPDATE', ratio);

  sendIssueResolutionTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'ISSUE_RESOLUTION', ratio);

  sendAppointmentUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'APPOINTMENT_UPDATE', ratio);

  sendGameEventTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'GAME_EVENT', ratio);

  sendTransportationUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(
      recipientId,
      elements,
      'TRANSPORTATION_UPDATE',
      ratio
    );

  sendFeatureFunctionalityUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(
      recipientId,
      elements,
      'FEATURE_FUNCTIONALITY_UPDATE',
      ratio
    );

  sendTicketUpdateTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    ratio: string = 'horizontal'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTaggedTemplate(recipientId, elements, 'TICKET_UPDATE', ratio);

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/list-template
  sendListTemplate = (
    recipientId: string,
    elements: Array<TemplateElement>,
    buttons: Array<TemplateButton>,
    topElementStyle: string = 'large'
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'list',
      elements,
      buttons,
      top_element_style: topElementStyle,
    });

  // https://developers.facebook.com/docs/messenger-platform/open-graph-template
  sendOpenGraphTemplate = (
    recipientId: string,
    elements: Array<OpenGraphElement>
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'open_graph',
      elements,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template
  sendReceiptTemplate = (
    recipientId: string,
    attrs: ReceiptAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'receipt',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-boardingpass-template
  sendAirlineBoardingPassTemplate = (
    recipientId: string,
    attrs: AirlineBoardingPassAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'airline_boardingpass',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-checkin-template
  sendAirlineCheckinTemplate = (
    recipientId: string,
    attrs: AirlineCheckinAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'airline_checkin',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template
  sendAirlineItineraryTemplate = (
    recipientId: string,
    attrs: AirlineItineraryAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'airline_itinerary',
      ...attrs,
    });

  // https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-update-template
  sendAirlineFlightUpdateTemplate = (
    recipientId: string,
    attrs: AirlineFlightUpdateAttributes
  ): Promise<SendMessageSucessResponse> =>
    this.sendTemplate(recipientId, {
      template_type: 'airline_update',
      ...attrs,
    });

  /**
   * Quick Replies
   *
   * https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
   */
  sendQuickReplies = (
    recipientId: string,
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

    return this.send(recipientId, {
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
    recipientId: string,
    action: SenderAction
  ): Promise<SendSenderActionResponse> =>
    this._http
      .post(`/me/messages?access_token=${this._accessToken}`, {
        recipient: {
          id: recipientId,
        },
        sender_action: action,
      })
      .then(res => res.data);

  turnTypingIndicatorsOn = (
    recipientId: string
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipientId, 'typing_on');

  turnTypingIndicatorsOff = (
    recipientId: string
  ): Promise<SendSenderActionResponse> =>
    this.sendSenderAction(recipientId, 'typing_off');

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
}
