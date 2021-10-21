import { Readable } from 'stream';

import axios, { AxiosError, AxiosInstance } from 'axios';
import imageType from 'image-type';
import invariant from 'ts-invariant';
import {
  OnRequestFunction,
  createRequestInterceptor,
} from 'messaging-api-common';
import { PrintableAxiosError } from 'axios-error';

import * as LineTypes from './LineTypes';

function handleError(
  err: AxiosError<{
    message: string;
    details: {
      property: string;
      message: string;
    }[];
  }>
): never {
  if (err.response && err.response.data) {
    const { message, details } = err.response.data;
    let msg = `LINE API - ${message}`;
    if (details && details.length > 0) {
      details.forEach((detail) => {
        msg += `\n- ${detail.property}: ${detail.message}`;
      });
    }
    throw new PrintableAxiosError(msg, err);
  }
  throw new PrintableAxiosError(err.message, err);
}

function toArray<T>(arrOrItem: T | T[]): T[] {
  return Array.isArray(arrOrItem) ? arrOrItem : [arrOrItem];
}

/**
 * LineClient is a client for LINE API calls.
 */
export default class LineClient {
  /**
   * The underlying axios instance.
   */
  public readonly axios: AxiosInstance;

  /**
   * The underlying axios instance for api-data.line.me APIs.
   */
  public readonly dataAxios: AxiosInstance;

  /**
   * The access token used by the client
   */
  private accessToken: string;

  /**
   * The callback to be called when receiving requests.
   */
  private onRequest?: OnRequestFunction;

