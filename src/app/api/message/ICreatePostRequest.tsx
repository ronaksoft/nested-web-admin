interface ICreatePostRequest {
    subject : string;
    targets : string;
    attaches : string;
    content_type : IContentType;
}
enum IContentType {
    'text/plain',
    'text/html',
}
export default ICreatePostRequest;
