import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import AxiosError from '../';

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

    expect(error.inspect()).toMatchSnapshot();
  }
});