  /**
   * Constructor of LineClient
   *
   * Usage:
   * ```js
   * new LineClient({
   *   accessToken: ACCESS_TOKEN,
   * })
   * ```
   *
   * @param config - [[ClientConfig]]
   */
  constructor(config: LineTypes.ClientConfig) {
    this.accessToken = config.accessToken;
    this.onRequest = config.onRequest;
    const { origin, dataOrigin } = config;

    this.axios = axios.create({
      baseURL: `${origin ?? 'https://api.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );

    this.dataAxios = axios.create({
      baseURL: `${dataOrigin ?? 'https://api-data.line.me'}/`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.dataAxios.interceptors.request.use(
      createRequestInterceptor({ onRequest: this.onRequest })
    );
  }

  /**
   * Gets a bot's basic information.
   *
   * @see https://developers.line.biz/en/reference/messaging-api/#get-bot-info
   * @returns Returns status code 200 and a JSON object with the bot information.
   */
  getBotInfo(): Promise<LineTypes.BotInfoResponse> {
    return this.axios
      .get<LineTypes.BotInfoResponse>('/v2/bot/info')
      .then((res) => res.data, handleError);
  }

  /**
   * Gets information on a webhook endpoint.
   *
   * @returns Returns status code 200 and a JSON object with the webhook information.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information
   */
  getWebhookEndpointInfo(): Promise<LineTypes.WebhookEndpointInfoResponse> {
    return this.axios
      .get<LineTypes.WebhookEndpointInfoResponse>(
        '/v2/bot/channel/webhook/endpoint'
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sets the webhook endpoint URL. It may take up to 1 minute for changes to take place due to caching.
   *
   * @param endpoint - Webhook URL.
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information
   */
  setWebhookEndpointUrl(
    endpoint: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .put<LineTypes.MutationSuccessResponse>(
        '/v2/bot/channel/webhook/endpoint',
        { endpoint }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Checks if the configured webhook endpoint can receive a test webhook event.
   *
   * @returns Returns status code 200 and a JSON object with the webhook information.
   * @see https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint
   */
  testWebhookEndpoint(): Promise<LineTypes.TestWebhookEndpointResponse> {
    return this.axios
      .post<LineTypes.TestWebhookEndpointResponse>(
        '/v2/bot/channel/webhook/test'
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sends a reply message in response to an event from a user, group, or room.
   *
   * @param body - Reply request body.
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-reply-message
   * @example
   * ```js
   * await client.reply({
   *   replyToken: '<REPLY_TOKEN>',
   *   messages: [Line.text('Hello'), Line.text('World')],
   *   notificationDisabled: true,
   * });
   * ```
   */
  reply(body: LineTypes.ReplyBody): Promise<LineTypes.MutationSuccessResponse>;

  /**
   * Sends a reply message in response to an event from a user, group, or room.
   *
   * @param replyToken - Reply token received via webhook.
   * @param messages - Messages to send (Max: 5).
   * @param notificationDisabled - Push notification is disabled or not.
   * @returns Returns status code `200` and an empty JSON object.
   * @example
   * ```js
   * await client.reply('<REPLY_TOKEN>', Line.text('Hello, world'));
   * ```
   */
  reply(
    replyToken: string,
    messages: LineTypes.Message | LineTypes.Message[],
    notificationDisabled?: boolean
  ): Promise<LineTypes.MutationSuccessResponse>;

  reply(
    bodyOrReplyToken: string | LineTypes.ReplyBody,
    messages?: LineTypes.Message | LineTypes.Message[],
    notificationDisabled = false
  ): Promise<LineTypes.MutationSuccessResponse> {
    const body =
      typeof bodyOrReplyToken === 'string'
        ? {
            replyToken: bodyOrReplyToken,
            messages: toArray(messages),
            notificationDisabled,
          }
        : {
            ...bodyOrReplyToken,
            messages: toArray(bodyOrReplyToken.messages),
          };
    return this.axios
      .post<LineTypes.MutationSuccessResponse>('/v2/bot/message/reply', body)
      .then((res) => res.data, handleError);
  }

  /**
   * Sends a push message to a user, group, or room at any time.
   *
   * @param body - Push request body.
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-push-message
   * @example
   * ```js
   * await client.push({
   *   to: '<USER_ID>',
   *   messages: [Line.text('Hello'), Line.text('World')],
   *   notificationDisabled: true,
   * });
   * ```
   */
  push(body: LineTypes.PushBody): Promise<LineTypes.MutationSuccessResponse>;

  /**
   * Sends a push message to a user, group, or room at any time.
   *
   * @param to - ID of the target recipient. Use a userId, groupId, or roomId value returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#common-properties). Do not use the LINE ID found on LINE.
   * @param messages - Messages to send (Max: 5).
   * @param notificationDisabled - Push notification is disabled or not.
   * @returns Returns status code `200` and an empty JSON object.
   * @example
   * ```js
   * await client.push('<USER_ID>', Line.text('Hello, world'));
   * ```
   */
  push(
    to: string,
    messages: LineTypes.Message | LineTypes.Message[],
    notificationDisabled?: boolean
  ): Promise<LineTypes.MutationSuccessResponse>;

  push(
    bodyOrTo: string | LineTypes.PushBody,
    messages?: LineTypes.Message | LineTypes.Message[],
    notificationDisabled = false
  ): Promise<LineTypes.MutationSuccessResponse> {
    const body =
      typeof bodyOrTo === 'string'
        ? {
            to: bodyOrTo,
            messages: toArray(messages),
            notificationDisabled,
          }
        : {
            ...bodyOrTo,
            messages: toArray(bodyOrTo.messages),
          };
    return this.axios
      .post<LineTypes.MutationSuccessResponse>('/v2/bot/message/push', body)
      .then((res) => res.data, handleError);
  }

  /**
   * Sends push messages to multiple users at any time. Messages cannot be sent to groups or rooms.
   *
   * @param body - Multicast request body.
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-multicast-message
   * @example
   * ```js
   * await client.multicast({
   *   to: ['<USER_ID_1>', '<USER_ID_2>'],
   *   messages: [Line.text('Hello'), Line.text('World')],
   *   notificationDisabled: true,
   * });
   * ```
   */
  multicast(
    body: LineTypes.MulticastBody
  ): Promise<LineTypes.MutationSuccessResponse>;

  /**
   * Sends push messages to multiple users at any time. Messages cannot be sent to groups or rooms.
   *
   * @param to - Array of user IDs. Use userId values which are returned in webhook event objects.
   * @param messages - Messages to send (Max: 5).
   * @param notificationDisabled - Push notification is disabled or not.
   * @returns Returns status code `200` and an empty JSON object.
   * @example
   * ```js
   * await client.multicast(
   *   ['<USER_ID_1>', '<USER_ID_2>'],
   *   Line.text('Hello, world')
   * );
   * ```
   */
  multicast(
    to: string[],
    messages: LineTypes.Message | LineTypes.Message[],
    notificationDisabled?: boolean
  ): Promise<LineTypes.MutationSuccessResponse>;

  multicast(
    bodyOrTo: string[] | LineTypes.MulticastBody,
    messages?: LineTypes.Message | LineTypes.Message[],
    notificationDisabled = false
  ): Promise<LineTypes.MutationSuccessResponse> {
    const body = Array.isArray(bodyOrTo)
      ? {
          to: bodyOrTo,
          messages: toArray(messages),
          notificationDisabled,
        }
      : {
          ...bodyOrTo,
          messages: toArray(bodyOrTo.messages),
        };
    return this.axios
      .post<LineTypes.MutationSuccessResponse>(
        '/v2/bot/message/multicast',
        body
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sends push messages to multiple users at any time.
   *
   * @param messages - Messages to send (Max: 5)
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-reply-message
   * @example
   * ```js
   * await client.broadcast({
   *   messages: [Line.text('Hello'), Line.text('World')],
   *   notificationDisabled: true,
   * });
   * ```
   */
  broadcast(
    body: LineTypes.BroadcastBody
  ): Promise<LineTypes.MutationSuccessResponse>;

  /**
   * Sends push messages to multiple users at any time.
   *
   * @param messages - Messages to send (Max: 5).
   * @param notificationDisabled - Push notification is disabled or not.
   * @returns Returns status code `200` and an empty JSON object.
   * @example
   * ```js
   * await client.multicast(Line.text('Hello, world'));
   * ```
   */
  broadcast(
    messages: LineTypes.Message | LineTypes.Message[],
    notificationDisabled?: boolean
  ): Promise<LineTypes.MutationSuccessResponse>;

  broadcast(
    bodyOrMessages:
      | LineTypes.BroadcastBody
      | LineTypes.Message
      | LineTypes.Message[],
    notificationDisabled = false
  ): Promise<LineTypes.MutationSuccessResponse> {
    const body =
      'messages' in bodyOrMessages
        ? {
            ...bodyOrMessages,
            messages: toArray(bodyOrMessages.messages),
          }
        : {
            messages: toArray(bodyOrMessages),
            notificationDisabled,
          };
    return this.axios
      .post<LineTypes.MutationSuccessResponse>(
        '/v2/bot/message/broadcast',
        body
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Sends a push message to multiple users. You can specify recipients using attributes (such as age, gender, OS, and region) or by retargeting (audiences). Messages cannot be sent to groups or rooms.
   *
   * @param body - Request body
   * @param body.messages - Messages to send - Max: 5
   * @param body.recipient - [[RecipientObject]]. You can specify recipients of the message using up to 10 audiences.
   * @param body.filter - demographic:
   * @param body.limit - max:
   * @returns Returns the `202` HTTP status code and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message
   */
  narrowcastRawBody(body: {
    messages: LineTypes.Message[];
    recipient?: LineTypes.RecipientObject;
    filter?: { demographic: LineTypes.DemographicFilterObject };
    limit?: {
      max: number;
    };
  }): Promise<{ requestId: string }> {
    return this.axios.post('/v2/bot/message/narrowcast', body).then((res) => {
      return {
        requestId: res.headers['x-line-request-id'],
        ...res.data,
      };
    }, handleError);
  }

  /**
   * Sends a push message to multiple users. You can specify recipients using attributes (such as age, gender, OS, and region) or by retargeting (audiences). Messages cannot be sent to groups or rooms.
   *
   * @param messages - Messages to send (Max: 5).
   * @param options - Narrowcast options
   * @returns Returns the `202` HTTP status code and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message
   */
  narrowcast(body: LineTypes.NarrowcastBody): Promise<{ requestId: string }>;

  /**
   * Sends a push message to multiple users. You can specify recipients using attributes (such as age, gender, OS, and region) or by retargeting (audiences). Messages cannot be sent to groups or rooms.
   *
   * @param messages - Messages to send (Max: 5).
   * @param options - Narrowcast options
   * @returns Returns the `202` HTTP status code and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message
   */
  narrowcast(
    messages: LineTypes.Message | LineTypes.Message[],
    recipient?: LineTypes.RecipientObject,
    filter?: { demographic: LineTypes.DemographicFilterObject },
    limit?: LineTypes.NarrowcastLimit,
    notificationDisabled?: boolean
  ): Promise<{ requestId: string }>;

  narrowcast(
    bodyOrMessages:
      | LineTypes.NarrowcastBody
      | LineTypes.Message
      | LineTypes.Message[],
    recipient?: LineTypes.RecipientObject,
    filter?: { demographic: LineTypes.DemographicFilterObject },
    limit?: LineTypes.NarrowcastLimit,
    notificationDisabled = false
  ): Promise<{ requestId: string }> {
    const body =
      'messages' in bodyOrMessages
        ? {
            ...bodyOrMessages,
            messages: toArray(bodyOrMessages.messages),
          }
        : {
            messages: toArray(bodyOrMessages),
            recipient,
            filter,
            limit,
            notificationDisabled,
          };
    return this.axios.post('/v2/bot/message/narrowcast', body).then(
      (res) => ({
        requestId: res.headers['x-line-request-id'],
        ...res.data,
      }),
      handleError
    );
  }

  /**
   * Gets images, videos, audio, and files sent by users.
   *
   * @param messageId - Message ID
   * @returns Returns status code `200` and the content in binary.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-content
   */
  getMessageContent(messageId: string): Promise<Buffer> {
    return this.dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'arraybuffer',
      })
      .then((res) => res.data, handleError);
  }

  getMessageContentStream(messageId: string): Promise<Readable> {
    return this.dataAxios
      .get(`/v2/bot/message/${messageId}/content`, {
        responseType: 'stream',
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets user profile information.
   *
   * @param userId - User ID that is returned in a [webhook event object](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID found on LINE.Message IDUser ID that is returned in a webhook event object. Do not use the LINE ID found on LINE.
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-profile
   */
  getUserProfile(userId: string): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/profile/${userId}`)
      .then((res) => res.data, handleError)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Gets the user profile of a member of a group that the LINE Official Account is in if the user ID of the group member is known. You can get user profiles of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile
   */
  getGroupMemberProfile(
    groupId: string,
    userId: string
  ): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/member/${userId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the user profile of a member of a room that the LINE Official Account is in if the user ID of the room member is known. You can get user profiles of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-room-member-profile
   */
  getRoomMemberProfile(
    roomId: string,
    userId: string
  ): Promise<LineTypes.User> {
    return this.axios
      .get(`/v2/bot/room/${roomId}/member/${userId}`)
      .then((res) => res.data, handleError);
  }

  /**
   *
   * Gets the group ID, group name, and group icon URL of a group where the LINE Official Account is a member.
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-group-summary
   */
  getGroupSummary(groupId: string): Promise<LineTypes.Group> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/summary`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the count of members in a group. You can get the member in group count even if the user hasn't added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a number representing group member count.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-members-group-count
   */
  getGroupMembersCount(groupId: string): Promise<number> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/members/count`)
      .then((res) => res.data.count, handleError);
  }

  /**
   * Gets the user IDs of the members of a group that the bot is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param start - Value of the continuation token found in the `next` property of the JSON object returned in the [response](https://developers.line.biz/en/reference/messaging-api/#get-group-member-user-ids-response). Include this parameter to get the next array of user IDs for the members of the group.
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile
   */
  getGroupMemberIds(
    groupId: string,
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this.axios
      .get(`/v2/bot/group/${groupId}/members/ids`, {
        params: start ? { start } : {},
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the user IDs of the members of a group that the bot is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile
   */
  async getAllGroupMemberIds(groupId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getGroupMemberIds(
        groupId,
        continuationToken
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Gets the count of members in a room. You can get the member in room count even if the user hasn't added the LINE Official Account as a friend or has blocked the LINE Official Account.
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a number representing room member count.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-members-room-count
   */
  getRoomMembersCount(roomId: string): Promise<number> {
    return this.axios
      .get(`/v2/bot/room/${roomId}/members/count`)
      .then((res) => res.data.count, handleError);
  }

  /**
   * Gets the user IDs of the members of a room that the LINE Official Account is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @param start - Value of the continuation token found in the `next` property of the JSON object returned in the [response](https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids-response). Include this parameter to get the next array of user IDs for the members of the group.
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids
   */
  getRoomMemberIds(
    roomId: string,
    start?: string
  ): Promise<{ memberIds: string[]; next?: string }> {
    return this.axios
      .get(`/v2/bot/room/${roomId}/members/ids`, {
        params: start ? { start } : {},
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the user IDs of the members of a room that the LINE Official Account is in. This includes the user IDs of users who have not added the LINE Official Account as a friend or have blocked the LINE Official Account.
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids
   */
  async getAllRoomMemberIds(roomId: string): Promise<string[]> {
    let allMemberIds: string[] = [];
    let continuationToken;

    do {
      const {
        memberIds,
        next,
      }: // eslint-disable-next-line no-await-in-loop
      { memberIds: string[]; next?: string } = await this.getRoomMemberIds(
        roomId,
        continuationToken
      );

      allMemberIds = allMemberIds.concat(memberIds);
      continuationToken = next;
    } while (continuationToken);

    return allMemberIds;
  }

  /**
   * Leaves a [group](https://developers.line.biz/en/docs/messaging-api/group-chats/#group).
   *
   * @param groupId - Group ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#leave-group
   */
  leaveGroup(groupId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/group/${groupId}/leave`)
      .then((res) => res.data, handleError);
  }

  /**
   * Leaves a [room](https://developers.line.biz/en/docs/messaging-api/group-chats/#room).
   *
   * @param roomId - Room ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects).
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#leave-room
   */
  leaveRoom(roomId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/room/${roomId}/leave`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets a list of the rich menu response object of all rich menus created by [Create a rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu).
   *
   * @returns Returns status code `200` and a list of [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).
   * @see https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list
   */
  getRichMenuList(): Promise<LineTypes.RichMenu[]> {
    return this.axios
      .get('/v2/bot/richmenu/list')
      .then((res) => res.data.richmenus, handleError);
  }

  /**
   * Gets a rich menu via a rich menu ID.
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and a [rich menu response objects](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object).
   * @see https://developers.line.biz/en/reference/messaging-api/#get-rich-menu
   */
  getRichMenu(richMenuId: string): Promise<LineTypes.RichMenu> {
    return this.axios
      .get(`/v2/bot/richmenu/${richMenuId}`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Creates a rich menu.
   *
   * @param richMenu - The rich menu represented as a rich menu object.
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   * @see https://developers.line.biz/en/reference/messaging-api/#create-rich-menu
   */
  createRichMenu(
    richMenu: LineTypes.RichMenu
  ): Promise<{ richMenuId: string }> {
    return this.axios
      .post('/v2/bot/richmenu', richMenu)
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes a rich menu.
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu
   */
  deleteRichMenu(
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .delete(`/v2/bot/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the ID of the rich menu linked to a user.
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-id-of-user
   */
  getLinkedRichMenu(userId: string): Promise<{ richMenuId: string }> {
    return this.axios
      .get(`/v2/bot/user/${userId}/richmenu`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Links a rich menu to a user. Only one rich menu can be linked to a user at one time. If a user already has a rich menu linked, calling this endpoint replaces the existing rich menu with the one specified in your request.
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user
   */
  linkRichMenu(
    userId: string,
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/user/${userId}/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Unlinks a rich menu from a user.
   *
   * @param userId - User ID. Found in the `source` object of [webhook event objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-user
   */
  unlinkRichMenu(userId: string): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .delete(`/v2/bot/user/${userId}/richmenu`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the ID of the default rich menu set with the Messaging API.
   *
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   * @see https://developers.line.biz/en/reference/messaging-api/#get-default-rich-menu-id
   */
  getDefaultRichMenu(): Promise<{ richMenuId: string }> {
    return this.axios
      .get(`/v2/bot/user/all/richmenu`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return null;
        }
        return handleError(err);
      });
  }

  /**
   * Sets the default rich menu. The default rich menu is displayed to all users who have added your LINE Official Account as a friend and are not linked to any per-user rich menu. If a default rich menu has already been set, calling this endpoint replaces the current default rich menu with the one specified in your request.
   *
   * @param richMenuId - ID of a rich menu
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu
   */
  setDefaultRichMenu(
    richMenuId: string
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .post(`/v2/bot/user/all/richmenu/${richMenuId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Cancels the default rich menu set with the Messaging API.
   *
   * @returns Returns status code `200` and a JSON object with the rich menu ID.
   * @see https://developers.line.biz/en/reference/messaging-api/#cancel-default-rich-menu
   */
  deleteDefaultRichMenu(): Promise<{ richMenuId: string }> {
    return this.axios
      .delete(`/v2/bot/user/all/richmenu`)
      .then((res) => res.data, handleError);
  }

  /**
   * Uploads and attaches an image to a rich menu.
   *
   * @param richMenuId - The ID of the rich menu to attach the image to
   * @param image - image
   * @returns Returns status code `200` and an empty JSON object.
   * @see https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image
   */
  uploadRichMenuImage(
    richMenuId: string,
    image: Buffer
  ): Promise<LineTypes.MutationSuccessResponse> {
    const type = imageType(image);
    invariant(
      type && (type.mime === 'image/jpeg' || type.mime === 'image/png'),
      'Image must be `image/jpeg` or `image/png`'
    );

    return this.dataAxios
      .post(`/v2/bot/richmenu/${richMenuId}/content`, image, {
        headers: {
          'Content-Type': (type as { mime: string }).mime,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Downloads an image associated with a rich menu.
   *
   * @param richMenuId - ID of the rich menu with the image to be downloaded
   * @returns Returns status code `200` and the binary data of the rich menu image. The image can be downloaded as shown in the example request.
   * @see https://developers.line.biz/en/reference/messaging-api/#download-rich-menu-image
   */
  downloadRichMenuImage(richMenuId: string): Promise<Buffer | undefined> {
    return this.dataAxios
      .get(`/v2/bot/richmenu/${richMenuId}/content`, {
        responseType: 'arraybuffer',
      })
      .then((res) => Buffer.from(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          return undefined;
        }
        return handleError(err);
      });
  }

  /**
   * Issues a link token used for the [account link](https://developers.line.biz/en/docs/messaging-api/linking-accounts/) feature.
   *
   * @param userId - User ID for the LINE account to be linked. Found in the `source` object of [account link event objects](https://developers.line.biz/en/reference/messaging-api/#account-link-event). Do not use the LINE ID used in LINE.
   * @returns Returns status code `200` and a link token. Link tokens are valid for 10 minutes and can only be used once.
   * @see https://developers.line.biz/en/reference/messaging-api/#issue-link-token
   */
  getLinkToken(userId: string): Promise<string> {
    return this.axios
      .post<{ linkToken: string }>(`/v2/bot/user/${userId}/linkToken`)
      .then((res) => res.data.linkToken, handleError);
  }

  /**
   * LINE Front-end Framework (LIFF)
   */

  /**
   * Gets information on all the LIFF apps registered in the channel.
   *
   * @returns Returns status code `200` and a JSON object with the following properties.
   * @see https://developers.line.biz/en/reference/liff-v1/#get-all-liff-apps
   */
  getLiffAppList(): Promise<LineTypes.LiffApp[]> {
    return this.axios
      .get('/liff/v1/apps')
      .then((res) => res.data.apps, handleError);
  }

  /**
   * Adds the LIFF app to a channel. You can add up to 30 LIFF apps on one channel.
   *
   * @param liffApp - LIFF app settings
   * @returns Returns status code `200` and a JSON object.
   * @see https://developers.line.biz/en/reference/liff-v1/#add-liff-app
   */
  createLiffApp(liffApp: LineTypes.LiffApp): Promise<{ liffId: string }> {
    return this.axios
      .post('/liff/v1/apps', liffApp)
      .then((res) => res.data, handleError);
  }

  /**
   * Partially updates LIFF app settings.
   *
   * @param liffId - ID of the LIFF app to be updated
   * @param liffApp - Partial LIFF app settings. Only the properties specified in the request body are updated.
   * @returns Status code `200` is returned.
   * @see https://developers.line.biz/en/reference/liff-v1/#update-liff-app
   */
  updateLiffApp(
    liffId: string,
    liffApp: LineTypes.PartialLiffApp
  ): Promise<void> {
    return this.axios
      .put(`/liff/v1/apps/${liffId}/view`, liffApp)
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes a LIFF app from a channel.
   *
   * @param liffId - ID of the LIFF app to be deleted
   * @returns Status code `200` is returned.
   * @see https://developers.line.biz/en/reference/liff-v1/#delete-liff-app
   */
  deleteLiffApp(liffId: string): Promise<void> {
    return this.axios
      .delete(`/liff/v1/apps/${liffId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Get number of messages sent
   *
   */

  /**
   * Gets the target limit for additional messages in the current month.
   *
   * @returns Returns status code `200` and a [[TargetLimitForAdditionalMessages]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-quota
   */
  getTargetLimitForAdditionalMessages(): Promise<LineTypes.TargetLimitForAdditionalMessages> {
    return this.axios
      .get<LineTypes.TargetLimitForAdditionalMessages>('/v2/bot/message/quota')
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the number of messages sent in the current month.
   *
   * @returns Returns status code `200` and a [[NumberOfMessagesSentThisMonth]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-consumption
   */
  getNumberOfMessagesSentThisMonth(): Promise<LineTypes.NumberOfMessagesSentThisMonth> {
    return this.axios
      .get<LineTypes.NumberOfMessagesSentThisMonth>(
        '/v2/bot/message/quota/consumption'
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the number of messages sent with the `/bot/message/reply` endpoint.
   *
   * The number of messages retrieved by this operation does not include the number of messages sent from LINE Official Account Manager.
   *
   * @param date - Date the messages were sent
   * @returns Returns status code `200` and a [[NumberOfMessagesSentResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages
   */
  getNumberOfSentReplyMessages(
    date: string
  ): Promise<LineTypes.NumberOfMessagesSentResponse> {
    return this.axios
      .get<LineTypes.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/reply',
        {
          params: {
            date,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Get Number of Sent Push Messages
   *
   * Gets the number of messages sent with the `/bot/message/push` endpoint.
   *
   * The number of messages retrieved by this operation does not include the number of messages sent from LINE Official Account Manager.
   *
   * Note: LINE\@ accounts under the free or basic plan cannot call this API endpoint.
   *
   * @param date - Date the messages were sent
   * @returns Returns status code `200` and a [[NumberOfMessagesSentResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages
   */
  getNumberOfSentPushMessages(
    date: string
  ): Promise<LineTypes.NumberOfMessagesSentResponse> {
    return this.axios
      .get<LineTypes.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/push',
        {
          params: {
            date,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the number of messages sent with the `/bot/message/multicast` endpoint.
   *
   * The number of messages retrieved by this operation does not include the number of messages sent from LINE Official Account Manager.
   *
   * @param date - Date the messages were sent
   * @returns Returns status code `200` and a [[NumberOfMessagesSentResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages
   */
  getNumberOfSentMulticastMessages(
    date: string
  ): Promise<LineTypes.NumberOfMessagesSentResponse> {
    return this.axios
      .get<LineTypes.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/multicast',
        {
          params: {
            date,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the number of messages sent with the `/bot/message/broadcast` endpoint.
   *
   * @param date - Date the messages were sent
   * @returns Returns status code `200` and a [[NumberOfMessagesSentResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages
   */
  getNumberOfSentBroadcastMessages(
    date: string
  ): Promise<LineTypes.NumberOfMessagesSentResponse> {
    return this.axios
      .get<LineTypes.NumberOfMessagesSentResponse>(
        '/v2/bot/message/delivery/broadcast',
        {
          params: {
            date,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Insight
   * https://developers.line.biz/en/reference/messaging-api/#get-insight
   */

  /**
   * Returns the number of messages sent from LINE Official Account on a specified day.
   *
   * @param date - Date for which to retrieve number of sent messages.
   * @returns Returns status code `200` and a [[NumberOfMessageDeliveriesResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-delivery-messages
   */
  getNumberOfMessageDeliveries(
    date: string
  ): Promise<LineTypes.NumberOfMessageDeliveriesResponse> {
    return this.axios
      .get<LineTypes.NumberOfMessageDeliveriesResponse>(
        '/v2/bot/insight/message/delivery',
        {
          params: {
            date,
          },
        }
      )
      .then((res) => res.data, handleError);
  }

  /**
   * Returns the number of users who have added the LINE Official Account on or before a specified date.
   *
   * @param date - Date for which to retrieve the number of followers.
   * @returns Returns status code `200` and a [[NumberOfFollowersResponse]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-number-of-followers
   */
  getNumberOfFollowers(
    date: string
  ): Promise<LineTypes.NumberOfFollowersResponse> {
    return this.axios
      .get<LineTypes.NumberOfFollowersResponse>('/v2/bot/insight/followers', {
        params: {
          date,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Retrieves the demographic attributes for a LINE Official Account's friends. You can only retrieve information about friends for LINE Official Accounts created by users in Japan (JP), Thailand (TH) and Taiwan (TW).
   *
   * @returns Returns status code `200` and a [[FriendDemographics]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-demographic
   */
  getFriendDemographics(): Promise<LineTypes.FriendDemographics> {
    return this.axios
      .get<LineTypes.FriendDemographics>('/v2/bot/insight/demographic')
      .then((res) => res.data, handleError);
  }

  /**
   * Gets the status of a narrowcast message.
   *
   * @param requestId - The narrowcast message's request ID. Each Messaging API request has a request ID.
   * @returns Returns a `200` HTTP status code and a [[NarrowcastProgressResponse]]
   * @see https://developers.line.biz/en/reference/messaging-api/#get-narrowcast-progress-status
   */
  getNarrowcastProgress(
    requestId: string
  ): Promise<LineTypes.NarrowcastProgressResponse> {
    return this.axios
      .get('/v2/bot/message/progress/narrowcast', {
        params: {
          requestId,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Creates an audience for uploading user IDs. You can create up to 1,000 audiences.
   *
   * @param description - The audience's name. Audience names must be unique. Note that comparisons are case-insensitive, so the names `AUDIENCE` and `audience` are considered identical.
   * - Max character limit: 120
   * @param isIfaAudience - If this is `false` (default), recipients are specified by user IDs. If `true`, recipients must be specified by IFAs.
   * @param audiences - An array of up to 10,000 user IDs or IFAs.
   * @param options - Create upload audience group options.
   * @returns Returns an [[UploadAudienceGroup]] along with the `202` HTTP status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#create-upload-audience-group
   */
  createUploadAudienceGroup(
    description: string,
    isIfaAudience: boolean,
    audiences: LineTypes.Audience[],
    options: LineTypes.CreateUploadAudienceGroupOptions = {}
  ): Promise<LineTypes.UploadAudienceGroup> {
    return this.axios
      .post('/v2/bot/audienceGroup/upload', {
        description,
        isIfaAudience,
        audiences,
        ...options,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Adds new user IDs or IFAs to an audience for uploading user IDs.
   *
   * @param audienceGroupId - The audience ID.
   * @param audiences - An array of up to 10,000 user IDs or IFAs.
   * @param options - Update upload audience group options.
   * @returns Returns the HTTP `202` status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#update-upload-audience-group
   */
  updateUploadAudienceGroup(
    audienceGroupId: number,
    audiences: LineTypes.Audience[],
    options: LineTypes.UpdateUploadAudienceGroupOptions = {}
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .put('/v2/bot/audienceGroup/upload', {
        audienceGroupId,
        audiences,
        ...options,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Creates an audience for click-based retargeting. You can create up to 1,000 audiences.
   *
   * @param description - The audience's name. Audience names must be unique. This is case-insensitive, meaning `AUDIENCE` and `audience` are considered identical.
   * - Max character limit: 120
   * @param requestId - The request ID of a broadcast or narrowcast message sent in the past 60 days. Each Messaging API request has a request ID.
   * @param options - create click audience group options
   * @returns Returns a [[ClickAudienceGroup]] along with the `202` HTTP status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#create-click-audience-group
   */
  createClickAudienceGroup(
    description: string,
    requestId: string,
    options: LineTypes.CreateClickAudienceGroupOptions = {}
  ): Promise<LineTypes.ClickAudienceGroup> {
    return this.axios
      .post('/v2/bot/audienceGroup/click', {
        description,
        requestId,
        ...options,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Create Impression-based Audience Group
   *
   * Creates an audience for impression-based retargeting. You can create up to 1,000 audiences.
   *
   * An impression-based retargeting audience is a collection of users who have viewed a broadcast or narrowcast message.
   *
   * Use a request ID to specify the message. The audience will include any user who has viewed at least one message bubble.
   *
   * @param description - The audience's name. Audience names must be unique. This is case-insensitive, meaning `AUDIENCE` and `audience` are considered identical.
   * - Max character limit: 120
   * @param requestId - The request ID of a broadcast or narrowcast message sent in the past 60 days. Each Messaging API request has a request ID.
   * @returns Returns an [[ImpAudienceGroup]] along with the `202` HTTP status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#create-imp-audience-group
   */
  createImpAudienceGroup(
    description: string,
    requestId: string
  ): Promise<LineTypes.ImpAudienceGroup> {
    return this.axios
      .post('/v2/bot/audienceGroup/imp', {
        description,
        requestId,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Set Description of Audience Group
   *
   * Renames an existing audience.
   *
   * @param description - The audience's name. Audience names must be unique. This is case-insensitive, meaning `AUDIENCE` and `audience` are considered identical.
   * - Max character limit: 120
   * @param audienceGroupId - The audience ID.
   * @returns Returns the `200` HTTP status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#set-description-audience-group
   */
  setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: number
  ): Promise<void> {
    return this.axios
      .put(`/v2/bot/audienceGroup/${audienceGroupId}/updateDescription`, {
        description,
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Deletes Audience Group
   *
   * Deletes an audience.
   *
   * @param audienceGroupId - The audience ID.
   * @returns Returns the `200` HTTP status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#delete-audience-group
   */
  deleteAudienceGroup(
    audienceGroupId: number
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .delete(`/v2/bot/audienceGroup/${audienceGroupId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets audience data.
   *
   * @param audienceGroupId - The audience ID.
   * @returns Returns a `200` HTTP status code and an [[AudienceGroupWithJob]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-audience-group
   */
  getAudienceGroup(
    audienceGroupId: number
  ): Promise<LineTypes.AudienceGroupWithJob> {
    return this.axios
      .get(`/v2/bot/audienceGroup/${audienceGroupId}`)
      .then((res) => res.data, handleError);
  }

  /**
   * Gets data for more than one audience.
   *
   * @param options - get audience groups options
   * @returns Returns a `200` HTTP status code and an [[AudienceGroups]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-audience-groups
   */
  getAudienceGroups(
    options: LineTypes.GetAudienceGroupsOptions = {}
  ): Promise<LineTypes.AudienceGroups> {
    return this.axios
      .get(`/v2/bot/audienceGroup/list`, {
        params: {
          page: 1,
          ...options,
        },
      })
      .then((res) => res.data, handleError);
  }

  /**
   * Get the authority level of the audience
   *
   * @returns Returns status code `200` and an [[AudienceGroupAuthorityLevel]].
   * @see https://developers.line.biz/en/reference/messaging-api/#get-authority-level
   */
  getAudienceGroupAuthorityLevel(): Promise<LineTypes.AudienceGroupAuthorityLevel> {
    return this.axios
      .get('/v2/bot/audienceGroup/authorityLevel')
      .then((res) => res.data, handleError);
  }

  /**
   * Change the authority level of all audiences created in the same channel.
   *
   * @param authorityLevel - The authority level for all audiences linked to a channel
   * - `PUBLIC`: The default authority level. Audiences will be available in channels other than the one where you created the audience. For example, it will be available in [LINE Official Account Manager](https://manager.line.biz/), [LINE Ad Manager](https://admanager.line.biz/), and all channels the bot is linked to.
   * - `PRIVATE`: Audiences will be available only in the channel where you created the audience.
   * @returns Returns the HTTP `200` status code.
   * @see https://developers.line.biz/en/reference/messaging-api/#change-authority-level
   */
  changeAudienceGroupAuthorityLevel(
    authorityLevel: 'PUBLIC' | 'PRIVATE'
  ): Promise<LineTypes.MutationSuccessResponse> {
    return this.axios
      .put(`/v2/bot/audienceGroup/authorityLevel`, {
        authorityLevel,
      })
      .then((res) => res.data, handleError);
  }
}
