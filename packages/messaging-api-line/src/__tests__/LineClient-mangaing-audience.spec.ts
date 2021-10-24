import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import Busboy from 'busboy';

import { LineClient } from '..';

import {
  constants,
  getCurrentContext,
  setupLineServer,
} from './testing-library';

type Form = Record<
  string,
  | string
  | {
      filename: string;
      mimetype: string;
      content: string;
    }
>;

setupLineServer();

it('should support #createUploadAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createUploadAudienceGroup({
    description: 'audienceGroupName_01',
    isIfaAudience: false,
    audiences: [
      {
        id: 'U4af4980627...',
      },
    ],
    uploadDescription: 'uploadDescription',
  });

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'UPLOAD',
    description: 'audienceGroupName_01',
    created: 1613698278,
    permission: 'READ_WRITE',
    expireTimestamp: 1629250278,
    isIfaAudience: false,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    isIfaAudience: false,
    audiences: [
      {
        id: 'U4af4980627...',
      },
    ],
    uploadDescription: 'uploadDescription',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createUploadAudienceGroup shorthand', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createUploadAudienceGroup(
    'audienceGroupName_01',
    false,
    [
      {
        id: 'U4af4980627...',
      },
    ],
    {
      uploadDescription: 'uploadDescription',
    }
  );

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'UPLOAD',
    description: 'audienceGroupName_01',
    created: 1613698278,
    permission: 'READ_WRITE',
    expireTimestamp: 1629250278,
    isIfaAudience: false,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    isIfaAudience: false,
    audiences: [
      {
        id: 'U4af4980627...',
      },
    ],
    uploadDescription: 'uploadDescription',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createUploadAudienceGroupByFile', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createUploadAudienceGroupByFile({
    description: 'audienceGroupName_01',
    isIfaAudience: false,
    uploadDescription: 'uploadDescription',
    file: fs.createReadStream(
      path.resolve(`${__dirname}/fixtures/audiences.txt`)
    ),
  });

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'UPLOAD',
    description: 'audienceGroupName_01',
    created: 1613698278,
    permission: 'READ_WRITE',
    expireTimestamp: 1629250278,
    isIfaAudience: false,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api-data.line.me/v2/bot/audienceGroup/upload/byFile'
  );

  const formdata = await new Promise<Form>((resolve) => {
    const busboy = new Busboy({
      headers: {
        'content-type': request?.headers.get('Content-Type') as string,
      },
    });

    const form: Form = {};

    busboy.on('file', (key, file, filename, _, mimetype) => {
      const chunks: Buffer[] = [];
      file.on('data', (data) => {
        chunks.push(data);
      });
      file.on('end', () => {
        form[key] = {
          filename,
          mimetype,
          content: Buffer.concat(chunks).toString(),
        };
      });
    });
    busboy.on('field', (key: string, value: string) => {
      form[key] = value;
    });
    busboy.on('finish', () => {
      resolve(form);
    });

    Readable.from(request?.body as string).pipe(busboy);
  });

  expect(formdata.description).toBe('audienceGroupName_01');
  expect(formdata.isIfaAudience).toBe('false');
  expect(formdata.uploadDescription).toBe('uploadDescription');
  expect(formdata.file).toEqual({
    filename: 'audiences.txt',
    mimetype: 'text/plain',
    content: `U4af4980627...\nU4af4980628...\nU4af4980629...\n`,
  });

  const boundary = request?.headers.get('content-type')?.split('boundary=')[1];

  expect(request?.headers.get('Content-Type')).toBe(
    `multipart/form-data; boundary=${boundary}`
  );
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #updateUploadAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.updateUploadAudienceGroup({
    audienceGroupId: constants.AUDIENCE_GROUP_ID,
    uploadDescription: 'uploadDescription',
    audiences: [
      {
        id: '1',
      },
    ],
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    audienceGroupId: 1234567890123,
    audiences: [
      {
        id: '1',
      },
    ],
    uploadDescription: 'uploadDescription',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #updateUploadAudienceGroup shorthand', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.updateUploadAudienceGroup(
    constants.AUDIENCE_GROUP_ID,
    [
      {
        id: '1',
      },
    ],
    {
      uploadDescription: 'uploadDescription',
    }
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/upload'
  );
  expect(request?.body).toEqual({
    audienceGroupId: 1234567890123,
    audiences: [
      {
        id: '1',
      },
    ],
    uploadDescription: 'uploadDescription',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #updateUploadAudienceGroupByFile', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.updateUploadAudienceGroupByFile({
    audienceGroupId: constants.AUDIENCE_GROUP_ID,
    uploadDescription: 'uploadDescription',
    file: fs.createReadStream(
      path.resolve(`${__dirname}/fixtures/audiences.txt`)
    ),
  });

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    'https://api-data.line.me/v2/bot/audienceGroup/upload/byFile'
  );

  const formdata = await new Promise<Form>((resolve) => {
    const busboy = new Busboy({
      headers: {
        'content-type': request?.headers.get('Content-Type') as string,
      },
    });

    const form: Form = {};

    busboy.on('file', (key, file, filename, _, mimetype) => {
      const chunks: Buffer[] = [];
      file.on('data', (data) => {
        chunks.push(data);
      });
      file.on('end', () => {
        form[key] = {
          filename,
          mimetype,
          content: Buffer.concat(chunks).toString(),
        };
      });
    });
    busboy.on('field', (key: string, value: string) => {
      form[key] = value;
    });
    busboy.on('finish', () => {
      resolve(form);
    });

    Readable.from(request?.body as string).pipe(busboy);
  });

  expect(formdata.audienceGroupId).toBe('1234567890123');
  expect(formdata.uploadDescription).toBe('uploadDescription');
  expect(formdata.file).toEqual({
    filename: 'audiences.txt',
    mimetype: 'text/plain',
    content: `U4af4980627...\nU4af4980628...\nU4af4980629...\n`,
  });

  const boundary = request?.headers.get('content-type')?.split('boundary=')[1];

  expect(request?.headers.get('Content-Type')).toBe(
    `multipart/form-data; boundary=${boundary}`
  );
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createClickAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createClickAudienceGroup({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
    clickUrl: 'https://developers.line.biz/',
  });

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'CLICK',
    description: 'audienceGroupName_01',
    created: 1613705240,
    permission: 'READ_WRITE',
    expireTimestamp: 1629257239,
    isIfaAudience: false,
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
    clickUrl: 'https://developers.line.biz/',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/click'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
    clickUrl: 'https://developers.line.biz/',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createClickAudienceGroup shorthand', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createClickAudienceGroup(
    'audienceGroupName_01',
    'bb9744f9-47fa-4a29-941e-1234567890ab',
    {
      clickUrl: 'https://developers.line.biz/',
    }
  );

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'CLICK',
    description: 'audienceGroupName_01',
    created: 1613705240,
    permission: 'READ_WRITE',
    expireTimestamp: 1629257239,
    isIfaAudience: false,
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
    clickUrl: 'https://developers.line.biz/',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/click'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
    clickUrl: 'https://developers.line.biz/',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createImpAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createImpAudienceGroup({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
  });

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'IMP',
    description: 'audienceGroupName_01',
    created: 1613707097,
    permission: 'READ_WRITE',
    expireTimestamp: 1629259095,
    isIfaAudience: false,
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/imp'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #createImpAudienceGroup shorthand', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.createImpAudienceGroup(
    'audienceGroupName_01',
    'bb9744f9-47fa-4a29-941e-1234567890ab'
  );

  expect(res).toEqual({
    audienceGroupId: 1234567890123,
    createRoute: 'MESSAGING_API',
    type: 'IMP',
    description: 'audienceGroupName_01',
    created: 1613707097,
    permission: 'READ_WRITE',
    expireTimestamp: 1629259095,
    isIfaAudience: false,
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('POST');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/imp'
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
    requestId: 'bb9744f9-47fa-4a29-941e-1234567890ab',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #setDescriptionAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.setDescriptionAudienceGroup(
    'audienceGroupName_01',
    constants.AUDIENCE_GROUP_ID
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${constants.AUDIENCE_GROUP_ID}/updateDescription`
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #setDescriptionAudienceGroup shorthand', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.setDescriptionAudienceGroup(
    'audienceGroupName_01',
    constants.AUDIENCE_GROUP_ID
  );

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${constants.AUDIENCE_GROUP_ID}/updateDescription`
  );
  expect(request?.body).toEqual({
    description: 'audienceGroupName_01',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it.todo(
  'should support PUT https://api.line.me/v2/bot/audienceGroup/{audienceGroupId}/activate'
);

it('should support #deleteAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.deleteAudienceGroup(constants.AUDIENCE_GROUP_ID);

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('DELETE');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${constants.AUDIENCE_GROUP_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getAudienceGroup', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAudienceGroup(constants.AUDIENCE_GROUP_ID);

  expect(res).toEqual({
    audienceGroup: {
      audienceGroupId: 1234567890123,
      createRoute: 'MESSAGING_API',
      type: 'UPLOAD',
      description: 'audienceGroupName_01',
      status: 'IN_PROGRESS',
      audienceCount: 0,
      created: 1634970179,
      permission: 'READ_WRITE',
      expireTimestamp: 1650522179,
      isIfaAudience: false,
    },
    jobs: [],
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/audienceGroup/${constants.AUDIENCE_GROUP_ID}`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getAudienceGroups', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAudienceGroups({
    page: 1,
    description: 'audienceGroupName_01',
    status: 'READY',
    size: 40,
    includesExternalPublicGroups: false,
    createRoute: 'MESSAGING_API',
  });

  expect(res).toEqual({
    audienceGroups: [
      {
        audienceGroupId: 1234567890123,
        type: 'CLICK',
        description: 'audienceGroupName_01',
        status: 'READY',
        audienceCount: 2,
        created: 1500351844,
        requestId: 'f70dd685-499a-4231-a441-f24b8d4fba21',
        clickUrl: 'https://developers.line.biz/',
      },
    ],
    hasNextPage: false,
    totalCount: 1,
    page: 1,
    size: 40,
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    `https://api.line.me/v2/bot/audienceGroup/list?page=1&description=audienceGroupName_01&status=READY&size=40&includesExternalPublicGroups=false&createRoute=MESSAGING_API`
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #getAudienceGroupAuthorityLevel', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.getAudienceGroupAuthorityLevel();

  expect(res).toEqual({
    authorityLevel: 'PUBLIC',
  });

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('GET');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
  );
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});

it('should support #changeAudienceGroupAuthorityLevel', async () => {
  const line = new LineClient({
    accessToken: constants.ACCESS_TOKEN,
    channelSecret: constants.CHANNEL_SECRET,
  });

  const res = await line.changeAudienceGroupAuthorityLevel('PUBLIC');

  expect(res).toEqual({});

  const { request } = getCurrentContext();

  expect(request).toBeDefined();
  expect(request?.method).toBe('PUT');
  expect(request?.url.href).toBe(
    'https://api.line.me/v2/bot/audienceGroup/authorityLevel'
  );
  expect(request?.body).toEqual({
    authorityLevel: 'PUBLIC',
  });
  expect(request?.headers.get('Content-Type')).toBe('application/json');
  expect(request?.headers.get('Authorization')).toBe('Bearer ACCESS_TOKEN');
});
