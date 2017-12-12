/* @flow */

import type {
  Recipient,
  AttachmentPayload,
  Attachment,
  Message,
  TemplateButton,
  MenuItem,
  GreetingConfig,
  TemplateElement,
  QuickReply,
  SenderAction,
  OpenGraphElement,
  MediaElement,
  ReceiptAttributes,
  AirlineBoardingPassAttributes,
  AirlineCheckinAttributes,
  AirlineItineraryAttributes,
  AirlineFlightUpdateAttributes,
} from './MessengerTypes';

function createMessage(message: Message): Message {
  return {
    ...message,
  };
}

function createText(text: string): Message {
  return createMessage({ text });
}

function createAttachment(attachment: Attachment): Message {
  return createMessage({ attachment });
}

function createAudio(audio: string | AttachmentPayload) {
  return createAttachment({
    type: 'audio',
  });
}

function createImage(image: string | AttachmentPayload) {
  return createAttachment({
    type: 'image',
  });
}

function createVideo(video: string | AttachmentPayload) {
  return createAttachment({
    type: 'video',
  });
}

function createFile(file: string | AttachmentPayload) {
  return createAttachment({
    type: 'file',
  });
}

function createTemplate(payload: AttachmentPayload) {
  return createAttachment({
    type: 'template',
    payload,
  });
}

function createButtonTemplate(text: string, buttons: Array<TemplateButton>) {
  return createTemplate({
    template_type: 'button',
    text,
    buttons,
  });
}

function createGenericTemplate(
  elements: Array<TemplateElement>,
  options?: {
    image_aspect_ratio?: 'horizontal' | 'square',
  } = {}
) {
  return createTemplate({
    template_type: 'generic',
    elements,
    image_aspect_ratio: options.image_aspect_ratio || 'horizontal',
  });
}

function createListTemplate(
  elements: Array<TemplateElement>,
  buttons: Array<TemplateButton>,
  options?: {
    top_element_style?: 'large' | 'compact',
  } = {}
) {
  return createTemplate({
    template_type: 'list',
    elements,
    buttons,
    top_element_style: options.top_element_style || 'large',
  });
}

function createOpenGraphTemplate(elements: Array<OpenGraphElement>) {
  return createTemplate({
    template_type: 'open_graph',
    elements,
  });
}

function createMediaTemplate(elements: Array<MediaElement>) {
  return createTemplate({
    template_type: 'media',
    elements,
  });
}

function createReceiptTemplate(attrs: ReceiptAttributes) {
  return createTemplate({
    template_type: 'receipt',
    ...attrs,
  });
}

function createAirlineBoardingPassTemplate(
  attrs: AirlineBoardingPassAttributes
) {
  return createTemplate({
    template_type: 'airline_boardingpass',
    ...attrs,
  });
}

function createAirlineCheckinTemplate(attrs: AirlineCheckinAttributes) {
  return createTemplate({
    template_type: 'airline_checkin',
    ...attrs,
  });
}

function createAirlineItineraryTemplate(attrs: AirlineItineraryAttributes) {
  return createTemplate({
    template_type: 'airline_itinerary',
    ...attrs,
  });
}

function createAirlineFlightUpdateTemplate(
  attrs: AirlineFlightUpdateAttributes
) {
  return createTemplate({
    template_type: 'airline_update',
    ...attrs,
  });
}

const Messenger = {
  createMessage,
  createText,
  createAttachment,
  createAudio,
  createImage,
  createVideo,
  createFile,
  createTemplate,
  createButtonTemplate,
  createGenericTemplate,
  createListTemplate,
  createOpenGraphTemplate,
  createMediaTemplate,
  createReceiptTemplate,
  createAirlineBoardingPassTemplate,
  createAirlineCheckinTemplate,
  createAirlineItineraryTemplate,
  createAirlineFlightUpdateTemplate,
};

export default Messenger;
