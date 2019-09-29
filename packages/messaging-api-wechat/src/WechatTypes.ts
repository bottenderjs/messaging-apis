export type SucceededResponseData = {
  errcode: 0;
  errmsg: 'ok';
};

export type FailedResponseData = {
  errcode: number;
  errmsg: string;
};

export type ResponseData = SucceededResponseData | FailedResponseData;

export type AccessToken = {
  access_token: string;
  expires_in: number;
};

export type Video = {
  media_id: string;
  thumb_media_id: string;
  title: string;
  description: string;
};

export type Music = {
  title: string;
  description: string;
  musicurl: string;
  hqmusicurl: string;
  thumb_media_id: string;
};

export type Article = {
  title: string;
  description: string;
  url: string;
  picurl: string;
};

export type News = {
  articles: Article[];
};

export type MsgMenu = {
  head_content: string;
  list: {
    id: string;
    content: string;
  }[];
  tail_content: string;
};

export type MiniProgramPage = {
  title: string;
  appid: string;
  pagepath: string;
  thumb_media_id: string;
};

export enum MediaType {
  Image = 'image',
  Voice = 'voice',
  Video = 'video',
  Thumb = 'thumb',
}

export type SendMessageOptions = {
  customservice?: {
    kf_account: string;
  };
};
