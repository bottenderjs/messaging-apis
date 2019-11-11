import querystring from 'querystring';

import AxiosError from 'axios-error';
import axios, { AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import omit from 'lodash.omit';
import snakecaseKeys from 'snakecase-keys';
import urlJoin from 'url-join';
import { onRequest } from 'messaging-api-common';

import {
  Attachment,
  AvailableMethod,
  Block,
  Channel,
  OAuthAPIResponse,
  User,
} from './SlackTypes';

type CommonOptions = {
  token?: string;
  accessToken?: string;
};

type PostEphemeralOptions = CommonOptions & {
  asUser?: boolean;
  attachments?: string | Attachment[];
  linkNames?: boolean;
  parse?: 'none' | 'full';
};

type GetInfoOptions = CommonOptions & {
  includeLocale?: boolean;
};

type UserInfoOptions = CommonOptions & {
  includeLocale?: boolean;
};

type ConversationMembersOptions = CommonOptions & {
  cursor?: string;
  limit?: number;
};

type ConversationListOptions = CommonOptions & {
  cursor?: string;
  excludeArchived?: boolean;
  limit?: number;
  types?: string;
};

type UserListOptions = CommonOptions & {
  cursor?: string;
  includeLocale?: boolean;
  limit?: number;
};

type ClientConfig = {
  accessToken: string;
  origin?: string;
  onRequest?: Function;
};

interface PostMessageOptions extends CommonOptions {
  asUser?: boolean;
  attachments?: string | Attachment[];
  iconEmoji?: string;
  iconUrl?: string;
  linkNames?: boolean;
  parse?: 'none' | 'full';
  replyBroadcast?: boolean;
  threadTs?: string;
  unfurlLinks?: boolean;
  unfurlMedia?: boolean;
  username?: string;
}

export default class SlackOAuthClient {
  _token: string;

  _onRequest: Function;

  _axios: AxiosInstance;

  static connect(accessTokenOrConfig: string | ClientConfig): SlackOAuthClient {
    return new SlackOAuthClient(accessTokenOrConfig);
  }

  constructor(accessTokenOrConfig: string | ClientConfig) {
    let origin;

    if (typeof accessTokenOrConfig === 'string') {
      // Bot User OAuth Access Token
      this._token = accessTokenOrConfig;
      this._onRequest = onRequest;
    } else {
      const config = accessTokenOrConfig;

      this._token = config.accessToken;
      this._onRequest = config.onRequest || onRequest;
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

    this._axios.interceptors.request.use(config => {
      this._onRequest({
        method: config.method,
        url: urlJoin(config.baseURL || '', config.url || '/'),
        headers: {
          ...config.headers.common,
          ...(config.method ? config.headers[config.method] : {}),
          ...omit(config.headers, [
            'common',
            'get',
            'post',
            'put',
            'patch',
            'delete',
            'head',
          ]),
        },

        body: config.data,
      });

      return config;
    });
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get accessToken(): string {
    return this._token;
  }

  async callMethod(
    method: AvailableMethod,
    inputBody: Record<string, any> = {}
  ): Promise<OAuthAPIResponse> {
    try {
      const body = {
        ...omit(inputBody, ['token', 'accessToken']),
        token: inputBody.accessToken || inputBody.token || this._token,
      };

      const response = await this._axios.post(
        method,
        querystring.stringify(snakecaseKeys(body, { deep: true }) as any)
      );

      const data = (camelcaseKeys(response.data, {
        deep: true,
      }) as any) as OAuthAPIResponse;

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
    options?: GetInfoOptions
  ): Promise<Channel> {
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
    options?: GetInfoOptions
  ): Promise<Channel> {
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
    options?: ConversationMembersOptions
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
    options?: Omit<ConversationMembersOptions, 'cursor'>
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
    options?: ConversationListOptions
  ): Promise<{
    channels: Channel[];
    next?: string;
  }> {
    return this.callMethod('conversations.list', options).then(data => ({
      channels: data.channels,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllConversationList(
    options?: Omit<ConversationListOptions, 'cursor'>
  ): Promise<Channel[]> {
    let allChannels: Channel[] = [];
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
    inputMessage:
      | {
          text?: string;
          attachments?: Attachment[] | string;
          blocks?: Block[] | string;
        }
      | string,
    options: PostMessageOptions = {}
  ): Promise<OAuthAPIResponse> {
    const message =
      typeof inputMessage === 'string' ? { text: inputMessage } : inputMessage;

    if (message.attachments && typeof message.attachments !== 'string') {
      // eslint-disable-next-line no-param-reassign
      message.attachments = JSON.stringify(
        snakecaseKeys(message.attachments, { deep: true })
      );
    }

    if (message.blocks && typeof message.blocks !== 'string') {
      // eslint-disable-next-line no-param-reassign
      message.blocks = JSON.stringify(
        snakecaseKeys(message.blocks, { deep: true })
      );
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
    inputMessage:
      | {
          text?: string;
          attachments?: Attachment[] | string;
          blocks?: Block[] | string;
        }
      | string,
    options: PostEphemeralOptions = {}
  ): Promise<OAuthAPIResponse> {
    const message =
      typeof inputMessage === 'string' ? { text: inputMessage } : inputMessage;

    if (message.attachments && typeof message.attachments !== 'string') {
      // eslint-disable-next-line no-param-reassign
      message.attachments = JSON.stringify(
        snakecaseKeys(message.attachments, { deep: true })
      );
    }

    if (message.blocks && typeof message.blocks !== 'string') {
      // eslint-disable-next-line no-param-reassign
      message.blocks = JSON.stringify(
        snakecaseKeys(message.blocks, { deep: true })
      );
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
  getUserInfo(userId: string, options?: UserInfoOptions): Promise<User> {
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
    options?: UserListOptions
  ): Promise<{
    members: User[];
    next?: string;
  }> {
    return this.callMethod('users.list', options).then(data => ({
      members: data.members,
      next: data.responseMetadata && data.responseMetadata.nextCursor,
    }));
  }

  async getAllUserList(
    options?: Omit<UserListOptions, 'cursor'>
  ): Promise<User[]> {
    let allUsers: User[] = [];
    let continuationCursor;

    do {
      const {
        members: users,
        next,
      }: {
        members: User[];
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
