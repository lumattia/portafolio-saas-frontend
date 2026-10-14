export enum MediaType {
  Image = 'Image',
  File = 'File'
}

export interface Media {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  mediaType: MediaType;
  createdAt: string;
  updatedAt: string;
}
