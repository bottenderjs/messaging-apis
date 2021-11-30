import { rest } from 'msw';

export const requestHandlers = [
  rest.get(
    'https://graph.facebook.com/:version/me/messenger_profile',
    (req, res, ctx) => {
      if (req.url.searchParams.get('fields') === 'get_started') {
        return res(
          ctx.json({
            data: [
              {
                get_started: {
                  payload: 'GET_STARTED',
                },
              },
            ],
          })
        );
      }

      if (req.url.searchParams.get('fields') === 'persistent_menu') {
        return res(
          ctx.json({
            data: [
              {
                persistent_menu: [
                  {
                    locale: 'default',
                    composer_input_disabled: true,
                    call_to_actions: [
                      {
                        type: 'postback',
                        title: 'Restart Conversation',
                        payload: 'RESTART',
                      },
                      {
                        type: 'web_url',
                        title: 'Powered by ALOHA.AI, Yoctol',
                        url: 'https://www.yoctol.com/',
                      },
                    ],
                  },
                ],
              },
            ],
          })
        );
      }

      if (req.url.searchParams.get('fields') === 'greeting') {
        return res(
          ctx.json({
            data: [
              {
                greeting: [
                  {
                    locale: 'default',
                    text: 'Hello!',
                  },
                ],
              },
            ],
          })
        );
      }

      if (req.url.searchParams.get('fields') === 'ice_breakers') {
        return res(
          ctx.json({
            data: [
              {
                ice_breakers: [
                  {
                    question: 'Where are you located?',
                    payload: 'LOCATION_POSTBACK_PAYLOAD',
                  },
                  {
                    question: 'What are your hours?',
                    payload: 'HOURS_POSTBACK_PAYLOAD',
                  },
                ],
              },
            ],
          })
        );
      }

      if (req.url.searchParams.get('fields') === 'whitelisted_domains') {
        return res(
          ctx.json({
            data: [
              {
                whitelisted_domains: ['http://www.yoctol.com/'],
              },
            ],
          })
        );
      }

      if (req.url.searchParams.get('fields') === 'account_linking_url') {
        return res(
          ctx.json({
            data: [
              {
                account_linking_url:
                  'https://www.example.com/oauth?response_type=code&client_id=1234567890&scope=basic',
              },
            ],
          })
        );
      }

      return res(
        ctx.json({
          data: [
            {
              get_started: {
                payload: 'GET_STARTED',
              },
            },
            {
              persistent_menu: [
                {
                  locale: 'default',
                  composer_input_disabled: true,
                  call_to_actions: [
                    {
                      type: 'postback',
                      title: 'Restart Conversation',
                      payload: 'RESTART',
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
    }
  ),
  rest.post(
    'https://graph.facebook.com/:version/me/messenger_profile',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          result: 'success',
        })
      );
    }
  ),
  rest.delete(
    'https://graph.facebook.com/:version/me/messenger_profile',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          result: 'success',
        })
      );
    }
  ),
  rest.get(
    'https://graph.facebook.com/:version/me/custom_user_settings',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              user_level_persistent_menu: [
                {
                  locale: 'default',
                  composer_input_disabled: true,
                  call_to_actions: [
                    {
                      type: 'postback',
                      title: 'Restart Conversation',
                      payload: 'RESTART',
                    },
                    {
                      type: 'web_url',
                      title: 'Powered by ALOHA.AI, Yoctol',
                      url: 'https://www.yoctol.com/',
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
    }
  ),
  rest.post(
    'https://graph.facebook.com/:version/me/custom_user_settings',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          result: 'success',
        })
      );
    }
  ),
  rest.delete(
    'https://graph.facebook.com/:version/me/custom_user_settings',
    (_req, res, ctx) => {
      return res(
        ctx.json({
          result: 'success',
        })
      );
    }
  ),
];
