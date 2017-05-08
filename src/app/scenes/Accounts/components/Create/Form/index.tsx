import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon} from 'antd';
import InputRow from './components/InputRow/index';
import _ from 'lodash';

interface IAccount {
  key: number;
  _id: string;
  fname: string;
  lname: string;
  phone: string;
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
          key: _.uniqueId(),
          _id: 'sorousht',
          fname: 'Soroush',
          lname: 'Torkzadeh',
          phone: '+989365022600'
        }
      ]
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.add = this.add.bind(this);
  }

  handleChange(account: IAccount) {
    const index = _.findIndex(this.state.accounts, { key: account.key });
    if (index >= 0) {
      this.state.accounts.splice(index, 1, account);
      this.setState({
        accounts: this.state.accounts
      });
    }
  }

  handleRemove(account: IAccount) {
    this.setState({
      accounts: _.reject(this.state.accounts, { key : account.key })
    });
  }

  add() {
    let account: IAccount = {
      key: _.uniqueId(),
      _id: '',
      fname: '',
      lname: '',
      phone: ''
    };


    this.setState({
      accounts: [...this.state.accounts, account],
    });
    console.log(this.state.accounts);
  }

  import() {
    console.log('Importing...');
  }

  render() {
    var rows = this.state.accounts.map((account) => <InputRow key={account.key} account={account} onChange={this.handleChange} onRemove={this.handleRemove} />);
    return (
      <div>
        <Row>
          <Col span={22}>
            <Row>
              <Col span={6}><b>Phone Number</b><span>(with country code)</span></Col>
              <Col span={6}><b>Username</b></Col>
              <Col span={6}><b>First Name</b></Col>
              <Col span={6}><b>Last Name</b></Col>
            </Row>
          </Col>
        </Row>
        {rows}
        <Card>
          <Row>
            <Col span={12}>
              <a onClick={this.add}>
                <Icon type='plus' /> Add another
              </a>
            </Col>
            <Col span={12}>
              <span>You can also</span>&nbsp;<a onClick={this.import}>Import from a file</a>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default Form;
