export type Attachment = {
  fallback: string,
  pretext?: string,
  color?: string,
  author_name?: string,
  author_link?: string,
  author_icon?: string,
  title?: string,
  title_link?: string,
  text?: string,
  fields?: Array<{
    title: string,
    value: string,
    short: boolean,
  }>,
  image_url?: string,
  thumb_url?: string,
  footer?: string,
  footer_icon?: string,
  ts?: number,
};

export type SendMessageSucessResponse = 'ok';
