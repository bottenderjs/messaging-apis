import MockAdapter from 'axios-mock-adapter';

import MessengerClient from '../MessengerClient';

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

describe('persona api', () => {
  describe('#createPersona', () => {
    it('should call messages api to create a persona', async () => {
      const { client, mock } = createMock();

      const persona = {
        name: 'kpman',
        profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
      };

      const reply = { id: '2222146701193608' };

      mock
        .onPost(`/me/personas?access_token=${ACCESS_TOKEN}`, persona)
        .reply(200, reply);

      const res = await client.createPersona(persona);

      expect(res).toEqual(reply);
    });
  });

  describe('#getPersona', () => {
    it('should get persona with the id given', async () => {
      const { client, mock } = createMock();

      const reply = {
        name: 'hi',
        profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
        id: '311884619589478',
      };

      mock
        .onGet(`/311884619589478?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getPersona('311884619589478');

      expect(res).toEqual(reply);
    });
  });

  describe('#getAllPersonas', () => {
    it('should call messages api to get all personas created', async () => {
      const { client, mock } = createMock();

      const cursor =
        'QVFIUl96LThrbmJrU3gzOHdsR2JaZA2dDM01uaEJNaUZArWnNTNHBhQi1iZA3lvakk2YWlUR3F5bUV3UDJYZAWVxYnJyOFA1VnJwZAG9GUEVzOGRMZAzRsV08wdW1R';

      const replyWithCursor = {
        data: [
          {
            name: '7',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '1007240332817468',
          },
          {
            name: '6',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '243523459665626',
          },
          {
            name: '5',
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
          next:
            'https://graph.facebook.com/v3.0/138523840252451/personas?access_token=0987654321&limit=25&after=QVFIUl96LThrbmJrU3gzOHdsR2JaZA2dDM01uaEJNaUZArWnNTNHBhQi1iZA3lvakk2YWlUR3F5bUV3UDJYZAWVxYnJyOFA1VnJwZAG9GUEVzOGRMZAzRsV08wdW1R',
        },
      };

      const replyWithoutCursor = {
        data: [
          {
            name: '8',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '1007240332817468',
          },
          {
            name: '9',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '243523459665626',
          },
          {
            name: '10',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '313552169447330',
          },
        ],
      };

      mock
        .onGet(`/me/personas?access_token=${ACCESS_TOKEN}`)
        .replyOnce(200, replyWithCursor);

      mock
        .onGet(`/me/personas?access_token=${ACCESS_TOKEN}&after=${cursor}`)
        .replyOnce(200, replyWithoutCursor);

      const res = await client.getAllPersonas();

      expect(res).toEqual([
        {
          name: '7',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '1007240332817468',
        },
        {
          name: '6',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '243523459665626',
        },
        {
          name: '5',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '313552169447330',
        },
        {
          name: '8',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '1007240332817468',
        },
        {
          name: '9',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '243523459665626',
        },
        {
          name: '10',
          profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
          id: '313552169447330',
        },
      ]);
    });
  });

  describe('#getPersonas', () => {
    it('should call messages api to get personas with cursor', async () => {
      const { client, mock } = createMock();

      const reply = {
        data: [
          {
            name: '7',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '1007240332817468',
          },
          {
            name: '6',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '243523459665626',
          },
          {
            name: '5',
            profile_picture_url: 'https://i.imgur.com/zV6uy4T.jpg',
            id: '313552169447330',
          },
        ],
        paging: {
          cursors: {
            before:
              'QVFIUktTaXVuTUtsYUpVdFhlQjVhV2tRMU1jY0tRekU0d1NVTS1fZAGw4YmFYakU3ay1vRnlKbUh4VktROWxvazQzLXQzbm1YN0M3SHRKaVBGTTVCNFlyZAXBn',
            after:
              'QVFIUl96LThrbmJrU3gzOHdsR2JaZA2dDM01uaEJNaUZArWnNTNHBhQi1iZA3lvakk2YWlUR3F5bUV3UDJYZAWVxYnJyOFA1VnJwZAG9GUEVzOGRMZAzRsV08wdW1R',
          },
          next:
            'https://graph.facebook.com/v3.0/138523840252451/personas?access_token=0987654321&limit=25&after=QVFIUl96LThrbmJrU3gzOHdsR2JaZA2dDM01uaEJNaUZArWnNTNHBhQi1iZA3lvakk2YWlUR3F5bUV3UDJYZAWVxYnJyOFA1VnJwZAG9GUEVzOGRMZAzRsV08wdW1R',
        },
      };

      const cursor =
        'QVFIUmRJYXR4Y3dBN1JpcU5pU0lfLWhZAS0IzMjZADZAWxWYksxLWVHdW1HSnJmV21paEZA3NEl2RW5LY25fRFZAnZAkg2OVBJR0VLZAXIzeFRTZAGFrSldjMVRlV3Fn';

      mock
        .onGet(`/me/personas?access_token=${ACCESS_TOKEN}&after=${cursor}`)
        .reply(200, reply);

      const res = await client.getPersonas(cursor);

      expect(res).toEqual(reply);
    });
  });

  describe('#deletePersona', () => {
    it('should call messages api to delete persona', async () => {
      const { client, mock } = createMock();

      const personaId = '291604368115617';

      const reply = {
        success: true,
      };

      mock
        .onDelete(`/${personaId}?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.deletePersona(personaId);

      expect(res).toEqual(reply);
    });
  });
});
