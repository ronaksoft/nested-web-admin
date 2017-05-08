import * as React from 'react';
import {Modal, Button, Row, Col} from 'antd';
import InputRow from './components/InputRow/index';
interface IAccount {
  key: Number;
  _id: String;
  fname: String;
  lname: String;
  phone: String;
}

interface IFormProps {
  handleClose: Handler;
}

interface IFormState {
  accounts: IAccount[];
}

class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    this.state = {
      accounts: [
        {
          key: 1,
          _id: 'sorousht',
          fname: 'Soroush',
          lname: 'Torkzadeh',
          phone: '+989365022600'
        }
      ]
    };
  }

  handleChange(account: IAccount) {
    console.log(account);
  }

  render() {
    var rows = this.state.accounts.map((account) => <InputRow key={account.key} account={account} onChange={this.handleChange} />);
    return (
      <div>
        <Row>
          <Col span={6}><b>Phone Number</b><span>(with country code)</span></Col>
          <Col span={6}><b>Username</b></Col>
          <Col span={6}><b>First Name</b></Col>
          <Col span={6}><b>Last Name</b></Col>
        </Row>
        {rows}
        <Row>
          <Col span={24}>
            <Button type='primary' size='large' onClick={this.props.handleClose}>Close me</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form;
