import IThumbnails from './IThumbnails';

export default interface IAttachment {
  expiration_timestamp: number;
  name: string;
  size: number;
  thumbs: IThumbnails;
  type: string;
  universal_id: string;
}
