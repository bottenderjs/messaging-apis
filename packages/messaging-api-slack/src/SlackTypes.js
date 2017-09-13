/* @flow */

export type Attachment = {
  fallback: string,
  pretext?: string,
  color?: string,
  author_name?: string,
  author_link?: string,
  author_icon?: string,
  title?: string,
  title_link?: string,
  text?: string,
  fields?: Array<{
    title: string,
    value: string,
    short: boolean,
  }>,
  image_url?: string,
  thumb_url?: string,
  footer?: string,
  footer_icon?: string,
  ts?: number,
};

export type SendMessageSucessResponse = 'ok';

export type SlackOAuthAPIResponse = {
  [key: string]: any,
  ok: boolean,
};

export type AvailableMethod =
  | 'chat.postMessage'
  | 'channels.info'
  | 'channels.list'
  | 'users.info'
  | 'users.list';

export type User = {
  id: string,
  name: string,
  real_name: string,
};

export type Channel = {
  id: string,
  name: string,
  members?: Array<User>,
};
