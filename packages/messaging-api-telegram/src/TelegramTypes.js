/* @flow */

export type ChatAction =
  | 'typing'
  | 'upload_photo'
  | 'record_video'
  | 'upload_video'
  | 'record_audio'
  | 'upload_audio'
  | 'upload_document'
  | 'find_location'
  | 'record_video_note'
  | 'upload_video_note';
