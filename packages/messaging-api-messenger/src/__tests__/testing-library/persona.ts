import { rest } from 'msw';

import { constants } from './shared';

export const requestHandlers = [
  rest.post(
    'https://graph.facebook.com/:version/me/personas',
    (_req, res, ctx) => {
      return res(ctx.json({ id: '311884619589478' }));
    }
  ),
  rest.get(
    'https://graph.facebook.com/:version/311884619589478',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          id: '311884619589478',
          name: 'kpman',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
        })
      );
    }
  ),
  rest.delete(
    'https://graph.facebook.com/:version/311884619589478',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          success: true,
        })
      );
    }
  ),
  rest.get(
    'https://graph.facebook.com/:version/me/personas',
    (req, res, ctx) => {
      const cursor =
        'QVFIUmRJYXR4Y3dBN1JpcU5pU0lfLWhZAS0IzMjZADZAWxWYksxLWVHdW1HSnJmV21paEZA3NEl2RW5LY25fRFZAnZAkg2OVBJR0VLZAXIzeFRTZAGFrSldjMVRlV3Fn';

      if (req.url.searchParams.get('after') === cursor) {
        return res(
          ctx.json({
            data: [
              {
                name: '4',
                profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
                id: '1007240332817468',
              },
              {
                name: '5',
                profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
                id: '243523459665626',
              },
              {
                name: '6',
                profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
                id: '313552169447330',
              },
            ],
          })
        );
      }

      return res(
        ctx.json({
          data: [
            {
              name: '1',
              profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
              id: '1007240332817468',
            },
            {
              name: '2',
              profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
              id: '243523459665626',
            },
            {
              name: '3',
              profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
              id: '313552169447330',
            },
          ],
          paging: {
            cursors: {
              before:
                'QVFIUktTaXVuTUtsYUpVdFhlQjVhV2tRMU1jY0tRekU0d1NVTS1fZAGw4YmFYakU3ay1vRnlKbUh4VktROWxvazQzLXQzbm1YN0M3SHRKaVBGTTVCNFlyZAXBn',
              after: cursor,
            },
            next: '/138523840252451/personas?access_token=0987654321&limit=25&after=QVFIUl96LThrbmJrU3gzOHdsR2JaZA2dDM01uaEJNaUZArWnNTNHBhQi1iZA3lvakk2YWlUR3F5bUV3UDJYZAWVxYnJyOFA1VnJwZAG9GUEVzOGRMZAzRsV08wdW1R',
          },
        })
      );
    }
  ),
];
