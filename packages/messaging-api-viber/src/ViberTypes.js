/* @flow */

export type ViberHTTPResponse = {
  status: number,
  status_message: string,
};

export type ViberEventType =
  | 'delivered'
  | 'seen'
  | 'failed'
  | 'subscribed'
  | 'unsubscribed'
  | 'conversation_started';

export type ViberSender = {
  name: string,
  avatar?: string,
};

export type ViberContact = {
  name: string,
  phone_number: string,
};

export type ViberLocation = {
  lat: string,
  lon: string,
};

export type ViberButton = {
  Columns: number,
  Rows: number,
  Text: string,
  ActionType: 'open-url' | 'reply',
  ActionBody: string,
  TextSize?: 'small' | 'medium' | 'large',
  TextVAlign?: 'middle',
  TextHAlign?: 'left' | 'middle' | 'right',
  Image?: string,
};

export type ViberPicture = {
  text: string,
  media: string,
  thumbnail?: string,
};

export type ViberVideo = {
  media: string,
  size: number,
  thumbnail?: string,
  duration?: number,
};

export type ViberFile = {
  media: string,
  size: number,
  file_name: string,
};

export type ViberRichMedia = {
  Type: 'rich_media',
  ButtonsGroupColumns: number,
  ButtonsGroupRows: number,
  BgColor: string,
  Buttons: Array<ViberButton>,
};
