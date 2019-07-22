interface ICreatePostRequest {
  subject: string;
  targets: string;
  body?: string;
  iframe_url?: string;
  attaches?: string;
  content_type?: 'text/plain' | 'text/html';
}
export default ICreatePostRequest;
