export interface DelegatedUIErrorI {
  message: string;
  title: string;
  description: string;
  error: {
    frontFacingMessages?: string[];
    frontFacingMessage: string;
    errors: string[];
    message: string | string[];
  };
}
