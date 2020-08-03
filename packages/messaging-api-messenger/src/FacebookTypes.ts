export type CamelCaseUnion<KM, U extends keyof KM> = KM[U];

export type CommonPaginationOptions = {
  limit?: number;
};

export type CursorBasedPaginationOptions = CommonPaginationOptions & {
  before?: string;
  after?: string;
};

export type TimeBasedPaginationOptions = CommonPaginationOptions & {
  until?: string;
  since?: string;
};

export type OffsetBasedPaginationOptions = CommonPaginationOptions & {
  offset?: number;
};

export type PaginationOptions =
  | CursorBasedPaginationOptions
  | TimeBasedPaginationOptions
  | OffsetBasedPaginationOptions;

export type PagingData<T extends object> = {
  data: T[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    previous?: string;
    next?: string;
  };
};

export type FacebookUser = {
  /**
   * The ID of this person's user account. This ID is unique to each app and cannot be used across different apps.
   */
  id: string;
  /**
   * The User's address.
   */
  address: Location;
  /**
   * The age segment for this person expressed as a minimum and maximum age. For example, more than 18, less than 21.
   */
  ageRange: AgeRange;
  /**
   * The person's birthday. This is a fixed format string, like MM/DD/YYYY.
   */
  birthday: string;
  /**
   * Can the person review brand polls
   */
  canReviewMeasurementRequest: boolean;
  /**
   * The User's primary email address listed on their profile. This field will not be returned if no valid email address is available.
   */
  email: string;
  /**
   * Athletes the User likes.
   */
  favoriteAthletes: Experience[];
  /**
   * Sports teams the User likes.
   */
  favoriteTeams: Experience[];
  /**
   * The person's first name
   */
  firstName: string;
  /**
   * The gender selected by this person, male or female. If the gender is set to a custom value, this value will be based off of the preferred pronoun; it will be omitted if the preferred pronoun is neutral
   */
  gender: string;
  /**
   * The person's hometown
   */
  hometown: FacebookPage;
  /**
   * The person's inspirational people
   */
  inspirationalPeople: Experience[];
  /**
   * Install type
   */
  installType: string;
  /**
   * Is the app making the request installed
   */
  installed: boolean;
  /**
   * if the current user is a guest user. should always return false.
   */
  isGuestUser: false;
  /**
   * Is this a shared login (e.g. a gray user)
   */
  isSharedLogin: boolean;
  /**
   * Facebook Pages representing the languages this person knows
   */
  languages: Experience[];
  /**
   * The person's last name
   */
  lastName: string;
  /**
   * A link to the person's Timeline. The link will only resolve if the person clicking the link is logged into Facebook and is a friend of the person whose profile is being viewed.
   */
  link: string;
  /**
   * The person's current location as entered by them on their profile. This field requires the user_location permission.
   */
  location: FacebookPage;
  /**
   * What the person is interested in meeting for
   */
  meetingFor: string[];
  /**
   * The person's middle name
   */
  middleName: string;
  /**
   * The person's full name
   */
  name: string;
  /**
   * The person's name formatted to correctly handle Chinese, Japanese, or Korean ordering
   */
  nameFormat: string;
  /**
   * The person's payment pricepoints
   */
  paymentPricepoints: PaymentPricepoints;
  /**
   * The profile picture URL of the Messenger user. The URL will expire.
   */
  profilePic: string;
  /**
   * The person's PGP public key
   */
  publicKey: string;
  /**
   * The person's favorite quotes
   */
  quotes: string;
  /**
   * Security settings
   */
  securitySettings: SecuritySettings;
  /**
   * The time that the shared login needs to be upgraded to Business Manager by
   */
  sharedLoginUpgradeRequiredBy: string;
  /**
   * Shortened, locale-aware name for the person
   */
  shortName: string;
  /**
   * The person's significant other
   */
  significantOther: FacebookUser;
  /**
   * Sports played by the person
   */
  sports: Experience[];
  /**
   * Whether the user can add a Donate Button to their Live Videos
   */
  supportsDonateButtonInLiveVideo: boolean;
  /**
   * Platform test group
   */
  testGroup: number;
  /**
   * A token that is the same across a business's apps. Access to this token requires that the person be logged into your app or have a role on your app. This token will change if the business owning the app changes
   */
  tokenForBusiness: string;
  /**
   * Video upload limits
   */
  videoUploadLimits: VideoUploadLimits;
  /**
   * Can the viewer send a gift to this person?
   */
  viewerCanSendGift: boolean;
};

export type FacebookUserField = keyof FacebookUserKeyMap;

