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

import * as SlackTypes from './SlackTypes';

const DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY = ['attachments', 'blocks'];

function stringifyPayloadFields(
  payload: Record<string, any> = {},
  fields: Array<string> = DEFAULT_PAYLOAD_FIELDS_TO_STRINGIFY
): object {
  fields.forEach(field => {
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
      options: SlackTypes.PostMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    postEphemeral: (
      options: SlackTypes.PostEphemeralOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    update: (
      options: SlackTypes.UpdateMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    delete: (
      options: SlackTypes.DeleteMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    meMessage: (
      options: SlackTypes.MeMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    getPermalink: (
      options: SlackTypes.GetPermalinkOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    scheduleMessage: (
      options: SlackTypes.ScheduleMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    deleteScheduledMessage: (
      options: SlackTypes.DeleteScheduledMessageOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    unfurl: (
      options: SlackTypes.UnfurlOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    scheduledMessages: {
      list: (
        options: SlackTypes.GetScheduledMessagesOptions
      ) => Promise<SlackTypes.OAuthAPIResponse>;
    };
  };

  views: {
    open: (
      options: SlackTypes.OpenViewOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    publish: (
      options: SlackTypes.PublishViewOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    push: (
      options: SlackTypes.PushViewOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
    update: (
      options: SlackTypes.UpdateViewOptions
    ) => Promise<SlackTypes.OAuthAPIResponse>;
  };

  static connect(
    accessTokenOrConfig: string | SlackTypes.ClientConfig
  ): SlackOAuthClient {
    return new SlackOAuthClient(accessTokenOrConfig);
  }

  constructor(accessTokenOrConfig: string | SlackTypes.ClientConfig) {
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
    method: SlackTypes.AvailableMethod,
    inputBody: Record<string, any> = {}
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
      ) as any) as SlackTypes.OAuthAPIResponse;

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
    options?: SlackTypes.GetInfoOptions
  ): Promise<SlackTypes.Channel> {
    return this.callMethod('channels.info', {
      channel: channelId,
      ...options,
    }).then(data => data.channel);
  }

  /**
   * Retrieve information about a conversation.
   *
   * https://api.slack.com/methods/conversations.info
   */
  getConversationInfo(
    channelId: string,
    options?: SlackTypes.GetInfoOptions
  ): Promise<SlackTypes.Channel> {
    return this.callMethod('conversations.info', {
      channel: channelId,
      ...options,
    }).then(data => data.channel);
  }

  /**
   * Retrieve members of a conversation.
   *
   * https://api.slack.com/methods/conversations.members
   */
  getConversationMembers(
    channelId: string,
    options?: SlackTypes.ConversationMembersOptions
  ): Promise<{
    members: string[];
    next?: string;
  }> {
    return this.callMethod('conversations.members', {
      channel: channelId,
      ...options,
    }).then(data => ({
      members: data.members,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllConversationMembers(
    channelId: string,
    options?: Omit<SlackTypes.ConversationMembersOptions, 'cursor'>
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
    options?: SlackTypes.ConversationListOptions
  ): Promise<{
    channels: SlackTypes.Channel[];
    next?: string;
  }> {
    return this.callMethod('conversations.list', options).then(data => ({
      channels: data.channels,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllConversationList(
    options?: Omit<SlackTypes.ConversationListOptions, 'cursor'>
  ): Promise<SlackTypes.Channel[]> {
    let allChannels: SlackTypes.Channel[] = [];
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
    inputMessage: SlackTypes.Message | string,
    options: SlackTypes.PostMessageOptionalOptions = {}
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options: SlackTypes.PostMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.postMessage', stringifyPayloadFields(options));
  }

  /**
   * Sends an ephemeral message to a user in a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  postEphemeral(
    channel: string,
    user: string,
    inputMessage: SlackTypes.Message | string,
    options: SlackTypes.PostEphemeralOptionalOptions = {}
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
   * https://api.slack.com/methods/chat.postMessage
   */
  _postEphemeral(
    options: SlackTypes.PostEphemeralOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options: SlackTypes.UpdateMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.update', stringifyPayloadFields(options));
  }

  /**
   * Deletes a message.
   *
   * https://api.slack.com/methods/chat.delete
   */
  _deleteMessage(
    options: SlackTypes.DeleteMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.delete', options);
  }

  /**
   * Share a me message into a channel.
   *
   * https://api.slack.com/methods/chat.meMessage
   */
  _meMessage(
    options: SlackTypes.MeMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.meMessage', options);
  }

  /**
   * Retrieve a permalink URL for a specific extant message
   *
   * https://api.slack.com/methods/chat.getPermalink
   */
  _getPermalink(
    options: SlackTypes.GetPermalinkOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.getPermalink', options);
  }

  /**
   * Schedules a message to be sent to a channel.
   *
   * https://api.slack.com/methods/chat.scheduleMessage
   */
  _scheduleMessage(
    options: SlackTypes.ScheduleMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options: SlackTypes.DeleteScheduledMessageOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.deleteScheduledMessage', options);
  }

  /**
   * Returns a list of scheduled messages.
   *
   * https://api.slack.com/methods/chat.scheduledMessages.list
   */
  _getScheduledMessages(
    options: SlackTypes.GetScheduledMessagesOptions = {}
  ): Promise<SlackTypes.OAuthAPIResponse> {
    return this.callMethod('chat.scheduledMessages.list', options);
  }

  /**
   * Provide custom unfurl behavior for user-posted URLs
   *
   * https://api.slack.com/methods/chat.unfurl
   */
  _unfurl(
    options: SlackTypes.UnfurlOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
  _openView(
    options: SlackTypes.OpenViewOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options: SlackTypes.PublishViewOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options: SlackTypes.UpdateViewOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
  _pushView(
    options: SlackTypes.PushViewOptions
  ): Promise<SlackTypes.OAuthAPIResponse> {
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
    options?: SlackTypes.UserInfoOptions
  ): Promise<SlackTypes.User> {
    return this.callMethod('users.info', { user: userId, ...options }).then(
      data => data.user
    );
  }

  /**
   * Lists all users in a Slack team.
   *
   * https://api.slack.com/methods/users.list
   */
  getUserList(
    options?: SlackTypes.UserListOptions
  ): Promise<{
    members: SlackTypes.User[];
    next?: string;
  }> {
    return this.callMethod('users.list', options).then(data => ({
      members: data.members,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllUserList(
    options?: Omit<SlackTypes.UserListOptions, 'cursor'>
  ): Promise<SlackTypes.User[]> {
    let allUsers: SlackTypes.User[] = [];
    let continuationCursor;

    do {
      const {
        members: users,
        next,
      }: {
        members: SlackTypes.User[];
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
