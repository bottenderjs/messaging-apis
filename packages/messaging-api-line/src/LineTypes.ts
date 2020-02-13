import { OnRequestFunction } from 'messaging-api-common';

export type ClientConfig = {
  accessToken: string;
  channelSecret: string;
  origin?: string;
  onRequest?: OnRequestFunction;
};

export type User = {
  displayName: string;
  userId: string;
  pictureUrl: string;
  statusMessage: string;
};

/**
 * For being compatible with line-bot-sdk-nodejs
 */
export type Profile = User;

/**
 * JSON object which contains the contents of the message you send.
 *
 * @see [Message objects](https://developers.line.biz/en/reference/messaging-api/#message-objects)
 */
export type Message =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | ImagemapMessage
  | TemplateMessage
  | FlexMessage;

/**
 * @see [Common properties for messages](https://developers.line.biz/en/reference/messaging-api/#common-properties-for-messages)
 */
export type MessageCommon = {
  /**
   * For the quick reply feature.
   * For more information, see [Using quick replies](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/).
   *
   * If the user receives multiple
   * [message objects](https://developers.line.biz/en/reference/messaging-api/#message-objects),
   * the quickReply property of the last message object is displayed.
   */
  quickReply?: QuickReply;
};

/**
 * @see [Text message](https://developers.line.biz/en/reference/messaging-api/#text-message)
 */
export type TextMessage = MessageCommon & {
  type: 'text';
  /**
   * Message text. You can include the following emoji:
   *
   * - Unicode emoji
   * - LINE original emoji
   *   ([Unicode codepoint table for LINE original emoji](https://developers.line.biz/media/messaging-api/emoji-list.pdf))
   *
   * Max: 2000 characters
   */
  text: string;
};

/**
 * Input image
 */
