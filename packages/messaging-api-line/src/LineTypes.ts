import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  channelSecret: string;
  origin?: string;
  dataOrigin?: string;
  onRequest?: OnRequestFunction;
};

export type User = {
  displayName: string;
  userId: string;
  language?: string;
  pictureUrl: string;
  statusMessage: string;
};

export type ImageMessage = {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
};

export type ImageMapArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageMapUriAction = {
  type: 'uri';
  label?: string;
  linkUri: string;
  area: ImageMapArea;
};

export type ImageMapMessageAction = {
  type: 'message';
  label?: string;
  text: string;
  area: ImageMapArea;
};

export type ImagemapMessage = {
  type: 'imagemap';
  baseUrl: string;
  altText: string;
  baseSize: {
    height: number;
    width: number;
  };
  video?: ImageMapVideo;
  actions: (ImageMapUriAction | ImageMapMessageAction)[];
};

export type VideoMessage = {
  type: 'video';
  originalContentUrl: string;
  previewImageUrl: string;
};

export type AudioMessage = {
  type: 'audio';
  originalContentUrl: string;
  duration: number;
};

export type Location = {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type LocationMessage = {
  type: 'location';
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type StickerMessage = {
  type: 'sticker';
  packageId: string;
  stickerId: string;
};

export type PostbackAction = {
  type: 'postback';
  label?: string;
  data: string;
  text?: string;
  displayText?: string;
};

export type MessageAction = {
  type: 'message';
  label?: string;
  text: string;
};

export type URIAction = {
  type: 'uri';
  label?: string;
  uri: string;
};

export type DatetimePickerAction = {
  type: 'datetimepicker';
  /**
   * Label for the action
   */
  label?: string;
  /**
   * String returned via webhook in the `postback.data` property of the postback event
   */
  data: 'string';
  /**
   * Action mode
   * - date: Pick date
   * - time: Pick time
   * - datetime: Pick date and time
   */
  mode: 'date' | 'time' | 'datetime';
  /**
   * Initial value of date or time
   */
  initial?: string;
  /**
   * Largest date or time value that can be selected. Must be greater than the `min` value.
   */
  max?: string;
  /**
   * Smallest date or time value that can be selected. Must be less than the `max` value.
   */
  min?: string;
};

export type CameraAction = {
  type: 'camera';
  label: string;
};

export type CameraRollAction = {
  type: 'cameraRoll';
  label: string;
};

export type LocationAction = {
  type: 'location';
  label: string;
};

export type Action =
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction;

export type QuickReplyAction =
  | PostbackAction
  | MessageAction
  | DatetimePickerAction
  | CameraAction
  | CameraRollAction
  | LocationAction;

export type QuickReply = {
  items: {
    type: 'action';
    imageUrl?: string;
    action: QuickReplyAction;
  }[];
};

/**
 * When sending a message from the LINE Official Account, you can specify the `sender.name` and the `sender.iconUrl` properties in Message objects.
 */
export type Sender = {
  /**
   * Display name. Certain words such as LINE may not be used.
   *
   * - Max character limit: 20
   */
  name?: string;

  /**
   * URL of the image to display as an icon when sending a message
   *
   * - Max character limit: 1000
   * - URL scheme: https
   */
  iconUrl?: string;
};

export type MessageOptions = {
  quickReply?: QuickReply;
  sender?: Sender;
};

export type TemplateMessage<Template> = {
  type: 'template';
  altText: string;
  template: Template;
};

export type ButtonsTemplate = {
  type: 'buttons';
  thumbnailImageUrl?: string;
  imageAspectRatio?: 'rectangle' | 'square';
  imageSize?: 'cover' | 'contain';
  imageBackgroundColor?: string;
  title?: string;
  text: string;
  defaultAction?: Action;
  actions: Action[];
};

export type ConfirmTemplate = {
  type: 'confirm';
  text: string;
  actions: Action[];
};

export type ColumnObject = {
  thumbnailImageUrl?: string;
  title?: string;
  text: string;
  defaultAction?: Action;
  actions: Action[];
};

export type CarouselTemplate = {
  type: 'carousel';
  columns: ColumnObject[];
  imageAspectRatio?: 'rectangle' | 'square';
  imageSize?: 'cover' | 'contain';
};

export type ImageCarouselColumnObject = {
  imageUrl: string;
  action: Action;
};

export type ImageCarouselTemplate = {
  type: 'image_carousel';
  columns: ImageCarouselColumnObject[];
};

export type Template =
  | ButtonsTemplate
  | ConfirmTemplate
  | CarouselTemplate
  | ImageCarouselTemplate;

/**
 * A container is the top-level structure of a Flex Message. Here are the types of containers available.
 *
 * - [Bubble](https://developers.line.biz/en/reference/messaging-api/#bubble)
 * - [Carousel](https://developers.line.biz/en/reference/messaging-api/#f-carousel)
 *
 * See [Flex Message elements](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/)
 * for the containers' JSON data samples and usage.
 */
export type FlexContainer = FlexBubble | FlexCarousel;

/**
 * This is a container that contains one message bubble. It can contain four
 * blocks: header, hero, body, and footer.
 *
 * For more information about using each block, see
 * [Block](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/#block).
 */
export type FlexBubble = {
  type: 'bubble';
  size?: 'nano' | 'micro' | 'kilo' | 'mega' | 'giga';
  /**
   * Text directionality and the order of components in horizontal boxes in the
   * container. Specify one of the following values:
   *
   * - `ltr`: Left to right
   * - `rtl`: Right to left
   *
   * The default value is `ltr`.
   */
  direction?: 'ltr' | 'rtl';
  header?: FlexBox<FlexBoxLayout>;
  hero?: FlexBox<FlexBoxLayout> | FlexImage;
  body?: FlexBox<FlexBoxLayout>;
  footer?: FlexBox<FlexBoxLayout>;
  styles?: FlexBubbleStyle;
  action?: Action;
};

export type FlexBubbleStyle = {
  header?: FlexBlockStyle;
  hero?: FlexBlockStyle;
  body?: FlexBlockStyle;
  footer?: FlexBlockStyle;
};

export type FlexBlockStyle = {
  /**
   * Background color of the block. Use a hexadecimal color code.
   */
  backgroundColor?: string;
  /**
   * - `true` to place a separator above the block.
   * - `true` will be ignored for the first block in a container because you
   *   cannot place a separator above the first block.
   * - The default value is `false`.
   */
  separator?: boolean;
  /**
   * Color of the separator. Use a hexadecimal color code.
   */
  separatorColor?: string;
};

export type FlexCarousel = {
  type: 'carousel';
  /**
   * (Max: 10 bubbles)
   */
  contents: FlexBubble[];
};

/**
 * Components are objects that compose a Flex Message container. Here are the
 * types of components available:
 *
 * - [Box](https://developers.line.biz/en/reference/messaging-api/#box)
 * - [Button](https://developers.line.biz/en/reference/messaging-api/#button)
 * - [Image](https://developers.line.biz/en/reference/messaging-api/#f-image)
 * - [Icon](https://developers.line.biz/en/reference/messaging-api/#icon)
 * - [Text](https://developers.line.biz/en/reference/messaging-api/#f-text)
 * - [Span](https://developers.line.biz/en/reference/messaging-api/#span)
 * - [Separator](https://developers.line.biz/en/reference/messaging-api/#separator)
 * - [Filler](https://developers.line.biz/en/reference/messaging-api/#filler)
 * - [Spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
 *
 * See the followings for the components' JSON data samples and usage.
 *
 * - [Flex Message elements](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/)
 * - [Flex Message layout](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/)
 */
export type FlexComponent =
  | FlexBox<FlexBoxLayout>
  | FlexButton
  | FlexImage
  | FlexIcon
  | FlexText
  | FlexSpan
  | FlexSeparator
  | FlexFiller
  | FlexSpacer;

export type FlexBoxLayout = 'horizontal' | 'vertical' | 'baseline';

/**
 * This is a component that defines the layout of child components.
 * You can also include a box in a box.
 */
export type FlexBox<L extends FlexBoxLayout> = {
  type: 'box';
  /**
   * The placement style of components in this box. Specify one of the following values:
   *
   * - `horizontal`: Components are placed horizontally. The `direction`
   *     property of the [bubble](https://developers.line.biz/en/reference/messaging-api/#bubble)
   *     container specifies the order.
   * - `vertical`: Components are placed vertically from top to bottom.
   * - `baseline`: Components are placed in the same way as `horizontal` is
   *     specified except the baselines of the components are aligned.
   *
   * For more information, see
   * [Types of box layouts](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-layout-types).
   */
  layout: L;
  /**
   * Components in this box. Here are the types of components available:
   *
   * - When the `layout` property is `horizontal` or `vertical`:
   *   + [Box](https://developers.line.biz/en/reference/messaging-api/#box)
   *   + [button](https://developers.line.biz/en/reference/messaging-api/#button)
   *   + [image](https://developers.line.biz/en/reference/messaging-api/#f-image)
   *   + [text](https://developers.line.biz/en/reference/messaging-api/#f-text)
   *   + [separator](https://developers.line.biz/en/reference/messaging-api/#separator)
   *   + [filler](https://developers.line.biz/en/reference/messaging-api/#filler)
   *   + [spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
   * - When the `layout` property is `baseline`:
   *   + [icon](https://developers.line.biz/en/reference/messaging-api/#icon)
   *   + [text](https://developers.line.biz/en/reference/messaging-api/#f-text)
   *   + [filler](https://developers.line.biz/en/reference/messaging-api/#filler)
   *   + [spacer (not recommended)](https://developers.line.biz/en/reference/messaging-api/#spacer)
   */
  contents: L extends 'baseline'
    ? (FlexIcon | FlexText | FlexFiller | FlexSpacer)[]
    : (
        | FlexBox<FlexBoxLayout>
        | FlexButton
        | FlexImage
        | FlexText
        | FlexSeparator
        | FlexFiller
        | FlexSpacer
      )[];
  /**
   * Background color of the block. In addition to the RGB color, an alpha
   * channel (transparency) can also be set. Use a hexadecimal color code.
   * (Example:#RRGGBBAA) The default value is `#00000000`.
   */
  backgroundColor?: string;
  /**
   * Color of box border. Use a hexadecimal color code.
   */
  borderColor?: string;
  /**
   * Width of box border. You can specify a value in pixels or any one of none,
   * light, normal, medium, semi-bold, or bold. none does not render a border
   * while the others become wider in the order of listing.
   */
  borderWidth?:
    | string
    | 'none'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semi-bold'
    | 'bold';
  /**
   * Radius at the time of rounding the corners of the border. You can specify a
   * value in pixels or any one of `none`, `xs`, `sm`, `md`, `lg`, `xl`, or `xxl`. none does not
   * round the corner while the others increase in radius in the order of listing. The default value is none.
   */
  cornerRadius?: string | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Width of the box. For more information, see [Width of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-width) in the API documentation.
   */
  width?: string;
  /**
   * Height of the box. For more information, see [Height of a box](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#box-height) in the API documentation.
   */
  height?: string;
  /**
   * The ratio of the width or height of this box within the parent box. The
   * default value for the horizontal parent box is `1`, and the default value
   * for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between components in this box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is `none`.
   * - To override this setting for a specific component, set the `margin`
   *   property of that component.
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Minimum space between this box and the previous component in the parent box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Free space between the borders of this box and the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingAll?: string;
  /**
   * Free space between the border at the upper end of this box and the upper end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingTop?: string;
  /**
   * Free space between the border at the lower end of this box and the lower end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingBottom?: string;
  /**
   * Free space between the border at the left end of this box and the left end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingStart?: string;
  /**
   * Free space between the border at the right end of this box and the right end of the child element.
   * For more information, see [Box padding](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#padding-property) in the API documentation.
   */
  paddingEnd?: string;
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
} & Offset;

export type Offset = {
  /**
   * Reference position for placing this box. Specify one of the following values:
   * - `relative`: Use the previous box as reference.
   * - `absolute`: Use the top left of parent element as reference.
   *
   * The default value is relative.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  position?: 'relative' | 'absolute';
  /**
   * The top offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetTop?: string;
  /**
   * The bottom offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetBottom?: string;
  /**
   * The left offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetStart?: string;
  /**
   * The right offset.
   * For more information, see [Offset](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-offset) in the API documentation.
   */
  offsetEnd?: string;
};

/**
 * This component draws a button.
 *
 * When the user taps a button, a specified action is performed.
 */
export type FlexButton = {
  type: 'button';
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action: Action;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Height of the button. The default value is `md`.
   */
  height?: 'sm' | 'md';
  /**
   * Style of the button. Specify one of the following values:
   *
   * - `link`: HTML link style
   * - `primary`: Style for dark color buttons
   * - `secondary`: Style for light color buttons
   *
   * The default value is `link`.
   */
  style?: 'link' | 'primary' | 'secondary';
  /**
   * Use a hexadecimal color code.
   *
   * - Character color when the `style` property is `link`.
   * - Background color when the `style` property is `primary` or `secondary`.
   */
  color?: string;
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity`
   * property will be ignored.
   */
  gravity?: string;
} & Offset;

/**
 * This is an invisible component to fill extra space between components.
 *
 * - The filler's `flex` property is fixed to 1.
 * - The `spacing` property of the parent box will be ignored for fillers.
 */
export type FlexFiller = {
  type: 'filler';
  /**
   * The ratio of the width or height of this component within the parent box. For more information, see [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
};

/**
 * This component draws an icon.
 */
export type FlexIcon = {
  type: 'icon';
  /**
   * Image URL
   *
   * Protocol: HTTPS
   * Image format: JPEG or PNG
   * Maximum image size: 240×240 pixels
   * Maximum data size: 1 MB
   */
  url: string;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Maximum size of the icon width.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl';
  /**
   * Aspect ratio of the icon. `{width}:{height}` format.
   * The values of `{width}` and `{height}` must be in the range 1–100000.
   * `{height}` can't be more than three times the value of `{width}`.
   * The default value is `1:1`.
   */
  aspectRatio?: string;
} & Offset;

/**
 * This component draws an image.
 */
export type FlexImage = {
  type: 'image';
  /**
   * Image URL
   *
   * - Protocol: HTTPS
   * - Image format: JPEG or PNG
   * - Maximum image size: 1024×1024 pixels
   * - Maximum data size: 1 MB
   */
  url: string;
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * - For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Horizontal alignment style. Specify one of the following values:
   *
   * - `start`: Left-aligned
   * - `end`: Right-aligned
   * - `center`: Center-aligned
   *
   * The default value is `center`.
   */
  align?: 'start' | 'end' | 'center';
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity` property will be ignored.
   */
  gravity?: 'top' | 'bottom' | 'center';
  /**
   * Maximum size of the image width.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
  /**
   * Aspect ratio of the image. `{width}:{height}` format.
   * Specify the value of `{width}` and `{height}` in the range from 1 to 100000. However,
   * you cannot set `{height}` to a value that is more than three times the value of `{width}`.
   * The default value is `1:1`.
   */
  aspectRatio?: string;
  /**
   * Style of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire drawing area. Parts of the image
   *   that do not fit in the drawing area are not displayed.
   * - `fit`: The entire image is displayed in the drawing area. The background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * The default value is `fit`.
   */
  aspectMode?: 'cover' | 'fit';
  /**
   * Background color of the image. Use a hexadecimal color code.
   */
  backgroundColor?: string;
  /**
   * Action performed when this button is tapped.
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
} & Offset;

/**
 * This component draws a separator between components in the parent box.
 */
export type FlexSeparator = {
  type: 'separator';
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Color of the separator. Use a hexadecimal color code.
   */
  color?: string;
};

/**
 * This is an invisible component that places a fixed-size space at the
 * beginning or end of the box.
 */
export type FlexSpacer = {
  type: 'spacer';
  /**
   * Size of the space.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

export type FlexText = {
  type: 'text';
  text: string;
  /**
   * Array of spans. Be sure to set either one of the `text` property or `contents` property. If you set the `contents` property, `text` is ignored.
   */
  contents?: FlexSpan[];
  /**
   * The ratio of the width or height of this box within the parent box.
   *
   * The default value for the horizontal parent box is `1`, and the default
   * value for the vertical parent box is `0`.
   *
   * For more information, see
   * [Width and height of components](https://developers.line.biz/en/docs/messaging-api/flex-message-layout/#component-width-and-height).
   */
  flex?: number;
  /**
   * Minimum space between this box and the previous component in the parent
   * box.
   *
   * - `none` does not set a space while the other values set a space whose
   *   size increases in the order of listing.
   * - The default value is the value of the `spacing` property of the parent
   *   box.
   * - If this box is the first component in the parent box, the `margin`
   *   property will be ignored.
   */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /**
   * Font size.
   * The size increases in the order of listing.
   * The default value is `md`.
   */
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl';
  /**
   * Horizontal alignment style. Specify one of the following values:
   *
   * - `start`: Left-aligned
   * - `end`: Right-aligned
   * - `center`: Center-aligned
   *
   * The default value is `start`.
   */
  align?: 'start' | 'end' | 'center';
  /**
   * Vertical alignment style. Specify one of the following values:
   *
   * - `top`: Top-aligned
   * - `bottom`: Bottom-aligned
   * - `center`: Center-aligned
   *
   * The default value is `top`.
   *
   * If the `layout` property of the parent box is `baseline`, the `gravity`
   * property will be ignored.
   */
  gravity?: 'top' | 'bottom' | 'center';
  /**
   * `true` to wrap text.
   *
   * The default value is `false`.
   *
   * If set to `true`, you can use a new line character (\n) to begin on a new
   * line.
   */
  wrap?: boolean;
  /**
   * Max number of lines. If the text does not fit in the specified number of
   * lines, an ellipsis (…) is displayed at the end of the last line. If set to
   * 0, all the text is displayed. The default value is 0.
   */
  maxLines?: number;
  /**
   * Font weight.
   * Specifying `bold`makes the font bold.
   * The default value is `regular`.
   */
  weight?: 'regular' | 'bold';
  /**
   * Font color. Use a hexadecimal color code.
   */
  color?: string;
  /**
   * Action performed when this text is tapped.
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   */
  action?: Action;
  /**
   * Style of the text. Specify one of the following values:
   * - `normal`: Normal
   * - `italic`: Italic
   *
   * The default value is `normal`.
   */
  style?: string;
  /**
   * Decoration of the text. Specify one of the following values:
   * `none`: No decoration
   * `underline`: Underline
   * `line-through`: Strikethrough
   *
   * The default value is `none`.
   */
  decoration?: string;
} & Offset;

/**
 * This component renders multiple text strings with different designs in one row. You can specify the color, size, weight, and decoration for the font. Span is set to `contents` property in [Text](https://developers.line.biz/en/reference/messaging-api/#f-text).
 */
export type FlexSpan = {
  type: 'span';
  /**
   * Text. If the `wrap` property of the parent text is set to `true`, you can use a new line character (`\n`) to begin on a new line.
   */
  text: string;
  /**
   * Font color. Use a hexadecimal color code.
   */
  color?: string;
  /**
   * Font size. You can specify one of the following values: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `3xl`, `4xl`, or `5xl`. The size increases in the order of listing. The default value is `md`.
   */
  size?: string;
  /**
   * Font weight. You can specify one of the following values: `regular` or `bold`. Specifying `bold` makes the font bold. The default value is `regular`.
   */
  weight?: string;
  /**
   * Style of the text. Specify one of the following values:
   * - `normal`: Normal
   * - `italic`: Italic
   *
   * The default value is `normal`.
   */
  style?: string;
  /**
   * Decoration of the text. Specify one of the following values:
   * `none`: No decoration
   * `underline`: Underline
   * `line-through`: Strikethrough
   *
   * The default value is `none`.
   *
   * Note: The decoration set in the `decoration` property of the [text](https://developers.line.biz/en/reference/messaging-api/#f-text) cannot be overwritten by the `decoration` property of the span.
   */
  decoration?: string;
};

export type FlexMessage = {
  type: 'flex';
  altText: string;
  contents: FlexContainer;
};

export type Message = (
  | TextMessage
  | ImageMessage
  | ImagemapMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | TemplateMessage<Template>
  | FlexMessage
) & {
  quickReply?: QuickReply;
  sender?: Sender;
};

type Area = {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action: {
    type: string;
    data: string;
  };
};

export type RichMenu = {
  size: {
    width: 2500;
    height: 1686 | 843;
  };
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: Area[];
};

export type LiffView = {
  type: 'compact' | 'tall' | 'full';
  url: string;
};

export type MutationSuccessResponse = {};

export type ImageMapVideo = {
  originalContentUrl: string;
  previewImageUrl: string;
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  externalLink: {
    linkUri: string;
    label: string;
  };
};

export type Emoji = {
  /**
   * Index position for a character in text, with the first character being at position 0.
   * The specified position must correspond to a $ character, which serves as a placeholder for the LINE emoji.
   * If you specify a position that doesn't contain a $ character, the API returns HTTP 400 Bad request.
   * See the text message example for details.
   */
  index: number;
  /**
   * Product ID for a set of LINE emoji. See LINE Available Emoji List: https://d.line-scdn.net/r/devcenter/sendable_line_emoji_list.pdf.
   */
  productId: string;
  /**
   * ID for a LINE emoji inside a set. See LINE Available Emoji List: https://d.line-scdn.net/r/devcenter/sendable_line_emoji_list.pdf.
   */
  emojiId: string;
};

export type TextMessage = {
  type: 'text';
  text: string;
  /**
   * One or more LINE emoji.
   * Max: 20 LINE emoji
   */
  emojis?: Emoji[];
};

export type NumberOfMessagesSentResponse = InsightStatisticsResponse & {
  /**
   * The number of messages sent with the Messaging API on the date specified in date.
   * The response has this property only when the value of status is `ready`.
   */
  success?: number;
};

export type TargetLimitForAdditionalMessages = {
  /**
   * One of the following values to indicate whether a target limit is set or not.
   *  - `none`: This indicates that a target limit is not set.
   *  - `limited`: This indicates that a target limit is set.
   */
  type: 'none' | 'limited';
  /**
   * The target limit for additional messages in the current month.
   * This property is returned when the `type` property has a value of `limited`.
   */
  value?: number;
};

export type NumberOfMessagesSentThisMonth = {
  /**
   * The number of sent messages in the current month
   */
  totalUsage: number;
};

export type InsightStatisticsResponse = {
  /**
   * Calculation status. One of:
   * - `ready`: Calculation has finished; the numbers are up-to-date.
   * - `unready`: We haven't finished calculating the number of sent messages for the specified `date`. Calculation usually takes about a day. Please try again later.
   * - `out_of_service`: The specified `date` is earlier than the date on which we first started calculating sent messages. Different APIs have different date. Check them at the [document](https://developers.line.biz/en/reference/messaging-api/).
   */
  status: 'ready' | 'unready' | 'out_of_service';
};

export type NumberOfMessageDeliveries = InsightStatisticsResponse & {
  /**
   * Number of push messages sent to **all** of this LINE official account's friends (broadcast messages).
   */
  broadcast: number;
  /**
   * Number of push messages sent to **some** of this LINE official account's friends, based on specific attributes (targeted/segmented messages).
   */
  targeting: number;
  /**
   * Number of auto-response messages sent.
   */
  autoResponse: number;
  /**
   * Number of greeting messages sent.
   */
  welcomeResponse: number;
  /**
   * Number of messages sent from LINE Official Account Manager [Chat screen](https://www.linebiz.com/jp-en/manual/OfficialAccountManager/chats/screens/).
   */
  chat: number;
  /**
   * Number of broadcast messages sent with the [Send broadcast message](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message) Messaging API operation.
   */
  apiBroadcast: number;
  /**
   * Number of push messages sent with the [Send push message](https://developers.line.biz/en/reference/messaging-api/#send-push-message) Messaging API operation.
   */
  apiPush: number;
  /**
   * Number of multicast messages sent with the [Send multicast message](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message) Messaging API operation.
   */
  apiMulticast: number;
  /**
   * Number of replies sent with the [Send reply message](https://developers.line.biz/en/reference/messaging-api/#send-reply-message) Messaging API operation.
   */
  apiReply: number;
};

export type NumberOfFollowers = InsightStatisticsResponse & {
  /**
   * The number of times, as of the specified `date`, that a user added this LINE official account as a friend. The number doesn't decrease when a user blocks the account after adding it, or when they delete their own account.
   */
  followers: number;
  /**
   * The number of users, as of the specified `date`, that the official account can reach with messages targeted by gender, age, or area. This number includes users for whom we estimated demographic attributes based on their activity in LINE and LINE-connected services.
   */
  targetedReaches: number;
  /**
   * The number of users blocking the account as of the specified `date`. The number decreases when a user unblocks the account.
   */
  blocks: number;
};

export type NumberOfMessageDeliveriesResponse =
  | InsightStatisticsResponse
  | NumberOfMessageDeliveries;

export type NumberOfFollowersResponse =
  | InsightStatisticsResponse
  | NumberOfFollowers;

type PercentageAble = {
  percentage: number;
};

export type FriendDemographics = {
  /**
   * `true` if friend demographic information is available.
   */
  available: boolean;
  /**
   * Percentage per gender
   */
  genders?: Array<
    {
      /**
       * Gender
       */
      gender: 'unknown' | 'male' | 'female';
    } & PercentageAble
  >;
  /**
   * Percentage per age group
   */
  ages?: Array<
    {
      /**
       * Age group
       */
      age: string;
    } & PercentageAble
  >;
  /**
   * Percentage per area
   */
  areas?: Array<
    {
      area: string;
    } & PercentageAble
  >;
  /**
   * Percentage by OS
   */
  appTypes?: Array<
    {
      appType: 'ios' | 'android' | 'others';
    } & PercentageAble
  >;
  /**
   * Percentage per friendship duration
   */
  subscriptionPeriods?: Array<
    {
      /**
       * Friendship duration
       */
      subscriptionPeriod:
        | 'over365days'
        | 'within365days'
        | 'within180days'
        | 'within90days'
        | 'within30days'
        | 'within7days'
        // in case for some rare cases(almost no)
        | 'unknown';
    } & PercentageAble
  >;
};

/* LINE Pay */
export type LinePayConfig = {
  channelId: string;
  channelSecret: string;
  sandbox?: boolean;
  origin?: string;
};

export type LinePayCurrency = 'USD' | 'JPY' | 'TWD' | 'THB';

/* Narrowcast */

export type NarrowcastOptions = {
  recipient?: RecipientObject;
  demographic?: DemographicFilterObject;
  max?: number;
};

// reference: https://github.com/line/line-bot-sdk-nodejs/pull/193/files
export type FilterOperatorObject<T> = {
  type: 'operator';
} & (
  | {
      and: T | (T | FilterOperatorObject<T>)[];
    }
  | {
      or: T | (T | FilterOperatorObject<T>)[];
    }
  | {
      not: T | (T | FilterOperatorObject<T>)[];
    }
);

export type AudienceObject = {
  type: 'audience';
  audienceGroupId: number;
};

export type RecipientObject =
  | AudienceObject
  | FilterOperatorObject<AudienceObject>;

export type DemographicAge =
  | 'age_15'
  | 'age_20'
  | 'age_25'
  | 'age_30'
  | 'age_35'
  | 'age_40'
  | 'age_45'
  | 'age_50';

export type DemographicSubscriptionPeriod =
  | 'day_7'
  | 'day_30'
  | 'day_90'
  | 'day_180'
  | 'day_365';

export type DemographicArea =
  | 'jp_01'
  | 'jp_02'
  | 'jp_03'
  | 'jp_04'
  | 'jp_05'
  | 'jp_06'
  | 'jp_07'
  | 'jp_08'
  | 'jp_09'
  | 'jp_10'
  | 'jp_11'
  | 'jp_12'
  | 'jp_13'
  | 'jp_14'
  | 'jp_15'
  | 'jp_16'
  | 'jp_17'
  | 'jp_18'
  | 'jp_19'
  | 'jp_20'
  | 'jp_21'
  | 'jp_22'
  | 'jp_23'
  | 'jp_24'
  | 'jp_25'
  | 'jp_26'
  | 'jp_27'
  | 'jp_28'
  | 'jp_29'
  | 'jp_30'
  | 'jp_31'
  | 'jp_32'
  | 'jp_33'
  | 'jp_34'
  | 'jp_35'
  | 'jp_36'
  | 'jp_37'
  | 'jp_38'
  | 'jp_39'
  | 'jp_40'
  | 'jp_41'
  | 'jp_42'
  | 'jp_43'
  | 'jp_44'
  | 'jp_45'
  | 'jp_46'
  | 'jp_47'
  | 'tw_01'
  | 'tw_02'
  | 'tw_03'
  | 'tw_04'
  | 'tw_05'
  | 'tw_06'
  | 'tw_07'
  | 'tw_08'
  | 'tw_09'
  | 'tw_10'
  | 'tw_11'
  | 'tw_12'
  | 'tw_13'
  | 'tw_14'
  | 'tw_15'
  | 'tw_16'
  | 'tw_17'
  | 'tw_18'
  | 'tw_19'
  | 'tw_20'
  | 'tw_21'
  | 'tw_22'
  | 'th_01'
  | 'th_02'
  | 'th_03'
  | 'th_04'
  | 'th_05'
  | 'th_06'
  | 'th_07'
  | 'th_08'
  | 'id_01'
  | 'id_02'
  | 'id_03'
  | 'id_04'
  | 'id_06'
  | 'id_07'
  | 'id_08'
  | 'id_09'
  | 'id_10'
  | 'id_11'
  | 'id_12'
  | 'id_05';

export type DemographicObject =
  | {
      type: 'gender';
      oneOf: ('male' | 'female')[];
    }
  | ({
      type: 'age';
    } & (
      | {
          gte: DemographicAge;
        }
      | {
          lt: DemographicAge;
        }
    ))
  | {
      type: 'appType';
      oneOf: ('ios' | 'android')[];
    }
  | {
      type: 'area';
      oneOf: DemographicArea[];
    }
  | ({
      type: 'subscriptionPeriod';
    } & (
      | {
          gte: DemographicSubscriptionPeriod;
        }
      | {
          lt: DemographicSubscriptionPeriod;
        }
    ));

export type DemographicFilterObject =
  | DemographicObject
  | FilterOperatorObject<DemographicObject>;

export type NarrowcastProgressResponse = (
  | {
      phase: 'waiting';
    }
  | ((
      | {
          phase: 'sending' | 'succeeded';
        }
      | {
          phase: 'failed';
          failedDescription: string;
        }
    ) & {
      successCount: number;
      failureCount: number;
      targetCount: string;
    })
) & {
  errorCode?: 1 | 2;
};

/* Audience */

export type CreateUploadAudienceGroupOptions = {
  uploadDescription?: string;
};

export type UpdateUploadAudienceGroupOptions = CreateUploadAudienceGroupOptions & {
  description?: string;
};

export type CreateClickAudienceGroupOptions = {
  clickUrl?: string;
};

export type Audience = {
  id: string;
};

export type BasicAudienceGroup = {
  /** The audience ID. */
  audienceGroupId: number;

  /** The audience's name. */
  description: string;

  /** When the audience was created (in UNIX time). */
  created: number;

  /**
   * The value specified when creating an audience for uploading user IDs to indicate the type of accounts that will be given as recipients. One of:
   * - true: Accounts are specified with IFAs.
   * - false (default): Accounts are specified with user IDs.
   */
  isIfaAudience: string;

  /**
   * Audience's update permission. Audiences linked to the same channel will be READ_WRITE.
   * - READ: Can use only.
   * - READ_WRITE: Can use and update.
   */
  permission: 'READ' | 'READ_WRITE';

  /** How the audience was created. If omitted, all audiences are included. */
  createRoute: 'OA_MANAGER' | 'MESSAGING_API';
};

export type UploadAudienceGroup = BasicAudienceGroup & {
  type: 'UPLOAD';
};

export type ImpAudienceGroup = BasicAudienceGroup & {
  type: 'IMP';

  // The request ID that was specified when the audience was created.
  requestId: string;
};

export type ClickAudienceGroup = BasicAudienceGroup & {
  type: 'CLICK';

  /** The request ID that was specified when the audience was created. */
  requestId: string;

  /** The URL that was specified when the audience was created. */
  clickUrl?: string;
};

export type AudienceGroup = (
  | UploadAudienceGroup
  | ImpAudienceGroup
  | ClickAudienceGroup
) & {
  audienceCount: number;
} & (
    | {
        status: 'IN_PROGRESS' | 'READY' | 'EXPIRED';
      }
    | {
        status: 'FAILED';
        failedType: 'AUDIENCE_GROUP_AUDIENCE_INSUFFICIENT' | 'INTERNAL_ERROR';
      }
  );

export type AudienceGroups = {
  /** An array of audience data. */
  audienceGroups: AudienceGroup[];

  /** true when this is not the last page. */
  hasNextPage: boolean;

  /** The total number of audiences that can be returned with the specified filter. */
  totalCount: number;

  /** Of the audiences you can get with the specified condition, the number of audiences with the update permission set to READ_WRITE. */
  readWriteAudienceGroupTotalCount: number;

  /** The current page number. */
  page: number;

  /** The number of audiences on the current page. */
  size: number;
};

export type Job = {
  /** A job ID. */
  audienceGroupJobId: number;

  /** An audience ID. */
  audienceGroupId: number;

  /** The job's description. */
  description: string;

  /**
   * The job's type. One of:
   * - DIFF_ADD: Indicates that a user ID or IFA was added via the Messaging API.
   */
  type: 'DIFF_ADD';

  /** The number of accounts (recipients) that were added or removed. */
  audienceCount: number;

  /** When the job was created (in UNIX time). */
  created: number;
} & (
  | {
      /** The job's status. */
      jobStatus: 'QUEUED' | 'WORKING' | 'FINISHED';
    }
  | {
      /** The job's status. */
      jobStatus: 'FAILED';

      /** The reason why the operation failed. This is only included when jobs[].jobStatus is */
      failedType: 'INTERNAL_ERROR';
    }
);

export type AudienceGroupWithJob = AudienceGroup & {
  /** An array of jobs. This array is used to keep track of each attempt to add new user IDs or IFAs to an audience for uploading user IDs. null is returned for any other type of audience. */
  jobs: Job[];
};

export type GetAudienceGroupsOptions = {
  page?: number;
  description?: string;
  status?: string;
  size?: number;
};

export type AudienceGroupAuthorityLevel = {
  authorityLevel: 'PUBLIC' | 'PRIVATE';
};

/**
 * LINE Notify Config
 */
export type LineNotifyConfig = {
  /**
   * LINE Notify Service Client ID
   */
  clientId: string;

  /**
   * LINE Notify Service Client Secret
   */
  clientSecret: string;

  /**
   * LINE Notify Service Callback URL
   */
  redirectUri: string;

  /**
   * LINE Notify Authentication URL origin
   */
  origin?: string;

  /**
   * LINE Notify Notification URL origin
   */
  apiOrigin?: string;
};

export type LineNotifyOptions = {
  /**
   * Maximum size of 240×240px JPEG
   */
  imageThumbnail?: string;

  /**
   * Maximum size of 2048×2048px JPEG
   */
  imageFullsize?: string;

  /**
   * Package ID.
   */
  stickerPackageId?: number;

  /**
   * 	Sticker ID.
   */
  stickerId?: number;

  /**
   * - true: The user doesn't receive a push notification when the message is sent.
   * - false: The user receives a push notification when the message is sent (unless they have disabled push notification in LINE and/or their device).
   *
   * If omitted, the value defaults to false.
   */
  notificationDisabled?: boolean;
};
