import axios from 'axios';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

export default class SlackClient {
  static factory = (accessToken: string): SlackClient =>
    new SlackClient(accessToken);

  _accessToken: string;
  _http: Axios;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
    this._http = axios.create({
      baseURL: '',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getHTTPClient: () => Axios = () => this._http;
}
