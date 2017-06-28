export type SendMessageSucessResponse =
  | 'ok'
  | {
      ok: boolean,
      channel?: string,
      message?: {},
    };
