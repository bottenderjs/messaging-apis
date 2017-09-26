/* @flow */

import querystring from 'querystring';

import axios from 'axios';

import type {
  SlackOAuthAPIResponse,
  AvailableMethod,
  User,
  Channel,
} from './SlackTypes';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type Token = string;

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
    method: AvailableMethod,
    body: Object = {}
  ): Promise<SlackOAuthAPIResponse> => {
    body.token = this._token; // eslint-disable-line no-param-reassign
    return this._http.post(method, querystring.stringify(body)).then(res => {
      if (!res.data.ok) {
        const error = (new Error(`Slack API error: ${res.data.error}`): Object);
        error.config = res.config;
        error.headers = res.headers;
        error.data = res.data;
        throw error;
      }
      return res.data;
    });
  };

  // https://api.slack.com/methods/chat.postMessage
  postMessage = (
    channel: string,
    text: string,
    options?: {} = {}
  ): Promise<SlackOAuthAPIResponse> =>
    this.callMethod('chat.postMessage', { channel, text, ...options });

  // https://api.slack.com/methods/users.list
  getUserList = (
    cursor?: string
  ): Promise<{ members: Array<User>, next: ?string }> =>
    this.callMethod('users.list', { cursor }).then(data => ({
      members: data.members,
      next: data.response_metadata && data.response_metadata.next_cursor,
    }));

  getAllUserList = async (): Promise<Array<User>> => {
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

  // https://api.slack.com/methods/users.info
  getUserInfo = (userId: string): Promise<User> =>
    this.callMethod('users.info', { user: userId }).then(data => data.user);

  // https://api.slack.com/methods/channels.list
  getChannelList = (): Promise<Array<Channel>> =>
    this.callMethod('channels.list').then(data => data.channels);

  // https://api.slack.com/methods/channels.info
  getChannelInfo = (channelId: string): Promise<Channel> =>
    this.callMethod('channels.info', { channel: channelId }).then(
      data => data.channel
    );
}