export type Image = {
  /**
   * Image URL (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 1024 x 1024
   * - Max: 1 MB
   */
  originalContentUrl: string;
  /**
   * Preview image URL (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Image message](https://developers.line.biz/en/reference/messaging-api/#image-message)
 */
export type ImageMessage = MessageCommon & { type: 'image' } & Image;

/**
 * Input video
 */
export type Video = {
  /**
   * URL of video file (Max: 1000 characters)
   *
   * - **HTTPS**
   * - mp4
   * - Max: 1 minute
   * - Max: 10 MB
   *
   * A very wide or tall video may be cropped when played in some environments.
   */
  originalContentUrl: string;
  /**
   * URL of preview image (Max: 1000 characters)
   *
   * - **HTTPS**
   * - JPEG
   * - Max: 240 x 240
   * - Max: 1 MB
   */
  previewImageUrl: string;
};

/**
 * @see [Video message](https://developers.line.biz/en/reference/messaging-api/#video-message)
 */
export type VideoMessage = MessageCommon & { type: 'video' } & Video;

/**
 * Input audio
 */
export type Audio = {
  /**
   * URL of audio file (Max: 1000 characters)
   *
   * - **HTTPS**
   * - m4a
   * - Max: 1 minute
   * - Max: 10 MB
   */
  originalContentUrl: string;
  /**
   * Length of audio file (milliseconds)
   */
  duration: number;
};

/**
 * @see [Audio message](https://developers.line.biz/en/reference/messaging-api/#audio-message)
 */
export type AudioMessage = MessageCommon & { type: 'audio' } & Audio;

/**
 * Input location.
 */
export type Location = {
  /**
   * Title (Max: 100 characters)
   */
  title: string;
  /**
   * Address (Max: 100 characters)
   */
  address: string;
  latitude: number;
  longitude: number;
};

/**
 * @see [Location message](https://developers.line.biz/en/reference/messaging-api/#location-message)
 */
export type LocationMessage = MessageCommon & { type: 'location' } & Location;

/**
 * Input sticker
 */
export type Sticker = {
  /**
   * Package ID for a set of stickers.
   * For information on package IDs, see the
   * [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   */
  packageId: string;
  /**
   * Sticker ID.
   * For a list of sticker IDs for stickers that can be sent with the Messaging
   * API, see the
   * [Sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
   */
  stickerId: string;
};

/**
 * @see [Sticker message](https://developers.line.biz/en/reference/messaging-api/#sticker-message)
 */
export type StickerMessage = MessageCommon & { type: 'sticker' } & Sticker;

/**
 * @see [Imagemap message](https://developers.line.biz/en/reference/messaging-api/#imagemap-message)
 */
export type ImagemapMessage = MessageCommon & {
  type: 'imagemap';
  /**
   * [Base URL](https://developers.line.biz/en/reference/messaging-api/#base-url) of image
   * (Max: 1000 characters, **HTTPS**)
   */
  baseUrl: string;
  /**
   * Alternative text (Max: 400 characters)
   */
  altText: string;
  baseSize: Size;
  /**
   * Video to play inside a image map messages
   */
  video?: {
    /**
     * URL of video file (Max: 1000 characters)
     *
     * - **HTTPS**
     * - mp4
     * - Max: 1 minute
     * - Max: 10 MB
     *
     * A very wide or tall video may be cropped when played in some environments.
     */
    originalContentUrl: string;
    /**
     * URL of preview image (Max: 1000 characters)
     *
     * - **HTTPS**
     * - JPEG
     * - Max: 240 x 240
     * - Max: 1 MB
     */
    previewImageUrl: string;
    area: Area;
    /**
     * External link to be displayed after a video is played
     * This property is required if you set a video to play and a label to display after the video on the imagemap
     */
    externalLink?: {
      linkUri: string;
      label: string;
    };
  };
  /**
   * Action when tapped (Max: 50)
   */
  actions: ImageMapAction[];
};

/**
 * Template messages are messages with predefined layouts which you can
 * customize. For more information, see
 * [template messages](https://developers.line.biz/en/docs/messaging-api/message-types/#template-messages).
 *
 * The following template types are available:
 *
 * - [Buttons](https://developers.line.biz/en/reference/messaging-api/#buttons)
 * - [Confirm](https://developers.line.biz/en/reference/messaging-api/#confirm)
 * - [Carousel](https://developers.line.biz/en/reference/messaging-api/#carousel)
 * - [Image carousel](https://developers.line.biz/en/reference/messaging-api/#image-carousel)
 *
 * @see [Template messages](https://developers.line.biz/en/reference/messaging-api/#template-messages)
 */
export type TemplateMessage = MessageCommon & {
  type: 'template';
  /**
   * Alternative text (Max: 400 characters)
   */
  altText: string;
  /**
   * Carousel template content
   */
  template: TemplateContent;
};

/**
 * Flex Messages are messages with a customizable layout.
 * You can customize the layout freely by combining multiple elements.
 * For more information, see
 * [Using Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/).
 *
 * @see [Flex messages](https://developers.line.biz/en/reference/messaging-api/#flex-message)
 */
export type FlexMessage = MessageCommon & {
  type: 'flex';
  altText: string;
  contents: FlexContainer;
};

/**
 * Object which specifies the actions and tappable regions of an imagemap.
 *
 * When a region is tapped, the user is redirected to the URI specified in
 * `uri` and the message specified in `message` is sent.
 *
 * @see [Imagemap action objects](https://developers.line.biz/en/reference/messaging-api/#imagemap-action-objects)
 */
export type ImageMapAction = ImageMapURIAction | ImagemapMessageAction;

export type ImageMapActionBase = {
  /**
   * Spoken when the accessibility feature is enabled on the client device. (Max: 50 characters)
   * Supported on LINE 8.2.0 and later for iOS.
   */
  label?: string;
  /** Defined tappable area */
  area: Area;
};

export type ImageMapURIAction = {
  type: 'uri';
  /**
   * Webpage URL (Max: 1000 characters)
   */
  linkUri: string;
} & ImageMapActionBase;

export type ImagemapMessageAction = {
  type: 'message';
  /**
   * Message to send (Max: 400 characters)
   */
  text: string;
} & ImageMapActionBase;

export type Area = {
  /**
   * Horizontal position relative to the top-left corner of the area
   */
  x: number;
  /**
   * Vertical position relative to the top-left corner of the area
   */
  y: number;
  /**
   * Width of the tappable area
   */
  width: number;
  /**
   * Height of the tappable area
   */
  height: number;
};

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
  header?: FlexBox;
  hero?: FlexBox | FlexImage;
  body?: FlexBox;
  footer?: FlexBox;
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
  | FlexBox
  | FlexButton
  | FlexImage
  | FlexIcon
  | FlexText
  | FlexSpan
  | FlexSeparator
  | FlexFiller
  | FlexSpacer;

/**
 * This is a component that defines the layout of child components.
 * You can also include a box in a box.
 */
export type FlexBox = {
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
  layout: 'horizontal' | 'vertical' | 'baseline';
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
  contents: FlexComponent[];
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
  gravity?: 'top' | 'bottom' | 'center';
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
   * Aspect ratio of the icon. The default value is `1:1`.
   */
  aspectRatio?: '1:1' | '2:1' | '3:1';
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
   * Aspect ratio of the image.
   * The default value is `1:1`.
   */
  aspectRatio?:
    | '1:1'
    | '1.51:1'
    | '1.91:1'
    | '4:3'
    | '16:9'
    | '20:13'
    | '2:1'
    | '3:1'
    | '3:4'
    | '9:16'
    | '1:2'
    | '1:3';
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

export type TemplateContent =
  | TemplateButtons
  | TemplateConfirm
  | TemplateCarousel
  | TemplateImageCarousel;

/**
 * Template with an image, title, text, and multiple action buttons.
 *
 * Because of the height limitation for buttons template messages, the lower
 * part of the text display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 */
export type TemplateButtons = {
  type: 'buttons';
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Max width: 1024px
   * - Max: 1 MB
   */
  thumbnailImageUrl?: string;
  /**
   * Aspect ratio of the image. Specify one of the following values:
   *
   * - `rectangle`: 1.51:1
   * - `square`: 1:1
   *
   * The default value is `rectangle`
   */
  imageAspectRatio?: 'rectangle' | 'square';
  /**
   * Size of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire image area. Parts of the image that
   *   do not fit in the area are not displayed.
   * - `contain`: The entire image is displayed in the image area. A background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * The default value is `cover`.
   */
  imageSize?: 'cover' | 'contain';
  /**
   * Background color of image. Specify a RGB color value.
   * The default value is `#FFFFFF` (white).
   */
  imageBackgroundColor?: string;
  /**
   * Title (Max: 40 characters)
   */
  title?: string;
  /**
   * Message text
   *
   * - Max: 160 characters (no image or title)
   * - Max: 60 characters (message with an image or title)
   */
  text: string;
  /**
   * Action when tapped (Max: 4)
   */
  actions: Action[];
};

/**
 * Template with two action buttons.
 *
 * Because of the height limitation for confirm template messages, the lower
 * part of the `text` display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 */
export type TemplateConfirm = {
  type: 'confirm';
  /**
   * Message text (Max: 240 characters)
   */
  text: string;
  /**
   * Action when tapped. Set 2 actions for the 2 buttons
   */
  actions: Action[];
};

/**
 * Template with multiple columns which can be cycled like a carousel.
 * The columns will be shown in order by scrolling horizontally.
 *
 * Because of the height limitation for carousel template messages, the lower
 * part of the `text` display area will get cut off if the height limitation is
 * exceeded. For this reason, depending on the character width, the message
 * text may not be fully displayed even when it is within the character limits.
 *
 * Keep the number of actions consistent for all columns. If you use an image
 * or title for a column, make sure to do the same for all other columns.
 */
export type TemplateCarousel = {
  type: 'carousel';
  /**
   * Array of columns (Max: 10)
   */
  columns: TemplateColumn[];
  /**
   * Aspect ratio of the image. Specify one of the following values:
   *
   * - `rectangle`: 1.51:1
   * - `square`: 1:1
   *
   * Applies to all columns. The default value is `rectangle`.
   */
  imageAspectRatio?: 'rectangle' | 'square';
  /**
   * Size of the image. Specify one of the following values:
   *
   * - `cover`: The image fills the entire image area. Parts of the image that
   *   do not fit in the area are not displayed.
   * - `contain`: The entire image is displayed in the image area. A background
   *   is displayed in the unused areas to the left and right of vertical images
   *   and in the areas above and below horizontal images.
   *
   * Applies to all columns. The default value is `cover`.
   */
  imageSize?: 'cover' | 'contain';
};

export type TemplateColumn = {
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Aspect ratio: 1:1.51
   * - Max width: 1024px
   * - Max: 1 MB
   */
  thumbnailImageUrl?: string;
  /**
   * Background color of image. Specify a RGB color value.
   * The default value is `#FFFFFF` (white).
   */
  imageBackgroundColor?: string;
  /**
   * Title (Max: 40 characters)
   */
  title?: string;
  /**
   * Message text
   *
   * - Max: 120 characters (no image or title)
   * - Max: 60 characters (message with an image or title)
   */
  text: string;
  /**
   * Action when image is tapped; set for the entire image, title, and text area
   */
  defaultAction?: Action;
  /**
   * Action when tapped (Max: 3)
   */
  actions: Action[];
};

/**
 * Template with multiple images which can be cycled like a carousel.
 * The images will be shown in order by scrolling horizontally.
 */
export type TemplateImageCarousel = {
  type: 'image_carousel';
  /**
   * Array of columns (Max: 10)
   */
  columns: TemplateImageColumn[];
};

export type TemplateImageColumn = {
  /**
   * Image URL (Max: 1000 characters)
   *
   * - HTTPS
   * - JPEG or PNG
   * - Aspect ratio: 1:1
   * - Max width: 1024px
   * - Max: 1 MB
   */
  imageUrl: string;
  /**
   * Action when image is tapped
   */
  action: Action<{ label?: string }>;
};

/**
 * These properties are used for the quick reply.
 *
 * For more information, see
 * [Using quick replies](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/).
 */
export type QuickReply = {
  /**
   * This is a container that contains
   * [quick reply buttons](https://developers.line.biz/en/reference/messaging-api/#quick-reply-button-object).
   *
   * Array of objects (Max: 13)
   */
  items: QuickReplyItem[];
};

/**
 * This is a quick reply option that is displayed as a button.
 *
 * For more information, see
 * [quick reply buttons](https://developers.line.biz/en/reference/messaging-api/#quick-reply-button-object).
 */
export type QuickReplyItem = {
  type: 'action';
  /**
   * URL of the icon that is displayed at the beginning of the button (Max: 1000 characters)
   *
   * - URL scheme: https
   * - Image format: PNG
   * - Aspect ratio: 1:1
   * - Data size: Up to 1 MB
   *
   * There is no limit on the image size. If the `action` property has the
   * following actions with empty `imageUrl`:
   *
   * - [camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
   * - [camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
   * - [location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
   *
   * the default icon is displayed.
   */
  imageUrl?: string;
  /**
   * Action performed when this button is tapped.
   *
   * Specify an [action object](https://developers.line.biz/en/reference/messaging-api/#action-objects).
   *
   * The following is a list of the available actions:
   *
   * - [Postback action](https://developers.line.biz/en/reference/messaging-api/#postback-action)
   * - [Message action](https://developers.line.biz/en/reference/messaging-api/#message-action)
   * - [Datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action)
   * - [Camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
   * - [Camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
   * - [Location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
   */
  action: Action;
};

/**
 * These are types of actions for your bot to take when a user taps a button or an image in a message.
 *
 * - [Postback action](https://developers.line.biz/en/reference/messaging-api/#postback-action)
 * - [Message action](https://developers.line.biz/en/reference/messaging-api/#message-action)
 * - [URI action](https://developers.line.biz/en/reference/messaging-api/#uri-action)
 * - [Datetime picker action](https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action)
 * - [Camera action](https://developers.line.biz/en/reference/messaging-api/#camera-action)
 * - [Camera roll action](https://developers.line.biz/en/reference/messaging-api/#camera-roll-action)
 * - [Location action](https://developers.line.biz/en/reference/messaging-api/#location-action)
 */
export type Action<ExtraFields = { label: string }> = (
  | PostbackAction
  | MessageAction
  | URIAction
  | DatetimePickerAction
  | { type: 'camera' }
  | { type: 'cameraRoll' }
  | { type: 'location' }
) &
  ExtraFields;

/**
 * When a control associated with this action is tapped, a postback event is
 * returned via webhook with the specified string in the data property.
 */
export type PostbackAction = {
  type: 'postback';
  /**
   * String returned via webhook in the `postback.data` property of the
   * postback event (Max: 300 characters)
   */
  data: string;
  /**
   * Text displayed in the chat as a message sent by the user when the action
   * is performed. Returned from the server through a webhook.
   *
   * - This property cannot be used with quick reply buttons. (Max: 300 characters)
   * - The `displayText` and `text` properties cannot both be used at the same time.
   * @deprecated
   */
  text?: string;
  /**
   * Text displayed in the chat as a message sent by the user when the action is performed.
   *
   * - Required for quick reply buttons.
   * - Optional for the other message types.
   *
   * Max: 300 characters
   *
   * The `displayText` and `text` properties cannot both be used at the same time.
   */
  displayText?: string;
};

/**
 * When a control associated with this action is tapped, the string in the text
 * property is sent as a message from the user.
 */
export type MessageAction = {
  type: 'message';
  /**
   * Text sent when the action is performed (Max: 300 characters)
   */
  text: string;
};

/**
 * When a control associated with this action is tapped, the URI specified in
 * the `uri` property is opened.
 */
export type URIAction = {
  type: 'uri';
  /**
   * URI opened when the action is performed (Max: 1000 characters).
   * Must start with `http`, `https`, or `tel`.
   */
  uri: string;
  altUri?: AltURI;
};

/**
 * URI opened on LINE for macOS and Windows when the action is performed (Max: 1000 characters)
 * If the altUri.desktop property is set, the uri property is ignored on LINE for macOS and Windows.
 * The available schemes are http, https, line, and tel.
 * For more information about the LINE URL scheme, see Using the LINE URL scheme.
 * This property is supported on the following version of LINE.
 *
 * LINE 5.12.0 or later for macOS and Windows
 * Note: The altUri.desktop property is supported only when you set URI actions in Flex Messages.
 */
export type AltURI = {
  desktop: string;
};

/**
 * When a control associated with this action is tapped, a
 * [postback event](https://developers.line.biz/en/reference/messaging-api/#postback-event)
 * is returned via webhook with the date and time selected by the user from the
 * date and time selection dialog.
 *
 * The datetime picker action does not support time zones.
 *
 * #### Date and time format
 *
 * The date and time formats for the `initial`, `max`, and `min` values are
 * shown below. The `full-date`, `time-hour`, and `time-minute` formats follow
 * the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) protocol.
 *
 * | Mode     | Format                                                       | Example                          |
 * | -------- | ------------------------------------------------------------ | -------------------------------- |
 * | date     | `full-date` (Max: 2100-12-31; Min: 1900-01-01)               | 2017-06-18                       |
 * | time     | `time-hour`:`time-minute` (Max: 23:59; Min: 00:00)           | 00:0006:1523:59                  |
 * | datetime | `full-date`T`time-hour`:`time-minute` or `full-date`t`time-hour`:`time-minute` (Max: 2100-12-31T23:59; Min: 1900-01-01T00:00) | 2017-06-18T06:152017-06-18t06:15 |
 */
export type DatetimePickerAction = {
  type: 'datetimepicker';
  /**
   * String returned via webhook in the `postback.data` property of the
   * postback event (Max: 300 characters)
   */
  data: string;
  mode: 'date' | 'time' | 'datetime';
  /**
   * Initial value of date or time
   */
  initial?: string;
  /**
   * Largest date or time value that can be selected. Must be greater than the
   * `min` value.
   */
  max?: string;
  /**
   * Smallest date or time value that can be selected. Must be less than the
   * `max` value.
   */
  min?: string;
};

export type Size = {
  width: number;
  height: number;
};

/**
 * Rich menus consist of either of these objects.
 *
 * - [Rich menu object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-object)
 *   without the rich menu ID. Use this object when you
 *   [create a rich menu](https://developers.line.biz/en/reference/messaging-api/#create-rich-menu).
 * - [Rich menu response object](https://developers.line.biz/en/reference/messaging-api/#rich-menu-response-object)
 *   with the rich menu ID. This object is returned when you
 *   [get a rich menu](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu)
 *   or [get a list of rich menus](https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list).
 *
 * [Area objects](https://developers.line.biz/en/reference/messaging-api/#area-object) and
 * [action objects](https://developers.line.biz/en/reference/messaging-api/#action-objects)
 * are included in these objects.
 */
export type RichMenu = {
  /**
   * [`size` object](https://developers.line.biz/en/reference/messaging-api/#size-object)
   * which contains the width and height of the rich menu displayed in the chat.
   * Rich menu images must be one of the following sizes: 2500x1686px or 2500x843px.
   */
  size: Size;
  /**
   * `true` to display the rich menu by default. Otherwise, `false`.
   */
  selected: boolean;
  /**
   * Name of the rich menu.
   *
   * This value can be used to help manage your rich menus and is not displayed
   * to users.
   *
   * (Max: 300 characters)
   */
  name: string;
  /**
   * Text displayed in the chat bar (Max: 14 characters)
   */
  chatBarText: string;
  /**
   * Array of [area objects](https://developers.line.biz/en/reference/messaging-api/#area-object)
   * which define the coordinates and size of tappable areas
   * (Max: 20 area objects)
   */
  areas: Array<{ bounds: Area; action: Action<{}> }>;
};

export type RichMenuResponse = { richMenuId: string } & RichMenu;

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

export const LINE_REQUEST_ID_HTTP_HEADER_NAME = 'x-line-request-id';
export type MessageAPIResponseBase = {
  [LINE_REQUEST_ID_HTTP_HEADER_NAME]?: string;
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

export type LiffView = {
  type: 'compact' | 'tall' | 'full';
  url: string;
};

export type MutationSuccessResponse = {};

/* LINE Pay */
export type LinePayConfig = {
  channelId: string;
  channelSecret: string;
  sandbox?: boolean;
  origin?: string;
};

export type LinePayCurrency = 'USD' | 'JPY' | 'TWD' | 'THB';
