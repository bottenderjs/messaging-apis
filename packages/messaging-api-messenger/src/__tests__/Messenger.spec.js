import Messenger from '../Messenger';

const RECIPIENT_ID = '1QAZ2WSX';

describe('createRequest', () => {
  it('should create send text request', () => {
    expect(
      Messenger.createRequest({
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      })
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});

describe('createMessage', () => {
  it('should create send text request', () => {
    expect(Messenger.createMessage(RECIPIENT_ID, { text: 'Hello' })).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('should create send text with RESPONSE type', () => {
    expect(
      Messenger.createMessage(
        RECIPIENT_ID,
        { text: 'Hello' },
        { messaging_type: 'RESPONSE' }
      )
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'RESPONSE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });

  it('can create request with phone_number', () => {
    expect(
      Messenger.createMessage(
        {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
        { text: 'Hello' }
      )
    ).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          phone_number: '+1(212)555-2368',
          name: { first_name: 'John', last_name: 'Doe' },
        },
      },
    });
  });
});

describe('createText', () => {
  it('should create send text request', () => {
    expect(Messenger.createText(RECIPIENT_ID, 'Hello')).toEqual({
      method: 'POST',
      relative_url: 'me/messages',
      body: {
        messaging_type: 'UPDATE',
        message: {
          text: 'Hello',
        },
        recipient: {
          id: RECIPIENT_ID,
        },
      },
    });
  });
});
