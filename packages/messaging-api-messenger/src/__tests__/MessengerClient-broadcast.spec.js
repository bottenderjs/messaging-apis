import MockAdapter from 'axios-mock-adapter';

import MessengerBroadcast from '../MessengerBroadcast';
import MessengerClient from '../MessengerClient';

const USER_ID = '1QAZ2WSX';
const ACCESS_TOKEN = '1234567890';

let axios;
let _create;
beforeEach(() => {
  axios = require('axios'); // eslint-disable-line global-require
  _create = axios.create;
});

afterEach(() => {
  axios.create = _create;
});

const createMock = () => {
  const client = new MessengerClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('broadcast api', () => {
  describe('#createMessageCreative', () => {
    it('should call messages api to create message creative', async () => {
      const { client, mock } = createMock();

      const reply = {
        message_creative_id: 938461089,
      };

      mock
        .onPost(`/me/message_creatives?access_token=${ACCESS_TOKEN}`, {
          messages: [
            {
              dynamic_text: {
                text: 'Hi, {first_name}! Here is a generic template:',
                fallback_text: 'Hi! Here is a generic template:',
              },
            },
            {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: [
                    {
                      title: 'Welcome to Our Marketplace!',
                      image_url: 'https://www.facebook.com/jaspers.png',
                      subtitle: 'Fresh fruits and vegetables. Yum.',
                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://www.jaspersmarket.com',
                          title: 'View Website',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        })
        .reply(200, reply);

      const res = await client.createMessageCreative([
        {
          dynamic_text: {
            text: 'Hi, {first_name}! Here is a generic template:',
            fallback_text: 'Hi! Here is a generic template:',
          },
        },
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'Welcome to Our Marketplace!',
                  image_url: 'https://www.facebook.com/jaspers.png',
                  subtitle: 'Fresh fruits and vegetables. Yum.',
                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://www.jaspersmarket.com',
                      title: 'View Website',
                    },
                  ],
                },
              ],
            },
          },
        },
      ]);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendBroadcastMessage', () => {
    it('should call messages api to send broadcast message', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089);

      expect(res).toEqual(reply);
    });

    it('can send with custom label', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
          custom_label_id: 5678,
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089, {
        custom_label_id: 5678,
      });

      expect(res).toEqual(reply);
    });

    it('can send with label Predicates', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
          targeting: {
            labels: {
              operator: 'OR',
              values: [
                '<UNDER_25_CUSTOMERS_LABEL_ID>',
                '<OVER_50_CUSTOMERS_LABEL_ID>',
              ],
            },
          },
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089, {
        targeting: {
          labels: MessengerBroadcast.or(
            '<UNDER_25_CUSTOMERS_LABEL_ID>',
            '<OVER_50_CUSTOMERS_LABEL_ID>'
          ),
        },
      });

      expect(res).toEqual(reply);
    });

    it('can send with schedule_time', async () => {
      const { client, mock } = createMock();

      const reply = {
        broadcast_id: 837,
      };

      mock
        .onPost(`/me/broadcast_messages?access_token=${ACCESS_TOKEN}`, {
          message_creative_id: 938461089,
          schedule_time: '2018-04-05T20:39:13+00:00',
        })
        .reply(200, reply);

      const res = await client.sendBroadcastMessage(938461089, {
        schedule_time: '2018-04-05T20:39:13+00:00',
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#cancelBroadcast', () => {
    it('should call broadcast api with cancel operation', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/938461089?access_token=${ACCESS_TOKEN}`, {
          operation: 'cancel',
        })
        .reply(200, reply);

      const res = await client.cancelBroadcast(938461089);

      expect(res).toEqual(reply);
    });
  });

  describe('#getBroadcast', () => {
    it('should get broadcast status', async () => {
      const { client, mock } = createMock();

      const reply = {
        scheduled_time: '<ISO-8601_FORMAT_TIME>',
        status: '<STATUS>',
        id: '<BROADCAST_ID>',
      };

      mock
        .onGet(
          `/938461089?fields=scheduled_time,status&access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getBroadcast(938461089);

      expect(res).toEqual(reply);
    });
  });

  describe('#sendSponsoredMessage', () => {
    it('should call marketing api to send sponsored message', async () => {
      const { client, mock } = createMock();

      const AD_ACCOUNT_ID = '18910417349234';

      const reply = {
        ad_group_id: '6088387928148',
        broadcast_id: '754911018029273',
        success: true,
      };

      mock
        .onPost(
          `/act_${AD_ACCOUNT_ID}/sponsored_message_ads?access_token=${ACCESS_TOKEN}`,
          {
            message_creative_id: 938461089,
            daily_budget: 100,
            bid_amount: 400,
            targeting: "{'geo_locations': {'countries':['US']}}",
          }
        )
        .reply(200, reply);

      const res = await client.sendSponsoredMessage(AD_ACCOUNT_ID, {
        message_creative_id: 938461089,
        daily_budget: 100,
        bid_amount: 400,
        targeting: "{'geo_locations': {'countries':['US']}}",
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#startReachEstimation', () => {
    it('should call messages api to start a reach estimation', async () => {
      const { client, mock } = createMock();

      const reply = {
        reach_estimation_id: '6088387928148',
      };

      mock
        .onPost(
          `/me/broadcast_reach_estimations?access_token=${ACCESS_TOKEN}`,
          {
            custom_label_id: 938461089,
          }
        )
        .reply(200, reply);

      const res = await client.startReachEstimation(938461089);

      expect(res).toEqual(reply);
    });
  });

  describe('#getReachEstimate', () => {
    it('should call messages api to retrieve the reach estimate', async () => {
      const { client, mock } = createMock();

      const reply = {
        reach_estimation: '<REACH_ESTIMATE>',
        id: '<REACH_ESTIMATION_ID>',
      };

      mock.onGet(`/73450120243?access_token=${ACCESS_TOKEN}`).reply(200, reply);

      const res = await client.getReachEstimate(73450120243);

      expect(res).toEqual(reply);
    });
  });

  describe('#getBroadcastMessagesSent', () => {
    it('should call insights api to retrieve the message sent insight', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'messages_sent',
            period: 'lifetime',
            values: [
              {
                value: 1000,
                end_time: '1970-01-02T00:00:00+0000',
              },
            ],
            title: 'Lifetime number of messages sent from the page broadcast',
            description:
              'Lifetime: The total number of messages sent from a Page to people.',
            id: '1301333349933076/insights/messages_sent',
          },
        ],
      };

      mock
        .onPost(
          `/73450120243/insights/messages_sent?access_token=${ACCESS_TOKEN}`
        )
        .reply(200, reply);

      const res = await client.getBroadcastMessagesSent(73450120243);

      expect(res).toEqual(reply.data);
    });
  });
});

