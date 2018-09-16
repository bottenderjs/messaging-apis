/* @flow */

import querystring from 'querystring';

import AxiosError from 'axios-error';
import axios from 'axios';
import omit from 'lodash.omit';

import type {
  SlackAttachment,
  SlackAvailableMethod,
  SlackChannel,
  SlackOAuthAPIResponse,
  SlackUser,
} from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type CommonOptions = {
  token?: string,
};

type PostMessageOptions = {
  as_user?: boolean,
  attachments?: string,
  icon_emoji?: string,
  icon_url?: string,
  link_names?: boolean,
  parse?: 'none' | 'full',
  reply_broadcast?: boolean,
  thread_ts?: string,
  unfurl_links?: boolean,
  unfurl_media?: boolean,
  username?: string,
  ...CommonOptions,
};

type PostEphemeralOptions = {
  as_user?: boolean,
  attachments?: string,
  link_names?: boolean,
  parse?: 'none' | 'full',
};

type GetInfoOptions = {
  include_locale?: boolean,
  ...CommonOptions,
};

type WithCursorOptions = {
  cursor?: string,
  ...CommonOptions,
};

type ConversationListOptions = {
  cursor?: string,
  exclude_archived?: boolean,
  limit?: number,
  types?: string,
  ...CommonOptions,
};

type ClientConfig = {
  accessToken: string,
  origin?: string,
};

export default class SlackOAuthClient {
  static connect(accessTokenOrConfig: string | ClientConfig): SlackOAuthClient {
    return new SlackOAuthClient(accessTokenOrConfig);
  }

  _axios: Axios;

  _token: string;

  constructor(accessTokenOrConfig: string | ClientConfig) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      origin = config.origin;
    } else {
      // Bot User OAuth Access Token
      this._token = accessTokenOrConfig;
    }

    // Web API
    // https://api.slack.com/web
    this._axios = axios.create({
      baseURL: `${origin || 'https://slack.com'}/api/`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._token;
  }

  async callMethod(
    method: SlackAvailableMethod,
    _body: Object = {}
  ): Promise<SlackOAuthAPIResponse> {
    try {
      const body = omit(_body, ['token', 'accessToken']);
      body.token = _body.accessToken || _body.token || this._token;

      const response = await this._axios.post(
        method,
        querystring.stringify(body)
      );
      const { data, config, request } = response;

      if (!data.ok) {
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
   * Gets information about a public channel.
   *
   * https://api.slack.com/methods/channels.info
   */
  getChannelInfo(
    channelId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackChannel> {
    return this.callMethod('channels.info', {
      channel: channelId,
      ...options,
    }).then(data => data.channel);
  }

  /**
   * Lists all public channels in a Slack team.
   *
   * https://api.slack.com/methods/channels.list
   * FIXME: [breaking] support cursor, exclude_archived, exclude_members, limit
   */
  getChannelList(options: CommonOptions = {}): Promise<Array<SlackChannel>> {
    return this.callMethod('channels.list', options).then(
      data => data.channels
    );
  }

  /**
   * Retrieve information about a conversation.
   *
   * https://api.slack.com/methods/conversations.info
   */
  getConversationInfo(
    channelId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackChannel> {
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
    options: WithCursorOptions = {}
  ): Promise<{
    members: Array<string>,
    next: ?string,
  }> {
    return this.callMethod('conversations.members', {
      channel: channelId,
      ...options,
    }).then(data => ({
      members: data.members,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));
  }

  async getAllConversationMembers(
    channelId: string,
    options: CommonOptions = {}
  ): Promise<Array<string>> {
    let allMembers = [];
    let continuationCursor;

    do {
      const {
        members,
        next,
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
    options: ConversationListOptions = {}
  ): Promise<{
    channels: Array<SlackChannel>,
    next: ?string,
  }> {
    return this.callMethod('conversations.list', options).then(data => ({
      channels: data.channels,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));
  }

  async getAllConversationList(
    options: ConversationListOptions = {}
  ): Promise<Array<SlackChannel>> {
    let allChannels = [];
    let continuationCursor;

    do {
      const _options = continuationCursor
        ? { cursor: continuationCursor, ...options }
        : options;
      const {
        channels,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getConversationList(_options);
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
    message:
      | { text?: string, attachments: Array<SlackAttachment> | string }
      | string,
    options?: PostMessageOptions = {}
  ): Promise<SlackOAuthAPIResponse> {
    if (options.attachments && typeof options.attachments !== 'string') {
      // A JSON-based array of structured attachments, presented as a URL-encoded string.
      // eslint-disable-next-line no-param-reassign
      options.attachments = JSON.stringify(options.attachments);
    } else if (
      typeof message === 'object' &&
      message.attachments &&
      typeof message.attachments !== 'string'
    ) {
      // eslint-disable-next-line no-param-reassign
      message.attachments = JSON.stringify(message.attachments);
    }

    if (typeof message === 'string') {
      return this.callMethod('chat.postMessage', {
        channel,
        text: message,
        ...options,
      });
    }
    return this.callMethod('chat.postMessage', {
      channel,
      ...message,
      ...options,
    });
  }

  /**
   * Sends an ephemeral message to a user in a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  postEphemeral(
    channel: string,
    user: string,
    message:
      | { text?: string, attachments: Array<SlackAttachment> | string }
      | string,
    options?: PostEphemeralOptions = {}
  ): Promise<SlackOAuthAPIResponse> {
    if (options.attachments && typeof options.attachments !== 'string') {
      // A JSON-based array of structured attachments, presented as a URL-encoded string.
      // eslint-disable-next-line no-param-reassign
      options.attachments = JSON.stringify(options.attachments);
    } else if (
      typeof message === 'object' &&
      message.attachments &&
      typeof message.attachments !== 'string'
    ) {
      // eslint-disable-next-line no-param-reassign
      message.attachments = JSON.stringify(message.attachments);
    }

    if (typeof message === 'string') {
      return this.callMethod('chat.postEphemeral', {
        channel,
        user,
        text: message,
        ...options,
      });
    }
    return this.callMethod('chat.postEphemeral', {
      channel,
      user,
      ...message,
      ...options,
    });
  }

  /**
   * Gets information about a user.
   *
   * https://api.slack.com/methods/users.info
   */
  getUserInfo(
    userId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackUser> {
    return this.callMethod('users.info', { user: userId, ...options }).then(
      data => data.user
    );
  }

  /**
   * Lists all users in a Slack team.
   *
   * https://api.slack.com/methods/users.list
   * FIXME: [breaking] support include_locale, limit, presence
   */
  getUserList(
    cursorOrOptions?: string | WithCursorOptions
  ): Promise<{ members: Array<SlackUser>, next: ?string }> {
    if (typeof cursorOrOptions === 'string') {
      // cursorOrOptions is cursor string
      return this.callMethod('users.list', { cursor: cursorOrOptions }).then(
        data => ({
          members: data.members,
          next: data.response_metadata && data.response_metadata.next_cursor,
        })
      );
    }

    // cursorOrOptions is options object
    return this.callMethod('users.list', cursorOrOptions).then(data => ({
      members: data.members,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));
  }

  async getAllUserList(options: CommonOptions = {}): Promise<Array<SlackUser>> {
    let allUsers = [];
    let continuationCursor;

    do {
      const {
        members: users,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getUserList({ cursor: continuationCursor, ...options });
      allUsers = allUsers.concat(users);
      continuationCursor = next;
    } while (continuationCursor);

    return allUsers;
  }
}
