export interface UploadImageResponse {
  data: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
  message: string;
}
