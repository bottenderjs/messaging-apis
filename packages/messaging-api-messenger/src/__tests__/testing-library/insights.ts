import { rest } from 'msw';

export const requestHandlers = [
  rest.get(
    'https://graph.facebook.com/:version/me/insights',
    (req, res, ctx) => {
      const metric = req.url.searchParams.get('metric').split(',');

      const data = [];

      if (metric.includes('page_messages_blocked_conversations_unique')) {
        data.push({
          name: 'page_messages_blocked_conversations_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique blocked conversations count',
          description:
            'Daily: The number of conversations with the Page that have been blocked.',
          id: '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
        });
      }

      if (metric.includes('page_messages_reported_conversations_unique')) {
        data.push({
          name: 'page_messages_reported_conversations_unique',
          period: 'day',
          values: [
            {
              value: 83111,
              end_time: '2017-02-02T08:00:00+0000',
            },
            {
              value: 85215,
              end_time: '2017-02-03T08:00:00+0000',
            },
            {
              value: 87175,
              end_time: '2017-02-04T08:00:00+0000',
            },
          ],
          title: 'Daily unique reported conversations count',
          description:
            'Daily: The number of conversations from your Page that have been reported by people for reasons such as spam, or containing inappropriate content.',
          id: '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
        });
      }

      if (metric.includes('page_messages_total_messaging_connections')) {
        data.push({
          name: 'page_messages_total_messaging_connections',
          period: 'day',
          values: [
            { value: 1000, end_time: '2018-03-12T07:00:00+0000' },
            { value: 1000, end_time: '2018-03-13T07:00:00+0000' },
          ],
          title: 'Messaging connections',
          description:
            'Daily: The number of people who have sent a message to your business, not including people who have blocked or reported your business on Messenger. (This number only includes connections made since October 2016.)',
          id: '1386473101668063/insights/page_messages_total_messaging_connections/day',
        });
      }

      if (metric.includes('page_messages_new_conversations_unique')) {
        data.push({
          name: 'page_messages_new_conversations_unique',
          period: 'day',
          values: [
            { value: 1, end_time: '2018-03-12T07:00:00+0000' },
            { value: 0, end_time: '2018-03-13T07:00:00+0000' },
          ],
          title: 'Daily unique new conversations count',
          description:
            'Daily: The number of messaging conversations on Facebook Messenger that began with people who had never messaged with your business before.',
          id: '1386473101668063/insights/page_messages_new_conversations_unique/day',
        });
      }

      return res(
        ctx.json({
          data,
        })
      );
    }
  ),
];
