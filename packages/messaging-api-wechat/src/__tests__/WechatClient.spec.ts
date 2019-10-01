import MockAdapter from 'axios-mock-adapter';

import WechatClient from '../WechatClient';
import { MediaType } from '../WechatTypes';

const APP_ID = 'APP_ID';
const APP_SECRET = 'APP_SECRET';

const RECIPIENT_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

const createMock = () => {
  const client = new WechatClient(APP_ID, APP_SECRET);
  const mock = new MockAdapter(client.axios);

  mock
    .onGet('/token?grant_type=client_credential&appid=APP_ID&secret=APP_SECRET')
    .reply(200, {
      access_token: ACCESS_TOKEN,
      expires_in: 7200,
    });

  return { client, mock };
};

describe('access token', () => {
  describe('#getAccessToken', () => {
    it('should response access_token and expires_in', async () => {
      const { client } = createMock();

      const reply = {
        accessToken: ACCESS_TOKEN,
        expiresIn: 7200,
      };

      const res = await client.getAccessToken();

      expect(res).toEqual(reply);
    });
  });
});

describe('media', () => {
  describe('#uploadMedia', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        type: 'image',
        media_id: 'MEDIA_ID',
        created_at: 123456789,
      };

      const camelcaseReply = {
        type: 'image',
        mediaId: 'MEDIA_ID',
        createdAt: 123456789,
      };

      mock
        .onPost(`/media/upload?access_token=${ACCESS_TOKEN}&type=image`)
        .reply(200, reply);

      const res = await client.uploadMedia(
        MediaType.Image,
        Buffer.from('1234')
      );

      expect(res).toEqual(camelcaseReply);
    });
  });

  describe('#getMedia', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        video_url: 'http://www.example.com/image.jpg',
      };

      const camelcaseReply = {
        videoUrl: 'http://www.example.com/image.jpg',
      };

      mock
        .onGet(`/media/get?access_token=${ACCESS_TOKEN}&media_id=MEDIA_ID`)
        .reply(200, reply);

      const res = await client.getMedia('MEDIA_ID');

      expect(res).toEqual(camelcaseReply);
    });
  });
});

