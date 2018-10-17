/* @flow */

import AxiosError from 'axios-error';
import axios from 'axios';
import debug from 'debug';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

export default class BotFrameworkClient {
  _accessToken: string;

  _onRequest: Function;

  _axios: Axios;

  get axios(): Axios {
    return this._axios;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  createConversation(conversation: Conversation): Promise<ResourceResponse> {
    return this._axios.post('/conversations', conversation);
  }

  sendToConversation(
    conversationId: string,
    activity: Activity
  ): Promise<Identification> {
    return this._axios.post(
      `/conversations/${conversationId}/activities`,
      activity
    );
  }

  replyToActivity() {
    //
  }

  getConversationMembers(
    conversationId: string
  ): Promise<Array<ChannelAccount>> {
    return this._axios.get(`/conversations/${conversationId}/members`);
  }

  getActivityMembers({
    conversationId,
    activityId,
  }): Promise<Array<ChannelAccount>> {
    return this._axios.get(
      `/conversations/${conversationId}/activities/${activityId}/members`
    );
  }

  updateActivity({ conversationId, activityId }) {
    //
  }

  deleteActivity({ conversationId, activityId }) {
    //
  }

  uploadAttachmentToChannel(
    conversationId: string,
    attachment: AttachmentUpload
  ) {}
}
