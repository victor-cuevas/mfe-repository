export interface FileUpload {
  id: string;
  content: {
    files: Array<File>;
  };
}
