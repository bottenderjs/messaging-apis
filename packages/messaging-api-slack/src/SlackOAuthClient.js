/* @flow */

import querystring from 'querystring';

import axios from 'axios';
import AxiosError from 'axios-error';

import type {
  SlackAttachment,
  SlackOAuthAPIResponse,
  SlackAvailableMethod,
  SlackUser,
  SlackChannel,
} from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
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
};

type GetInfoOptions = {
  include_locale?: boolean,
};

type WithCursorOptions = {
  cursor?: string,
};

type ConversationListOptions = {
  cursor?: string,
  exclude_archived?: boolean,
  limit?: number,
  types?: string,
};

type ClientConfig = {
  accessToken: string,
  origin?: string,
};

export default class SlackOAuthClient {
  static connect = (
    accessTokenOrConfig: string | ClientConfig
  ): SlackOAuthClient => new SlackOAuthClient(accessTokenOrConfig);

  _axios: Axios;

  _token: string;

  constructor(accessTokenOrConfig: string | ClientConfig) {
    let origin;
    if (accessTokenOrConfig && typeof accessTokenOrConfig === 'object') {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      ({ origin } = config);
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

  callMethod = async (
    method: SlackAvailableMethod,
    body: Object = {}
  ): Promise<SlackOAuthAPIResponse> => {
    body.token = this._token; // eslint-disable-line no-param-reassign
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
  };

  /**
   * Gets information about a public channel.
   *
   * https://api.slack.com/methods/channels.info
   */
  getChannelInfo = (
    channelId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackChannel> =>
    this.callMethod('channels.info', { channel: channelId, ...options }).then(
      data => data.channel
    );

  /**
   * Lists all public channels in a Slack team.
   *
   * https://api.slack.com/methods/channels.list
   * FIXME: [breaking] support cursor, exclude_archived, exclude_members, limit
   */
  getChannelList = (): Promise<Array<SlackChannel>> =>
    this.callMethod('channels.list').then(data => data.channels);

  /**
   * Retrieve information about a conversation.
   *
   * https://api.slack.com/methods/conversations.info
   */
  getConversationInfo = (
    channelId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackChannel> =>
    this.callMethod('conversations.info', {
      channel: channelId,
      ...options,
    }).then(data => data.channel);

  /**
   * Retrieve members of a conversation.
   *
   * https://api.slack.com/methods/conversations.members
   */
  getConversationMembers = (
    channelId: string,
    options: WithCursorOptions = {}
  ): Promise<{
    members: Array<string>,
    next: ?string,
  }> =>
    this.callMethod('conversations.members', {
      channel: channelId,
      ...options,
    }).then(data => ({
      members: data.members,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));

  getAllConversationMembers = async (
    channelId: string
  ): Promise<Array<string>> => {
    let allMembers = [];
    let continuationCursor;

    do {
      const {
        members,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getConversationMembers(channelId, {
        cursor: continuationCursor,
      });
      allMembers = allMembers.concat(members);
      continuationCursor = next;
    } while (continuationCursor);

    return allMembers;
  };

  /**
   * Lists all channels in a Slack team.
   *
   * https://api.slack.com/methods/conversations.list
   */
  getConversationList = (
    options: ConversationListOptions = {}
  ): Promise<{
    channels: Array<SlackChannel>,
    next: ?string,
  }> =>
    this.callMethod('conversations.list', options).then(data => ({
      channels: data.channels,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));

  getAllConversationList = async (
    options: ConversationListOptions = {}
  ): Promise<Array<SlackChannel>> => {
    let allChannels = [];
    let continuationCursor;

    do {
      const {
        channels,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getConversationList({
        ...options,
        cursor: continuationCursor,
      });
      allChannels = allChannels.concat(channels);
      continuationCursor = next;
    } while (continuationCursor);

    return allChannels;
  };

  /**
   * Sends a message to a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  postMessage = (
    channel: string,
    message:
      | { text?: string, attachments: Array<SlackAttachment> | string }
      | string,
    options?: PostMessageOptions = {}
  ): Promise<SlackOAuthAPIResponse> => {
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
  };

  /**
   * Gets information about a user.
   *
   * https://api.slack.com/methods/users.info
   */
  getUserInfo = (
    userId: string,
    options: GetInfoOptions = {}
  ): Promise<SlackUser> =>
    this.callMethod('users.info', { user: userId, ...options }).then(
      data => data.user
    );

  /**
   * Lists all users in a Slack team.
   *
   * https://api.slack.com/methods/users.list
   * FIXME: [breaking] support include_locale, limit, presence
   */
  getUserList = (
    cursor?: string
  ): Promise<{ members: Array<SlackUser>, next: ?string }> =>
    this.callMethod('users.list', { cursor }).then(data => ({
      members: data.members,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));

  getAllUserList = async (): Promise<Array<SlackUser>> => {
    let allUsers = [];
    let continuationCursor;

    do {
      const {
        members: users,
        next,
        // eslint-disable-next-line no-await-in-loop
      } = await this.getUserList(continuationCursor);
      allUsers = allUsers.concat(users);
      continuationCursor = next;
    } while (continuationCursor);

    return allUsers;
  };
}
