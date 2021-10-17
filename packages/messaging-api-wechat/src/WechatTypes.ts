import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  appId: string;
  appSecret: string;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type SucceededResponseData = {
  errcode: 0;
  errmsg: 'ok';
};

export type FailedResponseData = {
  errcode: number;
  errmsg: string;
};

export type ResponseData = SucceededResponseData;

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

export type MessageOptions = {
  touser: string;
} & SendMessageOptions &
  (
    | {
        msgtype: 'text';
        text: {
          content: string;
        };
      }
    | {
        msgtype: 'image';
        image: {
          mediaId: string;
        };
      }
    | {
        msgtype: 'voice';
        voice: {
          mediaId: string;
        };
      }
    | {
        msgtype: 'video';
        video: Video;
      }
    | {
        msgtype: 'music';
        music: Music;
      }
    | {
        msgtype: 'news';
        news: News;
      }
    | {
        msgtype: 'mpnews';
        mpnews: {
          mediaId: string;
        };
      }
    | {
        msgtype: 'msgmenu';
        msgmenu: MsgMenu;
      }
    | {
        msgtype: 'wxcard';
        wxcard: {
          cardId: string;
        };
      }
    | {
        msgtype: 'miniprogrampage';
        miniprogrampage: MiniProgramPage;
      }
  );

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

export type MediaType = 'image' | 'voice' | 'video' | 'thumb';

export type SendMessageOptions = {
  customservice?: {
    kfAccount: string;
  };
};

export type TypingCommand = 'Typing' | 'CancelTyping';
