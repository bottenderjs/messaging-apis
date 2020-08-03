import nock from 'nock';

import FacebookUserClient from '../FacebookUserClient';

function setup() {
  const client = new FacebookUserClient({});

  return {
    client,
  };
}

describe('#getUserInfo', () => {
  it('should work', async () => {
    const { client } = setup();

    const res = await client.getUserInfo();

    expect(res).toEqual({});
  });
});

describe('#getPermissions', () => {
  it('should work', async () => {
    const { client } = setup();

    const res = await client.getPermissions();

    expect(res).toEqual({});
  });
});

describe('#getUserAccounts', () => {
  it('should work', async () => {
    const { client } = setup();

    const res = await client.getUserAccounts();

    expect(res).toEqual({});
  });
});

describe('#getPage', () => {
  it('should work', async () => {
    const { client } = setup();
  });
});
