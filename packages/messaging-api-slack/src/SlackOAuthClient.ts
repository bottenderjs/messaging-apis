import querystring from 'querystring';

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import omit from 'lodash/omit';
import warning from 'warning';
import {
  OnRequestFunction,
  camelcaseKeysDeep,
  createRequestInterceptor,
  snakecaseKeysDeep,
} from 'messaging-api-common';

import * as Types from './SlackTypes';

const DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY = ['attachments', 'blocks'];

function stringifyPayloadFields(
  payload: Record<string, any> = {},
  fields: Array<string> = DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY
): object {
  fields.forEach((field) => {
    if (payload[field] && typeof payload[field] !== 'string') {
      // eslint-disable-next-line no-param-reassign
      payload[field] = JSON.stringify(snakecaseKeysDeep(payload[field]));
    }
  });

  return payload;
}

export default class SlackOAuthClient {
  _token: string;

  _onRequest: OnRequestFunction | undefined;

  _axios: AxiosInstance;

  chat: {
    postMessage: (
      options: Types.PostMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    postEphemeral: (
      options: Types.PostEphemeralOptions
    ) => Promise<Types.OAuthAPIResponse>;
    update: (
      options: Types.UpdateMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    delete: (
      options: Types.DeleteMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    meMessage: (
      options: Types.MeMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    getPermalink: (
      options: Types.GetPermalinkOptions
    ) => Promise<Types.OAuthAPIResponse>;
    scheduleMessage: (
      options: Types.ScheduleMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    deleteScheduledMessage: (
      options: Types.DeleteScheduledMessageOptions
    ) => Promise<Types.OAuthAPIResponse>;
    unfurl: (options: Types.UnfurlOptions) => Promise<Types.OAuthAPIResponse>;
    scheduledMessages: {
      list: (
        options: Types.GetScheduledMessagesOptions
      ) => Promise<Types.OAuthAPIResponse>;
    };
  };

  views: {
    open: (options: Types.OpenViewOptions) => Promise<Types.OAuthAPIResponse>;
    publish: (
      options: Types.PublishViewOptions
    ) => Promise<Types.OAuthAPIResponse>;
    push: (options: Types.PushViewOptions) => Promise<Types.OAuthAPIResponse>;
    update: (
      options: Types.UpdateViewOptions
    ) => Promise<Types.OAuthAPIResponse>;
  };

  /**
   * @deprecated Use `new SlackOAuthClient(...)` instead.
   */
  static connect(
    accessTokenOrConfig: string | Types.ClientConfig
  ): SlackOAuthClient {
    warning(
      false,
      '`SlackOAuthClient.connect(...)` is deprecated. Use `new SlackOAuthClient(...)` instead.'
    );
    return new SlackOAuthClient(accessTokenOrConfig);
  }

  constructor(accessTokenOrConfig: string | Types.ClientConfig) {
    let origin;

    if (typeof accessTokenOrConfig === 'string') {
      // Bot User OAuth Access Token
      this._token = accessTokenOrConfig;
    } else {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._onRequest = config.onRequest;
      origin = config.origin;
    }

    // Web API
    // https://api.slack.com/web
    this._axios = axios.create({
      baseURL: `${origin || 'https://slack.com'}/api/`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this._axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this._onRequest })
    );

    this.chat = {
      postMessage: this._postMessage.bind(this),
      postEphemeral: this._postEphemeral.bind(this),
      update: this._updateMessage.bind(this),
      delete: this._deleteMessage.bind(this),
      meMessage: this._meMessage.bind(this),
      getPermalink: this._getPermalink.bind(this),
      scheduleMessage: this._scheduleMessage.bind(this),
      deleteScheduledMessage: this._deleteScheduledMessage.bind(this),
      unfurl: this._unfurl.bind(this),
      scheduledMessages: {
        list: this._getScheduledMessages.bind(this),
      },
    };

    this.views = {
      open: this._openView.bind(this),
      publish: this._publishView.bind(this),
      push: this._pushView.bind(this),
      update: this._updateView.bind(this),
    };
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get accessToken(): string {
    return this._token;
  }

  async callMethod(
    method: Types.AvailableMethod,
    inputBody: Record<string, any> = {}
  ): Promise<Types.OAuthAPIResponse> {
    try {
      const body = {
        ...omit(inputBody, ['token', 'accessToken']),
        token: inputBody.accessToken || inputBody.token || this._token,
      };

      const response = await this._axios.post(
        method,
        querystring.stringify(snakecaseKeysDeep(body) as any)
      );

      const data = (camelcaseKeysDeep(
        response.data
      ) as any) as Types.OAuthAPIResponse;

      if (!data.ok) {
        const { config, request } = response;

        throw new AxiosError(`Slack API - ${data.error}`, {
          config,
          request,
          response,
        });
      }

      return data;
    } catch (err) {
      throw new AxiosError(err.message, err);
    }
  }

  /**
   * Gets information about a channel.
   *
   * https://api.slack.com/methods/channels.info
   */
  getChannelInfo(
    channelId: string,
    options?: Types.GetInfoOptions
  ): Promise<Types.Channel> {
    return this.callMethod('channels.info', {
      channel: channelId,
      ...options,
    }).then((data) => data.channel);
  }

  /**
   * Retrieve information about a conversation.
   *
   * https://api.slack.com/methods/conversations.info
   */
  getConversationInfo(
    channelId: string,
    options?: Types.GetInfoOptions
  ): Promise<Types.Channel> {
    return this.callMethod('conversations.info', {
      channel: channelId,
      ...options,
    }).then((data) => data.channel);
  }

  /**
   * Retrieve members of a conversation.
   *
   * https://api.slack.com/methods/conversations.members
   */
  getConversationMembers(
    channelId: string,
    options?: Types.ConversationMembersOptions
  ): Promise<{
    members: string[];
    next?: string;
  }> {
    return this.callMethod('conversations.members', {
      channel: channelId,
      ...options,
    }).then((data) => ({
      members: data.members,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllConversationMembers(
    channelId: string,
    options?: Omit<Types.ConversationMembersOptions, 'cursor'>
  ): Promise<string[]> {
    let allMembers: string[] = [];
    let continuationCursor;

    do {
      const {
        members,
        next,
      }: {
        members: string[];
        next?: string;
        // eslint-disable-next-line no-await-in-loop
      } = await this.getConversationMembers(channelId, {
        cursor: continuationCursor,
        ...options,
      });

      allMembers = allMembers.concat(members);
      continuationCursor = next;
    } while (continuationCursor);

    return allMembers;
  }

  /**
   * Lists all channels in a Slack team.
   *
   * https://api.slack.com/methods/conversations.list
   */
  getConversationList(
    options?: Types.ConversationListOptions
  ): Promise<{
    channels: Types.Channel[];
    next?: string;
  }> {
    return this.callMethod('conversations.list', options).then((data) => ({
      channels: data.channels,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllConversationList(
    options?: Omit<Types.ConversationListOptions, 'cursor'>
  ): Promise<Types.Channel[]> {
    let allChannels: Types.Channel[] = [];
    let continuationCursor: string | undefined;

    do {
      const nextOptions = continuationCursor
        ? { cursor: continuationCursor, ...options }
        : options;
      const {
        channels,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getConversationList(nextOptions);
      allChannels = allChannels.concat(channels);
      continuationCursor = next;
    } while (continuationCursor);

    return allChannels;
  }

  /**
   * Sends a message to a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  postMessage(
    channel: string,
    inputMessage: Types.Message | string,
    options: Types.PostMessageOptionalOptions = {}
  ): Promise<Types.OAuthAPIResponse> {
    warning(
      false,
      '`postMessage` is deprecated. Use `chat.postMessage` instead.'
    );

    const message =
      typeof inputMessage === 'string' ? { text: inputMessage } : inputMessage;

    return this._postMessage({
      channel,
      ...message,
      ...options,
    });
  }

  /**
   * Sends a message to a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  _postMessage(
    options: Types.PostMessageOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.postMessage', stringifyPayloadFields(options));
  }

  /**
   * Sends an ephemeral message to a user in a channel.
   *
   * https://api.slack.com/methods/chat.postEphemeral
   */
  postEphemeral(
    channel: string,
    user: string,
    inputMessage: Types.Message | string,
    options: Types.PostEphemeralOptionalOptions = {}
  ): Promise<Types.OAuthAPIResponse> {
    warning(
      false,
      '`postEphemeral` is deprecated. Use `chat.postEphemeral` instead.'
    );

    const message =
      typeof inputMessage === 'string' ? { text: inputMessage } : inputMessage;

    return this._postEphemeral({
      channel,
      user,
      ...message,
      ...options,
    });
  }

  /**
   * Sends an ephemeral message to a user in a channel.
   *
   * https://api.slack.com/methods/chat.postEphemeral
   */
  _postEphemeral(
    options: Types.PostEphemeralOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'chat.postEphemeral',
      stringifyPayloadFields(options)
    );
  }

  /**
   * Updates a message.
   *
   * https://api.slack.com/methods/chat.update
   */
  _updateMessage(
    options: Types.UpdateMessageOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.update', stringifyPayloadFields(options));
  }

  /**
   * Deletes a message.
   *
   * https://api.slack.com/methods/chat.delete
   */
  _deleteMessage(
    options: Types.DeleteMessageOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.delete', options);
  }

  /**
   * Share a me message into a channel.
   *
   * https://api.slack.com/methods/chat.meMessage
   */
  _meMessage(options: Types.MeMessageOptions): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.meMessage', options);
  }

  /**
   * Retrieve a permalink URL for a specific extant message
   *
   * https://api.slack.com/methods/chat.getPermalink
   */
  _getPermalink(
    options: Types.GetPermalinkOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.getPermalink', options);
  }

  /**
   * Schedules a message to be sent to a channel.
   *
   * https://api.slack.com/methods/chat.scheduleMessage
   */
  _scheduleMessage(
    options: Types.ScheduleMessageOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'chat.scheduleMessage',
      stringifyPayloadFields(options)
    );
  }

  /**
   * Deletes a pending scheduled message from the queue.
   *
   * https://api.slack.com/methods/chat.deleteScheduledMessage
   */
  _deleteScheduledMessage(
    options: Types.DeleteScheduledMessageOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.deleteScheduledMessage', options);
  }

  /**
   * Returns a list of scheduled messages.
   *
   * https://api.slack.com/methods/chat.scheduledMessages.list
   */
  _getScheduledMessages(
    options: Types.GetScheduledMessagesOptions = {}
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod('chat.scheduledMessages.list', options);
  }

  /**
   * Provide custom unfurl behavior for user-posted URLs
   *
   * https://api.slack.com/methods/chat.unfurl
   */
  _unfurl(options: Types.UnfurlOptions): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'chat.unfurl',
      stringifyPayloadFields(options, ['view'])
    );
  }

  /**
   * Open a view for a user.
   *
   * https://api.slack.com/methods/views.open
   */
  _openView(options: Types.OpenViewOptions): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'views.open',
      stringifyPayloadFields(options, ['view'])
    );
  }

  /**
   * Publish a static view for a User.
   *
   * https://api.slack.com/methods/views.publish
   */
  _publishView(
    options: Types.PublishViewOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'views.publish',
      stringifyPayloadFields(options, ['view'])
    );
  }

  /**
   * Update an existing view.
   *
   * https://api.slack.com/methods/views.update
   */
  _updateView(
    options: Types.UpdateViewOptions
  ): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'views.update',
      stringifyPayloadFields(options, ['view'])
    );
  }

  /**
   * Push a view onto the stack of a root view.
   *
   * https://api.slack.com/methods/views.push
   */
  _pushView(options: Types.PushViewOptions): Promise<Types.OAuthAPIResponse> {
    return this.callMethod(
      'views.push',
      stringifyPayloadFields(options, ['view'])
    );
  }

  /**
   * Gets information about a user.
   *
   * https://api.slack.com/methods/users.info
   */
  getUserInfo(
    userId: string,
    options?: Types.UserInfoOptions
  ): Promise<Types.User> {
    return this.callMethod('users.info', { user: userId, ...options }).then(
      (data) => data.user
    );
  }

  /**
   * Lists all users in a Slack team.
   *
   * https://api.slack.com/methods/users.list
   */
  getUserList(
    options?: Types.UserListOptions
  ): Promise<{
    members: Types.User[];
    next?: string;
  }> {
    return this.callMethod('users.list', options).then((data) => ({
      members: data.members,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllUserList(
    options?: Omit<Types.UserListOptions, 'cursor'>
  ): Promise<Types.User[]> {
    let allUsers: Types.User[] = [];
    let continuationCursor;

    do {
      const {
        members: users,
        next,
      }: {
        members: Types.User[];
        next?: string;
        // eslint-disable-next-line no-await-in-loop
      } = await this.getUserList({
        cursor: continuationCursor,
        ...options,
      });

      allUsers = allUsers.concat(users);
      continuationCursor = next;
    } while (continuationCursor);

    return allUsers;
  }
}
