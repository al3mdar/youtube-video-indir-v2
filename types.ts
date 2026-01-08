export enum MediaType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum DownloadStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
  DOWNLOADING = 'DOWNLOADING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface VideoMetadata {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration: string;
}

export interface AITagResponse {
  summary: string;
  tags: string[];
  suggestedFilename: string;
}
