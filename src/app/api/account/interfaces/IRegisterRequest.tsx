interface IRegisterRequest {
  _id: string;
  name: string;
  fname: string;
  lname: string;
  phone?: string;
  send_sms?: boolean;
}

export default IRegisterRequest;
