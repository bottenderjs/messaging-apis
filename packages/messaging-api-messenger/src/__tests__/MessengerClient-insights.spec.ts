import { MessengerClient } from '..';

import {
  constants,
  getCurrentContext,
  setupMessengerServer,
} from './testing-library';

setupMessengerServer();

it('should support #getInsights', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getInsights([
    'page_messages_reported_conversations_unique',
  ]);

  expect(res).toEqual([
    {
      name: 'page_messages_reported_conversations_unique',
      period: 'day',
      values: [
        {
          value: 83111,
          endTime: '2017-02-02T08:00:00+0000',
        },
        {
          value: 85215,
          endTime: '2017-02-03T08:00:00+0000',
        },
        {
          value: 87175,
          endTime: '2017-02-04T08:00:00+0000',
        },
      ],
      title: 'Daily unique reported conversations count',
      description:
        'Daily: The number of conversations from your Page that have been reported by people for reasons such as spam, or containing inappropriate content.',
      id: '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_reported_conversations_unique&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getInsights with multiple metrics', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getInsights([
    'page_messages_blocked_conversations_unique',
    'page_messages_reported_conversations_unique',
  ]);

  expect(res).toEqual([
    {
      name: 'page_messages_blocked_conversations_unique',
      period: 'day',
      values: [
        {
          value: 83111,
          endTime: '2017-02-02T08:00:00+0000',
        },
        {
          value: 85215,
          endTime: '2017-02-03T08:00:00+0000',
        },
        {
          value: 87175,
          endTime: '2017-02-04T08:00:00+0000',
        },
      ],
      title: 'Daily unique blocked conversations count',
      description:
        'Daily: The number of conversations with the Page that have been blocked.',
      id: '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
    },
    {
      name: 'page_messages_reported_conversations_unique',
      period: 'day',
      values: [
        {
          value: 83111,
          endTime: '2017-02-02T08:00:00+0000',
        },
        {
          value: 85215,
          endTime: '2017-02-03T08:00:00+0000',
        },
        {
          value: 87175,
          endTime: '2017-02-04T08:00:00+0000',
        },
      ],
      title: 'Daily unique reported conversations count',
      description:
        'Daily: The number of conversations from your Page that have been reported by people for reasons such as spam, or containing inappropriate content.',
      id: '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
    },
  ]);

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_blocked_conversations_unique%2Cpage_messages_reported_conversations_unique&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getBlockedConversations', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getBlockedConversations();

  expect(res).toEqual({
    name: 'page_messages_blocked_conversations_unique',
    period: 'day',
    values: [
      {
        value: 83111,
        endTime: '2017-02-02T08:00:00+0000',
      },
      {
        value: 85215,
        endTime: '2017-02-03T08:00:00+0000',
      },
      {
        value: 87175,
        endTime: '2017-02-04T08:00:00+0000',
      },
    ],
    title: 'Daily unique blocked conversations count',
    description:
      'Daily: The number of conversations with the Page that have been blocked.',
    id: '1234567/insights/?metric=page_messages_blocked_conversations_unique/day',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_blocked_conversations_unique&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getReportedConversations', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getReportedConversations();

  expect(res).toEqual({
    name: 'page_messages_reported_conversations_unique',
    period: 'day',
    values: [
      {
        value: 83111,
        endTime: '2017-02-02T08:00:00+0000',
      },
      {
        value: 85215,
        endTime: '2017-02-03T08:00:00+0000',
      },
      {
        value: 87175,
        endTime: '2017-02-04T08:00:00+0000',
      },
    ],
    title: 'Daily unique reported conversations count',
    description:
      'Daily: The number of conversations from your Page that have been reported by people for reasons such as spam, or containing inappropriate content.',
    id: '1234567/insights/?metric=page_messages_reported_conversations_unique/day',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_reported_conversations_unique&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getTotalMessagingConnections', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getTotalMessagingConnections();

  expect(res).toEqual({
    name: 'page_messages_total_messaging_connections',
    period: 'day',
    values: [
      { value: 1000, endTime: '2018-03-12T07:00:00+0000' },
      { value: 1000, endTime: '2018-03-13T07:00:00+0000' },
    ],
    title: 'Messaging connections',
    description:
      'Daily: The number of people who have sent a message to your business, not including people who have blocked or reported your business on Messenger. (This number only includes connections made since October 2016.)',
    id: '1386473101668063/insights/page_messages_total_messaging_connections/day',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_total_messaging_connections&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #getNewConversations', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.getNewConversations();

  expect(res).toEqual({
    name: 'page_messages_new_conversations_unique',
    period: 'day',
    values: [
      { value: 1, endTime: '2018-03-12T07:00:00+0000' },
      { value: 0, endTime: '2018-03-13T07:00:00+0000' },
    ],
    title: 'Daily unique new conversations count',
    description:
      'Daily: The number of messaging conversations on Facebook Messenger that began with people who had never messaged with your business before.',
    id: '1386473101668063/insights/page_messages_new_conversations_unique/day',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/me/insights/?metric=page_messages_new_conversations_unique&access_token=ACCESS_TOKEN'
  );
  expect(request?.url.searchParams.get('access_token')).toBe('ACCESS_TOKEN');
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});

it('should support #logCustomEvents', async () => {
  const messenger = new MessengerClient({
    accessToken: constants.ACCESS_TOKEN,
  });

  const res = await messenger.logCustomEvents({
    appId: constants.APP_ID,
    pageId: constants.PAGE_ID,
    pageScopedUserId: constants.USER_ID,
    events: [
      {
        _eventName: 'fb_mobile_purchase',
        _valueToSum: 55.22,
        _fbCurrency: 'USD',
      },
    ],
  });

  expect(res).toEqual({
    success: true,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://graph.facebook.com/v12.0/APP_ID/activities'
  );
  expect(request?.body).toEqual({
    event: 'CUSTOM_APP_EVENTS',
    custom_events:
      '[{"_eventName":"fb_mobile_purchase","_valueToSum":55.22,"_fbCurrency":"USD"}]',
    advertiser_tracking_enabled: 0,
    application_tracking_enabled: 0,
    extinfo: '["mb1"]',
    page_id: 'PAGE_ID',
    page_scoped_user_id: 'USER_ID',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
});
