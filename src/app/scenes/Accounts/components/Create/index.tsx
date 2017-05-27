import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon, notification, Form} from 'antd';
import _ from 'lodash';
import $ from 'jquery';
import md5 from 'md5';
import Account from '../../Account';
import {IAccount} from '../../interfaces/IAccount';
import IUnique from '../../interfaces/IUnique';
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
    rows = [];
    rowsKey = {};

    constructor(props: ICreateProps) {
        this.state = {accounts: []};
        this.accountApi = new AccountApi();
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChange = _.debounce(this.handleChange.bind(this), 256);
        this.add = this.add.bind(this);
        this.create = this.create.bind(this);
        this.import = this.import.bind(this);
        this.readFile = this.readFile.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.cleanup = this.cleanup.bind(this);
        this.initModal = this.initModal.bind(this);
        this.addItemWithDelay = this.addItemWithDelay.bind(this);
    }

    componentDidMount() {
        this.initModal();
    }

    initModal() {
        let account = new Packet(new Account());
        this.rows = [<InputRow ref={this.saveRow}
                               refKey={account.key}
                               index={this.rows.length}
                               key={account.key}
                               account={account}
                               onChange={this.handleChange}
                               onRemove={this.handleRemove}/>];
        this.setState({
            accounts: [account]
        });
    }

    handleRemove(account: IUnique, index: number) {
        this.rows[index] = null;
        this.setState({
            accounts: _.reject(this.state.accounts, {key: account.key})
        });
    }

    handleChange(key: string, model: any, errors: Array) {
        const packet = _.find(this.state.accounts, {key: key});
        if (!packet) {
            return;
        }

        const account = new Account(model._id, model.fname, model.lname, model.phone, model.pass);
        packet.model = account;
        const hasError = _.some(errors, (error) => _.isArray(error) && _.size(error) > 0);
        packet.state = hasError ? PacketState.Invalid : PacketState.Valid;

        const packetIndex = _.indexOf(this.state.accounts, {key: key});
        let accounts = this.state.accounts;
        accounts[packetIndex] = packet;
        this.setState({
            accounts: accounts,
        });
    }

    add() {
        let account = new Packet(new Account());
        this.rows.push(<InputRow ref={this.saveRow}
                                 refKey={account.key}
                                 index={this.rows.length}
                                 key={account.key}
                                 account={account}
                                 onChange={this.handleChange}
                                 onRemove={this.handleRemove}/>);
        this.setState({
            accounts: [...this.state.accounts, account],
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

    changeRowState() {
        this.rows.forEach((row: any, index) => {
            if (row === null) {
                return;
            }
            let account = this.state.accounts.find((acc: any) => {
                return acc.key === row.key;
            });
            // fixme :: check state befor render row
            if (true || account.state !== row.props.account.state) {
                this.rows[index] = (<InputRow ref={this.saveRow}
                                              refKey={account.key}
                                              index={this.rows.length}
                                              key={account.key}
                                              account={account}
                                              onChange={this.handleChange}
                                              onRemove={this.handleRemove}/>);
            }
        });
    }

    createAccount(index?: number) {

        index = index || 0;
        const packet = this.state.accounts[index];
        if (!packet) {
            return new Promise(res => {
                res();
            });
        }

        const next = index + 1;
        if (packet.state !== PacketState.Valid) {
            return this.createAccount(next);
        }

        return this.accountApi.register({
            uid: packet.model._id,
            fname: packet.model.fname,
            lname: packet.model.lname,
            phone: packet.model.phone,
            pass: md5(packet.model.pass)
        }).then((result) => {
            // apply changes

            packet.state = PacketState.Success;
            let accounts = this.state.accounts;
            accounts[index] = packet;
            this.setState({
                accounts: accounts
            });
            this.changeRowState();
            this.forceUpdate();

            // continue for the next
            return this.createAccount(next);
        }).catch((error) => {
            // apply changes
            if (error.err_code === 3) {
                packet.state = PacketState.Invalid;
            }
            packet.state = PacketState.Failure;
            let accounts = this.state.accounts;
            accounts[index] = packet;
            this.setState({
                accounts: accounts
            });

            this.changeRowState();
            this.forceUpdate();

            // continue for the next
            return this.createAccount(next);
        });
    }

    create() {

        let counter = 1;
        var hasErrorInFields = false;
        Object.keys(this.rowsKey).forEach(row => {
            this.rowsKey[row].validateFields((errors: any, value: any) => {

                const fieldErrors = _(errors).map((value, key) => value.errors).flatten().value();
                if (_.size(fieldErrors) > 0) {
                    hasErrorInFields = true;
                }

                counter++;
                if (counter < Object.keys(this.rowsKey).length) {
                    return;
                }

                const hasError = _.some(this.state.accounts, {state: PacketState.Invalid});
                if (hasError || hasErrorInFields) {
                    notification.warning({
                        message: 'Warning',
                        description: 'Some records are not valid! Please fix the problems and try again.',
                        duration: 8
                    });

                    return;
                }

                if (!hasError && !hasErrorInFields) {
                    this.createAccount().then((result) => {
                        notification.info({
                            message: 'Job done!',
                            description: 'Make sure all accounts have been created without any problem.',
                            duration: 8
                        });
                    });
                }

            });
        });

    }

    saveRow = (row) => {
        if (row) {
            this.rowsKey[row.props.refKey] = row;
        }
    }

    render() {

        return (
            <Modal
                visible={this.props.visible}
                title='Create Accounts'
                width={960}
                footer={[
                    <Button type='primary' size='large' onClick={this.create}>Create Accounts
                        ({this.state.accounts.length})</Button>
                ]}
                className='create-accounts'
                onCancel={this.handleClose}
                afterClose={this.cleanup}
            >
                <div>
                    <Row>
                        <Col span={22}>
                            <Row>
                                <Col span={5}><b>Phone Number</b><span>(with country code)</span></Col>
                                <Col span={5}><b>Username</b></Col>
                                <Col span={5}><b>First Name</b></Col>
                                <Col span={5}><b>Last Name</b></Col>
                                <Col span={4}><b>Password</b></Col>
                            </Row>
                        </Col>
                    </Row>
                    {this.rows}
                    <Card>
                        <Row type='flex' align='middle'>
                            <Col span={12}>
                                <a onClick={this.add}>
                                    <Icon type='plus'/> Add another
                                </a>
                            </Col>
                            <Col span={12}>
                                <input id='upload' type='file' accept='*' onChange={this.readFile} onClick={(event) => {
                                    event.target.value = null;
                                }} className='hidden'/>
                                <span>You can also</span>&nbsp;<a onClick={this.handleUpload}>Import from a file</a>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Modal>
        );
    }

    private handleClose() {
        this.props.handleClose();
    }

    private cleanup() {
        this.initModal();
    }

    private addItemWithDelay(item: Packet, delay: number) {
        return new Promise(resolve => setTimeout(resolve, delay)).then(() => {
            this.rows.push(<InputRow ref={this.saveRow}
                                     index={this.rows.length}
                                     refKey={item.key}
                                     key={item.key}
                                     account={item.model}
                                     onChange={this.handleChange}
                                     onRemove={this.handleRemove}/>);
            this.setState({
                accounts: [...this.state.accounts, item]
            });
        });
    }

    private import(text: string) {
        const CSV_ROW_ITEMS_COUNT = 4;
        const MAX_ITEMS_IN_FILE = 100;
        const DELAY_BETWEEN_IMPORT_ITEM = 0;
        if (!(_.isString(text) && text.length > 0)) {
            notification.warning({
                message: 'Attention',
                description: 'The file is empty!'
            });

            return;
        }

        const data = CSV.parse(text);

        if (_.size(data) > MAX_ITEMS_IN_FILE) {
            notification.warning({
                message: 'Attention',
                description: 'There are more than 100 items in the file. Please sparate the items into smaller files.',
                duration: 8
            });

            return;
        }
        this.rows = [];
        this.setState({accounts: []});
        const packets = _(data).filter((row) => row.length === CSV_ROW_ITEMS_COUNT).map((row) => {
            return new Packet(new Account(row[1], row[2], row[3], row[0]));
        }).value();

        let setNext = (index: number) => {
            index = index || 0;
            const item = packets[index];
            if (!item) {
                return Promise.resolve(index);
            }

            return this.addItemWithDelay(item, DELAY_BETWEEN_IMPORT_ITEM).then(() => setNext(index + 1));
        };

        return setNext(0).then(() => {
            notification.success({
                message: 'Import',
                description: `All ${packets.length} account(s) have been imported successfully.`
            });
        });
    }
}

export default Form.create()(Create);
