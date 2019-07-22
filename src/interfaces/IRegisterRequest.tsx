interface IRegisterRequest {
  _id?: string;
  uid: string;
  name?: string;
  fname: string;
  lname: string;
  pass: string;
  phone?: string;
  send_sms?: boolean;
}

export default IRegisterRequest;
