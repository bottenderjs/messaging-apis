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
  accessToken: string;
  expiresIn: number;
};

export type UploadedMedia = {
  type: string;
  mediaId: string;
  createdAt: number;
};

export type Media = {
  videoUrl: string;
};

export type Video = {
  mediaId: string;
  thumbMediaId: string;
  title: string;
  description: string;
};

export type Music = {
  title: string;
  description: string;
  musicurl: string;
  hqmusicurl: string;
  thumbMediaId: string;
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
  headContent: string;
  list: {
    id: string;
    content: string;
  }[];
  tailContent: string;
};

export type MiniProgramPage = {
  title: string;
  appid: string;
  pagepath: string;
  thumbMediaId: string;
};

export enum MediaType {
  Image = 'image',
  Voice = 'voice',
  Video = 'video',
  Thumb = 'thumb',
}

export type SendMessageOptions = {
  customservice?: {
    kfAccount: string;
  };
};
