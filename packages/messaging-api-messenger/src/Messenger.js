import warning from 'warning';

import MessengerBatch from './MessengerBatch';

function createRequest(...args) {
  warning(
    false,
    '`Messenger.createRequest` will breaking and become part of message creation API in v0.7. For batch usage, use `MessengerBatch.createRequest` instead.'
  );
  return MessengerBatch.createRequest(...args);
}

function createMessage(...args) {
  warning(
    false,
    '`Messenger.createMessage` will breaking and become part of message creation API in v0.7. For batch usage, use `MessengerBatch.createMessage` instead.'
  );
  return MessengerBatch.createMessage(...args);
}

function createText(...args) {
  warning(
    false,
    '`Messenger.createText` will breaking and become part of message creation API in v0.7. For batch usage, use `MessengerBatch.createText` instead.'
  );
  return MessengerBatch.createText(...args);
}

const Messenger = {
  createRequest,
  createMessage,
  createText,
};

export default Messenger;
