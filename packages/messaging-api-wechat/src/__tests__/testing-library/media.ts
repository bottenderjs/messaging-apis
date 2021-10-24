import { rest } from 'msw';
import { snakecaseKeys } from 'messaging-api-common';

import * as WechatTypes from '../../WechatTypes';

let uploadedMediaCount = 0;
let uploadedMediaMap: Record<
  string,
  { type: WechatTypes.MediaType; data: string }
> = {};

export const requestHandlers = [
  rest.post<{ media: string }>(
    'https://api.weixin.qq.com/cgi-bin/media/upload',
    async (req, res, ctx) => {
      const type = req.url.searchParams.get('type');
      if (!['image', 'voice', 'video', 'thumb'].includes(type)) {
        return res(ctx.json({ errcode: 40004, errmsg: 'invalid media type' }));
      }

      uploadedMediaCount += 1;
      const mediaId = `MEDIA_ID_${uploadedMediaCount}`;
      uploadedMediaMap[mediaId] = {
        type: type as WechatTypes.MediaType,
        data: req.body.media,
      };

      return res(
        ctx.json(
          snakecaseKeys({
            type: req.url.searchParams.get('type'),
            mediaId,
            createdAt: Date.now(),
          })
        )
      );
    }
  ),
  rest.get('https://api.weixin.qq.com/cgi-bin/media/get', (req, res, ctx) => {
    const mediaId = req.url.searchParams.get('media_id');
    if (!uploadedMediaMap[mediaId]) {
      return res(ctx.json({ errcode: 40007, errmsg: 'invalid media_id' }));
    }

    const { type, data } = uploadedMediaMap[mediaId];

    if (type === 'video') {
      return res(
        ctx.json(
          snakecaseKeys({
            videoUrl: 'https://www.example.com/download/url',
          })
        )
      );
    }

    return res(
      ctx.body(data),
      ctx.set('Content-Type', 'image/jpeg'),
      ctx.set('Content-Disposition', 'attachment; filename="MEDIA_ID.jpg')
    );
  }),
];

export function reset(): void {
  uploadedMediaCount = 0;
  uploadedMediaMap = {};
}
