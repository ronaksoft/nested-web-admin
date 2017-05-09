import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon} from 'antd';
import {Account} from '/src/app/common/account/Account';
import {IAccount} from '/src/app/common/account/IAccount';
import IUnique from '/src/app/common/IUnique';
import InputRow from './components/InputRow/index';
import CSV from '/src/app/common/CSV';
import AccountApi from '/src/app/api/account/account';
import Packet from '/src/app/common/packet/Packet';
import _ from 'lodash';
import $ from 'jquery';

interface ICreateProps {
  visible: Boolean;
  handleClose: Handler;
}

interface ICreateState {
  accounts: Packet<IAccount>[];
}

class Create extends React.Component<ICreateProps, ICreateState> {
  constructor(props: ICreateProps) {
    this.state = {
      accounts: [new Packet(new Account())]
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.add = this.add.bind(this);
    this.create = this.create.bind(this);
    this.import = this.import.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(account: IUnique) {
    const index = _.findIndex(this.state.accounts, { key: account.key });
    if (index >= 0) {
      this.state.accounts.splice(index, 1, account);
      this.setState({
        accounts: this.state.accounts
      });
    }
  }

  handleRemove(account: IUnique) {
    this.setState({
      accounts: _.reject(this.state.accounts, { key : account.key })
    });
  }

  add() {
    this.setState({
      accounts: [...this.state.accounts, new Packet(new Account())],
    });
  }

  handleUpload(e: Event) {
    e.preventDefault();
    $('#upload').trigger('click');
  }

  readFile(e: Event) {
    const reader = new FileReader();
    reader.onload = (readEvent) => this.import(readEvent.target.result);
    reader.readAsText(e.target.files[0]);
  }

  create () {
    console.log('creating', this.state.accounts);
    new AccountApi().register(this.state.accounts).then((result) => console.log(result)).catch((error) => console.log(error));
  }

  render() {
    var rows = this.state.accounts.map((account) => <InputRow key={account.key} account={account} onChange={this.handleChange} onRemove={this.handleRemove} />);

    return (
      <Modal
          visible={this.props.visible}
          title='Create Accounts'
          width={960}
          footer={[
            <Button type='primary' size='large' onClick={this.create}>Create Accounts ({this.state.accounts.length})</Button>
          ]}
          onCancel={this.handleClose}
        >
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
                  <input id='upload' type='file' accept='*' onChange={this.readFile} onClick={(event) => { event.target.value = null; }} className='hidden'/>
                  <span>You can also</span>&nbsp;<a onClick={this.handleUpload}>Import from a file</a>
                </Col>
              </Row>
            </Card>
          </div>
        </Modal>
    );
  }

  handleClose() {
    this.setState({
      accounts: [new Packet(new Account())]
    });
    this.props.handleClose();
  }

  private import(text: string) {
    const CSV_ROW_ITEMS_COUNT = 4;
    const data = CSV.parse(text);
    const importedAccounts = _(data).filter((row) => row.length === CSV_ROW_ITEMS_COUNT).map((row) => {
      return new Packet(new Account(row[0], row[1], row[2], row[3]));
    }).value();

    this.setState({
      accounts: _.concat(this.state.accounts, importedAccounts)
    });
  }
}

export default Create;
