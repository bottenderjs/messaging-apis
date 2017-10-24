export type AccessToken = {
  access_token: string,
  expires_in: number,
};

export type Video = {
  media_id: string,
  thumb_media_id: string,
  title: string,
  description: string,
};

export type Music = {
  title: string,
  description: string,
  musicurl: string,
  hqmusicurl: string,
  thumb_media_id: string,
};

export type Article = {
  title: string,
  description: string,
  url: string,
  picurl: string,
};

export type News = {
  articles: Array<Article>,
};

export type MiniProgramPage = {
  title: string,
  appid: string,
  pagepath: string,
  thumb_media_id: string,
};

export type MediaType = 'image' | 'voice' | 'video' | 'thumb';
