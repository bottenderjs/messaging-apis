import { rest } from 'msw';

import { res } from './res';

export const requestHandlers = [
  rest.get(
    'https://api.line.me/v2/bot/insight/message/delivery',
    (_, __, ctx) => {
      return res(
        ctx.json({
          status: 'ready',
          broadcast: 5385,
          targeting: 522,
        })
      );
    }
  ),
  rest.get('https://api.line.me/v2/bot/insight/followers', (_, __, ctx) => {
    return res(
      ctx.json({
        status: 'ready',
        followers: 7620,
        targetedReaches: 5848,
        blocks: 237,
      })
    );
  }),
  rest.get('https://api.line.me/v2/bot/insight/demographic', (_, __, ctx) => {
    return res(
      ctx.json({
        available: true,
        genders: [
          {
            gender: 'unknown',
            percentage: 37.6,
          },
          {
            gender: 'male',
            percentage: 31.8,
          },
          {
            gender: 'female',
            percentage: 30.6,
          },
        ],
        ages: [
          {
            age: 'unknown',
            percentage: 37.6,
          },
          {
            age: 'from50',
            percentage: 17.3,
          },
        ],
        areas: [
          {
            area: 'unknown',
            percentage: 42.9,
          },
          {
            area: '徳島',
            percentage: 2.9,
          },
        ],
        appTypes: [
          {
            appType: 'ios',
            percentage: 62.4,
          },
          {
            appType: 'android',
            percentage: 27.7,
          },
          {
            appType: 'others',
            percentage: 9.9,
          },
        ],
        subscriptionPeriods: [
          {
            subscriptionPeriod: 'over365days',
            percentage: 96.4,
          },
          {
            subscriptionPeriod: 'within365days',
            percentage: 1.9,
          },
          {
            subscriptionPeriod: 'within180days',
            percentage: 1.2,
          },
          {
            subscriptionPeriod: 'within90days',
            percentage: 0.5,
          },
          {
            subscriptionPeriod: 'within30days',
            percentage: 0.1,
          },
          {
            subscriptionPeriod: 'within7days',
            percentage: 0,
          },
        ],
      })
    );
  }),
  rest.get('https://api.line.me/v2/bot/insight/message/event', (_, __, ctx) => {
    return res(
      ctx.json({
        overview: {
          requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
          timestamp: 1568214000,
          delivered: 320,
          uniqueImpression: 82,
          uniqueClick: 51,
          uniqueMediaPlayed: null,
          uniqueMediaPlayed100Percent: null,
        },
        messages: [
          {
            seq: 1,
            impression: 136,
            mediaPlayed: null,
            mediaPlayed25Percent: null,
            mediaPlayed50Percent: null,
            mediaPlayed75Percent: null,
            mediaPlayed100Percent: null,
            uniqueMediaPlayed: null,
            uniqueMediaPlayed25Percent: null,
            uniqueMediaPlayed50Percent: null,
            uniqueMediaPlayed75Percent: null,
            uniqueMediaPlayed100Percent: null,
          },
        ],
        clicks: [
          {
            seq: 1,
            url: 'https://line.me/',
            click: 41,
            uniqueClick: 30,
            uniqueClickOfRequest: 30,
          },
          {
            seq: 1,
            url: 'https://www.linebiz.com/',
            click: 59,
            uniqueClick: 38,
            uniqueClickOfRequest: 38,
          },
        ],
      })
    );
  }),
];