export type FacebookUserKeyMap = {
  id: 'id';
  address: 'address';
  age_range: 'ageRange';
  birthday: 'birthday';
  can_review_measurement_request: 'canReviewMeasurementRequest';
  email: 'email';
  favorite_athletes: 'favoriteAthletes';
  favorite_teams: 'favoriteTeams';
  first_name: 'firstName';
  gender: 'gender';
  hometown: 'hometown';
  inspirational_people: 'inspirationalPeople';
  install_type: 'installType';
  installed: 'installed';
  is_guest_user: 'isGuestUser';
  is_shared_login: 'isSharedLogin';
  languages: 'languages';
  last_name: 'lastName';
  link: 'link';
  location: 'location';
  meeting_for: 'meetingFor';
  middle_name: 'middleName';
  name: 'name';
  name_format: 'nameFormat';
  payment_pricepoints: 'paymentPricepoints';
  profile_pic: 'profilePic';
  public_key: 'publicKey';
  quotes: 'quotes';
  security_settings: 'securitySettings';
  shared_login_upgrade_required_by: 'sharedLoginUpgradeRequiredBy';
  short_name: 'shortName';
  significant_other: 'significantOther';
  sports: 'sports';
  supports_donate_button_in_live_video: 'supportsDonateButtonInLiveVideo';
  test_group: 'testGroup';
  token_for_business: 'tokenForBusiness';
  video_upload_limits: 'videoUploadLimits';
  viewer_can_send_gift: 'viewerCanSendGift';
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/location/
 */
type Location = {
  city: string;
  cityId?: number;
  country: string;
  countryCode?: string;
  latitude: number;
  locatedIn: string;
  longitude: number;
  name: string;
  region?: string;
  regionId?: number;
  state: string;
  street: string;
  zip: string;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/age-range/
 */
type AgeRange = {
  /**
   * The upper bounds of the range for this person's age. `enum{17, 20, or empty}`.
   */
  max: number;
  /**
   * The lower bounds of the range for this person's age. `enum{13, 18, 21}`
   */
  min: number;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/experience/
 */
type Experience = {
  id: string;
  description: string;
  from: FacebookUser;
  name: string;
  with: FacebookUser[];
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/page
 */
export type FacebookPage = {
  /**
   * Page ID. No access token is required to access this field
   */
  id: string;
  /**
   * Information about the Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  about: string;
  /**
   * The Page's access token. Only returned if the User making the request has a role (other than Live Contributor) on the Page.
   */
  accessToken: string;
  /**
   * The Page's currently running promotion campaign
   */
  adCampaign: any;
  /**
   * Affiliation of this person. Applicable to Pages representing people. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  affiliation: string;
  /**
   * App ID for app-owned Pages and app Pages
   */
  appId: string;
  /**
   * Artists the band likes. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  artistsWeLike: string;
  /**
   * Dress code of the business. Applicable to Restaurants or Nightlife. Can be one of Casual, Dressy or Unspecified. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  attire: string;
  /**
   * The awards information of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  awards: string;
  /**
   * Band interests. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  bandInterests: string;
  /**
   * Members of the band. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  bandMembers: string;
  /**
   * The best available Page on Facebook for the concept represented by this Page. The best available Page takes into account authenticity and the number of likes
   */
  bestPage: FacebookPage;
  /**
   * Biography of the band. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  bio: string;
  /**
   * Birthday of this person. Applicable to Pages representing people. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  birthday: string;
  /**
   * Booking agent of the band. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  bookingAgent: string;
  /**
   * Year vehicle was built. Applicable to Vehicles. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  built: string;
  /**
   * The Business associated with this Page. Requires business_management permissions, and a page or user access token. The person requesting the access token must be an admin of the page.
   */
  business: any;
  /**
   * Whether the Page has checkin functionality enabled. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  canCheckin: boolean;
  /**
   * Indicates whether the current app user can post on this Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  canPost: boolean;
  /**
   * The Page's category. e.g. Product/Service, Computers/Technology. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  category: string;
  /**
   * The Page's sub-categories
   */
  categoryList: any[];
  /**
   * Number of checkins at a place represented by a Page
   */
  checkins: number;
  /**
   * The company overview. Applicable to Companies. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  companyOverview: string;
  /**
   * Instagram account connected to page via page settings
   */
  connectedInstagramAccount: any;
  /**
   * The mailing or contact address for this page. This field will be blank if the contact address is the same as the physical address
   */
  contactAddress: any;
  /**
   * Insight metrics that measures performance of copyright attribution. An example metric would be number of incremental followers from attribution
   */
  copyrightAttributionInsights: any;
  /**
   * Instagram usernames who will not be reported in copyright match systems
   */
  copyrightWhitelistedIgPartners: string[];
  /**
   * If this is a Page in a Global Pages hierarchy, the number of people who are being directed to this Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  countryPageLikes: number;
  /**
   * Information about the page's cover photo
   */
  cover: any;
  /**
   * Culinary team of the business. Applicable to Restaurants or Nightlife. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  culinaryTeam: string;
  /**
   * Current location of the Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  currentLocation: string;
  /**
   * A Vector of url strings for delivery_and_pickup_option_info of the Page.
   */
  deliveryAndPickupOptionInfo: string[];
  /**
   * The description of the Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  description: string;
  /**
   * The description of the Page in raw HTML. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  descriptionHtml: string;
  /**
   * To be used when temporary_status is set to differently_open to indicate how the business is operating differently than usual, such as a restaurant offering takeout.
   */
  differentlyOpenOfferings: {
    onlineServices?: boolean;
    delivery?: boolean;
    pickup?: boolean;
    other?: boolean;
  };
  /**
   * The director of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  directedBy: string;
  /**
   * Subtext about the Page being viewed. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  displaySubtext: string;
  /**
   * Page estimated message response time displayed to user. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  displayedMessageResponseTime: string;
  /**
   * The emails listed in the About section of a Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  emails: string[];
  /**
   * The social sentence and like count information for this Page. This is the same info used for the like button
   */
  engagement: any;
  /**
   * The number of users who like the Page. For Global Pages this is the count for all Pages across the brand. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  fanCount: number;
  /**
   * Video featured by the Page
   */
  featuredVideo: any;
  /**
   * Features of the vehicle. Applicable to Vehicles. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  features: string;
  /**
   * The restaurant's food styles. Applicable to Restaurants
   */
  foodStyles: string[];
  /**
   * When the company was founded. Applicable to Pages in the Company category. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  founded: string;
  /**
   * General information provided by the Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  generalInfo: string;
  /**
   * General manager of the business. Applicable to Restaurants or Nightlife. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  generalManager: string;
  /**
   * The genre of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  genre: string;
  /**
   * The name of the Page with country codes appended for Global Pages. Only visible to the Page admin. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  globalBrandPageName: string;
  /**
   * This brand's global Root ID
   */
  globalBrandRootId: string;
  /**
   * Indicates whether this Page has added the app making the query in a Page tab. Can be read with Page Public Content Access.
   */
  hasAddedApp: boolean;
  /**
   * Indicates whether WhatsApp number connected to this page is a WhatsApp business number. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  hasWhatsappBusinessNumber: boolean;
  /**
   * Indicates whether WhatsApp number connected to this page is a WhatsApp number. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  hasWhatsappNumber: boolean;
  /**
   * Hometown of the band. Applicable to Bands
   */
  hometown: string;
  /**
   * Indicates a single range of opening hours for a day. Each day can have 2 different hours ranges. The keys in the map are in the form of {day}_{number}_{status}. {day} should be the first 3 characters of the day of the week, {number} should be either 1 or 2 to allow for the two different hours ranges per day. {status} should be either open or close to delineate the start or end of a time range.
   */
  hours: Record<string, string>;
  /**
   * Legal information about the Page publishers. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  impressum: string;
  /**
   * Influences on the band. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  influences: string;
  /**
   * Instagram account linked to page during Instagram business conversion flow
   */
  instagramBusinessAccount: any;
  /**
   * Indicates the current Instant Articles review status for this page
   */
  instantArticlesReviewStatus: string;
  /**
   * Indicates whether this location is always open. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isAlwaysOpen: boolean;
  /**
   * Indicates whether location is part of a chain. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isChain: boolean;
  /**
   * Indicates whether the Page is a community Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isCommunityPage: boolean;
  /**
   * Indicates whether the page is eligible for the branded content tool
   */
  isEligibleForBrandedContent: boolean;
  /**
   * Indicates whether the page is a Messenger Platform Bot with Get Started button enabled
   */
  isMessengerBotGetStartedEnabled: boolean;
  /**
   * Indicates whether the page is a Messenger Platform Bot. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isMessengerPlatformBot: boolean;
  /**
   * Indicates whether Page is owned. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isOwned: boolean;
  /**
   * Whether the business corresponding to this Page is permanently closed. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  isPermanentlyClosed: boolean;
  /**
   * Indicates whether the Page is published and visible to non-admins
   */
  isPublished: boolean;
  /**
   * Indicates whether the Page is unclaimed
   */
  isUnclaimed: boolean;
  /**
   * Indicates whether the application is subscribed for real time updates from this page
   */
  isWebhooksSubscribed: boolean;
  /**
   * Indicates the time when the TOS for running LeadGen Ads on the page was accepted
   */
  leadgenTosAcceptanceTime: string;
  /**
   * Indicates whether a user has accepted the TOS for running LeadGen Ads on the Page
   */
  leadgenTosAccepted: boolean;
  /**
   * Indicates the user who accepted the TOS for running LeadGen Ads on the page
   */
  leadgenTosAcceptingUser: FacebookUser;
  /**
   * The Page's Facebook URL
   */
  link: string;
  /**
   * The location of this place. Applicable to all Places
   */
  location: any;
  /**
   * Members of this org. Applicable to Pages representing Team Orgs. Can be read with Page Public Content Access.
   */
  members: string;
  /**
   * The instant workflow merchant ID associated with the Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  merchantId: string;
  /**
   * Review status of the Page against FB commerce policies, this status decides whether the Page can use component flow
   */
  merchantReviewStatus: string;
  /**
   * The default ice breakers for a certain page
   */
  messengerAdsDefaultIcebreakers: string[];
  /**
   * The default page welcome message for Click to Messenger Ads
   */
  messengerAdsDefaultPageWelcomeMessage: any;
  /**
   * The default quick replies for a certain page
   */
  messengerAdsDefaultQuickReplies: string[];
  /**
   * Indicates what type this page is and we will generate different sets of quick replies based on it
   */
  messengerAdsQuickRepliesType: string;
  /**
   * The company mission. Applicable to Companies
   */
  mission: string;
  /**
   * MPG of the vehicle. Applicable to Vehicles. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  mpg: string;
  /**
   * The name of the Page
   */
  name: string;
  /**
   * The name of the Page with its location and/or global brand descriptor. Only visible to a page admin. Non-page admins will get the same value as name.
   */
  nameWithLocationDescriptor: string;
  /**
   * The TV network for the TV show. Applicable to TV Shows. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  network: string;
  /**
   * The number of people who have liked the Page, since the last login. Only visible to a Page admin. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  newLikeCount: number;
  /**
   * Offer eligibility status. Only visible to a page admin
   */
  offerEligible: boolean;
  /**
   * Overall page rating based on rating survey from users on a scale of 1-5.
   */
  overallStarRating: number;
  /**
   * A Page About Story is a document located in your Page's About section. It tells your Page's story with rich text and images and can be updated as your story evolves. Can be read with Page Public Content Access.
   */
  pageAboutStory: any;
  /**
   * The token of the page.
   */
  pageToken: string;
  /**
   * Parent Page of this Page.
   */
  parentPage: FacebookPage;
  /**
   * Parking information. Applicable to Businesses and Places
   */
  parking: any;
  /**
   * Payment options accepted by the business. Applicable to Restaurants or Nightlife
   */
  paymentOptions: any;
  /**
   * Personal information. Applicable to Pages representing People. Can be read with Page Public Content Access.
   */
  personalInfo: string;
  /**
   * Personal interests. Applicable to Pages representing People. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  personalInterests: string;
  /**
   * Pharmacy safety information. Applicable to Pharmaceutical companies. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  pharmaSafetyInfo: string;
  /**
   * Phone number provided by a Page. Can be read with Page Public Content Access.
   */
  phone: string;
  /**
   * For places, the category of the place
   */
  placeType: string;
  /**
   * The plot outline of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  plotOutline: string;
  /**
   * Group of tags describing the preferred audienceof ads created for the Page
   */
  preferredAudience: any;
  /**
   * Press contact information of the band. Applicable to Bands
   */
  pressContact: string;
  /**
   * Price range of the business, such as a restaurant or salon. Values can be one of $, $$, $$$, $$$$, Not Applicable, or null if no value is set.. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  priceRange: string;
  /**
   * Privacy url in page info section
   */
  privacyInfoUrl: string;
  /**
   * The productor of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  producedBy: string;
  /**
   * The products of this company. Applicable to Companies
   */
  products: string;
  /**
   * Boosted posts eligibility status. Only visible to a page admin
   */
  promotionEligible: boolean;
  /**
   * Reason for which boosted posts are not eligible. Only visible to a page admin
   */
  promotionIneligibleReason: string;
  /**
   * Public transit to the business. Applicable to Restaurants or Nightlife. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  publicTransit: string;
  /**
   * Number of ratings for the Page (limited to ratings that are publicly accessible). Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  ratingCount: number;
  /**
   * Messenger page scope id associated with page and a user using account_linking_token
   */
  recipient: string;
  /**
   * Record label of the band. Applicable to Bands. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  recordLabel: string;
  /**
   * The film's release date. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  releaseDate: string;
  /**
   * Services the restaurant provides. Applicable to Restaurants
   */
  restaurantServices: any;
  /**
   * The restaurant's specialties. Applicable to Restaurants
   */
  restaurantSpecialties: any;
  /**
   * The air schedule of the TV show. Applicable to TV Shows. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  schedule: string;
  /**
   * The screenwriter of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  screenplayBy: string;
  /**
   * The season information of the TV Show. Applicable to TV Shows. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  season: string;
  /**
   * The Page address, if any, in a simple single line format. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  singleLineAddress: string;
  /**
   * The cast of the film. Applicable to Films. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  starring: string;
  /**
   * Information about when the entity represented by the Page was started
   */
  startInfo: any;
  /**
   * Unique store code for this location Page. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  storeCode: string;
  /**
   * Location Page's store location descriptor
   */
  storeLocationDescriptor: string;
  /**
   * Unique store number for this location Page
   */
  storeNumber: number;
  /**
   * The studio for the film production. Applicable to Films
   */
  studio: string;
  /**
   * Whether the user can add a Donate Button to their Live Videos.
   */
  supportsDonateButtonInLiveVideo: boolean;
  /**
   * Indicates whether this Page supports Instant Articles
   */
  supportsInstantArticles: boolean;
  /**
   * The number of people talking about this Page
   */
  talkingAboutCount: number;
  /**
   * Indicates how the business corresponding to this Page is operating differently than usual. Enum values {differently_open, temporarily_closed, operating_as_usual, no_data} If set to differently_open use with differently_open_offerings to set status.
   */
  temporaryStatus:
    | 'differently_open'
    | 'temporarily_closed'
    | 'operating_as_usual'
    | 'no_data';
  /**
   * Unread message count for the Page. Only visible to a page admin
   */
  unreadMessageCount: number;
  /**
   * Number of unread notifications. Only visible to a page admin
   */
  unreadNotifCount: number;
  /**
   * Unseen message count for the Page. Only visible to a page admin
   */
  unseenMessageCount: number;
  /**
   * The alias of the Page. For example, for www.facebook.com/platform the username is 'platform'
   */
  username: string;
  /**
   * Showing whether this Page is verified and in what color e.g. blue verified, gray verified or not verified. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  verificationStatus: string;
  /**
   * Voip info
   */
  voipInfo: any;
  /**
   * The URL of the Page's website. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  website: string;
  /**
   * The number of visits to this Page's location. If the Page setting Show map, check-ins and star ratings on the Page (under Page Settings > Page Info > Address) is disabled, then this value will also be disabled. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  wereHereCount: number;
  /**
   * The Page's WhatsApp number. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  whatsappNumber: string;
  /**
   * The writer of the TV show. Applicable to TV Shows. Can be read with Page Public Content Access or Page Public Metadata Access.
   */
  writtenBy: string;

  /**
   * The ad posts for this Page
   */
  adsPosts: any;
  /**
   * Businesses that have agency permissions on the Page
   */
  agencies: any;
  /**
   * Photo albums for this Page. Can be read with Page Public Content Access.
   */
  albums: any;
  /**
   * Users assigned to this Page. Can be read with Page Public Content Access.
   */
  assignedUsers: any;
  /**
   * The music copyrights owned by this page (using alacorn)
   */
  audioMediaCopyrights: any;
  /**
   * User or Page Profiles blocked from this Page
   */
  blocked: any;
  /**
   * The call-to-action created by this Page. Can be read with Page Public Content Access.
   */
  callToActions: any;
  /**
   * The canvas elements associated with this page
   */
  canvasElements: any;
  /**
   * The canvas documents associated with this page
   */
  canvases: any;
  /**
   * Claimed URLs for Instant Articles that are associated with this Facebook Page
   */
  claimedUrls: any;
  /**
   * The commerce orders of this Page
   */
  commerceOrders: any;
  /**
   * The commerce payouts of this Page
   */
  commercePayouts: any;
  /**
   * The commerce transactions of this Page
   */
  commerceTransactions: any;
  /**
   * This Page's conversations
   */
  conversations: any;
  /**
   * Pages and users that will not be reported in the copyright match systems
   */
  copyrightWhitelistedPartners: any;
  /**
   * Pages that are allowed to crosspost
   */
  crosspostWhitelistedPages: any;
  /**
   * custom_labels
   */
  customLabels: any;
  /**
   * Custom user settings for a page
   */
  customUserSettings: any;
  /**
   * This Page's feed. Can be read with Page Public Content Access.
   */
  feed: any;
  /**
   * Children Pages of a Global Pages root Page. Both default and root Page can return children Pages. Can be read with Page Public Content Access.
   */
  globalBrandChildren: any;
  /**
   * This Page's Insights data
   */
  insights: any;
  /**
   * Linked Instagram accounts for this Page
   */
  instagramAccounts: any;
  /**
   * Instant articles associated with this Page. Can be read with Page Public Content Access.
   */
  instantArticles: any;
  /**
   * Instant article insights aggregated over all instant articles for that page
   */
  instantArticlesInsights: any;
  /**
   * A library of lead generation forms created for this page.
   */
  leadgenForms: any;
  /**
   * The Pages that this Page has liked. Can be read with Page Public Content Access.
   */
  likes: any;
  /**
   * Live encoders owned by this Page
   */
  liveEncoders: any;
  /**
   * Live videos on this Page. Can be read with Page Public Content Access.
   */
  liveVideos: any;
  /**
   * The location Pages that are children of this Page. Can be read with Page Public Content Access.
   */
  locations: any;
  /**
   * Media fingerprints from this page
   */
  mediaFingerprints: any;
  /**
   * Feature status of the page that has been granted through feature review that show up in the page settings
   */
  messagingFeatureReview: any;
  /**
   * Messenger page welcome messages created for a certain page
   */
  messengerAdsPageWelcomeMessages: any;
  /**
   * The profile of the page.
   */
  messengerProfile: any;
  /**
   * The native offers created by this Page. Can be read with Page Public Content Access.
   */
  nativeoffers: any;
  /**
   * Gets the Page Backed Instagram Account (an InstagramUser) associated with this Page.
   */
  pageBackedInstagramAccounts: any;
  /**
   * Messenger Platform Bot personas for the Page
   */
  personas: any;
  /**
   * This Page's Photos. Can be read with Page Public Content Access.
   */
  photos: any;
  /**
   * This Page's profile picture
   */
  picture: any;
  /**
   * The place topic associated with the categories of the page
   */
  placeTopics: any;
  /**
   * This Page's own Posts, a derivative of the /feed edge. Can be read with Page Public Content Access.
   */
  posts: any;
  /**
   * Product catalogs owned by this page
   */
  productCatalogs: any;
  /**
   * All published posts by this page
   */
  publishedPosts: any;
  /**
   * Open Graph ratings given to this Page
   */
  ratings: any;
  /**
   * The Page's Admins
   */
  roles: any;
  /**
   * All posts that are scheduled to a future date by a page
   */
  scheduledPosts: any;
  /**
   * Secondary Receivers for a page
   */
  secondaryReceivers: any;
  /**
   * Controllable settings for this page
   */
  settings: any;
  /**
   * Shows the shop setup status
   */
  shopSetupStatus: any;
  /**
   * Applications that have real time update subscriptions for this Page. Note that we will only return information about the current app
   */
  subscribedApps: any;
  /**
   * This Page's tabs and the apps in them. Can be read with Page Public Content Access.
   */
  tabs: any;
  /**
   * The Photos, Videos, and Posts in which the Page has been tagged. A derivative of /feeds. Can be read with Page Public Content Access.
   */
  tagged: any;
  /**
   * App which owns a thread for Handover Protocol
   */
  threadOwner: any;
  /**
   * tours
   */
  tours: any;
  /**
   * Video copyright rules from this page
   */
  videoCopyrightRules: any;
  /**
   * Video copyrights from this page
   */
  videoCopyrights: any;
  /**
   * Video Playlists for this Page
   */
  videoLists: any;
  /**
   * Video copyrights from this page using alacorn
   */
  videoMediaCopyrights: any;
  /**
   * Videos for this Page. Can be read with Page Public Content Access.
   */
  videos: any;
  /**
   * Shows all public Posts published by Page visitors on the Page. Can be read with Page Public Content Access.
   */
  visitorPosts: any;
};

export type FacebookPageKeyMap = {
  id: 'id';
  about: 'about';
  access_token: 'accessToken';
  ad_campaign: 'adCampaign';
  affiliation: 'affiliation';
  app_id: 'appId';
  artists_we_like: 'artistsWeLike';
  attire: 'attire';
  awards: 'awards';
  band_interests: 'bandInterests';
  band_members: 'bandMembers';
  best_page: 'bestPage';
  bio: 'bio';
  birthday: 'birthday';
  booking_agent: 'bookingAgent';
  built: 'built';
  business: 'business';
  can_checkin: 'canCheckin';
  can_post: 'canPost';
  category: 'category';
  category_list: 'categoryList';
  checkins: 'checkins';
  company_overview: 'companyOverview';
  connected_instagram_account: 'connectedInstagramAccount';
  contact_address: 'contactAddress';
  copyright_attribution_insights: 'copyrightAttributionInsights';
  copyright_whitelisted_ig_partners: 'copyrightWhitelistedIgPartners';
  country_page_likes: 'countryPageLikes';
  cover: 'cover';
  culinary_team: 'culinaryTeam';
  current_location: 'currentLocation';
  delivery_and_pickup_option_info: 'deliveryAndPickupOptionInfo';
  description: 'description';
  description_html: 'descriptionHtml';
  differently_open_offerings: 'differentlyOpenOfferings';
  directed_by: 'directedBy';
  display_subtext: 'displaySubtext';
  displayed_message_response_time: 'displayedMessageResponseTime';
  emails: 'emails';
  engagement: 'engagement';
  fan_count: 'fanCount';
  featured_video: 'featuredVideo';
  features: 'features';
  food_styles: 'foodStyles';
  founded: 'founded';
  general_info: 'generalInfo';
  general_manager: 'generalManager';
  genre: 'genre';
  global_brand_page_name: 'globalBrandPageName';
  global_brand_root_id: 'globalBrandRootId';
  has_added_app: 'hasAddedApp';
  has_whatsapp_business_number: 'hasWhatsappBusinessNumber';
  has_whatsapp_number: 'hasWhatsappNumber';
  hometown: 'hometown';
  hours: 'hours';
  impressum: 'impressum';
  influences: 'influences';
  instagram_business_account: 'instagramBusinessAccount';
  instant_articles_review_status: 'instantArticlesReviewStatus';
  is_always_open: 'isAlwaysOpen';
  is_chain: 'isChain';
  is_community_page: 'isCommunityPage';
  is_eligible_for_branded_content: 'isEligibleForBrandedContent';
  is_messenger_bot_get_started_enabled: 'isMessengerBotGetStartedEnabled';
  is_messenger_platform_bot: 'isMessengerPlatformBot';
  is_owned: 'isOwned';
  is_permanently_closed: 'isPermanentlyClosed';
  is_published: 'isPublished';
  is_unclaimed: 'isUnclaimed';
  is_webhooks_subscribed: 'isWebhooksSubscribed';
  leadgen_tos_acceptance_time: 'leadgenTosAcceptanceTime';
  leadgen_tos_accepted: 'leadgenTosAccepted';
  leadgen_tos_accepting_user: 'leadgenTosAcceptingUser';
  link: 'link';
  location: 'location';
  members: 'members';
  merchant_id: 'merchantId';
  merchant_review_status: 'merchantReviewStatus';
  messenger_ads_default_icebreakers: 'messengerAdsDefaultIcebreakers';
  messenger_ads_default_page_welcome_message: 'messengerAdsDefaultPageWelcomeMessage';
  messenger_ads_default_quick_replies: 'messengerAdsDefaultQuickReplies';
  messenger_ads_quick_replies_type: 'messengerAdsQuickRepliesType';
  mission: 'mission';
  mpg: 'mpg';
  name: 'name';
  name_with_location_descriptor: 'nameWithLocationDescriptor';
  network: 'network';
  new_like_count: 'newLikeCount';
  offer_eligible: 'offerEligible';
  overall_star_rating: 'overallStarRating';
  page_about_story: 'pageAboutStory';
  page_token: 'pageToken';
  parent_page: 'parentPage';
  parking: 'parking';
  payment_options: 'paymentOptions';
  personal_info: 'personalInfo';
  personal_interests: 'personalInterests';
  pharma_safety_info: 'pharmaSafetyInfo';
  phone: 'phone';
  place_type: 'placeType';
  plot_outline: 'plotOutline';
  preferred_audience: 'preferredAudience';
  press_contact: 'pressContact';
  price_range: 'priceRange';
  privacy_info_url: 'privacyInfoUrl';
  produced_by: 'producedBy';
  products: 'products';
  promotion_eligible: 'promotionEligible';
  promotion_ineligible_reason: 'promotionIneligibleReason';
  public_transit: 'publicTransit';
  rating_count: 'ratingCount';
  recipient: 'recipient';
  record_label: 'recordLabel';
  release_date: 'releaseDate';
  restaurant_services: 'restaurantServices';
  restaurant_specialties: 'restaurantSpecialties';
  schedule: 'schedule';
  screenplay_by: 'screenplayBy';
  season: 'season';
  single_line_address: 'singleLineAddress';
  starring: 'starring';
  start_info: 'startInfo';
  store_code: 'storeCode';
  store_location_descriptor: 'storeLocationDescriptor';
  store_number: 'storeNumber';
  studio: 'studio';
  supports_donate_button_in_live_video: 'supportsDonateButtonInLiveVideo';
  supports_instant_articles: 'supportsInstantArticles';
  talking_about_count: 'talkingAboutCount';
  temporary_status: 'temporaryStatus';
  unread_message_count: 'unreadMessageCount';
  unread_notif_count: 'unreadNotifCount';
  unseen_message_count: 'unseenMessageCount';
  username: 'username';
  verification_status: 'verificationStatus';
  voip_info: 'voipInfo';
  website: 'website';
  were_here_count: 'wereHereCount';
  whatsapp_number: 'whatsappNumber';
  written_by: 'writtenBy';

  ads_posts: 'adsPosts';
  agencies: 'agencies';
  albums: 'albums';
  assigned_users: 'assignedUsers';
  audio_media_copyrights: 'audioMediaCopyrights';
  blocked: 'blocked';
  call_to_actions: 'callToActions';
  canvas_elements: 'canvasElements';
  canvases: 'canvases';
  claimed_urls: 'claimedUrls';
  commerce_orders: 'commerceOrders';
  commerce_payouts: 'commercePayouts';
  commerce_transactions: 'commerceTransactions';
  conversations: 'conversations';
  copyright_whitelisted_partners: 'copyrightWhitelistedPartners';
  crosspost_whitelisted_pages: 'crosspostWhitelistedPages';
  custom_labels: 'customLabels';
  custom_user_settings: 'customUserSettings';
  feed: 'feed';
  global_brand_children: 'globalBrandChildren';
  insights: 'insights';
  instagram_accounts: 'instagramAccounts';
  instant_articles: 'instantArticles';
  instant_articles_insights: 'instantArticlesInsights';
  leadgen_forms: 'leadgenForms';
  likes: 'likes';
  live_encoders: 'liveEncoders';
  live_videos: 'liveVideos';
  locations: 'locations';
  media_fingerprints: 'mediaFingerprints';
  messaging_feature_review: 'messagingFeatureReview';
  messenger_ads_page_welcome_messages: 'messengerAdsPageWelcomeMessages';
  messenger_profile: 'messengerProfile';
  nativeoffers: 'nativeoffers';
  page_backed_instagram_accounts: 'pageBackedInstagramAccounts';
  personas: 'personas';
  photos: 'photos';
  picture: 'picture';
  place_topics: 'placeTopics';
  posts: 'posts';
  product_catalogs: 'productCatalogs';
  published_posts: 'publishedPosts';
  ratings: 'ratings';
  roles: 'roles';
  scheduled_posts: 'scheduledPosts';
  secondary_receivers: 'secondaryReceivers';
  settings: 'settings';
  shop_setup_status: 'shopSetupStatus';
  subscribed_apps: 'subscribedApps';
  tabs: 'tabs';
  tagged: 'tagged';
  thread_owner: 'threadOwner';
  tours: 'tours';
  video_copyright_rules: 'videoCopyrightRules';
  video_copyrights: 'videoCopyrights';
  video_lists: 'videoLists';
  video_media_copyrights: 'videoMediaCopyrights';
  videos: 'videos';
  visitor_posts: 'visitorPosts';
};

export type FacebookPageField = keyof FacebookPageKeyMap;

/**
 * https://developers.facebook.com/docs/graph-api/reference/payment-pricepoints/
 */
type PaymentPricepoints = {
  mobile: PaymentPricepoint[];
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/payment-pricepoint/
 */
type PaymentPricepoint = {
  credits: number;
  localCurrency: string;
  userPrice: string;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/security-settings/
 */
type SecuritySettings = {
  secureBrowsing: SecureBrowsing;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/secure-browsing/
 */
type SecureBrowsing = {
  enabled: boolean;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/video-upload-limits/
 */
type VideoUploadLimits = {
  length: number;
  size: number;
};

/**
 * https://developers.facebook.com/docs/graph-api/reference/permission/
 */
export type FacebookUserPermission = {
  /**
   * Name of the permission
   */
  permission: string;
  /**
   * Permission status
   */
  status: 'granted' | 'declined' | 'expired';
};

export type FacebookUserPermissionField = keyof FacebookUserPermission;

export type FacebookUserAccount = FacebookPage & { tasks: string };

export type FacebookUserAccountKeyMap = FacebookPageKeyMap & { tasks: 'tasks' };

export type FacebookUserAccountField = keyof FacebookUserAccountKeyMap;
