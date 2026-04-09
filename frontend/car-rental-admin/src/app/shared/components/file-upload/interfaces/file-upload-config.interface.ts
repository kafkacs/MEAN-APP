export interface FileUploadConfigI {
  text: string;
  multipleFiles: boolean;
  formats: ('image' | 'video' | 'audio' | 'document')[];
  min: number;
  max: number;
}
