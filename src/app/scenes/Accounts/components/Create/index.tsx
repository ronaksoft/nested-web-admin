import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon} from 'antd';
import _ from 'lodash';
import $ from 'jquery';
import Account from '../../Account';
import {IAccount} from '../../IAccount';
import IUnique from '../../IUnique';
import InputRow from './components/InputRow/index';
import CSV from '../../CSV';
import AccountApi from '../../../../api/account/account';
import Packet from '../../Packet';
import PacketState from '../../PacketState';

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
    this.accountApi = new AccountApi();
    this.handleRemove = this.handleRemove.bind(this);
    this.add = this.add.bind(this);
    this.create = this.create.bind(this);
    this.import = this.import.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleRemove(account: IUnique) {
    this.setState({
      accounts: _.reject(this.state.accounts, { key : account.key })
    });
  }

  handleChange = (key, model, errors) => {
    console.log('ahhh', key, model, errors);
    var index = _.findIndex(this.state.accounts, { key: key });
    if (index > -1) {
      _.assign(this.state.accounts[index].model, model);
    }

    const hasError = _.some(errors, (error) => {
      return _.isArray(error) && _.size(error) > 0;
    });

    this.state.accounts[index].state = hasError ? PacketState.Invalid : PacketState.Valid;
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
    const promises = _(this.state.accounts).filter((packet) => packet.state === PacketState.Valid).map((packet, index) => {
      packet.state = PacketState.Pending;
      return this.accountApi.register({
        uid: packet.model._id,
        fname: packet.model.fname,
        lname: packet.model.lname,
        phone: packet.model.phone
      }).then((result) => {
        packet.state = PacketState.Success;
        this.setState({
          accounts: _.clone(this.state.accounts)
        });
      }).catch((error) => {
        if (error.err_code === 3) {
          packet.state = PacketState.Invalid;
        }
        packet.state = PacketState.Failure;
        this.setState({
          accounts: _.clone(this.state.accounts)
        });
      });
    }).value();
  }

  saveRow = (row) => {
    this.row = row;
  }

  render() {
    var rows = this.state.accounts.map((account) => <InputRow ref={this.saveRow} key={account.key} account={account} onChange={this.handleChange} onRemove={this.handleRemove} />);

    return (
      <Modal
          visible={this.props.visible}
          title='Create Accounts'
          width={960}
          footer={[
            <Button type='primary' size='large' onClick={this.create}>Create Accounts ({this.state.accounts.length})</Button>
          ]}
          className='create-accounts'
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
              <Row type='flex' align='middle'>
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

  private replaceByKey(items: IUnique, item: IUnique) {
    const index = _.findIndex(items, { 'key' : item.key });

    if (index > -1) {
      items.splice(index, 1, item);
    }

    return items;
  }
}

export default Create;
