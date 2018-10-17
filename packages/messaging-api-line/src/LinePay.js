/* @flow */
import AxiosError from 'axios-error';
import axios from 'axios';
import invariant from 'invariant';

type Axios = {
  get: Function,
  post: Function,
  put: Function,
  path: Function,
  delete: Function,
};

type LinePayConfig = {
  channelId: string,
  channelSecret: string,
  sandbox: boolean,
  origin?: string,
};

function handleError(err) {
  if (err.response && err.response.data) {
    const { returnCode, returnMessage } = err.response.data;
    const msg = `LINE API - ${returnCode} ${returnMessage}`;
    throw new AxiosError(msg, err);
  }
  throw new AxiosError(err.message, err);
}

export default class LinePay {
  static connect(config: LinePayConfig): LinePay {
    return new LinePay(config);
  }

  _axios: Axios;

  constructor({
    channelId,
    channelSecret,
    sandbox = false,
    origin,
  }: LinePayConfig) {
    const linePayOrigin = sandbox
      ? 'https://sandbox-api-pay.line.me'
      : 'https://api-pay.line.me';

    this._axios = axios.create({
      baseURL: `${origin || linePayOrigin}/v2/`,
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': channelId,
        'X-LINE-ChannelSecret': channelSecret,
      },
    });
  }

  get axios(): Axios {
    return this._axios;
  }

  getPayments({
    transactionId,
    orderId,
  }: {
    transactionId: string,
    orderId: string,
  } = {}) {
    invariant(
      transactionId || orderId,
      'getPayments: One of `transactionId` or `orderId` must be provided'
    );

    let qs = '';

    if (transactionId) {
      qs += `transactionId=${transactionId}`;
    }

    if (orderId) {
      qs += `${qs ? '&' : ''}orderId=${orderId}`;
    }

    return this._axios
      .get(`/payments?${qs}`)
      .then(res => res.data, handleError);
  }

  getAuthorizations({
    transactionId,
    orderId,
  }: {
    transactionId: string,
    orderId: string,
  } = {}) {
    invariant(
      transactionId || orderId,
      'getAuthorizations: One of `transactionId` or `orderId` must be provided'
    );

    let qs = '';

    if (transactionId) {
      qs += `transactionId=${transactionId}`;
    }

    if (orderId) {
      qs += `${qs ? '&' : ''}orderId=${orderId}`;
    }

    return this._axios
      .get(`/payments/authorizations?${qs}`)
      .then(res => res.data, handleError);
  }

  reserve({
    productName,
    amount,
    currency,
    confirmUrl,
    orderId,
    ...options
  }: {
    // FIXME
  }) {
    return this._axios
      .post('/payments/request', {
        productName,
        amount,
        currency,
        confirmUrl,
        orderId,
        ...options,
      })
      .then(res => res.data, handleError);
  }

  confirm(
    transactionId: string,
    { amount, currency }: { amount: number, currency: string }
  ) {
    return this._axios
      .post(`/payments/${transactionId}/confirm`, {
        amount,
        currency,
      })
      .then(res => res.data, handleError);
  }

  capture(
    transactionId: string,
    { amount, currency }: { amount: number, currency: string }
  ) {
    return this._axios
      .post(`/payments/authorizations/${transactionId}/capture`, {
        amount,
        currency,
      })
      .then(res => res.data, handleError);
  }

  void(transactionId: string) {
    return this._axios
      .post(`/payments/authorizations/${transactionId}/void`)
      .then(res => res.data, handleError);
  }

  refund(transactionId: string, options?: { refundAmount?: number } = {}) {
    return this._axios
      .post(`/payments/${transactionId}/refund`, options)
      .then(res => res.data, handleError);
  }
}
