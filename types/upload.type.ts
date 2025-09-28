export interface UploadResponse {
  success: boolean;
  data: {
    success: boolean;
    file: {
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      category: string;
      feature: string;
    };
  };
  message: string;
}
// Interface for multiple upload response
export interface MultipleUploadResponse {
  success: boolean;
  data: {
    success: boolean;
    files: {
      id: string;
      url: string;
      filename: string;
      mimeType: string;
      size: number;
      category: string;
      feature: string;
    }[];
  };
  message: string;
}

export enum Features {
  STORIES = 'stories',
  MUSIC = 'music',
  MOVIES = 'movies',
  GAMES = 'games',
  COURSES = 'courses',
  LANGUAGE_CORNER = 'language-corner',
  LIBRARY = 'library',
  ETHICS = 'ethics',
  CATEGORIES = 'categories',
  AVATARS = 'avatars',
  ADS = 'ads',
  ATTACHMENTS = 'attachments',
  GENERAL = 'general',
  READ_ALONG = 'read-along',
  READ_ALONG_SLIDES = 'read-along-slides',
  VARIETY = 'variety',
  FAMILY_HEALTH = 'family-health',
  POPUP_NOTIFICATION = 'POPUP_NOTIFICATION',
}
