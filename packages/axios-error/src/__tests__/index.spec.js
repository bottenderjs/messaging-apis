import util from 'util';

import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import AxiosError from '..';

const mock = new MockAdapter(axios);

mock.onAny().reply(400, {
  error_status: 'boom....',
});

const stack = `Error: boom....
  at Object.<anonymous> (/Users/xxx/messaging-apis/packages/axios-error/src/__tests__/index.spec.js:16:19)
  at Generator.throw (<anonymous>)
  at step (/Users/xxx/messaging-apis/packages/axios-error/src/__tests__/index.spec.js:4:336)
  at /Users/xxx/messaging-apis/packages/axios-error/src/__tests__/index.spec.js:4:535
  at <anonymous>
`;

it('should work', async () => {
  try {
    await axios.post('/', { x: 1 });
  } catch (err) {
    // overwrite because axios-mock-adapter set it to undefined
    err.response.statusText = 'Bad Request';

    const error = new AxiosError(err.response.data.error_status, err);

    // overwrite stack to test it
    error.stack = stack;

    expect(error[util.inspect.custom]()).toMatchSnapshot();
  }
});

it('should set `.status` property', async () => {
  try {
    await axios.post('/', { x: 1 });
  } catch (err) {
    // overwrite because axios-mock-adapter set it to undefined
    err.response.statusText = 'Bad Request';

    const error = new AxiosError(err);

    expect(error.status).toBe(400);
  }
});

it('should work with construct using error instance only', async () => {
  try {
    await axios.post('/', { x: 1 });
  } catch (err) {
    // overwrite because axios-mock-adapter set it to undefined
    err.response.statusText = 'Bad Request';

    const error = new AxiosError(err);

    // overwrite stack to test it
    error.stack = stack;

    expect(error[util.inspect.custom]()).toMatchSnapshot();
  }
});

it('should work with undefined response', async () => {
  try {
    await axios.post('/', { x: 1 });
  } catch (err) {
    // overwrite to undefined
    // https://github.com/Yoctol/bottender/issues/246
    err.response = undefined;

    const error = new AxiosError('read ECONNRESET', err);

    // overwrite stack to test it
    error.stack = stack;

    expect(error[util.inspect.custom]()).toMatchSnapshot();
  }
});

it('should support error without axios data', () => {
  const error = new AxiosError('custom error');
  error.stack = stack;

  expect(error[util.inspect.custom]()).toMatchSnapshot();
});