describe('label api', () => {
  describe('#createLabel', () => {
    it('should call messages api to create label', async () => {
      const { client, mock } = createMock();

      const reply = {
        id: 1712444532121303,
      };

      mock
        .onPost(`/me/custom_labels?access_token=${ACCESS_TOKEN}`, {
          name: 'awesome',
        })
        .reply(200, reply);

      const res = await client.createLabel('awesome');

      expect(res).toEqual(reply);
    });
  });

  describe('#associateLabel', () => {
    it('should call messages api to associate label', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onPost(`/1712444532121303/label?access_token=${ACCESS_TOKEN}`, {
          user: USER_ID,
        })
        .reply(200, reply);

      const res = await client.associateLabel(USER_ID, 1712444532121303);

      expect(res).toEqual(reply);
    });

    it('should call messages api to associate label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onPost(
          `/1712444532121303/label?access_token=${options.access_token}`,
          {
            user: USER_ID,
          }
        )
        .reply(200, reply);

      const res = await client.associateLabel(
        USER_ID,
        1712444532121303,
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#dissociateLabel', () => {
    it('should call messages api to dissociate label', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onDelete(`/1712444532121303/label?access_token=${ACCESS_TOKEN}`, {
          user: USER_ID,
        })
        .reply(200, reply);

      const res = await client.dissociateLabel(USER_ID, 1712444532121303);

      expect(res).toEqual(reply);
    });

    it('should call messages api to dissociate label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onDelete(
          `/1712444532121303/label?access_token=${options.access_token}`,
          {
            user: USER_ID,
          }
        )
        .reply(200, reply);

      const res = await client.dissociateLabel(
        USER_ID,
        1712444532121303,
        options
      );

      expect(res).toEqual(reply);
    });
  });

  describe('#getAssociatedLabels', () => {
    it('should call messages api to get associated label', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };

      mock
        .onGet(`/${USER_ID}/custom_labels?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getAssociatedLabels(USER_ID);

      expect(res).toEqual(reply);
    });

    it('should call messages api to get associated label with custom access token', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };
      const options = {
        access_token: '0987654321',
      };

      mock
        .onGet(`/${USER_ID}/custom_labels?access_token=${options.access_token}`)
        .reply(200, reply);

      const res = await client.getAssociatedLabels(USER_ID, options);

      expect(res).toEqual(reply);
    });
  });

  describe('#getLabelDetails', () => {
    it('should call messages api to get label details', async () => {
      const { client, mock } = createMock();

      const reply = {
        name: 'myLabel',
        id: '1001200005002',
      };

      mock
        .onGet(`/1712444532121303?fields=name&access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getLabelDetails(1712444532121303);

      expect(res).toEqual(reply);
    });
  });

  describe('#getLabelList', () => {
    it('should call messages api to get label list', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: 'myLabel',
            id: '1001200005003',
          },
          {
            name: 'myOtherLabel',
            id: '1001200005002',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUmx1WTBpMGpJWXprYzVYaVhabW55dVpycko4U2xURGE5ODNtNFZAPal94a1hTUnNVMUtoMVVoTzlzSDktUkMtQkUzWEFLSXlMS3ZALYUw3TURLelZAPOGVR',
            after:
              'QVFIUmItNkpTbjVzakxFWGRydzdaVUFNNnNPaUl0SmwzVHN5ZAWZAEQ3lZANDAzTXFIM0NHbHdYSkQ5OG1GaEozdjkzRmxpUFhxTDl4ZAlBibnE4LWt1eGlTa3Bn',
          },
        },
      };

      mock
        .onGet(`/me/custom_labels?fields=name&access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getLabelList();

      expect(res).toEqual(reply);
    });
  });

  describe('#deleteLabel', () => {
    it('should call messages api to get label list', async () => {
      const { client, mock } = createMock();

      const reply = {
        success: true,
      };

      mock
        .onDelete(`/${1712444532121303}?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.deleteLabel(1712444532121303);

      expect(res).toEqual(reply);
    });
  });
});
