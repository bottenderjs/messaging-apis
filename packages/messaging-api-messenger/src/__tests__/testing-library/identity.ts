import pick from 'lodash/pick';
import { rest } from 'msw';

import { constants } from './shared';

export const requestHandlers = [
  rest.get(
    `https://graph.facebook.com/:version/${constants.USER_ID}`,
    (req, res, ctx) => {
      const user = {
        id: constants.USER_ID,
        first_name: 'Kevin',
        last_name: 'Durant',
        profile_pic: 'https://example.com/pic.png',
        locale: 'en_US',
        timezone: 8,
        gender: 'male',
      };
      return res(
        ctx.json(pick(user, req.url.searchParams.get('fields').split(',')))
      );
    }
  ),
  rest.get(
    `https://graph.facebook.com/:version/${constants.USER_ID}/ids_for_apps`,
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              id: '10152368852405295',
              app: {
                category: 'Business',
                link: 'https://www.facebook.com/games/?app_id=1419232575008550',
                name: "John's Game App",
                id: '1419232575008550',
              },
            },
            {
              id: '645195294',
              app: {
                link: 'https://apps.facebook.com/johnsmovieappns/',
                name: 'JohnsMovieApp',
                namespace: 'johnsmovieappns',
                id: '259773517400382',
              },
            },
          ],
          paging: {
            cursors: {
              before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
              after: 'NDAwMDExOTA3MDM1ODMwA',
            },
          },
        })
      );
    }
  ),
  rest.get(
    `https://graph.facebook.com/:version/${constants.USER_ID}/ids_for_pages`,
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              id: '12345123', // The psid for the user for that page
              page: {
                category: 'Musician',
                link: 'https://www.facebook.com/Johns-Next-Great-Thing-380374449010653/',
                name: "John's Next Great Thing",
                id: '380374449010653',
              },
            },
          ],
          paging: {
            cursors: {
              before: 'MTQ4OTU4MjQ5Nzc4NjY4OAZDZDA',
              after: 'NDAwMDExOTA3MDM1ODMwA',
            },
          },
        })
      );
    }
  ),
];