describe('send api', () => {
  describe('#sendRawBody', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'text',
          text: {
            content: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendRawBody({
        touser: RECIPIENT_ID,
        msgtype: 'text',
        text: {
          content: 'Hello!',
        },
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendText', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'text',
          text: {
            content: 'Hello!',
          },
        })
        .reply(200, reply);

      const res = await client.sendText(RECIPIENT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendImage', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'image',
          image: {
            media_id: 'MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendImage(RECIPIENT_ID, 'MEDIA_ID');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVoice', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'voice',
          voice: {
            media_id: 'MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendVoice(RECIPIENT_ID, 'MEDIA_ID');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendVideo', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'video',
          video: {
            media_id: 'MEDIA_ID',
            thumb_media_id: 'MEDIA_ID',
            title: 'TITLE',
            description: 'DESCRIPTION',
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECIPIENT_ID, {
        mediaId: 'MEDIA_ID',
        thumbMediaId: 'MEDIA_ID',
        title: 'TITLE',
        description: 'DESCRIPTION',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'video',
          video: {
            media_id: 'MEDIA_ID',
            thumb_media_id: 'MEDIA_ID',
            title: 'TITLE',
            description: 'DESCRIPTION',
          },
        })
        .reply(200, reply);

      const res = await client.sendVideo(RECIPIENT_ID, {
        media_id: 'MEDIA_ID',
        thumb_media_id: 'MEDIA_ID',
        title: 'TITLE',
        description: 'DESCRIPTION',
      } as any);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMusic', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'music',
          music: {
            title: 'MUSIC_TITLE',
            description: 'MUSIC_DESCRIPTION',
            musicurl: 'MUSIC_URL',
            hqmusicurl: 'HQ_MUSIC_URL',
            thumb_media_id: 'THUMB_MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendMusic(RECIPIENT_ID, {
        title: 'MUSIC_TITLE',
        description: 'MUSIC_DESCRIPTION',
        musicurl: 'MUSIC_URL',
        hqmusicurl: 'HQ_MUSIC_URL',
        thumbMediaId: 'THUMB_MEDIA_ID',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'music',
          music: {
            title: 'MUSIC_TITLE',
            description: 'MUSIC_DESCRIPTION',
            musicurl: 'MUSIC_URL',
            hqmusicurl: 'HQ_MUSIC_URL',
            thumb_media_id: 'THUMB_MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendMusic(RECIPIENT_ID, {
        title: 'MUSIC_TITLE',
        description: 'MUSIC_DESCRIPTION',
        musicurl: 'MUSIC_URL',
        hqmusicurl: 'HQ_MUSIC_URL',
        thumb_media_id: 'THUMB_MEDIA_ID',
      } as any);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendNews', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'news',
          news: {
            articles: [
              {
                title: 'Happy Day',
                description: 'Is Really A Happy Day',
                url: 'URL',
                picurl: 'PIC_URL',
              },
              {
                title: 'Happy Day',
                description: 'Is Really A Happy Day',
                url: 'URL',
                picurl: 'PIC_URL',
              },
            ],
          },
        })
        .reply(200, reply);

      const res = await client.sendNews(RECIPIENT_ID, {
        articles: [
          {
            title: 'Happy Day',
            description: 'Is Really A Happy Day',
            url: 'URL',
            picurl: 'PIC_URL',
          },
          {
            title: 'Happy Day',
            description: 'Is Really A Happy Day',
            url: 'URL',
            picurl: 'PIC_URL',
          },
        ],
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMPNews', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'mpnews',
          mpnews: {
            media_id: 'MEDIA_ID',
          },
        })
        .reply(200, reply);

      const res = await client.sendMPNews(RECIPIENT_ID, 'MEDIA_ID');

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMsgMenu', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'msgmenu',
          msgmenu: {
            head_content: 'HEAD',
            list: [
              {
                id: '101',
                content: 'Yes',
              },
              {
                id: '102',
                content: 'No',
              },
            ],
            tail_content: 'TAIL',
          },
        })
        .reply(200, reply);

      const res = await client.sendMsgMenu(RECIPIENT_ID, {
        headContent: 'HEAD',
        list: [
          {
            id: '101',
            content: 'Yes',
          },
          {
            id: '102',
            content: 'No',
          },
        ],
        tailContent: 'TAIL',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'msgmenu',
          msgmenu: {
            head_content: 'HEAD',
            list: [
              {
                id: '101',
                content: 'Yes',
              },
              {
                id: '102',
                content: 'No',
              },
            ],
            tail_content: 'TAIL',
          },
        })
        .reply(200, reply);

      const res = await client.sendMsgMenu(RECIPIENT_ID, {
        head_content: 'HEAD',
        list: [
          {
            id: '101',
            content: 'Yes',
          },
          {
            id: '102',
            content: 'No',
          },
        ],
        tail_content: 'TAIL',
      } as any);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendWXCard', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'wxcard',
          wxcard: {
            card_id: '123dsdajkasd231jhksad',
          },
        })
        .reply(200, reply);

      const res = await client.sendWXCard(
        RECIPIENT_ID,
        '123dsdajkasd231jhksad'
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#sendMiniProgramPage', () => {
    it('should call wechat api', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'miniprogrampage',
          miniprogrampage: {
            title: 'title',
            appid: 'appid',
            pagepath: 'pagepath',
            thumb_media_id: 'thumb_media_id',
          },
        })
        .reply(200, reply);

      const res = await client.sendMiniProgramPage(RECIPIENT_ID, {
        title: 'title',
        appid: 'appid',
        pagepath: 'pagepath',
        thumbMediaId: 'thumb_media_id',
      });

      expect(res).toEqual(reply);
    });

    it('should support snakecase', async () => {
      const { client, mock } = createMock();

      const reply = {
        errcode: 0,
        errmsg: 'ok',
      };

      mock
        .onPost(`/message/custom/send?access_token=${ACCESS_TOKEN}`, {
          touser: RECIPIENT_ID,
          msgtype: 'miniprogrampage',
          miniprogrampage: {
            title: 'title',
            appid: 'appid',
            pagepath: 'pagepath',
            thumb_media_id: 'thumb_media_id',
          },
        })
        .reply(200, reply);

      const res = await client.sendMiniProgramPage(RECIPIENT_ID, {
        title: 'title',
        appid: 'appid',
        pagepath: 'pagepath',
        thumb_media_id: 'thumb_media_id',
      } as any);

      expect(res).toEqual(reply);
    });
  });
});
