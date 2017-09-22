/* @flow */

import querystring from 'querystring';

import axios from 'axios';

import type {
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

type Token = string;

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

export default class SlackOAuthClient {
  static connect = (token: Token): SlackOAuthClient =>
    new SlackOAuthClient(token);

  _http: Axios;

  _token: Token;

  constructor(token: Token) {
    // Web API
    // https://api.slack.com/web
    this._http = axios.create({
      baseURL: 'https://slack.com/api/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // Bot User OAuth Access Token
    this._token = token;
  }

  getHTTPClient: () => Axios = () => this._http;

  callMethod = (
    method: SlackAvailableMethod,
    body: Object = {}
  ): Promise<SlackOAuthAPIResponse> => {
    body.token = this._token; // eslint-disable-line no-param-reassign
    return this._http.post(method, querystring.stringify(body)).then(res => {
      if (!res.data.ok) {
        throw new Error(res.data.error);
      }
      return res.data;
    });
  };

  /**
   * Gets information about a channel.
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
   * Lists all channels in a Slack team.
   *
   * https://api.slack.com/methods/channels.list
   * FIXME: [breaking] support cursor, exclude_archived, exclude_members, limit
   */
  getChannelList = (): Promise<Array<SlackChannel>> =>
    this.callMethod('channels.list').then(data => data.channels);

  /**
   * Sends a message to a channel.
   *
   * https://api.slack.com/methods/chat.postMessage
   */
  postMessage = (
    channel: string,
    text: string,
    options?: PostMessageOptions = {}
  ): Promise<SlackOAuthAPIResponse> =>
    this.callMethod('chat.postMessage', { channel, text, ...options });

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
