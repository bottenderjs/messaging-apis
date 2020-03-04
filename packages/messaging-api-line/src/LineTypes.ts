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
  label?: string;
  data: string;
  mode: string;
  initial?: string;
  max?: string;
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

export type TemplateAction =
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

export type MessageOptions = {
  quickReply?: QuickReply;
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
  defaultAction?: TemplateAction;
  actions: TemplateAction[];
};

export type ConfirmTemplate = {
  type: 'confirm';
  text: string;
  actions: TemplateAction[];
};

export type ColumnObject = {
  thumbnailImageUrl?: string;
  title?: string;
  text: string;
  defaultAction?: TemplateAction;
  actions: TemplateAction[];
};

export type CarouselTemplate = {
  type: 'carousel';
  columns: ColumnObject[];
  imageAspectRatio?: 'rectangle' | 'square';
  imageSize?: 'cover' | 'contain';
};

export type ImageCarouselColumnObject = {
  imageUrl: string;
  action: TemplateAction;
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

type Size = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type FlexBlockStyle = {
  backgroundColor?: string;
  separator?: boolean;
  separatorColor?: string;
};

type FlexBubbleStyle = {
  header?: FlexBlockStyle;
  hero?: FlexBlockStyle;
  body?: FlexBlockStyle;
  footer?: FlexBlockStyle;
};

type FlexButton = {
  type: 'button';
  action: TemplateAction;
  flex?: number;
  margin?: Size;
  height?: 'sm' | 'md';
  style?: 'link' | 'primary' | 'secondary';
  color?: string;
  gravity?: string;
};

type FlexFiller = {
  type: 'filler';
};

type FlexIcon = {
  type: 'icon';
  url: string;
  margin?: Size;
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
  asprctRatio?: '1:1' | '2:1' | '3:1';
};

type FlexImage = {
  type: 'image';
  url: string;
  flex?: number;
  margin?: Size;
  align?: 'start' | 'end' | 'center';
  gravity?: 'top' | 'bottom' | 'center';
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
  aspectMode?: 'cover' | 'fit';
  backgroundColor?: string;
  action?: TemplateAction;
};

type FlexSeparator = {
  type: 'separator';
  margin?: Size;
  color?: string;
};

type FlexSpacer = {
  type: 'spacer';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

type FlexText = {
  type: 'text';
  text: string;
  flex?: number;
  margin?: Size;
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
  align?: 'start' | 'end' | 'center';
  gravity?: 'top' | 'bottom' | 'center';
  wrap?: boolean;
  maxLines?: number;
  weight?: 'regular' | 'bold';
  color?: string;
  action?: TemplateAction;
};

type FlexBoxContent =
  // content
  | FlexButton
  | FlexIcon
  | FlexImage
  | FlexText
  // layout
  | FlexFiller
  | FlexSeparator
  | FlexSpacer;

type FlexBox = {
  type: 'box';
  layout: 'horizontal' | 'vertical' | 'baseline';
  contents: FlexBox[] | FlexBoxContent[];
  flex?: number;
  spacing?: Size;
  margin?: Size;
  action?: TemplateAction;
};

type FlexBubbleContainer = {
  type: 'bubble';
  direction?: 'ltr' | 'rtl';
  header?: FlexBox;
  hero?: FlexImage;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyle;
};

type FlexCarouselContainer = {
  type: 'carousel';
  contents: FlexBubbleContainer[];
};

export type FlexContainer = FlexBubbleContainer | FlexCarouselContainer;

export type FlexMessage = {
  type: 'flex';
  altText: string;
  contents: FlexContainer;
};

export type Message =
  | TextMessage
  | ImageMessage
  | ImagemapMessage
  | VideoMessage
  | AudioMessage
  | LocationMessage
  | StickerMessage
  | TemplateMessage<Template>
  | FlexMessage;

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

export type TextMessage = {
  type: 'text';
  text: string;
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

export type AccessTokenOptions = {
  accessToken?: string;
};

export type NarrowcastOptions = AccessTokenOptions & {
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

export type CreateUploadAudienceGroupOptions = AccessTokenOptions & {
  uploadDescription?: string;
};

export type UpdateUploadAudienceGroupOptions = CreateUploadAudienceGroupOptions & {
  description?: string;
};

export type CreateClickAudienceGroupOptions = AccessTokenOptions & {
  clickUrl?: string;
};

export type Audience = {
  id: string;
};

export type BasicAudienceGroup = {
  // The audience ID.
  audienceGroupId: number;

  // The audience's name.
  description: string;

  // When the audience was created (in UNIX time).
  created: number;
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

  // The request ID that was specified when the audience was created.
  requestId: string;

  // The URL that was specified when the audience was created.
  clickUrl?: string;
};

export type AudienceGroup = (
  | (UploadAudienceGroup & { isIfaAudience: string })
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
  audienceGroups: AudienceGroup[];
  hasNextPage: boolean;
  totalCount: number;
  page: number;
  size: number;
};

export type Job = {
  audienceGroupJobId: number;
  audienceGroupId: number;
  description: string;
  type: 'DIFF_ADD';
  audienceCount: number;
  created: number;
} & (
  | {
      jobStatus: 'QUEUED' | 'WORKING' | 'FINISHED';
    }
  | {
      jobStatus: 'FAILED';
      failedType?: 'INTERNAL_ERROR';
    }
);

export type AudienceGroupWithJob = AudienceGroup & {
  jobs?: Job[];
};

export type GetAudienceGroupsOptions = AccessTokenOptions & {
  page?: number;
  description?: string;
  status?: string;
  size?: number;
};

export type AudienceGroupAuthorityLevel = {
  authorityLevel: 'PUBLIC' | 'PRIVATE';
};
