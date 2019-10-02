interface IResponse {
  _reqid?: string | number;
  cmd: string;
  status?: string;
  data: any;
}

export default IResponse;
